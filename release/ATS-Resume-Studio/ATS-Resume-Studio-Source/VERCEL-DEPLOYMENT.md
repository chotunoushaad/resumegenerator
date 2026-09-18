# Deploying ATS Resume Studio to Vercel

ATS Resume Studio is a **100% browser-based** resume builder with zero backend requirements. Deploying to Vercel gives you a publicly accessible URL — your resume data still never leaves the user's browser.

---

## Option 1: Deploy from GitHub (Recommended)

This is the easiest method and sets up automatic deployments on every push.

### Step 1 — Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**.
2. Choose **Continue with GitHub** and authorize Vercel to access your repositories.

### Step 2 — Import the Repository

1. From your Vercel dashboard, click **Add New → Project**.
2. Find and select the **resumegenerator** repository.
3. Vercel will automatically detect the Next.js framework.

### Step 3 — Deploy

1. Leave all settings at their defaults:
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)
2. No environment variables are needed.
3. Click **Deploy**.

### Step 4 — Access Your Site

Once the build completes (typically 1–2 minutes), Vercel will provide a URL like:

```
https://resumegenerator-abc123.vercel.app
```

You can also add a custom domain from **Settings → Domains**.

---

## Option 2: Deploy with the Vercel CLI

### Step 1 — Install the Vercel CLI

```bash
npm install -g vercel
```

### Step 2 — Login

```bash
vercel login
```

Follow the browser prompt to authenticate with your Vercel account.

### Step 3 — Deploy

From the project root directory:

```bash
vercel
```

The CLI will ask:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (subsequent deploys)
- **Project name?** → `ats-resume-studio` (or your preference)
- **Directory?** → `./` (default)

### Step 4 — Production Deploy

To push to production:

```bash
vercel --prod
```

---

## Verification Checklist

After deployment, verify these URLs work:

| Page | URL | What to Check |
|---|---|---|
| Landing Page | `/` | 12 template previews load, "Launch Resume Builder" button works |
| Resume Builder | `/app` | Editor loads, sample resume displays in preview |
| Privacy Policy | `/privacy` | Page renders with privacy content |
| Terms of Use | `/terms` | Page renders with terms content |

### Functional Tests

- [ ] Import a `.txt` resume file
- [ ] Import a `.docx` resume file
- [ ] Import a `.pdf` resume (digital text)
- [ ] Import a `.png` resume screenshot (OCR)
- [ ] Edit resume fields in the editor
- [ ] Switch between all 12 templates
- [ ] Export PDF (opens print dialog)
- [ ] Export RTF (downloads `.rtf` file)
- [ ] Export DOCX (downloads `.docx` file)
- [ ] Refresh page — draft auto-loads from localStorage
- [ ] Clear Data — localStorage is wiped

### Privacy Verification

Open **DevTools → Network** tab and confirm:
- No requests to external AI APIs (OpenAI, Anthropic, Gemini)
- No resume data sent to any server
- OCR assets (`/tesseract/*`) load from your Vercel domain, not external CDNs

---

## Frequently Asked Questions

**Does this cost anything on Vercel?**
The Vercel Hobby plan (free) supports this application. There are no serverless functions, no database, and no API routes — just static pages and public assets.

**Are environment variables needed?**
No. The application has zero secrets and zero API keys.

**Will OCR still work?**
Yes. The Tesseract.js WebAssembly engine and English language data (~46 MB) are bundled in `public/tesseract/` and served from Vercel's Edge CDN. No external OCR APIs are used.

**Can I use a custom domain?**
Yes. Go to your Vercel project **Settings → Domains** and add your domain. Vercel handles SSL automatically.

**What about the Gumroad downloadable package?**
The `release/` directory and local launchers (`start-mac.command`, `serve.py`, etc.) are excluded from Vercel deploys via `.vercelignore`. They remain in the Git repository for building the downloadable Gumroad product separately.
