import json
import os

def filter_and_split(input_file, output_file1, output_file2):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Select from start (JDK and JRE) till "Microservices as State Machines"
    end_idx = len(data)
    for idx, q in enumerate(data):
        if "Microservices as State Machines" in q['question']:
            end_idx = idx + 1
            break
            
    selected_data = data[:end_idx]
    
    total = len(selected_data)
    mid = total // 2
    
    part1 = selected_data[:mid]
    part2 = selected_data[mid:]
    
    with open(output_file1, 'w', encoding='utf-8') as f:
        json.dump(part1, f, indent=2)
        
    with open(output_file2, 'w', encoding='utf-8') as f:
        json.dump(part2, f, indent=2)
    
    print(f"Total extracted: {total}")
    print(f"First: {selected_data[0]['question']}")
    print(f"Last: {selected_data[-1]['question']}")
    print(f"Split into {len(part1)} and {len(part2)} questions.")

if __name__ == "__main__":
    filter_and_split(r'e:\WebDev\javainterview\public\data\java_questions.json', 
                     r'e:\WebDev\javainterview\public\data\java_questions_1.json', 
                     r'e:\WebDev\javainterview\public\data\java_questions_2.json')
