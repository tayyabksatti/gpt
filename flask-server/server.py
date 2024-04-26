from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from PyPDF2 import PdfReader
from transformers import pipeline
import tensorflow as tf 
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
extracted_text = ''
stored_extracted_text = ''
def extract_text_from_pdf(pdf_path):
    try:
        pdf_reader = PdfReader(pdf_path)
        text = ''
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text()
            # print(text)
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    
    upload_folder = 'C:\\Users\\Tayyab Satti\\Desktop\\python\\'
    file.save(upload_folder + file.filename)
    
    file_path = os.path.join(upload_folder, file.filename)
    
    
    extracted_text = ''
    if file.filename.lower().endswith('.pdf'):
        extracted_text = extract_text_from_pdf(file_path)
        stored_extracted_text= extracted_text 
        if extracted_text is None:
            return jsonify({'error': 'Failed to extract text from PDF'}), 500
    # print(extracted_text)        
    return jsonify({'message': 'File uploaded successfully', 'filename': file.filename,'extracted_text':extracted_text}), 200

qa_pipeline = pipeline("question-answering")


@app.route('/question', methods=['POST'])
def handle_question():
    if request.method == 'POST':
        data = request.get_json()
        question = data.get('question', '')
        print(question)
        # extracted_text = session.get('extracted_text')
        extracted_text = data.get('extracted_text', '')
        print("hhhhhhhhhhh",extracted_text)
        if not question:
            return jsonify({'error': 'No question provided'}), 400
        if not extracted_text:
            return jsonify({'error': 'No extracted text provided'}), 400

        # Use the question answering pipeline to answer the question based on the extracted text
        answer = qa_pipeline(question=question, context=extracted_text)
        print(answer,"answer")
        return jsonify({'question': question, 'answer': answer['answer']}), 200
    else:
        return jsonify({'error': 'Method Not Allowed'}), 405


if __name__ == '__main__':
    app.run(debug=True)
