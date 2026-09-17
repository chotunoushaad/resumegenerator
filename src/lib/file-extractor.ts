/**
 * In-Browser Document & Image Text Extractor
 * Extracts readable text from .txt, .docx, .pdf, and image files (.png, .jpg, .jpeg, .webp)
 * entirely client-side using local WASM and Web Workers.
 * Zero external APIs, zero server uploads, 100% private.
 */

import { recognizeTextFromImage } from './ocr';

export interface ExtractionProgress {
  stage: 'reading' | 'loading_engine' | 'recognizing' | 'rendering_page' | 'processing';
  message: string;
  percent?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface ExtractionResult {
  text: string;
  filename: string;
  fileType: 'txt' | 'docx' | 'pdf' | 'png' | 'jpg' | 'webp';
  isOcr?: boolean;
  ocrNotice?: string;
}

const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_PDF_PAGES = 15;

export async function extractTextFromFile(
  file: File,
  onProgress?: (progress: ExtractionProgress) => void,
  signal?: AbortSignal
): Promise<ExtractionResult> {
  const filename = file.name.toLowerCase();

  // 1. Plain Text (.txt)
  if (filename.endsWith('.txt') || file.type === 'text/plain') {
    onProgress?.({ stage: 'reading', message: 'Reading text document...' });
    const text = await readAsPlainText(file);
    if (!text.trim()) {
      throw new Error('This text file is empty. Please upload a file containing resume content.');
    }
    return {
      text: text.trim(),
      filename: file.name,
      fileType: 'txt',
    };
  }

  // 2. Microsoft Word Document (.docx)
  if (
    filename.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    if (file.size > MAX_PDF_SIZE_BYTES) {
      throw new Error('Word document exceeds 25 MB limit. Please upload a smaller file.');
    }
    onProgress?.({ stage: 'processing', message: 'Extracting text from Word document...' });
    try {
      const arrayBuffer = await file.arrayBuffer();
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();

      if (!text) {
        throw new Error('No readable text could be extracted from this Word document.');
      }

      return {
        text,
        filename: file.name,
        fileType: 'docx',
      };
    } catch (err: unknown) {
      console.error('DOCX Extraction Error:', err);
      throw new Error(
        'Failed to read .docx file. Ensure it is a valid, uncorrupted Word document or copy/paste the text manually.'
      );
    }
  }

  // 3. Image Resumes (.png, .jpg, .jpeg, .webp)
  const isPng = filename.endsWith('.png') || file.type === 'image/png';
  const isJpg =
    filename.endsWith('.jpg') ||
    filename.endsWith('.jpeg') ||
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg';
  const isWebp = filename.endsWith('.webp') || file.type === 'image/webp';

  if (isPng || isJpg || isWebp) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(
        `Image size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 20 MB limit. Please upload a smaller screenshot or photo.`
      );
    }

    const imageExt = isPng ? 'png' : isWebp ? 'webp' : 'jpg';

    onProgress?.({ stage: 'reading', message: 'Reading image file...' });
    onProgress?.({ stage: 'loading_engine', message: 'Loading on-device text recognition...' });

    try {
      const recognizedText = await recognizeTextFromImage(
        file,
        (pct) => {
          onProgress?.({
            stage: 'recognizing',
            message: `Recognizing text (${pct}%)...`,
            percent: pct,
          });
        },
        signal
      );

      if (!recognizedText || recognizedText.length < 5) {
        throw new Error(
          'No clear text could be recognized from this image. Please ensure the image is sharp and well-lit, or paste the text manually.'
        );
      }

      onProgress?.({ stage: 'processing', message: 'Organizing your resume...' });

      return {
        text: recognizedText,
        filename: file.name,
        fileType: imageExt,
        isOcr: true,
        ocrNotice:
          'Text extracted using on-device text recognition. Image quality affects accuracy—you can edit all fields in the editor.',
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('cancelled')) {
        throw err;
      }
      console.error('Image OCR error:', err);
      throw new Error(
        err instanceof Error
          ? err.message
          : 'Failed to recognize text from image. Please verify the image contains readable text or paste plain text.'
      );
    }
  }

  // 4. PDF Document (.pdf)
  if (filename.endsWith('.pdf') || file.type === 'application/pdf') {
    if (file.size > MAX_PDF_SIZE_BYTES) {
      throw new Error(
        `PDF size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 25 MB limit. Please upload a smaller file.`
      );
    }

    onProgress?.({ stage: 'reading', message: 'Loading PDF document...' });

    let pdfDoc;
    let pdfjs;

    try {
      const arrayBuffer = await file.arrayBuffer();
      pdfjs = await import('pdfjs-dist/build/pdf.mjs');

      // Configure web worker strictly to local offline bundle
      if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      }

      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
      });

      pdfDoc = await loadingTask.promise;
    } catch (err: unknown) {
      console.error('PDF Load Error:', err);
      const errName = (err as { name?: string })?.name || '';
      const errMsg = (err as { message?: string })?.message || '';

      if (errName === 'PasswordException' || errMsg.toLowerCase().includes('password')) {
        throw new Error(
          'This PDF is password-protected. Please remove the password protection before uploading, or copy and paste the plain text.'
        );
      }
      throw new Error(
        'The PDF file appears corrupted or unreadable. Please re-export it from Word, Google Docs, or Canva, or paste the text manually.'
      );
    }

    if (!pdfDoc || pdfDoc.numPages === 0) {
      throw new Error('This PDF has no pages or is unreadable.');
    }

    if (pdfDoc.numPages > MAX_PDF_PAGES) {
      throw new Error(
        `This document contains ${pdfDoc.numPages} pages, exceeding the ${MAX_PDF_PAGES}-page limit for resume processing. Please upload a standard 1–3 page resume.`
      );
    }

    // Step A: Attempt fast digital text extraction across all pages
    const extractedPages: string[] = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      if (signal?.aborted) throw new Error('Extraction cancelled by user.');

      onProgress?.({
        stage: 'processing',
        message: `Reading document text (page ${i} of ${pdfDoc.numPages})...`,
        currentPage: i,
        totalPages: pdfDoc.numPages,
      });

      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();

      let lastY: number | null = null;
      let line = '';
      const lines: string[] = [];

      for (const item of textContent.items) {
        if ('str' in item) {
          const currentY = 'transform' in item ? (item.transform as number[])[5] : null;
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
            lines.push(line.trim());
            line = '';
          }
          line += item.str + ' ';
          lastY = currentY;
        }
      }
      if (line.trim()) lines.push(line.trim());
      if (lines.length > 0) {
        extractedPages.push(lines.join('\n'));
      }
    }

    const digitalText = extractedPages.join('\n\n').trim();

    // If substantial digital text exists (>= 30 characters), use it immediately!
    if (digitalText.length >= 30) {
      onProgress?.({ stage: 'processing', message: 'Organizing your resume...' });
      return {
        text: digitalText,
        filename: file.name,
        fileType: 'pdf',
        isOcr: false,
      };
    }

    // Step B: Scanned / Image-Only PDF — Render pages to canvas and perform on-device OCR
    onProgress?.({
      stage: 'loading_engine',
      message: 'Scanned document detected. Starting on-device text recognition...',
    });

    const ocrPageResults: string[] = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      if (signal?.aborted) throw new Error('Extraction cancelled by user.');

      onProgress?.({
        stage: 'rendering_page',
        message: `Rendering page ${i} of ${pdfDoc.numPages}...`,
        currentPage: i,
        totalPages: pdfDoc.numPages,
      });

      const page = await pdfDoc.getPage(i);
      // Render at 1.5x scale (approx. 150-200 DPI) for optimal balance of OCR accuracy and fast on-device recognition
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D rendering context is not supported in this browser.');
      }

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      if (signal?.aborted) throw new Error('Extraction cancelled by user.');

      onProgress?.({
        stage: 'recognizing',
        message: `Recognizing text on page ${i} of ${pdfDoc.numPages}...`,
        currentPage: i,
        totalPages: pdfDoc.numPages,
      });

      const pageOcrText = await recognizeTextFromImage(
        canvas,
        (pct) => {
          onProgress?.({
            stage: 'recognizing',
            message: `Recognizing text on page ${i} of ${pdfDoc.numPages} (${pct}%)...`,
            currentPage: i,
            totalPages: pdfDoc.numPages,
            percent: pct,
          });
        },
        signal
      );

      if (pageOcrText.trim()) {
        ocrPageResults.push(pageOcrText.trim());
      }
    }

    const fullOcrText = ocrPageResults.join('\n\n').trim();

    if (!fullOcrText || fullOcrText.length < 10) {
      throw new Error(
        'No readable text could be recognized from this scanned PDF. Please ensure the scan is clear, or copy and paste the plain text.'
      );
    }

    onProgress?.({ stage: 'processing', message: 'Organizing your resume...' });

    return {
      text: fullOcrText,
      filename: file.name,
      fileType: 'pdf',
      isOcr: true,
      ocrNotice:
        'Scanned PDF text recognized using on-device OCR. Please review and verify all extracted fields.',
    };
  }

  // Unsupported file format
  throw new Error(
    `Unsupported file format: "${file.name}". Please upload a .docx, .pdf, .txt, .png, .jpg, or .webp resume.`
  );
}

function readAsPlainText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}
