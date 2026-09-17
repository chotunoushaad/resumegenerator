# Troubleshooting & Common Questions

Here are quick solutions for common questions when running ATS Resume Studio.

---

### 1. "The Mac launcher (`start-mac.command`) says it cannot be opened or is from an unidentified developer."
**Cause:** macOS Gatekeeper flags all downloaded scripts for initial user approval.
**Solution:**
1. Right-click (or Control-click) on **`start-mac.command`**.
2. Select **Open** from the menu.
3. In the security dialog, click **Open**.
4. The terminal window will start the local server and open your browser automatically.
*(Alternative: Open **System Settings ➔ Privacy & Security**, scroll to Security, and click **Open Anyway**).*

---

### 2. "The browser shows ERR_CONNECTION_REFUSED."
**Cause:** The small Terminal or Command Prompt window was closed, which stops the background local server.
**Solution:**
1. Double-click `start-mac.command` (Mac) or `start-windows.bat` (Windows) again.
2. **Leave the Terminal window open in the background** while you use the application in your browser.

---

### 3. "The launcher says 'Operation not permitted' on macOS."
**Cause:** macOS Privacy & Security (TCC) may restrict terminal access to certain user folders, or Python was launched without full folder permissions.
**Solution:**
1. ATS Resume Studio includes an automatic fallback: if Python is restricted by macOS, the launcher automatically falls back to Node.js, and if Node.js is not present, it directly opens the application in your browser.
2. If needed, you can also grant Terminal folder access in:
   **System Settings ➔ Privacy & Security ➔ Files and Folders ➔ Terminal** (ensure Downloads/Desktop access is enabled).
3. Alternatively, remove the internet download quarantine attribute by opening Terminal, typing:
   ```bash
   xattr -d com.apple.quarantine "/path/to/ATS-Resume-Studio/ATS-Resume-Studio-App/start-mac.command"
   ```

---

### 4. "My PDF file failed to import or showed an OCR warning."
**Cause:** The PDF you uploaded is likely an image-only scan or photocopy (a flat picture of paper) without an underlying digital text layer.
**Solution:**
- Open your original resume file in Microsoft Word, Google Docs, or Pages.
- Copy all the text (`Ctrl+A` / `Cmd+A` then `Ctrl+C` / `Cmd+C`).
- In ATS Resume Studio, click **"Import Resume"**, select the **"Paste Plain Text"** tab, paste the text, and click **"Process & Import Resume"**.
- Alternatively, export your resume from Word as a `.docx` file and upload the `.docx` directly.

---

### 5. "The Windows launcher (`start-windows.bat`) says Python is not found."
**Cause:** Python is not installed or not added to your system PATH.
**Solution:**
- The launcher will automatically fall back to Node.js or open the app directly in your browser.
- You can optionally install Python from [python.org](https://www.python.org/) (check the box "Add Python to PATH" during install).

---

### 6. "When I click 'Download PDF', the print dialog doesn't appear."
**Cause:** Your web browser may have blocked popup windows.
**Solution:**
- Check the right side of your browser's address bar for a small "popup blocked" icon.
- Click it and choose **"Always allow popups from 127.0.0.1"** (or localhost).
- Click **"Download PDF"** again.

---

### 7. "How do I make my resume fit onto exactly one page?"
**Solution:**
1. In the top controls bar, set **Font Size** to **Small** (9.5pt).
2. Set **Spacing** to **Compact**.
3. Keep the **"Page break guide"** checked to see where an 11-inch Letter page ends.
4. Trim wordy bullet points or older roles so your key accomplishments sit above the red dashed line.

---

### 8. "How do I reset the app or start over?"
**Solution:**
- Click **"Blank Form"** to clear all fields and start fresh.
- Click **"Clear Data"** to delete all locally saved drafts from your browser storage.
- Click **"Load Sample"** anytime to explore the demonstration data.
