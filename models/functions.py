import os
from dotenv import load_dotenv, find_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import google.generativeai as genai
from apps import whisper
from apps import genai2

load_dotenv(find_dotenv())

def process_audio(audio_path: str) -> str:
    chunks = whisper.split_audio(audio_path)
    print("Transcribing audio...")
    transcript = whisper.transcribe_chunks(chunks)
    print("Summarizing transcript...")
    summary = genai2.summarize_large_transcript(transcript)
    return summary

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
