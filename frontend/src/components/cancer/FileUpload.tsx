"use client";
import React, { useState } from "react";
import { FileUpload } from "../ui/file-upload";

export default function FileUploadDemo() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // ✅ FileUpload passes files directly, not an event
  const handleImageChange = async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    if (
      !selectedFile.type.includes("image/") ||
      !selectedFile.name.match(/\.(jpeg|jpg|png)$/i)
    ) {
      alert("Only audio files (.mp3, .wav, .ogg, .m4a) are supported");
      return;
    }
    setImage(selectedFile);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.prediction || "No response from model.");
    } catch (error) {
      console.error("Upload failed", error);
      setResult("Prediction failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplaceFile = () => {
    setImage(null);
    setResult("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-wheat dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
      {!image ? (
        <FileUpload onChange={handleImageChange} />
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-500 mr-2"
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
              <span className="text-sm font-medium">{image.name}</span>
            </div>
            <button
              onClick={handleReplaceFile}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              Replace File
            </button>
          </div>

          {isUploading ? (
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
          ) : null}
        </div>
      )}

      {result && (
        <div className="mt-8 w-full">
          <div className="bg-white dark:bg-gray-850 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="border-b-4 border-blue-600 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Detection Result
                </h2>
              </div>
            </div>

            {/* Dynamic Content Parser */}
            <div className="p-6 space-y-6">
              {result.split(/\n{2,}/).map((section, sectionIndex) => {
                // Clean the section first
                const cleanedSection = section.trim();

                // Check if section is a heading
                const isHeading =
                  cleanedSection.match(/^[A-Z][a-zA-Z ]+:/) ||
                  cleanedSection.match(/^[#*]{1,2}\s/) ||
                  cleanedSection.match(/^[A-Z ]+$/);

                // Check for bold text patterns
                const isBoldHeading = cleanedSection.match(/\*\*.+\*\*/);

                if (isHeading || isBoldHeading) {
                  // Clean heading text
                  const headingText = cleanedSection
                    .replace(/\*\*/g, "")
                    .replace(/#/g, "")
                    .trim();

                  return (
                    <div key={`heading-${sectionIndex}`} className="space-y-3">
                      <div className="flex items-center">
                        <div
                          className={`w-1.5 h-6 ${
                            sectionIndex % 3 === 0
                              ? "bg-blue-600"
                              : sectionIndex % 3 === 1
                              ? "bg-green-600"
                              : "bg-purple-600"
                          } rounded-full mr-3`}
                        ></div>
                        <h3
                          className={`text-lg font-bold ${
                            sectionIndex % 3 === 0
                              ? "text-blue-700 dark:text-blue-400"
                              : sectionIndex % 3 === 1
                              ? "text-green-700 dark:text-green-400"
                              : "text-purple-700 dark:text-purple-400"
                          }`}
                        >
                          {headingText}
                        </h3>
                      </div>
                    </div>
                  );
                }

                // Process bullet points that start with *
                if (
                  cleanedSection.includes("* ") &&
                  cleanedSection.split("\n").length === 1
                ) {
                  return (
                    <ul
                      key={`bullets-${sectionIndex}`}
                      className="pl-6 space-y-3"
                    >
                      {cleanedSection
                        .split("* ")
                        .filter((item) => item.trim())
                        .map((item, itemIndex) => (
                          <li
                            key={`bullet-${itemIndex}`}
                            className="text-gray-700 dark:text-gray-300 leading-relaxed"
                          >
                            <span className="absolute -ml-4">•</span>
                            {item.trim()}
                          </li>
                        ))}
                    </ul>
                  );
                }

                // Process regular lists (with line breaks)
                if (cleanedSection.match(/^\s*[-*•]\s|\d+\.\s/)) {
                  return (
                    <ul key={`list-${sectionIndex}`} className="pl-6 space-y-3">
                      {cleanedSection.split("\n").map((item, itemIndex) => (
                        <li
                          key={`listitem-${itemIndex}`}
                          className="text-gray-700 dark:text-gray-300 leading-relaxed"
                        >
                          <span className="absolute -ml-4">•</span>
                          {item.replace(/^\s*[-*•]\s|\d+\.\s/, "").trim()}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Regular paragraph
                return (
                  <div key={`para-${sectionIndex}`} className="pl-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {cleanedSection}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
          </div>
        </div>
      )}
    </div>
  );
}
