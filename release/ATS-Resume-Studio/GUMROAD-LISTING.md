# Gumroad Product Listing: ATS Resume Studio

---

## 1. Product Title
**ATS Resume Studio — The Private, Subscription-Free Resume Builder**

---

## 2. Product Subtitle
*Create a polished, ATS-conscious application-ready resume without monthly subscriptions or AI accounts. 12 editorial templates, in-browser DOCX/PDF/TXT import, selectable vector PDF, and Word-compatible RTF export.*

---

## 3. Short Product Description
Stop getting silently filtered out by automated applicant tracking systems (ATS) because of multi-column tables, graphics, and icon templates. ATS Resume Studio runs **100% in your browser with zero AI/API fees, zero monthly subscriptions, and zero cloud uploads**. Import your existing resume from Word (.docx), PDF, or TXT, refine it with our reorderable editor, apply 12 editorial templates, and export clean, ATS-conscious vector PDF, Word-compatible RTF, and Microsoft Word (.docx) files.

---

## 4. Long-Form Sales Description (Gumroad Description Box)

### The Hidden Subscription Trap in Resume Builders
If you’ve ever tried an online resume builder, you know how frustrating the process is:
1. You spend 45 minutes entering your employment history.
2. You click "Download" only to be hit with a mandatory credit card screen.
3. You get charged **\$25–\$35 every month**, long after your job hunt is over.
4. Or worse: you use an AI resume generator that invents fake accomplishments and requires expensive API tokens.

### The Antidote: 100% In-Browser, Free Forever, Zero AI Costs
**ATS Resume Studio** was built for job seekers who want dignity, design polish, and absolute privacy.

- **Zero Subscriptions:** Buy once or run locally. No recurring credit card fees, no account creation, no paywalls.
- **Zero Cloud Uploads:** Your resume never leaves your computer. We decode `.docx`, `.pdf`, and `.txt` files directly in your browser's local memory using client-side JavaScript.
- **Zero Hallucinated AI:** This is not an AI resume writer that invents fake skills or hallucinated metrics. It is an intelligent, deterministic layout and formatting engine that organizes your real career history.

---

### Key Features

#### 1. In-Browser Resume Import (.docx, .pdf, .txt)
Drop your existing resume file into the app. Using client-side engines (Mammoth.js and PDF.js), the text is extracted locally and structured into:
- Full Name & Contact Details (Phone, Email, Location, LinkedIn, Website)
- Professional Summary & Highlights
- Core Skills & Proficiencies
- Work History (Titles, Companies, Locations, Dates, Accomplishment Bullets)
- Education (Degrees, Universities, Honors)
- Certifications, Projects, Awards, and Academic Publications

#### 2. "Review Uncategorized Text" Safety Net
If your imported resume has unique sections (such as Volunteer Work, Military Experience, or Languages), nothing is lost or deleted. Unmatched text is placed into a dedicated review panel so you can easily copy and paste it into your desired sections.

#### 3. Reorderable Manual Editor
Total control over your resume hierarchy:
- Move positions, degrees, and bullets up or down with one click.
- Automatic draft saving to your browser's local storage—close your tab and come back anytime.
- One-click "Start from Blank" and "Clear My Data" controls.

#### 4. 12 ATS-Conscious Templates (6 Verticals × 2 Variants)
- **Corporate & Executive:** *The Boardroom* & *The Partner*
- **Tech & Engineering:** *The Builder* & *The Architect*
- **Creative & Marketing:** *The Editorial* & *The Studio*
- **Healthcare & Education:** *The Practitioner* & *The Educator*
- **Academic & Research:** *The Scholar* & *The Researcher*
- **Trades & Service:** *The Operator* & *The Foreman*

#### 5. Triple Format Exports
- **Selectable Vector-Text PDF:** Standard 8.5″ × 11″ US Letter dimensions, embedded Google Fonts, clean page breaks, and 100% copy-pasteable text for ATS screeners.
- **Word-Compatible RTF (.rtf):** Opens natively in Microsoft Word, Google Docs, Apple Pages, and LibreOffice with standard tab stops instead of layout tables.
- **True Word (.docx):** Clean OpenXML document output with styled headings and bullet points.

---

## 5. Pricing & Licensing Tiers

| Tier | Price | Access & Rights |
| :--- | :--- | :--- |
| **Personal Use License** | **\$19** *(one-time)* | Pre-compiled static application, 1-click launchers (Mac/Windows), sample test resumes, personal resume creation rights. |
| **Developer & Agency License** | **\$49** *(one-time)* | Everything in Personal + full Next.js 14 + Tailwind + TypeScript source code. Self-host internally, remove branding, format resumes for paying clients. |

---

## 6. Frequently Asked Questions

**Does this software use AI or send my resume to OpenAI or Anthropic?**
No. This software is completely AI-free and API-free. It operates 100% locally in your browser using deterministic JavaScript rules. No external AI APIs are called, and no customer data is ever sent across the network.

**How are these templates designed for Applicant Tracking Systems (ATS)?**
Every template uses a strict single-column structure with standard headings and selectable text. We intentionally avoid sidebars, floating graphics, and multi-column tables that scramble automated ATS parsers like Workday, Taleo, and Greenhouse. (Note: While templates are engineered to maximize ATS readability, no tool can guarantee interview invitations, employment offers, or specific ATS scores, as hiring decisions depend entirely on employer criteria and qualifications.)

**Can it import scanned or image-only PDFs?**
In-browser extraction requires an embedded text layer. Scanned photocopies or image-only PDFs do not have text layers; for those, simply copy and paste the plain text or upload a Word `.docx` file.

**How does local draft saving work?**
The app automatically saves your work-in-progress to your browser's local storage (`localStorage`). Your data never touches a server. You can click "Clear Data" at any time to wipe everything.
