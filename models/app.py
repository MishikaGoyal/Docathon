from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from functions import process_pdf, summarize_with_gemini, process_audio
import uuid

app = Flask(__name__)
CORS(app)

'''os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"'''

app.config['UPLOAD_FOLDER'] = 'uploads'

app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB limit

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

'''@app.route("/transcribe", methods=["POST"])
def transcribe_and_summarize():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        filename = secure_filename(file.filename)
        unique_name = f"{uuid.uuid4()}_{filename}"
        audio_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
        file.save(audio_path)
        print(f"Saved file to {audio_path}")
        summary = process_audio(audio_path)
        return jsonify({"summary": summary})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500'''

@app.route('/summarize', methods=['POST'])
def summarize_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            text = process_pdf(filepath)
            summary = summarize_with_gemini(text)
            return jsonify({"summary": summary})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

if __name__ == '__main__':
    app.run(debug=True)