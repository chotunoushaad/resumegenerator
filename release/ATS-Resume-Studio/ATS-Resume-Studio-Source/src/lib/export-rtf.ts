import { ResumeData } from '@/types/resume';
import { TemplateConfig } from '@/types/template';
import { sanitizeFilename, hexToRgb } from './utils';

function rtfEscape(s: string | null | undefined): string {
  if (s == null) return '';
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    // Convert non-ASCII characters to RTF unicode escapes
    .replace(/[\u0080-\uFFFF]/g, (c) => `\\u${c.charCodeAt(0)}?`)
    .replace(/\t/g, '\\tab ')
    .replace(/\n/g, '\\line ');
}

export function generateRtfContent(
  data: ResumeData,
  template: TemplateConfig,
  accentColor: string,
  accent2Color?: string
): string {
  const accentRGB = hexToRgb(accentColor);
  const accent2RGB = accent2Color ? hexToRgb(accent2Color) : null;

  // Color table:
  // 1 = dark black, 2 = dark gray, 3 = light gray banner (#E8E8E8), 4 = accent, 5 = accent2
  let colorTable = `{\\colortbl;\\red17\\green17\\blue17;\\red60\\green60\\blue60;\\red232\\green232\\blue232;\\red${accentRGB.r}\\green${accentRGB.g}\\blue${accentRGB.b};`;
  if (accent2RGB) {
    colorTable += `\\red${accent2RGB.r}\\green${accent2RGB.g}\\blue${accent2RGB.b};`;
  }
  colorTable += '}';

  // Font table
  const useSerif =
    template.bodyFont.includes('Garamond') ||
    template.bodyFont.includes('Cambria') ||
    template.bodyFont.includes('Georgia');

  const fontTable = useSerif
    ? `{\\fonttbl{\\f0\\froman\\fcharset0 Garamond;}{\\f1\\fswiss\\fcharset0 Arial;}}`
    : `{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}{\\f1\\froman\\fcharset0 Garamond;}}`;

  const out: string[] = [];

  // Header & Page dimensions (US Letter: 12240 x 15840 twips, 0.75in margins = 1080 twips)
  out.push(`{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat`);
  out.push(fontTable);
  out.push(colorTable);
  out.push(`\\paperw12240\\paperh15840\\margl1080\\margr1080\\margt1080\\margb1080`);
  out.push(`\\f0\\fs22\\cf1`); // Default font, 11pt, dark black text

  // 1. Candidate Name
  if (data.name) {
    const align =
      template.nameAlign === 'left' || template.nameAlign === 'asymmetric'
        ? '\\ql'
        : '\\qc';
    const isUpper =
      template.nameStyle === 'uppercase-tracked' ||
      template.nameStyle === 'sans-uppercase-tracked' ||
      template.nameStyle === 'sans-bold-uppercase';

    const nameText = isUpper ? data.name.toUpperCase() : data.name;
    out.push(
      `{\\pard${align}\\sb0\\sa120\\fs48\\b\\cf1 ${rtfEscape(nameText)}\\par}`
    );
  }

  // 2. Contact Information
  const contactItems = [
    data.contact.location,
    data.contact.phone,
    data.contact.email,
    data.contact.linkedin,
    data.contact.website,
  ].filter(Boolean);

  if (contactItems.length > 0) {
    const align =
      template.nameAlign === 'left' || template.nameAlign === 'asymmetric'
        ? '\\ql'
        : '\\qc';
    out.push(
      `{\\pard${align}\\sb0\\sa240\\fs19\\cf2 ${rtfEscape(
        contactItems.join('  |  ')
      )}\\par}`
    );
  }

  // Section Header Helper
  const sectionHeader = (title: string) => {
    const isBanner = ['banner', 'banner-soft', 'banner-underline'].includes(
      template.sectionStyle
    );
    if (isBanner) {
      out.push(
        `{\\pard\\qc\\sb240\\sa120\\cbpat3\\cf4\\fs20\\b ${rtfEscape(
          title.toUpperCase()
        )}\\b0\\par}`
      );
    } else {
      out.push(
        `{\\pard\\ql\\sb240\\sa60\\cf4\\fs19\\b ${rtfEscape(
          title.toUpperCase()
        )}\\b0\\par}`
      );
      out.push(`{\\pard\\ql\\sb0\\sa120\\brdrb\\brdrs\\brdrw10\\brdrcf4\\par}`);
    }
  };

  // 3. Summary
  const s = data.summary || { tagline: '', bullets: [], skills: [] };
  const hasSummary =
    s.tagline ||
    (s.bullets && s.bullets.length > 0) ||
    (s.skills && s.skills.length > 0);

  if (hasSummary) {
    sectionHeader('Summary');

    if (s.bullets && s.bullets.length > 0) {
      s.bullets.forEach((b) => {
        if (!b.trim()) return;
        out.push(
          `{\\pard\\fi-280\\li360\\sa50\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(
            b
          )}\\par}`
        );
      });
    }

    if (s.tagline) {
      const ital = template.italicTagline ? '\\i ' : '';
      const italEnd = template.italicTagline ? '\\i0 ' : '';
      out.push(
        `{\\pard\\ql\\sa60\\cf1\\fs22 ${ital}${rtfEscape(s.tagline)}${italEnd}\\par}`
      );
    }

    if (s.skills && s.skills.length > 0) {
      out.push(
        `{\\pard\\ql\\sa120\\cf1\\fs21 ${rtfEscape(
          s.skills.join('  -  ')
        )}\\par}`
      );
    }
  }

  // Helper for certifications
  const renderCerts = () => {
    if (!data.certifications || data.certifications.length === 0) return;
    sectionHeader('Certifications & Licenses');
    data.certifications.forEach((c) => {
      const parts = [
        c.name ? `{\\b ${rtfEscape(c.name)}\\b0}` : '',
        c.org ? `, ${rtfEscape(c.org)}` : '',
        c.date ? ` (${rtfEscape(c.date)})` : '',
      ].join('');
      out.push(
        `{\\pard\\fi-280\\li360\\sa40\\cf1\\fs22 \\u8226? \\tab ${parts}\\par}`
      );
    });
  };

  if (template.licensesProminent) {
    renderCerts();
  }

  // 4. Experience
  if (data.experience && data.experience.length > 0) {
    sectionHeader('Experience');
    data.experience.forEach((exp) => {
      const titleLine = [
        exp.title ? `{\\b ${rtfEscape(exp.title)}\\b0}` : '',
        exp.company ? ` \\u8212? ${rtfEscape(exp.company)}` : '',
        exp.location ? `, ${rtfEscape(exp.location)}` : '',
      ].join('');
      const dateRange = [exp.start, exp.end].filter(Boolean).join(' \\u8212? ');

      out.push(
        `{\\pard\\ql\\sb120\\sa40\\tx9000\\tqr\\tx9000\\cf1\\fs22 ${titleLine}\\tab ${rtfEscape(
          dateRange
        )}\\par}`
      );

      if (exp.summary) {
        const ital = template.italicRoles ? '\\i ' : '';
        const italEnd = template.italicRoles ? '\\i0 ' : '';
        out.push(
          `{\\pard\\ql\\sa40\\cf1\\fs21 ${ital}${rtfEscape(
            exp.summary
          )}${italEnd}\\par}`
        );
      }

      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((b) => {
          if (!b.trim()) return;
          out.push(
            `{\\pard\\fi-280\\li360\\sa30\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(
              b
            )}\\par}`
          );
        });
      }
      out.push(`{\\pard\\sb60\\par}`);
    });
  }

  // 5. Education
  if (data.education && data.education.length > 0) {
    sectionHeader('Education');
    data.education.forEach((ed) => {
      const line = [
        ed.degree ? `{\\b ${rtfEscape(ed.degree)}\\b0}` : '',
        ed.school ? ` \\u8212? ${rtfEscape(ed.school)}` : '',
        ed.location ? `, ${rtfEscape(ed.location)}` : '',
      ].join('');
      out.push(
        `{\\pard\\ql\\sb80\\sa40\\tx9000\\tqr\\tx9000\\cf1\\fs22 ${line}\\tab ${rtfEscape(
          ed.date || ''
        )}\\par}`
      );
      if (ed.honors) {
        out.push(
          `{\\pard\\ql\\sa40\\cf2\\fs20\\i ${rtfEscape(ed.honors)}\\i0\\par}`
        );
      }
    });
  }

  if (!template.licensesProminent) {
    renderCerts();
  }

  // 6. Projects
  if (data.projects && data.projects.length > 0) {
    sectionHeader('Projects');
    data.projects.forEach((p) => {
      if (p.name) {
        out.push(
          `{\\pard\\ql\\sb80\\sa30\\cf1\\fs22\\b ${rtfEscape(p.name)}\\b0\\par}`
        );
      }
      if (p.description) {
        out.push(
          `{\\pard\\ql\\sa30\\cf1\\fs21 ${rtfEscape(p.description)}\\par}`
        );
      }
      if (p.bullets && p.bullets.length > 0) {
        p.bullets.forEach((b) => {
          if (!b.trim()) return;
          out.push(
            `{\\pard\\fi-280\\li360\\sa20\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(
              b
            )}\\par}`
          );
        });
      }
    });
  }

  // 7. Awards
  if (data.awards && data.awards.length > 0) {
    sectionHeader('Awards & Honors');
    data.awards.forEach((a) => {
      if (!a.trim()) return;
      out.push(
        `{\\pard\\fi-280\\li360\\sa40\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(
          a
        )}\\par}`
      );
    });
  }

  // 8. Publications
  if (data.publications && data.publications.length > 0) {
    sectionHeader('Publications & Presentations');
    data.publications.forEach((pub) => {
      const parts = [
        `"${rtfEscape(pub.title)}"`,
        pub.journalOrVenue ? `, \\i ${rtfEscape(pub.journalOrVenue)}\\i0 ` : '',
        pub.date ? ` (${rtfEscape(pub.date)})` : '',
      ].join('');
      out.push(
        `{\\pard\\fi-280\\li360\\sa40\\cf1\\fs22 \\u8226? \\tab ${parts}\\par}`
      );
    });
  }

  out.push(`}`);
  return out.join('\n');
}

export function exportToRtf(
  data: ResumeData,
  template: TemplateConfig,
  accentColor: string,
  accent2Color?: string
): void {
  const rtfContent = generateRtfContent(data, template, accentColor, accent2Color);
  const filename = `${sanitizeFilename(data.name || 'resume')}.rtf`;

  if (typeof document === 'undefined') return;

  const blob = new Blob([rtfContent], { type: 'application/rtf;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1500);
}
