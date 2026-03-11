import PyPDF2
import re

def count_questions(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        # Just check first 500 pages for now to be fast
        for i in range(len(reader.pages)):
            text += reader.pages[i].extract_text() + "\n"
            if i % 100 == 0:
                print(f"Processed {i} pages...")
    
    # regex for questions starting with a number and a dot
    matches = re.findall(r'\n\s*(\d+)\.\s+', text)
    if matches:
        # Convert to ints and filter
        nums = sorted([int(m) for m in matches])
        print(f"Found {len(nums)} potential question numbers.")
        print(f"Max number found: {max(nums)}")
        # Print a sample of high numbers
        print(f"Sample high numbers: {nums[-20:]}")
    else:
        print("No matches found")

if __name__ == "__main__":
    count_questions("Top 1000 Java interview.pdf")
