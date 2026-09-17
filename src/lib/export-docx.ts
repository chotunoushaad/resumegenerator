import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  TabStopType,
  TabStopPosition,
  ShadingType,
  BorderStyle,
} from 'docx';
import { ResumeData } from '@/types/resume';
import { TemplateConfig } from '@/types/template';
import { sanitizeFilename } from './utils';

// Helper to trigger browser download
function downloadBlob(blob: Blob, filename: string) {
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

export async function exportToDocx(
  data: ResumeData,
  template: TemplateConfig,
  accentColor: string
): Promise<void> {
  const hexAccent = accentColor.replace('#', '');
  const isBanner = ['banner', 'banner-soft', 'banner-underline'].includes(template.sectionStyle);
  const fontName = template.bodyFont.includes('Garamond')
    ? 'EB Garamond'
    : template.bodyFont.includes('Georgia')
    ? 'Georgia'
    : template.bodyFont.includes('Cambria')
    ? 'Cambria'
    : 'Calibri';

  const children: Paragraph[] = [];

  // 1. Header: Name
  const nameAlign =
    template.nameAlign === 'left' || template.nameAlign === 'asymmetric'
      ? AlignmentType.LEFT
      : AlignmentType.CENTER;

  const isUppercase =
    template.nameStyle === 'uppercase-tracked' ||
    template.nameStyle === 'sans-uppercase-tracked' ||
    template.nameStyle === 'sans-bold-uppercase';

  const nameText = isUppercase ? (data.name || 'Your Name').toUpperCase() : (data.name || 'Your Name');

  children.push(
    new Paragraph({
      alignment: nameAlign,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: nameText,
          bold: true,
          size: 48, // 24pt
          font: fontName,
          color: '111111',
        }),
      ],
    })
  );

  // 2. Contact items (single pipe-separated line)
  const contactItems = [
    data.contact.location,
    data.contact.phone,
    data.contact.email,
    data.contact.linkedin,
    data.contact.website,
  ].filter(Boolean);

  if (contactItems.length > 0) {
    children.push(
      new Paragraph({
        alignment: nameAlign,
        spacing: { before: 0, after: 240 },
        children: [
          new TextRun({
            text: contactItems.join('  |  '),
            size: 19, // 9.5pt
            font: fontName,
            color: '333333',
          }),
        ],
      })
    );
  }

  // Section Header Helper
  const createSectionHeader = (title: string): Paragraph => {
    if (isBanner) {
      return new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 140 },
        shading: {
          type: ShadingType.CLEAR,
          fill: template.sectionStyle === 'banner-soft' ? 'F2EFE9' : 'E8E8E8',
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 20, // 10pt
            font: fontName,
            color: hexAccent,
          }),
        ],
      });
    }

    // Rule style
    return new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: hexAccent,
          space: 4,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 20, // 10pt
          font: fontName,
          color: hexAccent,
        }),
      ],
    });
  };

  // 3. Summary Section
  const hasSummary =
    data.summary?.tagline ||
    (data.summary?.bullets && data.summary.bullets.length > 0) ||
    (data.summary?.skills && data.summary.skills.length > 0);

  if (hasSummary) {
    children.push(createSectionHeader('Summary'));

    if (data.summary.bullets && data.summary.bullets.length > 0) {
      for (const bullet of data.summary.bullets) {
        if (!bullet.trim()) continue;
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: bullet,
                size: 21,
                font: fontName,
                color: '222222',
              }),
            ],
          })
        );
      }
    }

    if (data.summary.tagline) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: data.summary.tagline,
              italics: template.italicTagline,
              size: 21,
              font: fontName,
              color: '222222',
            }),
          ],
        })
      );
    }

    if (data.summary.skills && data.summary.skills.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 140 },
          children: [
            new TextRun({
              text: data.summary.skills.join('  -  '),
              size: 20,
              font: template.monoSkills ? 'Consolas' : fontName,
              color: '222222',
            }),
          ],
        })
      );
    }
  }

  // Certifications before experience for Trades or Practitioner if prominent
  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return;
    children.push(createSectionHeader('Certifications & Licenses'));
    for (const cert of data.certifications) {
      const parts = [
        cert.name,
        cert.org ? `, ${cert.org}` : '',
        cert.date ? ` (${cert.date})` : '',
      ].filter(Boolean).join('');

      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: parts,
              size: 21,
              font: fontName,
              color: '222222',
            }),
          ],
        })
      );
    }
  };

  if (template.licensesProminent) {
    renderCertifications();
  }

  // 4. Experience Section
  if (data.experience && data.experience.length > 0) {
    children.push(createSectionHeader('Experience'));

    for (const exp of data.experience) {
      const companyPart = exp.company ? ` — ${exp.company}` : '';
      const locationPart = exp.location ? `, ${exp.location}` : '';
      const dateRange = [exp.start, exp.end].filter(Boolean).join(' — ');

      // Position title on left, date right-aligned using Right Tab Stop (9000 dxa ~ 6.25 inches)
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 9600,
            },
          ],
          children: [
            new TextRun({
              text: exp.title,
              bold: true,
              size: 22,
              font: fontName,
              color: '111111',
            }),
            new TextRun({
              text: `${companyPart}${locationPart}`,
              size: 21,
              font: fontName,
              color: '333333',
            }),
            new TextRun({
              text: `\t${dateRange}`,
              size: 20,
              font: fontName,
              color: '444444',
            }),
          ],
        })
      );

      if (exp.summary) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 60 },
            children: [
              new TextRun({
                text: exp.summary,
                italics: !!template.italicRoles,
                size: 21,
                font: fontName,
                color: '333333',
              }),
            ],
          })
        );
      }

      if (exp.bullets && exp.bullets.length > 0) {
        for (const bullet of exp.bullets) {
          if (!bullet.trim()) continue;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 30, after: 30 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 21,
                  font: fontName,
                  color: '222222',
                }),
              ],
            })
          );
        }
      }
    }
  }

  // 5. Education Section
  if (data.education && data.education.length > 0) {
    children.push(createSectionHeader('Education'));

    for (const edu of data.education) {
      const schoolPart = edu.school ? ` — ${edu.school}` : '';
      const locationPart = edu.location ? `, ${edu.location}` : '';

      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 9600,
            },
          ],
          children: [
            new TextRun({
              text: edu.degree,
              bold: true,
              size: 22,
              font: fontName,
              color: '111111',
            }),
            new TextRun({
              text: `${schoolPart}${locationPart}`,
              size: 21,
              font: fontName,
              color: '333333',
            }),
            new TextRun({
              text: `\t${edu.date || ''}`,
              size: 20,
              font: fontName,
              color: '444444',
            }),
          ],
        })
      );

      if (edu.honors) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: edu.honors,
                italics: true,
                size: 20,
                font: fontName,
                color: '444444',
              }),
            ],
          })
        );
      }
    }
  }

  if (!template.licensesProminent) {
    renderCertifications();
  }

  // 6. Projects Section
  if (data.projects && data.projects.length > 0) {
    children.push(createSectionHeader('Projects'));

    for (const project of data.projects) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({
              text: project.name,
              bold: true,
              size: 21,
              font: fontName,
              color: '111111',
            }),
            project.role ? new TextRun({ text: ` — ${project.role}`, size: 20, font: fontName, color: '333333' }) : new TextRun(''),
          ],
        })
      );

      if (project.description) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 40 },
            children: [
              new TextRun({
                text: project.description,
                size: 21,
                font: fontName,
                color: '222222',
              }),
            ],
          })
        );
      }

      if (project.bullets && project.bullets.length > 0) {
        for (const bullet of project.bullets) {
          if (!bullet.trim()) continue;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 21,
                  font: fontName,
                  color: '222222',
                }),
              ],
            })
          );
        }
      }
    }
  }

  // 7. Awards Section
  if (data.awards && data.awards.length > 0) {
    children.push(createSectionHeader('Awards & Honors'));
    for (const award of data.awards) {
      if (!award.trim()) continue;
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 30, after: 30 },
          children: [
            new TextRun({
              text: award,
              size: 21,
              font: fontName,
              color: '222222',
            }),
          ],
        })
      );
    }
  }

  // 8. Academic Publications (if present)
  if (data.publications && data.publications.length > 0) {
    children.push(createSectionHeader('Publications & Presentations'));
    for (const pub of data.publications) {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: `"${pub.title}"`,
              bold: true,
              size: 21,
              font: fontName,
            }),
            new TextRun({
              text: pub.journalOrVenue ? `, ${pub.journalOrVenue}` : '',
              italics: true,
              size: 21,
              font: fontName,
            }),
            new TextRun({
              text: pub.date ? ` (${pub.date})` : '',
              size: 20,
              font: fontName,
              color: '444444',
            }),
          ],
        })
      );
    }
  }

  // Construct Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080, // 0.75 inch in twips
              right: 1080,
              bottom: 1080,
              left: 1080,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${sanitizeFilename(data.name || 'resume')}.docx`;
  downloadBlob(blob, filename);
}
