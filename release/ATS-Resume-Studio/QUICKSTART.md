# Quick-Start Guide: Using ATS Resume Studio

Welcome! This guide explains how to get started with ATS Resume Studio in simple, everyday language.

---

## 1. How to Open the App (Mac & Windows)

### Step 1: Extract the ZIP Archive First
- **Important**: Do not run the app directly from inside the ZIP file.
- Right-click `ATS-Resume-Studio-Gumroad-Package.zip` on your computer and choose **Extract All** (Windows) or double-click to unzip (Mac).
- Open the extracted folder: **`ATS-Resume-Studio`** ➔ **`ATS-Resume-Studio-App/`**.

### Step 2: Launch the App

#### If you are on a Mac:
1. Double-click **`start-mac.command`**.
2. **If macOS blocks the script on first launch:**
   - Because you downloaded the file from the internet, macOS Gatekeeper may show: *"start-mac.command can't be opened because it is from an unidentified developer"*.
   - **Solution (Standard Apple Approval):**
     1. Right-click (or Control-click) on **`start-mac.command`**.
     2. Select **Open** from the context menu.
     3. In the dialog box that appears, click **Open**. (You only need to do this once).
     4. Alternatively, open **System Settings ➔ Privacy & Security**, scroll down to the Security section, and click **Open Anyway**.
3. A small Terminal window will appear showing:
   ```text
   ============================================================
      ATS RESUME STUDIO — LOCAL SERVER RUNNING
   ============================================================
      Status:        Listening on 127.0.0.1:3000 (Active)
      Server URL:    http://127.0.0.1:3000/app/
      Engine:        Python (or Node.js)
   ------------------------------------------------------------
      Opening your web browser automatically...
      KEEP THIS TERMINAL WINDOW OPEN while using the app.
      Press Ctrl+C to shut down the server when finished.
   ============================================================
   ```
4. Your default web browser will automatically open to:
   **`http://127.0.0.1:3000/app/`**
5. **Keep the Terminal window open:** While you are writing and editing your resume, keep this window open in the background. When you are finished, press `Ctrl+C` or close the Terminal window to stop the server.

#### If you are on Windows:
1. Double-click **`start-windows.bat`**.
2. If Windows SmartScreen appears, click **"More info"** ➔ **"Run anyway"**.
3. Your web browser will open automatically. Keep the command prompt window open while using the app.

---

## 2. Privacy Guarantee: Zero Data Leaves Your Device

Unlike subscription resume builders that upload your private contact information, employment history, and personal details to external cloud databases, **ATS Resume Studio works 100% inside your local web browser**.

- **No external AI APIs:** Your resume is never sent to OpenAI, Anthropic, Google, or any cloud LLM.
- **Local Document Decoding:** When you import a `.docx`, `.pdf`, or `.txt` resume, your computer processes the file in private memory.
- **Zero Telemetry:** No analytics scripts, trackers, cookies, or account sign-ins.
- **Offline Capable:** You can disconnect your internet connection entirely and the app will continue to run with 100% functionality.

---

## 3. How to Import an Existing Resume

Click the black **"Import Resume (.docx, .pdf, image, .txt)"** button in the top bar:

1. **Drag and drop your file** into the upload area (or click "Browse files"):
   - **Word Documents (`.docx`):** Cleanly extracted directly in your browser.
   - **Digital & Scanned PDFs (`.pdf`):** Digital PDFs extract in milliseconds. Scanned/photocopied PDFs are automatically recognized page-by-page using on-device text recognition.
   - **Resume Images (`.png`, `.jpg`, `.jpeg`, `.webp`):** Screenshots and photos of resumes are recognized using on-device OCR.
   - **Plain Text Files (`.txt`):** Fully supported.
2. The app automatically extracts your name, contact details, work experience, education, skills, and certifications into structured, editable fields.
3. If an image or scanned document has unusual formatting, any unassigned text is safely placed in the editable **"Uncategorized Content"** section at the bottom so you never lose any information.

> [!TIP]
> **On-Device Text Recognition Quality:**
> Clear, high-resolution screenshots and sharp scans provide the best recognition accuracy. Because recognition runs 100% inside your browser, no image files or personal data are ever uploaded to any third-party AI or OCR service. You can review and edit every single extracted field in the editor before saving or exporting.

---

## 4. How to Edit Your Information

The left column is your **Resume Editor**:

- **Personal Details:** Edit your Full Name, Phone Number, Email, City/State, LinkedIn URL, or Portfolio/Website.
- **Summary & Highlights:** Add or edit bullet points summarizing your career achievements.
- **Skills:** Enter your core competencies. Each skill appears in the preview according to your chosen template style.
- **Work Experience & Education:**
  - Click any field to edit Job Titles, Company Names, Dates, or Bullet Points.
  - Click the **Up Arrow (↑)** or **Down Arrow (↓)** on any position or bullet to reorder them instantly.
  - Click **"+ Add Experience"** or **"+ Add Education"** to create new entries.
  - Click the **"✕"** icon to delete any unwanted entry.
- **Review Uncategorized Content:** If your imported resume had unique custom sections (such as Volunteer Leadership or Military Service), they appear at the bottom of the editor so you can easily copy and paste them into your preferred sections.

---

## 5. How to Choose and Style a Template

Above the resume preview, you will find styling controls:

1. **Category Tabs:** Switch between **Corporate**, **Tech**, **Creative**, **Health / Edu**, **Academic**, and **Trades** to explore tailored typographic layouts.
2. **Template Variants:** Each category has 2 distinct layouts (12 total templates). Click any template card to switch layouts instantly.
3. **Font Size Toggle:** Click **Small**, **Normal**, or **Large** to adjust text size and help fit your content onto one page.
4. **Spacing Density Toggle:** Click **Compact**, **Normal**, or **Relaxed** to adjust line height and section padding.
5. **Accent Color:** Click any circular color swatch or click the color picker box to choose your own custom color.
6. **Page 1 Boundary Guide:** Keep the "Page break guide" checkbox checked to see a subtle dashed red line indicating where an 11-inch Letter page ends.

---

## 6. How to Export Your Resume

At the bottom of your screen, you have three export options:

1. **Word RTF (`.rtf`):**
   - Click **"Word RTF (.rtf)"**.
   - Downloads an editable document formatted with true tab stops (no tables).
   - Opens perfectly in Microsoft Word, Apple Pages, Google Docs, and LibreOffice.
2. **Word (`.docx`):**
   - Click **"Word (.docx)"**.
   - Downloads a native Microsoft Word document.
3. **Download PDF (Vector Text):**
   - Click **"Download PDF"**.
   - Opens your browser's native Print dialog with vector fonts embedded.
   - Set Destination to **"Save as PDF"** and Margins to **"None"** (or "Default").
   - Result: A crisp, selectable vector PDF engineered for ATS systems and human recruiters.

---

## 7. How to Clear Locally Stored Draft Data

- While you work, your progress is automatically saved to your browser's private `localStorage`. If you accidentally close your browser tab, your work will still be there when you return.
- If you want to delete your draft completely, click **"Clear Data"** at the top of the editor column. All stored resume data is permanently wiped from your browser memory.
