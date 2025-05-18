import os
from dotenv import load_dotenv, find_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import google.generativeai as genai
import requests
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

load_dotenv(find_dotenv())

GLADIA_API_KEY = os.getenv("GLADIA_API_KEY")
GLADIA_URL = os.getenv("GLADIA_URL")

def transcribe_with_gladia(filepath):
    try:
        with open(filepath, 'rb') as f:
            files = {'audio': (
                    os.path.basename(filepath), f,
                    'audio/mpeg'
                )}
            headers = {
                'accept': 'application/json',
                'x-gladia-key': GLADIA_API_KEY
            }
            data = {
                'language': 'english',
                'toggle_diarization': 'false',
                'toggle_direct_translate': 'false'
            }
            print("Sending file to Gladia API...")
            response = requests.post(GLADIA_URL, headers=headers, files=files,data=data, timeout=60)
            print("Received response from Gladia API")

        if response.status_code != 200:
            return {"error": "API call failed", "details": response.text}

        return response.json()

    finally:
        if os.path.exists(filepath):
            os.remove(filepath) 

def process_pdf(filepath: str):
    loader = PyPDFLoader(filepath)
    pages = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        length_function=len
    )
    chunks = text_splitter.split_documents(pages)
    all_text = "\n\n".join(chunk.page_content for chunk in chunks)
    return all_text

def summarize_with_gemini(text: str):
    api_key = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = (f'''
        Please read the following content carefully. Summarize it clearly and concisely. 
        Then, rewrite the summary in simple, easy-to-understand language suitable for a patient or someone without medical background. 
        Avoid complex terms and keep the tone friendly and reassuring:\n\n"
        {text}
    ''')
    response = model.generate_content(prompt)
    return response.text

MODEL_PATH = "breast_cancer_classifier.h5"
model = load_model(MODEL_PATH)
 
class_names = ['Non-Cancerous', 'Cancerous']

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224)) 
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0 

    prediction = model.predict(img_array)[0]
    predicted_class = class_names[np.argmax(prediction)]

    return predicted_class, float(np.max(prediction))
