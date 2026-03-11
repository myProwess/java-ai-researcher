import json
import glob
import os

def fix_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        modified = False
        for item in data:
            q = item.get('question', '').strip()
            a = item.get('answer', '').strip()
            
            # If the question doesn't end with '?', but there is a '?' in the answer,
            # move the text from 'answer' to 'question' up to the first '?'
            if not q.endswith('?') and '?' in a:
                idx = a.find('?')
                moved_text = a[:idx+1].strip()
                rem_answer = a[idx+1:].strip()
                
                item['question'] = f"{q} {moved_text}".strip()
                item['answer'] = rem_answer
                modified = True
                
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"Fixed {file_path}")
        else:
            print(f"No changes needed for {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == '__main__':
    files = glob.glob('public/data/*.json')
    for f in files:
        fix_json(os.path.abspath(f))
