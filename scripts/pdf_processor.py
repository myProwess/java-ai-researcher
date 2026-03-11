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
        "Java Basics": ["java", "jvm", "jre", "jdk", "platform"],
        "OOP Concepts": ["inheritance", "polymorphism", "encapsulation", "abstraction", "class", "interface"],
        "Collections": ["list", "set", "map", "arraylist", "hashmap", "vector", "iterator"],
        "Exception Handling": ["try", "catch", "finally", "throw", "exception", "error"],
        "Multithreading": ["thread", "runnable", "synchronization", "deadlock", "monitor"],
        "JVM": ["heap", "stack", "garbage collection", "classloader", "jit"],
        "Streams & Lambda": ["stream", "lambda", "functional interface", "filter", "map-reduce"],
        "Spring & Frameworks": ["spring", "bean", "autowired", "dependency injection", "mvc"],
        "Design Patterns": ["singleton", "factory", "observer", "builder", "design pattern"],
        "Strings": ["string", "stringbuilder", "stringbuffer", "immutable"],
        "Arrays": ["array", "dimension", "index"],
        "Operators": ["operator", "bitwise", "logical"],
        "Concurrency": ["executor", "future", "callable", "lock", "semaphore"],
        "File Handling": ["io", "file", "path", "reader", "writer", "stream"],
        "Garbage Collection": ["gc", "finalize", "reference"],
        "Advanced Java": ["reflection", "annotation", "generic", "native"]
    }
    
    question_lower = question_text.lower()
    for topic, keywords in topics_map.items():
        if any(keyword in question_lower for keyword in keywords):
            return topic
    return "Others"

def assign_difficulty(question_text, answer_text):
    """Heuristic to assign difficulty levels."""
    complex_keywords = ["internal", "performance", "memory", "race condition", "optimizing", "architect"]
    medium_keywords = ["difference", "explain", "how to", "compare"]
    
    text = (question_text + " " + answer_text).lower()
    
    if any(k in text for k in complex_keywords) or len(answer_text) > 800:
        return "Advanced"
    elif any(k in text for k in medium_keywords) or len(answer_text) > 300:
        return "Intermediate"
    return "Basic"

def process_pdf(pdf_path, output_json):
    raw_text = extract_text_from_pdf(pdf_path)
    
    # regex to find questions starting with "Q:" or "Question:" or "1. ", etc.
    # This is highly dependent on the PDF format.
    # Here we use a generic pattern: "Q: <Question text> A: <Answer text>"
    pattern = r"Q:\s*(.*?)\s*A:\s*(.*?)(?=Q:|$)"
    matches = re.finditer(pattern, raw_text, re.DOTALL | re.IGNORECASE)
    
    questions = []
    for i, match in enumerate(matches, 1):
        q_text = match.group(1).strip()
        a_text = match.group(2).strip()
        
        topic = categorize_topic(q_text)
        difficulty = assign_difficulty(q_text, a_text)
        
        questions.append({
            "id": i,
            "question": q_text,
            "answer": a_text,
            "topic": topic,
            "difficulty": difficulty,
            "tags": [topic.lower(), "java"]
        })
    
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2)
    
    print(f"Successfully processed {len(questions)} questions into {output_json}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        pdf = sys.argv[1]
        out = sys.argv[2] if len(sys.argv) > 2 else "java_questions.json"
        process_pdf(pdf, out)
    else:
        print("Usage: python pdf_processor.py <pdf_path> [output_json]")
