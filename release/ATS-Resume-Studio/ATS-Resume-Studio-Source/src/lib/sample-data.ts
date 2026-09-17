import { ResumeData } from '@/types/resume';

export const SAMPLE_RESUME_TEXT = `EMMA LARSEN
Brooklyn, NY  |  emma.larsen@gmail.com  |  (917) 555-0142  |  linkedin.com/in/emmalarsen

Multi-faceted retail executive with expertise in:
- Driving 35% YoY revenue growth across multi-unit operations
- Building and mentoring high-performance teams of 40+ associates
Project Management - Conflict Resolution - Strategic Planning - P&L Ownership - Visual Merchandising

EXPERIENCE

District Manager — Aldridge & Co., New York, NY                              Mar 2021 — Present
Oversee 12 retail locations across the tri-state region with combined annual revenue of $48M.
- Grew district revenue 35% YoY through targeted merchandising and staff training initiatives
- Reduced employee turnover from 64% to 22% by overhauling onboarding and recognition programs
- Led launch of three new store concepts, each exceeding first-year sales projections by 18%+
- Partner with marketing on regional campaigns; manage P&L, budgets, and capital expenditures

Store Manager — Aldridge & Co., Brooklyn Flagship                            Jun 2018 — Mar 2021
- Managed flagship location with $9M annual revenue and team of 45 associates
- Implemented inventory system overhaul that reduced shrink by 41%
- Won "Manager of the Year" 2020 across 80+ U.S. locations

Assistant Store Manager — J. Crew, SoHo                                       Jul 2015 — May 2018
- Supported daily operations of $14M flagship in partnership with General Manager
- Developed visual merchandising standards adopted across 12 regional stores

EDUCATION

B.A., Business Administration                                                  May 2015
New York University, Stern School of Business — New York, NY
Magna Cum Laude

CERTIFICATIONS

- Certified Retail Operations Professional (CROP), National Retail Federation, 2022
- Six Sigma Green Belt, ASQ, 2020`;

export const SAMPLE_DATA: ResumeData = {
  name: "Emma Larsen",
  contact: {
    phone: "(917) 555-0142",
    email: "emma.larsen@gmail.com",
    location: "Brooklyn, NY",
    linkedin: "linkedin.com/in/emmalarsen",
    website: "",
  },
  summary: {
    tagline: "Multi-faceted retail executive with expertise in:",
    bullets: [
      "Driving 35% YoY revenue growth across multi-unit operations",
      "Building and mentoring high-performance teams of 40+ associates",
    ],
    skills: [
      "Project Management",
      "Conflict Resolution",
      "Strategic Planning",
      "P&L Ownership",
      "Visual Merchandising",
      "Team Leadership",
    ],
  },
  experience: [
    {
      id: "exp-1",
      title: "District Manager",
      company: "Aldridge & Co.",
      location: "New York, NY",
      start: "Mar 2021",
      end: "Present",
      current: true,
      summary: "Oversee 12 retail locations across the tri-state region with combined annual revenue of $48M.",
      bullets: [
        "Grew district revenue 35% YoY through targeted merchandising and staff training initiatives",
        "Reduced employee turnover from 64% to 22% by overhauling onboarding and recognition programs",
        "Led launch of three new store concepts, each exceeding first-year sales projections by 18%+",
        "Partner with marketing on regional campaigns; manage P&L, budgets, and capital expenditures",
      ],
    },
    {
      id: "exp-2",
      title: "Store Manager",
      company: "Aldridge & Co.",
      location: "Brooklyn Flagship",
      start: "Jun 2018",
      end: "Mar 2021",
      current: false,
      summary: "",
      bullets: [
        "Managed flagship location with $9M annual revenue and team of 45 associates",
        "Implemented inventory system overhaul that reduced shrink by 41%",
        "Won 'Manager of the Year' 2020 across 80+ U.S. locations",
      ],
    },
    {
      id: "exp-3",
      title: "Assistant Store Manager",
      company: "J. Crew",
      location: "SoHo, NY",
      start: "Jul 2015",
      end: "May 2018",
      current: false,
      summary: "",
      bullets: [
        "Supported daily operations of $14M flagship in partnership with General Manager",
        "Developed visual merchandising standards adopted across 12 regional stores",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.A., Business Administration",
      school: "New York University, Stern School of Business",
      location: "New York, NY",
      date: "May 2015",
      honors: "Magna Cum Laude",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Certified Retail Operations Professional (CROP)",
      org: "National Retail Federation",
      date: "2022",
    },
    {
      id: "cert-2",
      name: "Six Sigma Green Belt",
      org: "ASQ",
      date: "2020",
    },
  ],
  projects: [],
  awards: [
    "Manager of the Year 2020 (Aldridge & Co.)",
    "Stern Leadership Scholar (NYU)",
  ],
  publications: [],
  uncategorizedContent: '',
};

export const EMPTY_RESUME: ResumeData = {
  name: "",
  contact: {
    phone: "",
    email: "",
    location: "",
    linkedin: "",
    website: "",
  },
  summary: {
    tagline: "",
    bullets: [],
    skills: [],
  },
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  awards: [],
  publications: [],
  uncategorizedContent: '',
};
