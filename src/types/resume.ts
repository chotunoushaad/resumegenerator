export interface ResumeContact {
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface ResumeSummary {
  tagline: string;
  bullets: string[];
  skills: string[];
}

export interface ResumeExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  school: string;
  location: string;
  date: string;
  honors?: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  org: string;
  date: string;
  credentialUrl?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  role?: string;
  description: string;
  bullets: string[];
  link?: string;
}

export interface ResumePublication {
  id: string;
  title: string;
  journalOrVenue: string;
  date: string;
  authors?: string;
  url?: string;
}

export interface ResumeData {
  name: string;
  contact: ResumeContact;
  summary: ResumeSummary;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  projects: ResumeProject[];
  awards: string[];
  publications?: ResumePublication[];
  uncategorizedContent?: string;
}

export type ResumeSectionId =
  | 'identity'
  | 'summary'
  | 'experience'
  | 'education'
  | 'certifications'
  | 'projects'
  | 'awards'
  | 'publications'
  | 'uncategorized';
