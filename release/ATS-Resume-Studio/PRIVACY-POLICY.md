# Privacy Policy — ATS Resume Studio

Last Updated: September 2026

## The Fundamental Rule: Your Resume Stays On Your Device

ATS Resume Studio does not upload, transfer, transmit, or store your resume on any remote server. **All file parsing, editing, formatting, and exports occur 100% client-side within your browser.**

---

### 1. In-Browser Document Extraction
When you import a `.docx`, `.pdf`, or `.txt` file:
- The file is decoded entirely in your local browser runtime using client-side JavaScript libraries (Mammoth.js and PDF.js).
- No file content or byte streams are sent to any external server, AI platform, or cloud API.
- Once imported, our deterministic rule parser structures the text directly in local computer memory.

### 2. Local Storage (Draft Auto-Save)
To prevent accidental data loss if you refresh your browser tab, your active resume draft is saved locally in your browser's `localStorage`.
- This data is stored solely on your computer and is never synced to the cloud.
- You can permanently wipe this storage at any time by clicking the "Clear Data" button in the editor.

### 3. No External AI Services
This product does not send your data to OpenAI, Anthropic, Google, or any external AI model. Your career data is never used to train language models.

### 4. Document Downloads
When you click "Download PDF", "Word RTF", or "Word (.docx)", the files are assembled directly in your browser using local blob constructors. Downloads proceed straight to your device's default Downloads folder without passing through any intermediate proxy.

### 5. Zero Telemetry & Zero Analytics
This software includes no tracking pixels, telemetry beacons, third-party advertising cookies, or analytics scripts.
