'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  ClipboardPaste,
  Sparkles,
  Ban,
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { extractTextFromFile, ExtractionProgress } from '@/lib/file-extractor';
import { parseResumeByRules } from '@/lib/resume-rule-parser';
import { SAMPLE_RESUME_TEXT } from '@/lib/sample-data';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: ResumeData) => void;
}

export function UploadModal({ isOpen, onClose, onParsed }: UploadModalProps) {
  const [tab, setTab] = useState<'upload' | 'paste'>('upload');
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Active file & progress state
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [currentFileType, setCurrentFileType] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<ExtractionProgress | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  if (!isOpen) return null;

  const handleCancelExtraction = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setProgressState(null);
    setCurrentFileName(null);
    setCurrentFileType(null);
    setError('File processing was cancelled.');
  };

  const handleProcessText = (text: string, filename?: string, ocrNotice?: string) => {
    try {
      setLoading(true);
      setError(null);
      setWarning(null);

      const parsed = parseResumeByRules(text);

      if (ocrNotice) {
        setWarning(ocrNotice);
      } else if (!parsed.name || parsed.name === 'Your Name') {
        setWarning('Could not confidently detect your full name. Please check the Name field in the editor.');
      }

      onParsed(parsed);
      onClose();
    } catch (err: unknown) {
      console.error('Parsing error:', err);
      setError('An error occurred while organizing your resume. Please try manual entry or paste plain text.');
    } finally {
      setLoading(false);
      setProgressState(null);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (loading) return;

    setError(null);
    setWarning(null);
    setLoading(true);
    setCurrentFileName(file.name);

    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    setCurrentFileType(ext);

    // Initialize abort controller for cancellation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await extractTextFromFile(
        file,
        (progress) => {
          setProgressState(progress);
        },
        controller.signal
      );

      abortControllerRef.current = null;
      handleProcessText(result.text, result.filename, result.ocrNotice);
    } catch (err: unknown) {
      abortControllerRef.current = null;
      if (err instanceof Error && err.message.includes('cancelled')) {
        setError('File processing was cancelled.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to extract text from file.');
      }
      setLoading(false);
      setProgressState(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (loading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handlePasteSubmit = () => {
    if (!rawText.trim() || loading) return;
    handleProcessText(rawText);
  };

  const loadSample = () => {
    setRawText(SAMPLE_RESUME_TEXT);
    setTab('paste');
    setError(null);
  };

  const handleModalClose = () => {
    if (loading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-base font-bold shadow-2xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Import Existing Resume
              </h3>
              <p className="text-xs text-stone-500">
                Upload a DOCX, PDF, TXT, PNG, JPG, or WEBP resume.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/50 px-6 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => setTab('upload')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              tab === 'upload'
                ? 'border-stone-900 text-stone-900 bg-white rounded-t-md'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Upload Resume File
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setTab('paste')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              tab === 'paste'
                ? 'border-stone-900 text-stone-900 bg-white rounded-t-md'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Paste Plain Text
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Privacy Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Local Privacy Guarantee:</strong> Your file is processed only in your browser and is never uploaded. On-device text recognition runs 100% locally with zero external API calls.
            </div>
          </div>

          {/* Active Processing / Import Status Area */}
          {loading && (
            <div className="bg-stone-900 text-white rounded-xl p-5 shadow-lg space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  <div>
                    <div className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                      <span>{currentFileName || 'Processing Document'}</span>
                      {currentFileType && (
                        <span className="bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase">
                          {currentFileType}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {progressState?.message || 'Reading document in browser...'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCancelExtraction}
                  className="flex items-center gap-1 text-xs bg-stone-800 hover:bg-rose-900/60 hover:text-rose-200 text-stone-300 px-2.5 py-1.5 rounded-md transition-colors border border-stone-700"
                >
                  <Ban className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>

              {/* Progress Bar if percentage is available */}
              {typeof progressState?.percent === 'number' && (
                <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-2 transition-all duration-200 rounded-full"
                    style={{ width: `${progressState.percent}%` }}
                  />
                </div>
              )}

              <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-800">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> On-Device Text Recognition Active
                </span>
                <span>Zero server calls</span>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {error && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-amber-900 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold">Notice</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* TAB 1: FILE UPLOAD */}
          {tab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!loading) setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => {
                  if (!loading) fileInputRef.current?.click();
                }}
                className={`border-2 border-dashed rounded-xl p-7 text-center transition-all ${
                  loading
                    ? 'opacity-50 cursor-not-allowed border-stone-200 bg-stone-50'
                    : isDragOver
                    ? 'border-stone-900 bg-stone-100/70 scale-[0.99] cursor-pointer'
                    : 'border-stone-300 hover:border-stone-600 bg-stone-50/40 hover:bg-stone-50 cursor-pointer'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.docx,.pdf,.png,.jpg,.jpeg,.webp,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={loading}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-full bg-stone-200/80 text-stone-700 mx-auto flex items-center justify-center mb-3">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-stone-900" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>

                <div className="text-sm font-semibold text-stone-900">
                  {loading ? 'Processing document locally...' : 'Choose a file or drag & drop here'}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Supports <strong>.docx</strong>, <strong>.pdf</strong> (digital &amp; scanned), <strong>.png</strong>, <strong>.jpg</strong>, <strong>.webp</strong>, and <strong>.txt</strong>
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-stone-500 text-[11px]">
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-stone-200 shadow-2xs">
                    <FileText className="w-3.5 h-3.5 text-blue-600" /> Word (.docx)
                  </span>
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-stone-200 shadow-2xs">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-rose-600" /> PDF (Digital &amp; Scanned)
                  </span>
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-stone-200 shadow-2xs">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Image (PNG / JPG / WEBP)
                  </span>
                  <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-stone-200 shadow-2xs">
                    <FileCode className="w-3.5 h-3.5 text-stone-600" /> Plain Text (.txt)
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
                <div>
                  <span className="font-semibold text-stone-700">On-Device Text Recognition:</span> Scanned PDFs and resume screenshots are recognized locally using built-in OCR. No image data or personal text ever leaves your computer.
                </div>
                <div className="text-stone-400">
                  Tip: Clear, high-contrast screenshots and documents achieve the highest extraction accuracy. You can freely edit any extracted field in the editor.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE TEXT */}
          {tab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-600">
                  Paste Resume Content
                </label>
                <button
                  type="button"
                  onClick={loadSample}
                  disabled={loading}
                  className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2 flex items-center gap-1 font-medium disabled:opacity-50"
                >
                  <FileText className="w-3.5 h-3.5" /> Insert Sample Resume
                </button>
              </div>

              <textarea
                rows={11}
                value={rawText}
                disabled={loading}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste plain text here (e.g., from Word, Google Docs, or LinkedIn)..."
                className="w-full px-3.5 py-3 text-xs sm:text-sm border border-stone-300 rounded-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 font-mono transition-colors resize-none leading-relaxed disabled:bg-stone-50"
              />

              <button
                type="button"
                onClick={handlePasteSubmit}
                disabled={!rawText.trim() || loading}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardPaste className="w-4 h-4" />}
                Parse &amp; Load into Editor
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50/80 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Zero network traffic. Zero API fees.</span>
          <button
            type="button"
            onClick={handleModalClose}
            className="text-stone-600 hover:text-stone-950 font-medium px-2 py-1 rounded"
          >
            Cancel &amp; Edit Manually
          </button>
        </div>
      </div>
    </div>
  );
}
