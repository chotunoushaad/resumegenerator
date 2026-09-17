import React from 'react';
import Link from 'next/link';
import { FileCheck, ArrowLeft, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service & Disclaimers — ATS Resume Studio',
  description: 'Terms of service, acceptable use, and clear hiring & ATS compliance disclaimers.',
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/70 text-stone-800 text-xs font-medium uppercase tracking-wider mb-4">
            <FileCheck className="w-3.5 h-3.5" /> Legal Terms
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 font-medium tracking-tight">
            Terms of Service &amp; Disclaimers
          </h1>
          <p className="text-stone-600 text-sm mt-3">
            Last Updated: September 2026
          </p>
        </div>

        <div className="prose prose-stone max-w-none text-stone-800 text-sm leading-relaxed space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-900 text-base">
              <AlertCircle className="w-5 h-5 text-amber-700" />
              Important Career &amp; ATS Outcomes Disclaimer
            </div>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-normal m-0">
              ATS Resume Studio provides client-side formatting, layout engines, and typographic templates engineered to optimize resume structure for automated Applicant Tracking Systems. <strong>We do not guarantee job interviews, employment offers, or specific ATS scores.</strong> Every company, recruiter, and hiring software uses distinct evaluation metrics, keyword matching, and human screening workflows outside our control.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              1. Nature of the Service
            </h2>
            <p>
              ATS Resume Studio is a free, in-browser resume formatting and organization tool. It is not an automated career counseling or AI resume writing service. You are solely responsible for ensuring the truthfulness, accuracy, and completeness of all information included in your resume.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              2. Commercial Source Code License (Gumroad)
            </h2>
            <p>
              The web tool is provided free for individual personal use. If you purchase a developer or agency source-code license on Gumroad:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>You may self-host the application for internal business, recruiting, or career coaching use.</li>
              <li>You may write and format resumes for paying clients.</li>
              <li>You may not resell the source code or market a competing public resume template based directly on this codebase without substantial modification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              3. Limitation of Liability
            </h2>
            <p>
              The software is provided &ldquo;as is&rdquo; without warranty of any kind. Under no circumstances shall the creators or maintainers of ATS Resume Studio be liable for any direct, indirect, or incidental damages arising from your job applications or use of this tool.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/app" className="font-medium text-stone-900 hover:underline">
            Launch Studio &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
