'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  ChevronDown,
  Layers,
  Check,
  UploadCloud,
  FileSpreadsheet,
  HardDrive,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, TEMPLATES } from '@/lib/templates-config';
import { TemplateCategory, TemplateId } from '@/types/template';
import { SAMPLE_DATA } from '@/lib/sample-data';
import { ResumePreview } from '@/components/preview/ResumePreview';

export default function LandingPage() {
  const [activePreviewCat, setActivePreviewCat] = useState<TemplateCategory>('corporate');
  const [activePreviewTpl, setActivePreviewTpl] = useState<TemplateId>('corporate-boardroom');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const selectedConfig = TEMPLATES[activePreviewTpl];

  const handleCategoryClick = (catId: TemplateCategory) => {
    setActivePreviewCat(catId);
    const category = CATEGORIES.find((c) => c.id === catId);
    if (category) {
      setActivePreviewTpl(category.variants[0]);
    }
  };

  const faqs = [
    {
      q: 'Is this really 100% free with no monthly subscription?',
      a: 'Yes. Most resume builders hook job seekers with a free trial and then silently bill $20-$30 per month. ATS Resume Studio runs entirely inside your web browser. There are no subscriptions, no accounts, and no paywalls to export your documents.',
    },
    {
      q: 'Is this an AI resume writer?',
      a: 'No. This is not an AI text generator. It does not use OpenAI, Anthropic, Gemini, or any paid AI API. Instead, it uses an in-browser deterministic rule parser to extract and organize your existing resume from .docx, .pdf, or .txt files into clean, ATS-compliant fields. You retain 100% control over your career story.',
    },
    {
      q: 'What happens to my uploaded resume files?',
      a: 'Nothing leaves your device. We use browser-native libraries (Mammoth.js for DOCX, PDF.js for PDF, and Tesseract.js for image OCR) to extract text directly in your browser memory. Even screenshot images and scanned PDFs are processed using on-device text recognition — no files, personal contact information, or employment records are ever uploaded to any server.',
    },
    {
      q: 'What export formats do you support?',
      a: 'You can export your resume as: (1) Vector-text PDF via your browser’s native print dialog with selectable text; (2) Word-compatible RTF (.rtf) which opens cleanly in Microsoft Word, Google Docs, and Apple Pages; and (3) true Microsoft Word (.docx).',
    },
    {
      q: 'Why single-column layouts for ATS?',
      a: 'Automated Applicant Tracking Systems (Workday, Taleo, Greenhouse, Lever) read resumes linearly from left to right. When two-column or graphic templates are uploaded, the parser reads across columns, scrambling job titles, dates, and bullet points. Our templates strictly use single-column typographic hierarchies that parse cleanly 100% of the time.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-stone-900 font-sans selection:bg-stone-300">
      {/* Navigation Header */}
      <header className="border-b border-stone-200/80 bg-[#FAF7F0]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              R
            </div>
            <span className="font-serif italic font-medium text-xl text-stone-950 tracking-tight">
              ATS Resume Studio
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.16em] font-medium text-stone-600">
            <a href="#how-it-works" className="hover:text-stone-950 transition-colors">
              How It Works
            </a>
            <a href="#templates" className="hover:text-stone-950 transition-colors">
              12 Templates
            </a>
            <a href="#privacy" className="hover:text-stone-950 transition-colors">
              Privacy First
            </a>
            <a href="#faq" className="hover:text-stone-950 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Build Free Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 px-6 border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-xs tracking-wider uppercase font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            100% In-Browser &bull; Zero Subscriptions &bull; Zero AI Fees
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight text-stone-950 leading-[1.08]">
            Create a polished résumé<br />
            <span className="italic font-normal text-stone-700">
              without subscriptions or AI accounts.
            </span>
          </h1>

          <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans">
            Import your existing resume (.docx, .pdf, .txt, or screenshot image) directly in your browser. Organize it with pure single-column typography, apply 12 editorial ATS styles, and download editable Word and vector PDF files.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/app"
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white px-7 py-3.5 rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <span>Launch Resume Builder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#templates"
              className="w-full sm:w-auto bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 px-6 py-3.5 rounded-lg text-sm font-medium transition-colors"
            >
              Browse 12 ATS Templates
            </a>
          </div>

          {/* Value Badges */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Word-Compatible RTF &amp; DOCX
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Selectable Vector PDF
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> LocalStorage Auto-Save
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Zero Data Uploaded to Cloud
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 bg-[#F3EFE6] border-b border-stone-200">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-[0.22em] font-medium text-stone-500">
              Simple 4-Step Process
            </h2>
            <p className="font-serif text-3xl sm:text-4xl font-medium text-stone-950">
              From Old Document to Clean Resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 font-mono text-xs font-semibold flex items-center justify-center">
                01
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900">
                1. Import or Type
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Drag and drop your existing .docx, .pdf, .txt, or resume screenshot (PNG, JPG) — or start from a blank form.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 font-mono text-xs font-semibold flex items-center justify-center">
                02
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900">
                2. Browser Parsing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Our client-side rule parser organizes headings, dates, and bullets instantly in your browser.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 font-mono text-xs font-semibold flex items-center justify-center">
                03
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900">
                3. Refine &amp; Reorder
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Add bullet points, reorder positions with Move Up/Down controls, and review any unparsed text.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 font-mono text-xs font-semibold flex items-center justify-center">
                04
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900">
                4. Download Clean Files
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Export vector-text PDF or Word-compatible RTF ready to apply to jobs immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Templates Gallery */}
      <section id="templates" className="py-20 md:py-28 px-6 border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-[0.22em] font-medium text-stone-500">
              12 ATS-Conscious Styles
            </h2>
            <p className="font-serif text-3xl sm:text-4xl font-medium text-stone-950">
              Editorial Typography for Every Profession
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Designed with timeless typographic restraint: The New Yorker meets McKinsey. Single-column layouts with standard headings ensure 100% linear ATS readability.
            </p>
          </div>

          {/* Interactive Template Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1 bg-white/70 rounded-lg border border-stone-200">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md transition-all whitespace-nowrap ${
                    activePreviewCat === cat.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.find((c) => c.id === activePreviewCat)?.variants.map((vId) => {
                const tpl = TEMPLATES[vId];
                const active = vId === activePreviewTpl;
                return (
                  <button
                    key={vId}
                    onClick={() => setActivePreviewTpl(vId)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
                      active
                        ? 'border-stone-900 bg-white text-stone-950 shadow-xs ring-1 ring-stone-900'
                        : 'border-stone-300/80 bg-white/60 text-stone-600 hover:border-stone-500'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: tpl.accent }}
                    />
                    <span>{tpl.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-stone-900" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center overflow-x-auto pb-6">
            <div className="shadow-2xl rounded-sm border border-stone-300 overflow-hidden transform scale-[0.68] sm:scale-[0.8] md:scale-[0.88] origin-top transition-transform">
              <ResumePreview
                data={SAMPLE_DATA}
                template={selectedConfig}
                accent={selectedConfig.accent}
                accent2={selectedConfig.accent2}
                showPageBreakGuide={false}
              />
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors shadow-sm"
            >
              <span>Open Studio with This Template</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy First Section */}
      <section id="privacy" className="py-20 md:py-24 px-6 bg-[#F3EFE6] border-b border-stone-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Complete Device Isolation
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-950">
              Your Career Data Never Leaves Your Device
            </h2>
            <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
              Unlike cloud-hosted tools that harvest resume data, ATS Resume Studio operates with zero server communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <HardDrive className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-medium text-stone-900">Local Browser Storage</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Drafts are saved only in your browser’s localStorage. Clearing your browser data deletes everything.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <EyeOff className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-medium text-stone-900">Zero Cloud Uploads</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Uploaded .docx, .pdf, and .txt files are decoded entirely in client-side JavaScript. No backend exists.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-base font-medium text-stone-900">No Hidden Accounts</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No passwords, no email registrations, and no subscription paywalls to download your files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 md:py-24 px-6 border-b border-stone-200/80">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs uppercase tracking-[0.22em] font-medium text-stone-500">
              Questions &amp; Answers
            </h2>
            <p className="font-serif text-3xl font-medium text-stone-950">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200/90 rounded-lg overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-medium text-xs sm:text-sm text-stone-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gumroad Support / Source Code Section */}
      <section className="py-16 px-6 bg-[#F3EFE6] border-b border-stone-200">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
            Want to Support the Project or Self-Host?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
            The web tool is free to use forever. If you are an agency, career coach, or developer who wants the full clean source code with commercial writing rights, grab the bundle on Gumroad.
          </p>
          <div className="pt-2">
            <a
              href="https://gumroad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
            >
              <span>Get Source Code License on Gumroad ($29)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#FAF7F0] text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-semibold text-stone-800 text-sm">
              ATS Resume Studio
            </span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-stone-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-900 transition-colors">
              Terms &amp; Disclaimers
            </Link>
            <Link href="/app" className="hover:text-stone-900 font-medium text-stone-800 transition-colors">
              Launch Studio &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
