import re
import json
import os
try:
    import PyPDF2
except ImportError:
    print("PyPDF2 not found. Please install it using 'pip install PyPDF2'")

def extract_text_from_pdf(pdf_path):
    """Extracts raw text from a PDF file."""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def categorize_topic(question_text):
    """Categorizes a question into predefined topics based on keywords."""
    topics_map = {
        "JVM": ["jvm", "heap", "stack", "garbage collection", "classloader", "jit", "memory"],
        "Java Basics": ["java", "jre", "jdk", "platform", "main", "variable", "keyword", "data type"],
        "OOP Concepts": ["inheritance", "polymorphism", "encapsulation", "abstraction", "class", "interface", "object", "override", "overload"],
        "Collections": ["list", "set", "map", "arraylist", "hashmap", "vector", "iterator", "collection", "queue", "deque"],
        "Exception Handling": ["try", "catch", "finally", "throw", "exception", "error", "checked", "unchecked"],
        "Multithreading": ["thread", "runnable", "synchronization", "deadlock", "monitor", "wait", "notify", "volatile"],
        "Streams & Lambda": ["stream", "lambda", "functional interface", "filter", "map-reduce", "optional"],
        "Spring & Frameworks": ["spring", "bean", "autowired", "dependency injection", "mvc", "boot", "jpa", "hibernate"],
        "Design Patterns": ["singleton", "factory", "observer", "builder", "design pattern", "strategy", "decorator"],
        "Strings": ["string", "stringbuilder", "stringbuffer", "immutable", "pooling"],
        "Arrays": ["array", "dimension", "index"],
        "Concurrency": ["executor", "future", "callable", "lock", "semaphore", "concurrent"],
        "File Handling": ["io", "file", "path", "reader", "writer", "serialization"],
        "Others": []
    }
    
    question_lower = question_text.lower()
    for topic, keywords in topics_map.items():
        if any(keyword in question_lower for keyword in keywords):
            return topic
    return "Core Java"



def process_pdf(pdf_path, output_json1, output_json2, start_page=0, end_page=1110):
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            total_pages = len(reader.pages)
            end_page = min(end_page, total_pages)
            print(f"Extracting text from page {start_page+1} to {end_page}...")
            # Leading newline ensures first question is caught by \n pattern
            text = "\n" 
            for i in range(start_page, end_page):
                text += reader.pages[i].extract_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return

    # Use strict regex: number followed by dot, then newline or capital letter
    # This helps avoid catching numbered lists like '1. item' in the middle of a sentence
    segments = re.split(r'\n\s*(\d+)\.\s*(?=\n|[A-Z])', text)
    
    questions_list = []
    print(f"Found {len(segments)//2} potential segments with strict matching")
    
    for i in range(1, len(segments), 2):
        num = int(segments[i])
        content = segments[i+1].strip()
        
        if not content:
            continue
            
        lines = [l.strip() for l in content.split('\n') if l.strip()]
        if not lines:
            continue
            
        q_lines = []
        a_lines = []
        found_end_of_q = False
        
        # Heuristic for question end
        for j, line in enumerate(lines):
            if not found_end_of_q:
                q_lines.append(line)
                if line.endswith('?') or len(q_lines) >= 2:
                    found_end_of_q = True
            else:
                a_lines.append(line)
        
        q_text = " ".join(q_lines)
        a_text = " ".join(a_lines)
        
        q_text = re.sub(r'\s+', ' ', q_text)
        a_text = re.sub(r'\s+', ' ', a_text)
        
        if len(q_text) < 5: # Some questions might be short
            continue
            
        topic = categorize_topic(q_text)
        
        questions_list.append({
            "id": num,
            "question": q_text,
            "answer": a_text,
            "topic": topic,
            "tags": [topic.lower(), "java"]
        })
    
    # 1. Start from identifying "JDK and JRE" (Question 1)
    start_idx = -1
    for idx, q in enumerate(questions_list):
        if (q['id'] == 1 and "JDK and JRE" in q['question']) or ("difference between JDK and JRE" in q['question']):
            start_idx = idx
            break
    
    if start_idx == -1:
        print("Warning: Could not find Question 1. Starting from first found.")
        start_idx = 0
            
    # 2. Slice from there
    questions_slice = questions_list[start_idx:]
    
    # 3. Stop at "Microservices as State Machines" or ID 497
    end_idx = len(questions_slice)
    for idx, q in enumerate(questions_slice):
        if "Microservices as State Machines" in q['question'] or q['id'] == 498:
            # If we find 498 target, we stop before it. 
            # If we find 497 and it's our target, inclusive.
            if q['id'] == 497:
                end_idx = idx + 1
            else:
                end_idx = idx
            break
            
    final_questions = questions_slice[:end_idx]
    
    # Strictly filter based on user range 1 to 497
    # (In case some sub-numbered items 1-497 were caught incorrectly)
    # We want ONLY the main questions. 
    # Usually, sub-numbered items in answers don't follow the question format.
    
    seen_ids = set()
    dedup_questions = []
    for q in final_questions:
        if 1 <= q['id'] <= 497 and q['id'] not in seen_ids:
            dedup_questions.append(q)
            seen_ids.add(q['id'])
    
    # Sort by ID to ensure order
    dedup_questions.sort(key=lambda x: x['id'])

    # Split data into two
    mid = len(dedup_questions) // 2
    part1 = dedup_questions[:mid]
    part2 = dedup_questions[mid:]

    with open(output_json1, 'w', encoding='utf-8') as f:
        json.dump(part1, f, indent=2)
        
    with open(output_json2, 'w', encoding='utf-8') as f:
        json.dump(part2, f, indent=2)
    
    print(f"Successfully processed {len(dedup_questions)} questions into {output_json1} and {output_json2}")

if __name__ == "__main__":
    process_pdf("Top 1000 Java interview.pdf", "public/data/java_questions_1.json", "public/data/java_questions_2.json", 58, 1112)
