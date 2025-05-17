import os
import io
from pydub import AudioSegment
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32


model_id = "openai/whisper-large"
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id,
    torch_dtype=torch_dtype,
    low_cpu_mem_usage=True,
    use_safetensors=True
).to(device)

processor = AutoProcessor.from_pretrained(model_id)

pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    torch_dtype=torch_dtype,
    device=0 if torch.cuda.is_available() else -1,
    return_timestamps=True,
    return_language=True
)

def split_audio(audio_path, chunk_length_ms=60_000):
    '''Splits an audio file into 60s chunks in-memory.'''
    audio = AudioSegment.from_file(audio_path)
    return [audio[i:i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]

def transcribe_chunks(chunks):
    '''Processes chunks using Whisper and returns full transcription.'''
    full_transcription = ""
    for i, chunk in enumerate(chunks):
        buffer = io.BytesIO()
        chunk.export(buffer, format="wav")
        buffer.seek(0)

        print(f"Transcribing chunk {i + 1}/{len(chunks)}")
        result = pipe(buffer)
        full_transcription += result["text"] + " "

    return full_transcription.strip()
