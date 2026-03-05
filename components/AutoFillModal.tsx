"use client";

import React, { useRef, useState, useCallback } from "react";

type AutofillResult = Record<string, unknown>;

interface AutofillModalProps {
  onAutofill: (data: AutofillResult) => void;
  onClose: () => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export default function AutofillModal({ onAutofill, onClose }: AutofillModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("");
  const [base64, setBase64] = useState<string>("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [parsedJson, setParsedJson] = useState<AutofillResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic"];
  const MAX_MB = 10;

  const readFile = (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setErrorMsg("Unsupported file type. Please upload JPEG, PNG, WEBP, or HEIC.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErrorMsg(`File too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }
    setErrorMsg("");
    setFileName(file.name);
    setMimeType(file.type);
    setParsedJson(null);
    setUploadState("idle");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      // Strip the data URL prefix to get raw base64
      setBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }, []);

  const handleParse = async () => {
    if (!base64 || !mimeType) return;
    setUploadState("uploading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error ?? "Unknown error from server");
      }

      setParsedJson(json.data);
      setUploadState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setUploadState("error");
    }
  };

  const handleApply = () => {
    if (parsedJson) {
      onAutofill(parsedJson);
      onClose();
    }
  };

  const fieldCount = parsedJson ? Object.keys(parsedJson).length : 0;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Autofill from Image</h2>
            <p className="text-xs text-gray-500 mt-0.5">Upload a handwritten form — Gemini AI will extract and fill it</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center p-6
              ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED.join(",")}
              className="hidden"
              onChange={handleFileChange}
            />
            {preview ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Uploaded form preview" className="max-h-52 mx-auto rounded-lg object-contain shadow" />
                <p className="text-xs text-gray-500 truncate">{fileName}</p>
                <p className="text-xs text-blue-600 underline">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-2 text-gray-400">
                <svg className="mx-auto w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-medium text-sm text-gray-600">Drag & drop or click to upload</p>
                <p className="text-xs">JPEG, PNG, WEBP, HEIC — max {MAX_MB}MB</p>
              </div>
            )}
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {errorMsg}
            </div>
          )}

          {/* Success preview */}
          {uploadState === "success" && parsedJson && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 space-y-2">
              <p className="text-green-800 font-semibold text-sm">
                ✓ Extracted {fieldCount} field{fieldCount !== 1 ? "s" : ""} successfully
              </p>
              <details className="text-xs text-gray-600">
                <summary className="cursor-pointer text-green-700 font-medium">Preview extracted JSON</summary>
                <pre className="mt-2 bg-white border border-gray-200 rounded p-2 overflow-x-auto text-xs max-h-48">
                  {JSON.stringify(parsedJson, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {uploadState !== "success" ? (
              <button
                type="button"
                onClick={handleParse}
                disabled={!base64 || uploadState === "uploading"}
                className={`
                  flex-1 py-2.5 rounded-lg font-semibold text-sm transition
                  ${!base64 || uploadState === "uploading"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 text-white shadow"
                  }
                `}
              >
                {uploadState === "uploading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Parsing with Gemini...
                  </span>
                ) : "Parse Image"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-green-600 hover:bg-green-700 text-white shadow transition"
              >
                Apply to Form ({fieldCount} fields)
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>

          {/* Re-parse option after success */}
          {uploadState === "success" && (
            <button
              type="button"
              onClick={() => { setParsedJson(null); setUploadState("idle"); setPreview(null); setBase64(""); setFileName(""); }}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Upload a different image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}