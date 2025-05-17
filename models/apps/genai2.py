import google.generativeai as genai
from decouple import config
import textwrap

# Constants
MAX_CHAR_LENGTH = 10000
CHUNK_WRAP = 9000
GEMINI_MODEL = "models/gemini-1.5-flash"
GEMINI_API = config("GOOGLE_API_KEY")

# Configure Gemini API
genai.configure(api_key=GEMINI_API)
model = genai.GenerativeModel(GEMINI_MODEL)

def summarize_chunk(chunk: str) -> str:
    prompt = (f'''
            You are an AI medical assistant analyzing a multilingual transcript.
            Summarize the conversation in a structured one-page report including:
            - Brief overview of discussion
            - Key medical observations or patient complaints
            - Actionable points or suggested next steps.
            Transcript:\n\"\"\"{chunk}\"\"\""
        '''
    )
    response = model.generate_content(prompt)
    return response.text.strip()

def summarize_large_transcript(transcript: str) -> str:
    if len(transcript) <= MAX_CHAR_LENGTH:
        return summarize_chunk(transcript)

    chunks = textwrap.wrap(transcript, CHUNK_WRAP, break_long_words=False, replace_whitespace=False)
    summaries = []

    for idx, chunk in enumerate(chunks):
        print(f"Summarizing chunk {idx + 1}/{len(chunks)}")
        summaries.append(summarize_chunk(chunk))

    final_prompt = (f'''
        You are an AI assistant tasked with creating a single-page medical summary from multiple summarized segments.
        Please merge and structure it clearly into: Overview, Medical Points, and Next Steps.
        Summaries:\n\n{chr(10).join(summaries)}
        '''
    )

    final_response = model.generate_content(final_prompt)
    return final_response.text.strip()