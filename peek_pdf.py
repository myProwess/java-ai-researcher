import PyPDF2
import re

def check_structure(pdf_path, search_term):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    
    pos = text.find(search_term)
    if pos != -1:
        print("--- CONTEXT ---")
        print(text[pos-100:pos+500])
    else:
        print("Not found")

if __name__ == "__main__":
    check_structure("Top 1000 Java interview.pdf", "How can we check is a collection is initialized")
