/**
 * Local On-Device OCR Service
 * 100% In-Browser Text Recognition using local Tesseract.js assets.
 * Zero external API calls, zero telemetry, zero CDN dependency.
 */

export interface OcrProgress {
  status: string;
  progress: number;
}

export async function recognizeTextFromImage(
  imageSource: File | Blob | HTMLCanvasElement,
  onProgress?: (progressPercent: number) => void,
  signal?: AbortSignal
): Promise<string> {
  if (signal?.aborted) {
    throw new Error('Extraction cancelled by user.');
  }

  // Dynamic import to prevent SSR evaluation
  const { createWorker } = await import('tesseract.js');

  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
  let isAborted = false;

  const handleAbort = async () => {
    isAborted = true;
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // Ignore termination errors
      }
    }
  };

  if (signal) {
    signal.addEventListener('abort', handleAbort, { once: true });
  }

  try {
    // Initialize worker with local offline asset paths
    worker = await createWorker('eng', 1, {
      workerPath: '/tesseract/worker.min.js',
      corePath: '/tesseract',
      langPath: '/tesseract/lang-data',
      logger: (m: { status: string; progress?: number }) => {
        if (m.status === 'recognizing text' && onProgress) {
          const pct = Math.min(100, Math.max(0, Math.round((m.progress || 0) * 100)));
          onProgress(pct);
        }
      },
    });

    if (signal?.aborted || isAborted) {
      throw new Error('Extraction cancelled by user.');
    }

    const {
      data: { text },
    } = await worker.recognize(imageSource);

    if (signal?.aborted || isAborted) {
      throw new Error('Extraction cancelled by user.');
    }

    return (text || '').trim();
  } catch (err: unknown) {
    if (signal?.aborted || isAborted) {
      throw new Error('Extraction cancelled by user.');
    }
    console.error('Local OCR Error:', err);
    throw err;
  } finally {
    if (signal) {
      signal.removeEventListener('abort', handleAbort);
    }
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // Ignore termination errors
      }
    }
  }
}
