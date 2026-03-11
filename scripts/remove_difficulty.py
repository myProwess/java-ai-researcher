import json
import glob
import os

files = glob.glob('e:/WebDev/javainterview/public/data/*.json')
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            
        new_data = []
        for q in data:
            if 'difficulty' in q:
                del q['difficulty']
            new_data.append(q)
            
        with open(f, 'w', encoding='utf-8') as file:
            json.dump(new_data, file, indent=2)
            
        print(f"Updated {f}")
    except Exception as e:
        print(f"Error processing {f}: {e}")
