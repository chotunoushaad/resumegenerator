# Architecture & Developer Guide

## System Overview
ATS Resume Studio is a **100% client-side, browser-native application** built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. It contains zero backend servers, requires zero API keys, and incurs zero recurring AI or cloud costs.

## Core Architectural Invariants
1. **Zero External AI / API Services:** No Anthropic, OpenAI, Gemini, or third-party AI APIs are used. Content is processed using deterministic client-side parsing rules.
2. **In-Browser Document Extraction:**
   - Word files (`.docx`) are decoded locally via **Mammoth.js**.
   - Portable Document Format (`.pdf`) files are decoded locally via **PDF.js**.
   - Plain text files (`.txt`) are decoded via standard Web APIs (`FileReader`).
3. **Deterministic Rule Parser:**
   - Uses regex and common resume heading patterns (Experience, Education, Skills, Certifications, Projects, Awards, Publications) to extract fields.
   - Any non-standard or unparsed content is preserved in an editable `uncategorizedContent` review area so no user data is lost or hallucinated.
4. **Zero Cloud Retention:**
   - Resume drafts are stored strictly in the user's browser `localStorage`.
   - Nothing is uploaded to any server.

## Export Engine
- **PDF Export (`exportToPdf`):** Native vector text layer generated via browser print pipeline with embedded Google Fonts.
- **Word-Compatible RTF (`exportToRtf`):** Real Rich Text Format document with custom color tables, font tables, twip margins, and right-aligned tab stops for dates. Opens cleanly in Word, Google Docs, Apple Pages, and LibreOffice.
- **Word DOCX (`exportToDocx`):** Standard OpenXML document output via `docx` library.
