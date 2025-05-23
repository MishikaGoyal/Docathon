from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from functions import process_pdf, summarize_with_gemini, transcribe_with_gladia, predict_image
import uuid

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB limit

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    print("Incoming request to /transcribe")
 
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file part in the request"}), 400

    file = request.files['audio']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.mp3'):
        return jsonify({"error": "Only .mp3 files are supported"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    print("File content type:", file.content_type)
    print("File MIME type:", file.mimetype)  
    result = transcribe_with_gladia(filepath)
    print("Full API response:", result)  # Debugging - show full response
    
    if "error" in result:
        return jsonify(result), 500

    # Extract all transcriptions from the response
    try:
        # Case 1: If transcriptions are in a direct 'transcription' array
        if "transcription" in result and isinstance(result["transcription"], list):
            transcriptions = result["transcription"]
        
        # Case 2: If transcriptions are nested in predictions (common with Gladia)
        elif "prediction" in result and isinstance(result["prediction"], list):
            transcriptions = []
            for prediction in result["prediction"]:
                if "transcription" in prediction:
                    transcriptions.append(prediction["transcription"])
        
        # Case 3: If the structure is different, add more conditions here
        else:
            return jsonify({"error": "Could not find transcription array in response"}), 500

        return jsonify({"transcriptions": transcriptions})

    except Exception as e:
        print(f"Error parsing transcription response: {str(e)}")
        return jsonify({"error": "Failed to parse transcriptions from API response"}), 500

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

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file in the request"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected image file"}), 400

    if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        return jsonify({"error": "Only .jpg, .jpeg, or .png files are supported"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        result, confidence = predict_image(filepath)
        print("Confidence:", confidence)
        return jsonify({"prediction": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)