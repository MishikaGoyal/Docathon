"use client";
import React, { useState } from "react";
import { FileUpload } from "../ui/file-upload";
import { jsPDF } from "jspdf";

export default function FileUploadDemo() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];

    // Validate file type and size
    if (
      !selectedFile.type.includes("audio/") ||
      !selectedFile.name.match(/\.(mp3|wav|ogg|m4a)$/i)
    ) {
      alert("Only audio files (.mp3, .wav, .ogg, .m4a) are supported");
      return;
    }

    setAudioFile(selectedFile);
    setIsUploading(true);
    setPdfUrl(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch("http://127.0.0.1:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!Array.isArray(data.transcriptions)) {
        throw new Error("No transcription data returned from API");
      }

      // Generate PDF with each transcription on new line
      const pdf = new jsPDF();
      pdf.text(data.transcriptions, 10, 10);
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("API Error:", error);
      alert(
        `Transcription failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplaceFile = () => {
    setAudioFile(null);
    setPdfUrl(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-wheat dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
      {!audioFile ? (
        <FileUpload onChange={handleFileChange} />
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg
                className="w-6 h-6 text-black mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">{audioFile.name}</span>
            </div>
            <button
              onClick={handleReplaceFile}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              Replace File
            </button>
          </div>

          {isUploading && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing...</span>
            </div>
          )}

          {pdfUrl && (
            <div className="mt-4">
              <a
                href={pdfUrl}
                download="transcription.pdf"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
