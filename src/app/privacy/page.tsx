import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, HardDrive, EyeOff, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — ATS Resume Studio',
  description: '100% in-browser resume generation. Zero data transmission, zero database storage, and total user privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-stone-900 font-sans">
      <header className="border-b border-stone-200 bg-white/70 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-950 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="font-serif italic text-stone-900 font-medium text-lg">
            ATS Resume Studio
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5 text-emerald-700" /> Device Isolation Privacy
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 font-medium tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-stone-600 text-sm mt-3">
            Last Updated: September 2026
          </p>
        </div>

        <div className="prose prose-stone max-w-none text-stone-800 text-sm leading-relaxed space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-3">
            <h2 className="font-serif text-xl font-medium text-stone-900 m-0">
              The Fundamental Rule: Your Resume Stays On Your Device
            </h2>
            <p className="text-stone-700 m-0">
              ATS Resume Studio does not upload, transfer, transmit, or store your resume on any remote server. <strong>All file parsing, editing, formatting, and exports occur 100% client-side within your browser.</strong>
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              1. In-Browser Document Extraction
            </h2>
            <p>
              When you import a <code>.docx</code>, <code>.pdf</code>, or <code>.txt</code> file:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>The file is decoded entirely in your local browser runtime using client-side JavaScript libraries (Mammoth.js and PDF.js).</li>
              <li>No file content or byte streams are sent to any external server, AI platform, or cloud API.</li>
              <li>Once imported, our deterministic rule parser structures the text directly in memory.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              2. Local Storage (Draft Auto-Save)
            </h2>
            <p>
              To prevent accidental data loss if you refresh your browser tab, your active resume draft is saved locally in your browser&apos;s <code>localStorage</code>.
            </p>
            <p>
              This data is stored solely on your computer and is never synced to the cloud. You can clear this storage at any time by clicking the &ldquo;Clear Data&rdquo; button in the editor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              3. No External AI Services
            </h2>
            <p>
              This product does not send your data to OpenAI, Anthropic, Google, or any external AI model. Your career data is never used to train language models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              4. Document Downloads
            </h2>
            <p>
              When you click &ldquo;Download PDF&rdquo;, &ldquo;Word RTF&rdquo;, or &ldquo;Word (.docx)&rdquo;, the files are assembled directly in your browser using local blob constructors. Downloads proceed straight to your device&apos;s default Downloads folder without passing through any intermediate proxy.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <Link href="/terms" className="hover:underline">
            Terms of Service &amp; Disclaimers
          </Link>
          <Link href="/app" className="font-medium text-stone-900 hover:underline">
            Launch Studio &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
