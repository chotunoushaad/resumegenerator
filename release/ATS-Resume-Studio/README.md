# ATS Resume Studio

> Create a polished, ATS-conscious application-ready resume without subscriptions or AI accounts.

A 100% client-side, privacy-first, ATS-friendly resume generator built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Mammoth.js**, and **PDF.js**.

---

## Highlights
- **100% In-Browser & Free:** Zero AI costs, zero external APIs, zero server dependencies, and zero monthly subscriptions.
- **Client-Side Document Import:** Extract readable text from `.docx` (Word), `.pdf` (text-based), and `.txt` files directly in your browser without uploading files to any server.
- **Deterministic Rule Parser:** Automatically organizes resume content into structured fields (contact, summary, experience, education, skills, certifications, projects, awards, publications).
- **"Uncategorized Content" Safety Net:** Any text from custom or non-standard sections is safely preserved in an editable review panel so no information is lost or hallucinated.
- **12 ATS-Conscious Templates:** 6 career verticals (Corporate, Tech, Creative, Healthcare/Edu, Academic, Trades) with 2 tailored variants each.
- **Triple Export Formats:**
  - **Vector-Text PDF:** Generated with standard US Letter dimensions, embedded Google Fonts, and selectable text.
  - **Word-Compatible RTF (.rtf):** Opens natively in Microsoft Word, Google Docs, Apple Pages, and LibreOffice with standard tab stops instead of layout tables.
  - **True Word (.docx):** Standard OpenXML document output.
- **Local Storage Auto-Save:** Drafts are saved only in the browser's `localStorage` with a one-click "Clear All Data" control.

---

## Quickstart (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the marketing landing page, or [http://localhost:3000/app](http://localhost:3000/app) for the interactive Resume Studio.

---

## Live Hosted Application

- **Production URL:** [https://resumegenerator-chotunoushaad.vercel.app](https://resumegenerator-chotunoushaad.vercel.app)
- **Deployment URL:** [https://resumegenerator-cvgr087hz-chotunoushaad.vercel.app](https://resumegenerator-cvgr087hz-chotunoushaad.vercel.app)

---

## Deploy to Vercel

The fastest way to deploy ATS Resume Studio publicly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchotunoushaad%2Fresumegenerator)

Or deploy via the CLI:

```bash
npm i -g vercel
vercel --prod
```

No environment variables or secrets are needed. See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for the full step-by-step guide.

---

## Available Scripts
- `npm run dev`: Starts local development server on port 3000
- `npm run build`: Compiles production Next.js build
- `npm run start`: Starts production server
- `npm run type-check`: Verifies TypeScript types (`tsc --noEmit`)
- `npm run lint`: Runs Next.js ESLint checks

---

## Repository Structure
```
├── documentation/
│   └── ARCHITECTURE.md       # Architectural deep dive & design decisions
├── public/
│   └── icon.svg              # Product SVG favicon
├── src/
│   ├── app/
│   │   ├── app/              # Interactive Resume Studio application
│   │   ├── privacy/          # Zero-retention Privacy Policy page
│   │   ├── terms/            # Terms of Service & ATS Disclaimers
│   │   ├── globals.css       # Typography, print media queries, scrollbars
│   │   ├── layout.tsx        # Root HTML layout with font imports & metadata
│   │   └── page.tsx          # Marketing landing page
│   ├── components/
│   │   ├── editor/           # Reorderable, accessible form section editors & upload modal
│   │   ├── preview/          # Letter-size canvas, page-break indicators, zoom controls
│   │   ├── templates/        # 12 ATS-conscious template layout renderers
│   │   └── marketing/        # Landing page sections, gallery, FAQ
│   ├── lib/
│   │   ├── file-extractor.ts # In-browser text extractor (Mammoth.js, PDF.js, FileReader)
│   │   ├── resume-rule-parser.ts # Deterministic rule-based resume parser
│   │   ├── storage.ts        # Browser localStorage draft auto-saver
│   │   ├── export-rtf.ts     # Word-compatible RTF generator
│   │   ├── export-docx.ts    # Native .docx generation using docx npm library
│   │   ├── export-pdf.ts     # Vector text print-to-PDF pipeline
│   │   ├── sample-data.ts    # Sample resume data
│   │   ├── templates-config.ts # Configuration table for 12 template styles
│   │   └── utils.ts          # Sanitization, color conversions, tailwind helpers
│   └── types/
│       ├── resume.ts         # Structured resume data model interfaces
│       └── template.ts       # Template design & category configuration types
├── GUMROAD-LISTING.md        # Sales copy, pricing tiers, and listing description
├── ONBOARDING-GUIDE.md       # Customer instructions & troubleshooting guide
└── README.md                 # Project quickstart & documentation
```

---

## Privacy Architecture
1. **Zero Network Transmission:** All file reading, text extraction, parsing, and exports happen 100% client-side.
2. **No Database:** Resumes are never stored on any remote server.
3. **No External AI Services:** No API keys, no external AI dependencies, and no third-party telemetry.
