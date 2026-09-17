import {
  ResumeData,
  ResumeExperience,
  ResumeEducation,
  ResumeCertification,
  ResumeProject,
  ResumePublication,
} from '@/types/resume';

interface SectionBlock {
  type:
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'certifications'
    | 'projects'
    | 'awards'
    | 'publications'
    | 'unknown';
  headerText: string;
  lines: string[];
}

const SECTION_PATTERNS: { type: SectionBlock['type']; regex: RegExp }[] = [
  {
    type: 'summary',
    regex: /^(professional\s+summary|summary|profile|professional\s+profile|executive\s+summary|about\s+me|career\s+objective|objective)$/i,
  },
  {
    type: 'experience',
    regex: /^(work\s+experience|experience|professional\s+experience|employment\s+history|work\s+history|relevant\s+experience|career\s+history)$/i,
  },
  {
    type: 'education',
    regex: /^(education|academic\s+background|academic\s+history|degrees|academic\s+qualifications|educational\s+background)$/i,
  },
  {
    type: 'skills',
    regex: /^(skills|core\s+competencies|technical\s+skills|key\s+skills|competencies|areas\s+of\s+expertise|tools\s+(&|and)\s+technologies|technologies|proficiencies)$/i,
  },
  {
    type: 'certifications',
    regex: /^(certifications|licenses|certifications\s+(&|and)\s+licenses|credentials|professional\s+certifications|certificates|training)$/i,
  },
  {
    type: 'projects',
    regex: /^(projects|notable\s+projects|key\s+projects|personal\s+projects|technical\s+projects|portfolio)$/i,
  },
  {
    type: 'awards',
    regex: /^(awards|honors|awards\s+(&|and)\s+honors|honors\s+(&|and)\s+awards|achievements|recognition|accolades)$/i,
  },
  {
    type: 'publications',
    regex: /^(publications|presentations|publications\s+(&|and)\s+presentations|research\s+papers|conference\s+papers)$/i,
  },
];

const DATE_RANGE_REGEX =
  /(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\b(?:19|20)\d{2}\b)\s*(?:[-—–]+|\bto\b)\s*(?:Present|Current|Now|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\b(?:19|20)\d{2}\b)/i;

const SINGLE_DATE_REGEX =
  /(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\b(?:19|20)\d{2}\b)/i;

/**
 * Pure in-browser rule-based resume parser
 * Parses plain text into structured fields without any external AI or network calls.
 */
export function parseResumeByRules(rawText: string): ResumeData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const contact = extractContactInfo(lines);
  const name = extractCandidateName(lines, contact);

  // Partition lines into sections
  const { sections, preambleLines } = partitionSections(lines);

  // Initialize data structure
  const data: ResumeData = {
    name,
    contact,
    summary: { tagline: '', bullets: [], skills: [] },
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    awards: [],
    publications: [],
    uncategorizedContent: '',
  };

  const uncategorizedParts: string[] = [];

  // If there were unparsed lines before the first section, save them
  if (preambleLines.length > 0) {
    const unparsedPreamble = preambleLines.filter(
      (l) =>
        l !== name &&
        !l.includes(contact.email) &&
        !l.includes(contact.phone) &&
        !l.includes(contact.location)
    );
    if (unparsedPreamble.length > 0) {
      uncategorizedParts.push(unparsedPreamble.join('\n'));
    }
  }

  // Parse each recognized section
  for (const section of sections) {
    switch (section.type) {
      case 'summary':
        parseSummarySection(section.lines, data);
        break;
      case 'experience':
        parseExperienceSection(section.lines, data);
        break;
      case 'education':
        parseEducationSection(section.lines, data);
        break;
      case 'skills':
        parseSkillsSection(section.lines, data);
        break;
      case 'certifications':
        parseCertificationsSection(section.lines, data);
        break;
      case 'projects':
        parseProjectsSection(section.lines, data);
        break;
      case 'awards':
        parseAwardsSection(section.lines, data);
        break;
      case 'publications':
        parsePublicationsSection(section.lines, data);
        break;
      case 'unknown':
      default:
        uncategorizedParts.push(
          `--- ${section.headerText} ---\n${section.lines.join('\n')}`
        );
        break;
    }
  }

  if (uncategorizedParts.length > 0) {
    data.uncategorizedContent = uncategorizedParts.join('\n\n').trim();
  }

  return data;
}

// 1. Extract Contact Information
function extractContactInfo(lines: string[]): ResumeData['contact'] {
  const text = lines.join(' \n ');

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone
  const phoneMatch = text.match(
    /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/
  );
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // LinkedIn
  const linkedinMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i
  );
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  // Personal website (ignore linkedin and email domains)
  const textWithoutEmail = email ? text.replace(email, ' ') : text;
  const urlMatches = textWithoutEmail.match(
    /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?)/gi
  );
  let website = '';
  if (urlMatches) {
    const candidate = urlMatches.find(
      (u) =>
        !u.includes('linkedin.com') &&
        !u.includes('@') &&
        !u.endsWith('.') &&
        (u.startsWith('http') ||
          u.startsWith('www.') ||
          /\.(com|org|net|io|dev|app|me|co|edu|ai|tech|portfolio|info)\b/i.test(u))
    );
    if (candidate) website = candidate;
  }

  // Location heuristic: check header lines for "City, ST" or "City, Country"
  let location = '';
  const locRegex = /([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2}\b|[A-Z][a-zA-Z\s.-]+,\s*[A-Z][a-zA-Z\s]+)/;
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    if (line.includes(email) || line.includes(phone) || line.includes('|')) {
      const parts = line.split(/[|•–—]/);
      for (const part of parts) {
        const trimmed = part.trim();
        if (locRegex.test(trimmed) && !trimmed.includes('@') && !trimmed.includes('http')) {
          location = trimmed;
          break;
        }
      }
    }
    if (location) break;
  }

  return { phone, email, location, linkedin, website };
}

// 2. Candidate Name Heuristic
function extractCandidateName(
  lines: string[],
  contact: ResumeData['contact']
): string {
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const l = lines[i].trim();
    if (!l) continue;

    // If line has email or phone along with a name (e.g. "Jane Doe, jane@example.com")
    if (contact.email && l.includes(contact.email) && l.length > contact.email.length) {
      const stripped = l
        .replace(contact.email, '')
        .replace(contact.phone || '', '')
        .replace(/[,|•–—]/g, ' ')
        .trim();
      if (/^[A-Za-z\s.'-]{2,40}$/.test(stripped) && stripped.split(/\s+/).length <= 5) {
        return stripped;
      }
    }

    if (
      (contact.email && l.includes(contact.email)) ||
      (contact.phone && l.includes(contact.phone))
    ) {
      continue;
    }

    if (/^(resume|curriculum\s+vitae|cv|page\s+\d+)$/i.test(l)) continue;

    // Name is usually 2 to 4 words without special symbols
    if (/^[A-Za-z\s.'-]{2,40}$/.test(l) && l.split(/\s+/).length <= 5) {
      return l;
    }
  }

  if (lines[0]) {
    const fallback = lines[0]
      .replace(contact.email || '', '')
      .replace(contact.phone || '', '')
      .replace(/[,|•–—]/g, ' ')
      .trim();
    if (fallback) return fallback;
  }

  return 'Your Name';
}

// 3. Partition Document into Section Blocks
function partitionSections(lines: string[]) {
  const sections: SectionBlock[] = [];
  const preambleLines: string[] = [];
  let currentBlock: SectionBlock | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matchedPattern = SECTION_PATTERNS.find((p) => p.regex.test(line));

    if (matchedPattern) {
      if (currentBlock) {
        sections.push(currentBlock);
      }
      currentBlock = {
        type: matchedPattern.type,
        headerText: line,
        lines: [],
      };
    } else if (
      // General section header heuristic: all-caps line (e.g. "VOLUNTEERING", "PATENTS & INVENTIONS", "ADDITIONAL INFO")
      line.toUpperCase() === line &&
      line.replace(/[^A-Za-z]/g, '').length >= 3 &&
      line.length <= 60 &&
      !line.includes('@') &&
      !line.includes('|') &&
      !DATE_RANGE_REGEX.test(line) &&
      lines[i + 1]
    ) {
      if (currentBlock) {
        sections.push(currentBlock);
      }
      currentBlock = {
        type: 'unknown',
        headerText: line,
        lines: [],
      };
    } else {
      if (currentBlock) {
        currentBlock.lines.push(line);
      } else {
        preambleLines.push(line);
      }
    }
  }

  if (currentBlock) {
    sections.push(currentBlock);
  }

  return { sections, preambleLines };
}

// 4. Summary Section Parser
function parseSummarySection(lines: string[], data: ResumeData) {
  const bullets: string[] = [];
  let tagline = '';

  for (const line of lines) {
    // Detect bullet
    if (/^[-*•–—]\s*/.test(line)) {
      bullets.push(line.replace(/^[-*•–—]\s*/, '').trim());
    } else if (line.endsWith(':') || line.toLowerCase().includes('expertise in')) {
      if (tagline && !tagline.endsWith(':')) {
        bullets.unshift(tagline);
      }
      tagline = line;
    } else if (line.includes(' - ') || line.includes(' | ') || line.includes(' • ')) {
      // Inline skills in summary
      const skills = line
        .split(/[-|•–—]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 35);
      data.summary.skills.push(...skills);
    } else {
      if (!tagline && bullets.length === 0) {
        tagline = line;
      } else {
        bullets.push(line);
      }
    }
  }

  data.summary.tagline = tagline;
  data.summary.bullets = bullets;
}

// 5. Experience Section Parser
function parseExperienceSection(lines: string[], data: ResumeData) {
  let currentExp: ResumeExperience | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line contains a bullet
    if (/^[-*•–—]\s*/.test(line)) {
      const bullet = line.replace(/^[-*•–—]\s*/, '').trim();
      if (currentExp) {
        currentExp.bullets.push(bullet);
      } else if (data.experience.length > 0) {
        data.experience[data.experience.length - 1].bullets.push(bullet);
      }
      continue;
    }

    const dateMatch = line.match(DATE_RANGE_REGEX);
    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
    const nextLineDateMatch = !/^[-*•–—]\s*/.test(nextLine)
      ? nextLine.match(DATE_RANGE_REGEX)
      : null;

    // Pattern A: Title and Company on this line, Date (and optional Location) on the NEXT line
    if (!dateMatch && nextLineDateMatch) {
      if (currentExp) {
        data.experience.push(currentExp);
      }

      let title = line;
      let company = '';
      let location = '';

      if (
        line.includes('—') ||
        line.includes(' - ') ||
        line.includes('|')
      ) {
        const parts = line.split(/[-—|]/).map((p) => p.trim());
        title = parts[0] || '';
        company = parts[1] || '';
        if (parts[2]) location = parts[2];
      }

      const dateStr = nextLineDateMatch[0];
      const remainingNext = nextLine
        .replace(DATE_RANGE_REGEX, '')
        .replace(/[|•–—]/g, ' ')
        .trim();
      if (remainingNext) {
        location = remainingNext;
      }

      const [start, end] = dateStr
        .split(/\s*(?:[-—–]+|\bto\b)\s*/i)
        .map((s) => s.trim());

      currentExp = {
        id: `exp-${Date.now()}-${data.experience.length}`,
        title: title || 'Position Title',
        company: company,
        location: location,
        start: start || '',
        end: end || 'Present',
        current: /present|current|now/i.test(end || ''),
        summary: '',
        bullets: [],
      };

      // Advance i to skip nextLine since it was consumed
      i++;
      continue;
    }

    // Pattern B: Date is on THIS line (either alone or combined with title/company)
    if (dateMatch) {
      if (currentExp) {
        data.experience.push(currentExp);
      }

      const dateStr = dateMatch[0];
      const remainingLine = line.replace(DATE_RANGE_REGEX, '').trim();
      const [start, end] = dateStr
        .split(/\s*(?:[-—–]+|\bto\b)\s*/i)
        .map((s) => s.trim());

      let title = remainingLine;
      let company = '';
      let location = '';

      if (
        remainingLine.includes('—') ||
        remainingLine.includes(' - ') ||
        remainingLine.includes('|')
      ) {
        const parts = remainingLine.split(/[-—|]/).map((p) => p.trim());
        title = parts[0] || '';
        company = parts[1] || '';
        location = parts[2] || '';
      }

      currentExp = {
        id: `exp-${Date.now()}-${data.experience.length}`,
        title: title || 'Position Title',
        company: company,
        location: location,
        start: start || '',
        end: end || 'Present',
        current: /present|current|now/i.test(end || ''),
        summary: '',
        bullets: [],
      };
      continue;
    }

    // Subtitle line (company, location) or paragraph summary under current experience
    if (currentExp) {
      if (!currentExp.company && line.length < 50) {
        const parts = line.split(/[,—|-]/).map((p) => p.trim());
        currentExp.company = parts[0] || '';
        if (parts[1]) currentExp.location = parts[1];
      } else if (!currentExp.summary && currentExp.bullets.length === 0) {
        currentExp.summary = line;
      } else {
        currentExp.bullets.push(line);
      }
    }
  }

  if (currentExp) {
    data.experience.push(currentExp);
  }
}

// 6. Education Section Parser
function parseEducationSection(lines: string[], data: ResumeData) {
  let currentEdu: ResumeEducation | null = null;

  for (const line of lines) {
    const isDegree =
      /(bachelor|master|doctor|associate|b\.a\.|b\.s\.|m\.a\.|m\.s\.|m\.b\.a\.|ph\.d\.|degree|diploma|certificate|juris\s+doctor|j\.d\.)/i.test(
        line
      );
    const dateMatch = line.match(SINGLE_DATE_REGEX);

    if (isDegree) {
      if (currentEdu) {
        data.education.push(currentEdu);
      }

      const dateStr = dateMatch ? dateMatch[0] : '';
      const cleanLine = line.replace(SINGLE_DATE_REGEX, '').trim();

      let degree = cleanLine;
      let school = '';
      let location = '';

      if (cleanLine.includes('—') || cleanLine.includes(' - ') || cleanLine.includes(',')) {
        const parts = cleanLine.split(/[-—,]/).map((p) => p.trim());
        degree = parts[0];
        school = parts[1] || '';
        location = parts[2] || '';
      }

      currentEdu = {
        id: `edu-${Date.now()}-${data.education.length}`,
        degree: degree || 'Degree',
        school,
        location,
        date: dateStr,
        honors: '',
      };
    } else if (dateMatch && currentEdu && !currentEdu.date) {
      currentEdu.date = dateMatch[0];
      const loc = line
        .replace(SINGLE_DATE_REGEX, '')
        .replace(/[|•–—,]/g, ' ')
        .trim();
      if (loc && !currentEdu.location) {
        currentEdu.location = loc;
      }
    } else if (/(cum laude|magna|summa|honors|dean|gpa|specialization)/i.test(line)) {
      if (currentEdu) {
        currentEdu.honors = currentEdu.honors
          ? `${currentEdu.honors}, ${line}`
          : line;
      }
    } else if (currentEdu && !currentEdu.school) {
      currentEdu.school = line;
    }
  }

  if (currentEdu) {
    data.education.push(currentEdu);
  }
}

// 7. Skills Section Parser
function parseSkillsSection(lines: string[], data: ResumeData) {
  for (const line of lines) {
    // Split by commas, bullets, pipes, or colons (e.g. "Languages: JavaScript, TypeScript")
    const cleanLine = line.replace(/^[A-Za-z\s]+:\s*/, '');
    const tokens = cleanLine
      .split(/[,|•–—\t;]/)
      .map((s) => s.replace(/^[-*•–—]\s*/, '').trim())
      .filter((s) => s.length > 1 && s.length < 40);

    data.summary.skills.push(...tokens);
  }
  // Deduplicate
  data.summary.skills = Array.from(new Set(data.summary.skills));
}

// 8. Certifications Section Parser
function parseCertificationsSection(lines: string[], data: ResumeData) {
  for (const line of lines) {
    const clean = line.replace(/^[-*•–—]\s*/, '').trim();
    if (!clean) continue;

    const dateMatch = clean.match(SINGLE_DATE_REGEX);
    const date = dateMatch ? dateMatch[0] : '';
    const withoutDate = clean.replace(SINGLE_DATE_REGEX, '').trim();

    const parts = withoutDate.split(/[,—|-]/).map((p) => p.trim()).filter(Boolean);

    data.certifications.push({
      id: `cert-${Date.now()}-${data.certifications.length}`,
      name: parts[0] || withoutDate,
      org: parts[1] || '',
      date,
    });
  }
}

// 9. Projects Section Parser
function parseProjectsSection(lines: string[], data: ResumeData) {
  let currentProj: ResumeProject | null = null;

  for (const line of lines) {
    if (/^[-*•–—]\s*/.test(line)) {
      const bullet = line.replace(/^[-*•–—]\s*/, '').trim();
      if (currentProj) {
        currentProj.bullets.push(bullet);
      }
    } else {
      if (currentProj) {
        data.projects.push(currentProj);
      }

      let name = line;
      let role = '';
      if (line.includes('—') || line.includes(' - ') || line.includes('|')) {
        const parts = line.split(/[-—|]/).map((p) => p.trim());
        name = parts[0] || line;
        role = parts[1] || '';
      }

      currentProj = {
        id: `proj-${Date.now()}-${data.projects.length}`,
        name,
        role,
        description: '',
        bullets: [],
      };
    }
  }

  if (currentProj) {
    data.projects.push(currentProj);
  }
}

// 10. Awards Section Parser
function parseAwardsSection(lines: string[], data: ResumeData) {
  for (const line of lines) {
    const clean = line.replace(/^[-*•–—]\s*/, '').trim();
    if (clean) data.awards.push(clean);
  }
}

// 11. Publications Section Parser
function parsePublicationsSection(lines: string[], data: ResumeData) {
  if (!data.publications) data.publications = [];
  for (const line of lines) {
    const clean = line.replace(/^[-*•–—]\s*/, '').trim();
    if (!clean) continue;

    const dateMatch = clean.match(SINGLE_DATE_REGEX);
    data.publications.push({
      id: `pub-${Date.now()}-${data.publications.length}`,
      title: clean.replace(SINGLE_DATE_REGEX, '').trim(),
      journalOrVenue: '',
      date: dateMatch ? dateMatch[0] : '',
    });
  }
}
