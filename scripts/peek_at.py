import PyPDF2
import re

def peek_at(pdf_path, start_num, end_num):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        # We know 534 is around page 500 probably
        for i in range(500, 1112):
            text += reader.pages[i].extract_text() + "\n"
            if str(start_num) + "." in text and str(end_num) + "." in text:
                break
    
    pos = text.find(str(start_num) + ".")
    if pos != -1:
        print(text[pos:pos+2000])
    else:
        print(f"Number {start_num} not found in pages 500-1112")

if __name__ == "__main__":
    peek_at("Top 1000 Java interview.pdf", 534, 540)
