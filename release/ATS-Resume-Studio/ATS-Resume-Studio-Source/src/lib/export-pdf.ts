import { ResumeData } from '@/types/resume';
import { sanitizeFilename, escapeHtml } from './utils';

export function exportToPdf(printElement: HTMLElement | null, data: ResumeData): void {
  if (!printElement) {
    throw new Error('Resume element not found for export');
  }

  const resumeHTML = printElement.innerHTML;
  const docTitle = `${data.name || 'Resume'} - ATS Resume`;

  const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(docTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
  @page {
    size: letter;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body {
    margin: 0;
    padding: 0;
    background: #FFFFFF;
    color: #111111;
  }
  .resume-page {
    box-shadow: none !important;
    margin: 0 !important;
    width: 8.5in !important;
    min-height: 11in !important;
    background: #FDFCF9 !important;
  }
  @media print {
    body {
      background: #FFFFFF !important;
    }
  }
</style>
</head>
<body>
${resumeHTML}
<script>
  (function() {
    function triggerPrint() {
      try {
        window.focus();
        window.print();
      } catch (e) {
        console.error('Print trigger failed:', e);
      }
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function() {
        setTimeout(triggerPrint, 150);
      });
    } else {
      setTimeout(triggerPrint, 600);
    }
  })();
</script>
</body>
</html>`;

  // Try opening new print window
  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    // Popup was blocked by browser - fallback to downloadable HTML file
    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sanitizeFilename(data.name || 'resume')}.html`;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
    alert('Pop-up was blocked. Downloaded a print-ready HTML file instead — open it in your browser and press Cmd+P (or Ctrl+P) to save as vector PDF.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(fullDoc);
  printWindow.document.close();
}
