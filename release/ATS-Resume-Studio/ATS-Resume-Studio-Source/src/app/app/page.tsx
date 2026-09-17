'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  FileText,
  Printer,
  UploadCloud,
  ArrowLeft,
  ShieldCheck,
  Check,
  HardDrive,
  FileSpreadsheet,
} from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { TemplateCategory, TemplateId } from '@/types/template';
import { SAMPLE_DATA, EMPTY_RESUME } from '@/lib/sample-data';
import { TEMPLATES } from '@/lib/templates-config';
import { ResumeForm } from '@/components/editor/ResumeForm';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { PreviewControls } from '@/components/preview/PreviewControls';
import { UploadModal } from '@/components/editor/UploadModal';
import { exportToDocx } from '@/lib/export-docx';
import { exportToRtf } from '@/lib/export-rtf';
import { exportToPdf } from '@/lib/export-pdf';
import {
  loadDraftFromStorage,
  saveDraftToStorage,
  clearDraftFromStorage,
} from '@/lib/storage';

export default function ResumeStudioPage() {
  const [data, setData] = useState<ResumeData>(SAMPLE_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('corporate-boardroom');
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('corporate');
  const [accentOverrides, setAccentOverrides] = useState<Record<string, { accent?: string; accent2?: string }>>({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingRtf, setIsExportingRtf] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  // Zoom & view options
  const [scale, setScale] = useState(0.78);
  const [autoFit, setAutoFit] = useState(true);
  const [showPageBreakGuide, setShowPageBreakGuide] = useState(true);
  const [fontSizeOption, setFontSizeOption] = useState<'sm' | 'base' | 'lg'>('base');
  const [densityOption, setDensityOption] = useState<'compact' | 'normal' | 'relaxed'>('normal');

  const previewWrapRef = useRef<HTMLDivElement>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);
  const offscreenPrintRef = useRef<HTMLDivElement>(null);

  const template = TEMPLATES[selectedTemplate];
  const overrides = accentOverrides[selectedTemplate] || {};
  const effectiveAccent = overrides.accent || template.accent;
  const effectiveAccent2 = overrides.accent2 || template.accent2;
  const hasCustomAccent = Boolean(overrides.accent || overrides.accent2);

  // 1. Load draft from localStorage on mount
  useEffect(() => {
    const saved = loadDraftFromStorage();
    if (saved && saved.name) {
      setData(saved);
    }
    setHasLoadedDraft(true);
  }, []);

  // 2. Auto-save to localStorage on change
  useEffect(() => {
    if (!hasLoadedDraft) return;
    saveDraftToStorage(data);
  }, [data, hasLoadedDraft]);

  // 3. Auto-fit computation
  useEffect(() => {
    const computeFit = () => {
      if (!autoFit || !previewWrapRef.current) return;
      const containerWidth = previewWrapRef.current.clientWidth;
      const targetWidth = 8.5 * 96; // 816px
      const availableWidth = containerWidth - 48;
      const fitted = Math.min(1.0, Math.max(0.4, availableWidth / targetWidth));
      setScale(fitted);
    };

    computeFit();
    window.addEventListener('resize', computeFit);
    return () => window.removeEventListener('resize', computeFit);
  }, [autoFit]);

  const handleSetAccent = (hex: string) => {
    setAccentOverrides((prev) => ({
      ...prev,
      [selectedTemplate]: { ...(prev[selectedTemplate] || {}), accent: hex },
    }));
  };

  const handleSetAccent2 = (hex: string) => {
    setAccentOverrides((prev) => ({
      ...prev,
      [selectedTemplate]: { ...(prev[selectedTemplate] || {}), accent2: hex },
    }));
  };

  const handleResetAccent = () => {
    setAccentOverrides((prev) => {
      const next = { ...prev };
      delete next[selectedTemplate];
      return next;
    });
  };

  const handleClearData = () => {
    clearDraftFromStorage();
    setData(EMPTY_RESUME);
  };

  const handleExportRtf = () => {
    setIsExportingRtf(true);
    try {
      exportToRtf(data, template, effectiveAccent, effectiveAccent2);
    } catch (err) {
      console.error('RTF Export error:', err);
      alert('Failed to generate RTF document.');
    } finally {
      setIsExportingRtf(false);
    }
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportToDocx(data, template, effectiveAccent);
    } catch (err) {
      console.error('DOCX Export error:', err);
      alert('Failed to generate Word document.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      exportToPdf(offscreenPrintRef.current, data);
    } catch (err) {
      console.error('PDF Export error:', err);
      alert('Failed to trigger PDF print.');
    } finally {
      setTimeout(() => setIsExportingPdf(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3EFE6] text-stone-900 font-sans">
      {/* Studio Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/90 px-4 md:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 no-print">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-stone-500 hover:text-stone-900 p-1 rounded hover:bg-stone-100 transition-colors"
            title="Back to Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="font-serif italic font-medium text-lg text-stone-900">
              ATS Resume Studio
            </span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.16em] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              100% In-Browser &bull; Free
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* File Upload Trigger */}
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-stone-200" />
            <span>Import Resume (.docx, .pdf, image, .txt)</span>
          </button>

          {/* Privacy & Storage Badge */}
          <div
            className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
            title="Your resume stays on your device. This tool does not upload or store your resume on a server."
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
            <span>Draft Saved Locally</span>
          </div>
        </div>
      </header>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] gap-0">
        {/* LEFT COLUMN: Form Editor */}
        <aside className="bg-white border-r border-stone-200/90 lg:h-[calc(100vh-49px)] lg:overflow-y-auto preview-scroll p-4 md:p-6 no-print">
          <div className="mb-4">
            <h2 className="font-serif text-xl font-medium text-stone-900">
              Resume Editor
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Edit all details, reorder entries, or import an existing file.
            </p>
          </div>

          <ResumeForm
            data={data}
            setData={setData}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onClearData={handleClearData}
          />
        </aside>

        {/* RIGHT COLUMN: Template Picker & Letter Preview */}
        <main className="lg:h-[calc(100vh-49px)] flex flex-col overflow-hidden bg-[#EAE6DA]">
          {/* Controls Bar */}
          <PreviewControls
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            accent={effectiveAccent}
            setAccent={handleSetAccent}
            accent2={effectiveAccent2}
            setAccent2={handleSetAccent2}
            hasCustomAccent={hasCustomAccent}
            onResetAccent={handleResetAccent}
            scale={scale}
            setScale={setScale}
            autoFit={autoFit}
            setAutoFit={setAutoFit}
            showPageBreakGuide={showPageBreakGuide}
            setShowPageBreakGuide={setShowPageBreakGuide}
            fontSizeOption={fontSizeOption}
            setFontSizeOption={setFontSizeOption}
            densityOption={densityOption}
            setDensityOption={setDensityOption}
          />

          {/* Canvas Viewport */}
          <div
            ref={previewWrapRef}
            className="flex-1 overflow-auto preview-scroll p-4 md:p-8 flex items-start justify-center"
          >
            <div
              style={{
                width: `${8.5 * scale}in`,
                flexShrink: 0,
                transformOrigin: 'top center',
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: '8.5in',
                }}
              >
                <ResumePreview
                  ref={previewContentRef}
                  data={data}
                  template={template}
                  accent={effectiveAccent}
                  accent2={effectiveAccent2}
                  showPageBreakGuide={showPageBreakGuide}
                  fontSizeOption={fontSizeOption}
                  densityOption={densityOption}
                />
              </div>
            </div>
          </div>

          {/* Sticky Bottom Export Bar */}
          <footer className="bg-white border-t border-stone-200 px-4 md:px-6 py-3 flex items-center justify-between gap-3 no-print">
            <div className="hidden sm:block">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400 block">
                Active Template
              </span>
              <span className="font-serif text-sm font-medium text-stone-900">
                {template.label}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Word-Compatible RTF */}
              <button
                type="button"
                onClick={handleExportRtf}
                disabled={isExportingRtf}
                className="bg-white border border-stone-300 hover:border-stone-900 text-stone-800 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Download Word-compatible RTF (opens in Word, Pages, Google Docs)"
              >
                <FileText className="w-4 h-4 text-blue-700" />
                <span>{isExportingRtf ? 'Generating...' : 'Word RTF (.rtf)'}</span>
              </button>

              {/* True Microsoft Word .docx */}
              <button
                type="button"
                onClick={handleExportDocx}
                disabled={isExportingDocx}
                className="hidden sm:flex bg-white border border-stone-300 hover:border-stone-900 text-stone-800 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium items-center gap-1.5 transition-colors shadow-2xs"
                title="Download true Microsoft Word .docx"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>{isExportingDocx ? 'Generating...' : 'Word (.docx)'}</span>
              </button>

              {/* Vector PDF Export */}
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs"
                title="Print or Save as Vector Text PDF"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>{isExportingPdf ? 'Opening Print...' : 'Download PDF'}</span>
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* In-Browser Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onParsed={(parsed) => setData(parsed)}
      />

      {/* Off-screen Full-Size Resume for 1:1 Vector Print Export */}
      <div
        ref={offscreenPrintRef}
        aria-hidden="true"
        className="absolute -left-[99999px] top-0 pointer-events-none"
        style={{ width: '8.5in' }}
      >
        <ResumePreview
          data={data}
          template={template}
          accent={effectiveAccent}
          accent2={effectiveAccent2}
          showPageBreakGuide={false}
          fontSizeOption={fontSizeOption}
          densityOption={densityOption}
        />
      </div>
    </div>
  );
}
