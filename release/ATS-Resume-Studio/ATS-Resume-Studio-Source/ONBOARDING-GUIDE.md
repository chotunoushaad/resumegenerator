# Buyer & User Onboarding Guide: ATS Resume Studio

Welcome to ATS Resume Studio! This guide walks you through importing your existing resume, customizing your layout, and exporting clean ATS-ready files.

---

## 1. Quickstart: Create Your Resume in 3 Steps

### Step 1: Open the Application
Navigate to the interactive studio at `/app` (or `http://localhost:3000/app` for local source code users).

### Step 2: Input Your Career Data
You have three simple ways to populate your resume:
1. **Import File (Recommended):** Click **"Import Resume (.docx, .pdf, .txt)"** in the top navigation bar. Drag and drop your existing Word document, text-based PDF, or plain text file. Text is extracted in your browser and automatically organized into structured sections.
2. **Start with Sample:** Click **"Load Sample"** to explore a pre-populated executive resume (Emma Larsen).
3. **Start from Blank:** Click **"Blank Form"** to enter your information from scratch.

### Step 3: Choose Template & Export
1. Select your industry vertical across the top tabs (Corporate, Tech, Creative, Health/Edu, Academic, Trades).
2. Switch between the two tailored template variants.
3. Customize your accent color using the palette swatches or custom hex input.
4. Export:
   - **Download PDF:** Generates a clean vector-text PDF via your browser's print dialog.
   - **Word RTF (.rtf):** Downloads a Word-compatible RTF document that opens cleanly in Word, Pages, and Google Docs.
   - **Word (.docx):** Downloads a true OpenXML Word document.

---

## 2. In-Browser Document Extraction Tips

### Word Documents (.docx)
- Modern `.docx` files extract with 100% fidelity using in-browser Mammoth.js.

### Text-Based PDFs (.pdf)
- Modern PDFs generated from Word, Google Docs, or LaTeX contain an embedded vector text layer that extracts cleanly.
- **Important:** If your PDF was scanned from a physical printer or saved as an image/screenshot, it has no text layer. In-browser extraction without OCR will detect this and show a notice. In that case, simply copy and paste your plain text into the "Paste Plain Text" tab.

### The "Uncategorized Text" Review Area
- If your uploaded resume contains non-standard headings (e.g. "Volunteer Work", "Languages", "Interests"), the parser preserves them in the **"Review Imported / Uncategorized Text"** box at the top of the editor.
- Nothing is ever deleted or lost. You can copy/paste any unparsed items into your desired sections.

---

## 3. Privacy & Local Storage
- **Zero Cloud Storage:** Your resume is never uploaded to any remote server or database.
- **Auto-Save:** Your draft automatically saves to your browser's `localStorage`. You can safely refresh your tab or return later.
- **Clear Data:** To wipe your local draft completely, click **"Clear Data"** in the toolbar.

---

## 4. Troubleshooting & Support

### PDF Pop-up Blocked
- Modern browsers may occasionally block automatic print pop-ups. If this occurs, the app automatically downloads a print-ready `.html` file. Simply open that file in your browser and press `Ctrl+P` (Windows) or `Cmd+P` (Mac) to save as PDF.

### Multi-Page Content Fitting
- Use the **Page break guide** toggle (dashed red line) to see exactly where the 11-inch Letter boundary occurs.
- If your resume overflows onto page 2 by only 2–3 lines, select a more compact template variant (such as *The Educator* or *The Researcher*) or trim bullet points.
