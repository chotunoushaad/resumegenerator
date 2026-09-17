'use client';

import React, { forwardRef, useMemo } from 'react';
import { ResumeData } from '@/types/resume';
import { TemplateConfig } from '@/types/template';
import { hexToRgba } from '@/lib/utils';
import { MONO_FACE } from '@/lib/templates-config';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateConfig;
  accent: string;
  accent2?: string;
  showPageBreakGuide?: boolean;
  fontSizeOption?: 'sm' | 'base' | 'lg';
  densityOption?: 'compact' | 'normal' | 'relaxed';
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview(
    {
      data,
      template,
      accent,
      accent2,
      showPageBreakGuide = true,
      fontSizeOption = 'base',
      densityOption = 'normal',
    },
    ref
  ) {
    const effAccent2 = accent2 || template.accent2 || accent;
    const baseFontSize =
      fontSizeOption === 'sm' ? '9.5pt' : fontSizeOption === 'lg' ? '11.5pt' : '10.5pt';
    const headerFontSize =
      fontSizeOption === 'sm' ? '9pt' : fontSizeOption === 'lg' ? '11pt' : '10pt';
    const lineHeight =
      densityOption === 'compact' ? 1.35 : densityOption === 'relaxed' ? 1.65 : 1.5;
    const effectiveDensity = densityOption || template.density || 'normal';
    const expItemMargin =
      effectiveDensity === 'compact'
        ? '0.08in'
        : effectiveDensity === 'relaxed'
        ? '0.22in'
        : '0.15in';
    const sectionMargin =
      effectiveDensity === 'compact'
        ? '0.12in 0 0.06in 0'
        : effectiveDensity === 'relaxed'
        ? '0.24in 0 0.14in 0'
        : '0.18in 0 0.1in 0';

    // Contact items filtering
    const contactItems = useMemo(() => {
      return [
        data.contact.location,
        data.contact.phone,
        data.contact.email,
        data.contact.linkedin,
        data.contact.website,
      ].filter(Boolean);
    }, [data.contact]);

    // Header layout styles
    const nameStyles: React.CSSProperties = useMemo(() => {
      const base: React.CSSProperties = {
        fontFamily: template.nameFont,
        color: '#111111',
        margin: 0,
        lineHeight: 1.15,
      };

      switch (template.nameStyle) {
        case 'uppercase-tracked':
          return {
            ...base,
            fontSize: '28pt',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontWeight: 500,
          };
        case 'sans-uppercase-tracked':
          return {
            ...base,
            fontSize: '24pt',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            fontWeight: 600,
          };
        case 'sans-bold':
          return {
            ...base,
            fontSize: '26pt',
            fontWeight: 700,
            letterSpacing: '-0.01em',
          };
        case 'sans-bold-uppercase':
          return {
            ...base,
            fontSize: '26pt',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          };
        case 'serif-display':
          return {
            ...base,
            fontSize: '30pt',
            fontWeight: 500,
            letterSpacing: '0.01em',
          };
        default:
          return base;
      }
    }, [template.nameFont, template.nameStyle]);

    // Section Header Renderer
    const renderSectionHeader = (title: string) => {
      const style = template.sectionStyle;

      if (style === 'banner' || style === 'banner-underline') {
        return (
          <div
            className="resume-section-header"
            style={{
              background: '#E8E8E8',
              padding: '0.06in 0.12in',
              margin: sectionMargin,
              borderBottom:
                style === 'banner-underline' ? `1.5px solid ${effAccent2}` : 'none',
              textAlign: 'center',
              letterSpacing: '0.18em',
              fontSize: headerFontSize,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {title}
          </div>
        );
      }

      if (style === 'banner-soft') {
        return (
          <div
            className="resume-section-header"
            style={{
              background: hexToRgba(accent, 0.1),
              padding: '0.06in 0.12in',
              margin: sectionMargin,
              textAlign: 'center',
              letterSpacing: '0.18em',
              fontSize: headerFontSize,
              fontWeight: 500,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {title}
          </div>
        );
      }

      if (style === 'small-caps-rule') {
        return (
          <div
            className="resume-section-header"
            style={{
              margin: sectionMargin,
              paddingBottom: '0.03in',
              borderBottom: `1px solid ${accent}`,
              letterSpacing: '0.22em',
              fontSize: headerFontSize,
              fontWeight: 600,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {title}
          </div>
        );
      }

      if (style === 'small-caps-italic') {
        return (
          <div
            className="resume-section-header"
            style={{
              margin: sectionMargin,
              paddingBottom: '0.04in',
              borderBottom: `0.5px solid ${accent}`,
              letterSpacing: '0.16em',
              fontSize: headerFontSize,
              fontStyle: 'italic',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {title}
          </div>
        );
      }

      return null;
    };

    // Decorative Mark Renderer
    const renderDecorativeMark = () => {
      const mark = template.decorativeMark;
      if (mark === 'corner-arc') {
        return (
          <div
            aria-hidden="true"
            className="print-corner-mark"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '0.85in',
              height: '0.85in',
              background: accent,
              borderBottomLeftRadius: '100%',
              opacity: 0.92,
              pointerEvents: 'none',
            }}
          />
        );
      }
      if (mark === 'thin-rule') {
        return (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '0.5in',
              right: '0.75in',
              width: '0.75in',
              height: '2px',
              background: accent,
              pointerEvents: 'none',
            }}
          />
        );
      }
      return null;
    };

    // Name & Contact Header
    const renderHeader = () => {
      const align = template.nameAlign;
      const contactStyle: React.CSSProperties = {
        fontFamily: template.bodyFont,
        fontSize: '9.5pt',
        color: '#3a3a3a',
        letterSpacing: '0.02em',
      };

      if (align === 'center') {
        return (
          <div
            style={{
              textAlign: 'center',
              marginTop: template.decorativeMark === 'corner-arc' ? '0.2in' : 0,
            }}
          >
            <h1 style={nameStyles}>{data.name || 'Your Name'}</h1>
            {contactItems.length > 0 && (
              <div style={{ ...contactStyle, marginTop: '0.12in' }}>
                {contactItems.join('  |  ')}
              </div>
            )}
          </div>
        );
      }

      if (align === 'left') {
        return (
          <div
            style={{
              textAlign: 'left',
              marginTop: template.decorativeMark === 'corner-arc' ? '0.2in' : 0,
            }}
          >
            <h1 style={nameStyles}>{data.name || 'Your Name'}</h1>
            {template.decorativeMark === 'name-rule' && (
              <div
                style={{
                  width: '1.4in',
                  height: '1.5px',
                  background: accent,
                  marginTop: '0.06in',
                }}
              />
            )}
            {template.decorativeMark === 'name-rule-orange' && (
              <div
                style={{
                  width: '1.4in',
                  height: '2px',
                  background: effAccent2,
                  marginTop: '0.08in',
                }}
              />
            )}
            {contactItems.length > 0 && (
              <div style={{ ...contactStyle, marginTop: '0.12in' }}>
                {contactItems.join('  |  ')}
              </div>
            )}
          </div>
        );
      }

      // Asymmetric (name left, contact right on same baseline)
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.3in',
            marginTop: template.decorativeMark === 'corner-arc' ? '0.2in' : 0,
          }}
        >
          <h1 style={nameStyles}>{data.name || 'Your Name'}</h1>
          {contactItems.length > 0 && (
            <div
              style={{
                ...contactStyle,
                textAlign: 'right',
                maxWidth: '3.5in',
                lineHeight: 1.5,
              }}
            >
              {contactItems.map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </div>
          )}
        </div>
      );
    };

    // Certifications Section
    const renderCertificationsSection = () => {
      if (!data.certifications || data.certifications.length === 0) return null;

      return (
        <div className="resume-section">
          {renderSectionHeader('Certifications & Licenses')}
          <div
            style={{
              fontFamily: template.bodyFont,
              fontSize: baseFontSize,
              color: '#1c1c1c',
              lineHeight: lineHeight,
            }}
          >
            <ul style={{ margin: 0, paddingLeft: '0.22in' }}>
              {data.certifications.map((c, i) => (
                <li key={c.id || i} style={{ marginBottom: '0.03in' }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  {c.org && <span>{', '}{c.org}</span>}
                  {c.date && (
                    <span style={{ color: '#444444' }}>
                      {' ('}{c.date}{')'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    };

    const hasSummary =
      data.summary?.tagline ||
      (data.summary?.bullets && data.summary.bullets.length > 0) ||
      (data.summary?.skills && data.summary.skills.length > 0);

    return (
      <div
        ref={ref}
        className="resume-page relative"
        style={{
          width: '8.5in',
          minHeight: '11in',
          background: '#FDFCF9',
          padding: '0.75in',
          boxSizing: 'border-box',
          fontFamily: template.bodyFont,
          color: '#1c1c1c',
          fontSize: baseFontSize,
          lineHeight: lineHeight,
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.05), 0 20px 35px -10px rgba(0,0,0,0.12)',
        }}
      >
        {/* Page Break Boundary Guide (Letter Height = 11in) */}
        {showPageBreakGuide && (
          <div
            className="absolute left-0 right-0 border-b border-dashed border-red-300 pointer-events-none no-print"
            style={{ top: '11in' }}
          >
            <span className="absolute right-2 -top-5 text-[10px] font-mono text-red-400 bg-red-50/80 px-1.5 py-0.5 rounded">
              Page 1 boundary (11 in)
            </span>
          </div>
        )}

        {/* Decorative corner mark */}
        {renderDecorativeMark()}

        {/* Header (Name & Contact) */}
        {renderHeader()}

        {/* Prominent Certifications for Healthcare/Trades */}
        {template.licensesProminent && renderCertificationsSection()}

        {/* Summary Section */}
        {hasSummary && (
          <div className="resume-section">
            {renderSectionHeader('Summary')}
            <div
              style={{
                fontFamily: template.bodyFont,
                fontSize: baseFontSize,
                color: '#1c1c1c',
                lineHeight: lineHeight,
              }}
            >
              {data.summary.bullets && data.summary.bullets.length > 0 && (
                <ul style={{ margin: '0 0 0.08in 0', paddingLeft: '0.22in' }}>
                  {data.summary.bullets.map((b, i) => (
                    <li key={i} style={{ marginBottom: '0.04in' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {data.summary.tagline && (
                <div
                  style={{
                    fontStyle: template.italicTagline ? 'italic' : 'normal',
                    margin: '0.05in 0 0.06in 0',
                    color: '#2b2b2b',
                  }}
                >
                  {data.summary.tagline}
                </div>
              )}

              {data.summary.skills && data.summary.skills.length > 0 && (
                <div
                  style={{
                    fontFamily: template.monoSkills ? MONO_FACE : template.bodyFont,
                    fontSize: template.monoSkills
                      ? fontSizeOption === 'sm' ? '8.5pt' : fontSizeOption === 'lg' ? '10.5pt' : '9.5pt'
                      : baseFontSize,
                    color: '#1c1c1c',
                    marginTop: '0.04in',
                  }}
                >
                  {template.pillSkills ? (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.06in',
                      }}
                    >
                      {data.summary.skills.map((sk, i) => (
                        <span
                          key={i}
                          style={{
                            border: `1px solid ${hexToRgba(accent, 0.35)}`,
                            color: accent,
                            padding: '0.02in 0.1in',
                            borderRadius: '0.04in',
                            fontSize: '9pt',
                            letterSpacing: '0.02em',
                            background: hexToRgba(accent, 0.04),
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    data.summary.skills.join('  -  ')
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <div className="resume-section">
            {renderSectionHeader('Experience')}
            <div
              style={{
                fontFamily: template.bodyFont,
                fontSize: baseFontSize,
                color: '#1c1c1c',
                lineHeight: lineHeight,
              }}
            >
              {data.experience.map((exp, i) => (
                <div
                  key={exp.id || i}
                  style={{
                    marginBottom:
                      i === data.experience.length - 1
                        ? 0
                        : expItemMargin,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '0.3in',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#111' }}>
                      {exp.title}
                      {exp.company && (
                        <span style={{ fontWeight: 400 }}>
                          {' — '}{exp.company}
                        </span>
                      )}
                      {exp.location && (
                        <span style={{ fontWeight: 400, color: '#3a3a3a' }}>
                          {', '}{exp.location}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontVariantNumeric: template.tabularDates
                          ? 'tabular-nums'
                          : 'normal',
                        color: '#3a3a3a',
                        whiteSpace: 'nowrap',
                        fontSize: '10pt',
                      }}
                    >
                      {[exp.start, exp.end].filter(Boolean).join(' — ')}
                    </div>
                  </div>

                  {exp.summary && (
                    <div
                      style={{
                        fontStyle: template.italicRoles ? 'italic' : 'normal',
                        color: '#2b2b2b',
                        margin: '0.03in 0',
                      }}
                    >
                      {exp.summary}
                    </div>
                  )}

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ margin: '0.03in 0 0 0', paddingLeft: '0.22in' }}>
                      {exp.bullets.map((b, j) => (
                        <li key={j} style={{ marginBottom: '0.02in' }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <div className="resume-section">
            {renderSectionHeader('Education')}
            <div
              style={{
                fontFamily: template.bodyFont,
                fontSize: baseFontSize,
                color: '#1c1c1c',
                lineHeight: lineHeight,
              }}
            >
              {data.education.map((ed, i) => (
                <div
                  key={ed.id || i}
                  style={{
                    marginBottom:
                      i === data.education.length - 1 ? 0 : expItemMargin,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '0.3in',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#111' }}>
                      {ed.degree}
                      {ed.school && (
                        <span style={{ fontWeight: 400 }}>
                          {' — '}{ed.school}
                        </span>
                      )}
                      {ed.location && (
                        <span style={{ fontWeight: 400, color: '#3a3a3a' }}>
                          {', '}{ed.location}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontVariantNumeric: template.tabularDates
                          ? 'tabular-nums'
                          : 'normal',
                        color: '#3a3a3a',
                        whiteSpace: 'nowrap',
                        fontSize: '10pt',
                      }}
                    >
                      {ed.date}
                    </div>
                  </div>
                  {ed.honors && (
                    <div
                      style={{
                        fontStyle: 'italic',
                        color: '#3a3a3a',
                        marginTop: '0.02in',
                      }}
                    >
                      {ed.honors}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications (if not placed prominently above) */}
        {!template.licensesProminent && renderCertificationsSection()}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <div className="resume-section">
            {renderSectionHeader('Projects')}
            <div
              style={{
                fontFamily: template.bodyFont,
                fontSize: baseFontSize,
                color: '#1c1c1c',
                lineHeight: lineHeight,
              }}
            >
              {data.projects.map((p, i) => (
                <div
                  key={p.id || i}
                  style={{
                    marginBottom:
                      i === data.projects.length - 1 ? 0 : expItemMargin,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {p.name}
                    {p.role && (
                      <span style={{ fontWeight: 400, color: '#444' }}>
                        {' — '}{p.role}
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <div style={{ color: '#2b2b2b', margin: '0.02in 0' }}>
                      {p.description}
                    </div>
                  )}
                  {p.bullets && p.bullets.length > 0 && (
                    <ul style={{ margin: '0.02in 0 0 0', paddingLeft: '0.22in' }}>
                      {p.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards Section */}
        {data.awards && data.awards.length > 0 && (
          <div className="resume-section">
            {renderSectionHeader('Awards & Honors')}
            <div
              style={{
                fontFamily: template.bodyFont,
                fontSize: baseFontSize,
                color: '#1c1c1c',
                lineHeight: lineHeight,
              }}
            >
              <ul style={{ margin: 0, paddingLeft: '0.22in' }}>
                {data.awards.map((a, i) => (
                  <li key={i} style={{ marginBottom: '0.03in' }}>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Academic Publications & Presentations */}
        {data.publications && data.publications.length > 0 && (
          <div className="resume-section">
            {renderSectionHeader('Publications & Presentations')}
            <div
              style={{
                fontFamily: template.bodyFont,
                fontSize: baseFontSize,
                color: '#1c1c1c',
                lineHeight: lineHeight,
              }}
            >
              <ul style={{ margin: 0, paddingLeft: '0.22in' }}>
                {data.publications.map((pub, i) => (
                  <li key={pub.id || i} style={{ marginBottom: '0.04in' }}>
                    <span style={{ fontWeight: 600 }}>&ldquo;{pub.title}&rdquo;</span>
                    {pub.journalOrVenue && (
                      <span style={{ fontStyle: 'italic' }}>
                        {', '}{pub.journalOrVenue}
                      </span>
                    )}
                    {pub.date && <span>{' ('}{pub.date}{')'}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
);
