import PyPDF2
import re

def count_all_numbered(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for i, page in enumerate(reader.pages):
            text += page.extract_text() + "\n"
    
    matches = re.finditer(r'\n\s*(\d+)\.', text)
    nums = [int(m.group(1)) for m in matches]
    print(f"Total matches: {len(nums)}")
    if nums:
        print(f"Max: {max(nums)}")
        # Check for gaps
        s_nums = sorted(list(set(nums)))
        print(f"Unique numbers: {len(s_nums)}")
        print(f"Snippet: {s_nums[-50:]}")

if __name__ == "__main__":
    count_all_numbered("Top 1000 Java interview.pdf")
