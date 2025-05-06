import requests 
url = "https://dme.ap.nic.in/leftmenu_pages/organs/Documents_Required.pdf"
response = requests.get(url)

with open("Documents_req.pdf", "wb") as f:
    f.write(response.content)

import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = PyPDFLoader("Documents_req.pdf")
pages = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
    length_function=len
)
chunks = text_splitter.split_documents(pages)


import google.generativeai as genai

GOOGLE_API_KEY = "GOOGLE_API_KEY"
genai.configure(api_key=os.getenv(GOOGLE_API_KEY))

model = genai.GenerativeModel("gemini-2.0-flash")

# Summarize all chunks using Gemini
all_text = "\n\n".join(chunk.page_content for chunk in chunks)

prompt = f"Please read the following content carefully. Summarize it clearly and concisely. Then, rewrite the summary in simple, easy-to-understand language suitable for a patient or someone without medical background. Avoid complex terms and keep the tone friendly and reassuring:\n\n{all_text}"
response = model.generate_content(prompt)

print(response.text)
