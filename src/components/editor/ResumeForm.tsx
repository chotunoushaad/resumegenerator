'use client';

import React, { useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileCheck,
  FolderGit2,
  BookOpen,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  UploadCloud,
  FileX2,
} from 'lucide-react';
import {
  ResumeData,
  ResumeExperience,
  ResumeEducation,
  ResumeCertification,
  ResumeProject,
  ResumePublication,
} from '@/types/resume';
import { CollapsibleSection } from './CollapsibleSection';
import { ReorderableListInput } from './ReorderableListInput';
import { SAMPLE_DATA, EMPTY_RESUME } from '@/lib/sample-data';

interface ResumeFormProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onOpenUploadModal?: () => void;
  onClearData?: () => void;
}

const inputClass =
  'w-full px-2.5 py-1.5 text-xs sm:text-sm border border-stone-300 rounded bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition-colors font-sans';
const labelClass =
  'block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-medium font-sans';
const cardClass =
  'border border-stone-200/90 rounded-md p-3.5 bg-stone-50/40 space-y-3 relative group transition-all hover:border-stone-300';

export function ResumeForm({
  data,
  setData,
  onOpenUploadModal,
  onClearData,
}: ResumeFormProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showUncategorized, setShowUncategorized] = useState(true);

  // Deep update helpers
  const updateField = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateContact = (key: keyof ResumeData['contact'], val: string) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: val },
    }));
  };

  // Reordering helpers
  const moveItem = <T,>(arr: T[], idx: number, direction: 'up' | 'down'): T[] => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= arr.length) return arr;
    const next = [...arr];
    const temp = next[targetIdx];
    next[targetIdx] = next[idx];
    next[idx] = temp;
    return next;
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      location: '',
      start: '',
      end: '',
      current: false,
      summary: '',
      bullets: [''],
    };
    setData((p) => ({ ...p, experience: [...p.experience, newExp] }));
  };

  const updateExperience = (idx: number, patch: Partial<ResumeExperience>) => {
    setData((p) => ({
      ...p,
      experience: p.experience.map((e, i) => (i === idx ? { ...e, ...patch } : e)),
    }));
  };

  const removeExperience = (idx: number) => {
    setData((p) => ({
      ...p,
      experience: p.experience.filter((_, i) => i !== idx),
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu-${Date.now()}`,
      degree: '',
      school: '',
      location: '',
      date: '',
      honors: '',
    };
    setData((p) => ({ ...p, education: [...p.education, newEdu] }));
  };

  const updateEducation = (idx: number, patch: Partial<ResumeEducation>) => {
    setData((p) => ({
      ...p,
      education: p.education.map((ed, i) => (i === idx ? { ...ed, ...patch } : ed)),
    }));
  };

  const removeEducation = (idx: number) => {
    setData((p) => ({
      ...p,
      education: p.education.filter((_, i) => i !== idx),
    }));
  };

  // Certifications handlers
  const addCert = () => {
    const newCert: ResumeCertification = {
      id: `cert-${Date.now()}`,
      name: '',
      org: '',
      date: '',
    };
    setData((p) => ({ ...p, certifications: [...p.certifications, newCert] }));
  };

  const updateCert = (idx: number, patch: Partial<ResumeCertification>) => {
    setData((p) => ({
      ...p,
      certifications: p.certifications.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));
  };

  const removeCert = (idx: number) => {
    setData((p) => ({
      ...p,
      certifications: p.certifications.filter((_, i) => i !== idx),
    }));
  };

  // Projects handlers
  const addProject = () => {
    const newProj: ResumeProject = {
      id: `proj-${Date.now()}`,
      name: '',
      role: '',
      description: '',
      bullets: [''],
    };
    setData((p) => ({ ...p, projects: [...p.projects, newProj] }));
  };

  const updateProject = (idx: number, patch: Partial<ResumeProject>) => {
    setData((p) => ({
      ...p,
      projects: p.projects.map((proj, i) => (i === idx ? { ...proj, ...patch } : proj)),
    }));
  };

  const removeProject = (idx: number) => {
    setData((p) => ({
      ...p,
      projects: p.projects.filter((_, i) => i !== idx),
    }));
  };

  // Publications handlers
  const addPublication = () => {
    const newPub: ResumePublication = {
      id: `pub-${Date.now()}`,
      title: '',
      journalOrVenue: '',
      date: '',
      authors: '',
    };
    setData((p) => ({ ...p, publications: [...(p.publications || []), newPub] }));
  };

  const updatePublication = (idx: number, patch: Partial<ResumePublication>) => {
    const pubs = data.publications || [];
    setData((p) => ({
      ...p,
      publications: pubs.map((pub, i) => (i === idx ? { ...pub, ...patch } : pub)),
    }));
  };

  const removePublication = (idx: number) => {
    const pubs = data.publications || [];
    setData((p) => ({
      ...p,
      publications: pubs.filter((_, i) => i !== idx),
    }));
  };

  // Check completeness
  const hasName = Boolean(data.name.trim());
  const hasContact = Boolean(data.contact.email.trim() || data.contact.phone.trim());
  const hasExp = data.experience.length > 0;
  const hasEdu = data.education.length > 0;
  const isAtsReady = hasName && hasContact && hasExp && hasEdu;

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {onOpenUploadModal && (
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Import Resume
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-stone-600 pl-1">
            {isAtsReady ? (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Core fields complete
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Missing core sections
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setData(SAMPLE_DATA)}
            className="text-stone-600 hover:text-stone-950 font-medium px-2 py-1 rounded hover:bg-stone-200/60 transition-colors"
          >
            Load Sample
          </button>
          <span className="text-stone-300">|</span>
          <button
            type="button"
            onClick={() => setData(EMPTY_RESUME)}
            className="text-stone-600 hover:text-stone-950 font-medium px-2 py-1 rounded hover:bg-stone-200/60 transition-colors"
          >
            Blank Form
          </button>
          <span className="text-stone-300">|</span>
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="text-stone-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            Clear Data
          </button>
        </div>
      </div>

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between text-xs text-red-800 animate-fadeIn">
          <span>Wipe all fields and clear local draft from your browser?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onClearData) onClearData();
                else setData(EMPTY_RESUME);
                setShowClearConfirm(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded font-medium transition-colors"
            >
              Confirm Clear
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="text-stone-600 hover:text-stone-900 px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Uncategorized Imported Text (If extracted from file) */}
      {data.uncategorizedContent && (
        <div className="bg-amber-50/70 border border-amber-300/80 rounded-lg p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-amber-900">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Review Imported / Uncategorized Text</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowUncategorized(!showUncategorized)}
                className="text-amber-800 underline font-medium hover:text-amber-950"
              >
                {showUncategorized ? 'Hide' : 'Show Text'}
              </button>
              <button
                type="button"
                onClick={() => updateField('uncategorizedContent', '')}
                className="text-amber-700 hover:text-red-700 p-1 rounded hover:bg-amber-100"
                title="Dismiss Uncategorized Text"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-amber-800/90 text-[11px] leading-relaxed">
            The text below was extracted from your file but didn't match a standard section header. You can copy and paste any relevant items into the appropriate sections below.
          </p>
          {showUncategorized && (
            <textarea
              rows={5}
              readOnly
              value={data.uncategorizedContent}
              className="w-full font-mono text-[11px] p-2 bg-white border border-amber-300 rounded text-stone-800 focus:outline-none"
            />
          )}
        </div>
      )}

      {/* 1. Identity & Contact */}
      <CollapsibleSection title="Identity & Contact Details" icon={<User className="w-4 h-4" />} defaultOpen={true}>
        <div>
          <label className={labelClass} htmlFor="name-input">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name-input"
            className={inputClass}
            value={data.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Emma Larsen"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className={labelClass} htmlFor="phone-input">Phone Number</label>
            <input
              id="phone-input"
              className={inputClass}
              value={data.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              placeholder="(917) 555-0142"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="email-input">Email Address</label>
            <input
              id="email-input"
              type="email"
              className={inputClass}
              value={data.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              placeholder="emma.larsen@gmail.com"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="loc-input">Location (City, ST)</label>
            <input
              id="loc-input"
              className={inputClass}
              value={data.contact.location}
              onChange={(e) => updateContact('location', e.target.value)}
              placeholder="Brooklyn, NY"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="linkedin-input">LinkedIn</label>
            <input
              id="linkedin-input"
              className={inputClass}
              value={data.contact.linkedin}
              onChange={(e) => updateContact('linkedin', e.target.value)}
              placeholder="linkedin.com/in/emmalarsen"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="web-input">Portfolio / Website</label>
            <input
              id="web-input"
              className={inputClass}
              value={data.contact.website}
              onChange={(e) => updateContact('website', e.target.value)}
              placeholder="emmalarsen.com"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. Professional Summary & Skills */}
      <CollapsibleSection title="Summary & Core Skills" icon={<FileCheck className="w-4 h-4" />} defaultOpen={true}>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className={labelClass} htmlFor="tagline-input">
              Italic Tagline / Subtitle
            </label>
            <span className="text-[10px] text-stone-400">Positioning line</span>
          </div>
          <input
            id="tagline-input"
            className={inputClass}
            value={data.summary.tagline}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                summary: { ...p.summary, tagline: e.target.value },
              }))
            }
            placeholder="e.g. Multi-faceted retail executive with expertise in:"
          />
        </div>

        <ReorderableListInput
          label="Summary Highlights"
          items={data.summary.bullets}
          onChange={(bullets) =>
            setData((p) => ({ ...p, summary: { ...p.summary, bullets } }))
          }
          placeholder="e.g. Driving 35% YoY revenue growth across multi-unit operations"
        />

        <ReorderableListInput
          label="Skills & Technologies"
          items={data.summary.skills}
          onChange={(skills) =>
            setData((p) => ({ ...p, summary: { ...p.summary, skills } }))
          }
          placeholder="e.g. Project Management"
          helperText="Single skill per row works best for ATS parsers"
        />
      </CollapsibleSection>

      {/* 3. Experience */}
      <CollapsibleSection
        title="Work Experience"
        count={data.experience.length}
        icon={<Briefcase className="w-4 h-4" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          {data.experience.map((exp, idx) => (
            <div key={exp.id || idx} className={cardClass}>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                  {exp.title ? `${exp.title} ${exp.company ? `(${exp.company})` : ''}` : `Position ${idx + 1}`}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        experience: moveItem(p.experience, idx, 'up'),
                      }))
                    }
                    disabled={idx === 0}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        experience: moveItem(p.experience, idx, 'down'),
                      }))
                    }
                    disabled={idx === data.experience.length - 1}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded ml-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input
                    className={inputClass}
                    placeholder="District Manager"
                    value={exp.title}
                    onChange={(e) => updateExperience(idx, { title: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    className={inputClass}
                    placeholder="Aldridge & Co."
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, { company: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    className={inputClass}
                    placeholder="New York, NY"
                    value={exp.location}
                    onChange={(e) => updateExperience(idx, { location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input
                      className={inputClass}
                      placeholder="Mar 2021"
                      value={exp.start}
                      onChange={(e) => updateExperience(idx, { start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input
                      className={inputClass}
                      placeholder="Present"
                      value={exp.end}
                      onChange={(e) => updateExperience(idx, { end: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Role Summary (Optional)</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="Overview paragraph for this position..."
                  value={exp.summary}
                  onChange={(e) => updateExperience(idx, { summary: e.target.value })}
                />
              </div>

              <ReorderableListInput
                label="Accomplishments & Metrics"
                items={exp.bullets}
                onChange={(bullets) => updateExperience(idx, { bullets })}
                placeholder="Action verb + achievement + quantifiable metric..."
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="w-full py-2.5 border border-dashed border-stone-300 hover:border-stone-500 rounded-md text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Experience Entry
          </button>
        </div>
      </CollapsibleSection>

      {/* 4. Education */}
      <CollapsibleSection
        title="Education"
        count={data.education.length}
        icon={<GraduationCap className="w-4 h-4" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={edu.id || idx} className={cardClass}>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                  {edu.degree || `Degree ${idx + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        education: moveItem(p.education, idx, 'up'),
                      }))
                    }
                    disabled={idx === 0}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        education: moveItem(p.education, idx, 'down'),
                      }))
                    }
                    disabled={idx === data.education.length - 1}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="p-1 text-stone-400 hover:text-red-600 rounded ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>Degree</label>
                  <input
                    className={inputClass}
                    placeholder="B.A., Business Administration"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>School / University</label>
                  <input
                    className={inputClass}
                    placeholder="New York University"
                    value={edu.school}
                    onChange={(e) => updateEducation(idx, { school: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    className={inputClass}
                    placeholder="New York, NY"
                    value={edu.location}
                    onChange={(e) => updateEducation(idx, { location: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Graduation Date</label>
                  <input
                    className={inputClass}
                    placeholder="May 2015"
                    value={edu.date}
                    onChange={(e) => updateEducation(idx, { date: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Honors / GPA (Optional)</label>
                  <input
                    className={inputClass}
                    placeholder="Magna Cum Laude"
                    value={edu.honors || ''}
                    onChange={(e) => updateEducation(idx, { honors: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEducation}
            className="w-full py-2.5 border border-dashed border-stone-300 hover:border-stone-500 rounded-md text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Education Entry
          </button>
        </div>
      </CollapsibleSection>

      {/* 5. Certifications & Licenses */}
      <CollapsibleSection
        title="Certifications &amp; Licenses"
        count={data.certifications.length}
        icon={<Award className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {data.certifications.map((cert, idx) => (
            <div key={cert.id || idx} className={cardClass}>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                  {cert.name || `Certification ${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeCert(idx)}
                  className="p-1 text-stone-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Certification Name</label>
                  <input
                    className={inputClass}
                    placeholder="Six Sigma Green Belt"
                    value={cert.name}
                    onChange={(e) => updateCert(idx, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    className={inputClass}
                    placeholder="2020"
                    value={cert.date}
                    onChange={(e) => updateCert(idx, { date: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Issuing Organization</label>
                  <input
                    className={inputClass}
                    placeholder="ASQ"
                    value={cert.org}
                    onChange={(e) => updateCert(idx, { org: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCert}
            className="w-full py-2 border border-dashed border-stone-300 hover:border-stone-500 rounded-md text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Certification
          </button>
        </div>
      </CollapsibleSection>

      {/* 6. Projects */}
      <CollapsibleSection
        title="Notable Projects"
        count={data.projects.length}
        icon={<FolderGit2 className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {data.projects.map((proj, idx) => (
            <div key={proj.id || idx} className={cardClass}>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                  {proj.name || `Project ${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="p-1 text-stone-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>Project Name</label>
                  <input
                    className={inputClass}
                    value={proj.name}
                    onChange={(e) => updateProject(idx, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Role (Optional)</label>
                  <input
                    className={inputClass}
                    value={proj.role || ''}
                    onChange={(e) => updateProject(idx, { role: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(idx, { description: e.target.value })}
                  />
                </div>
              </div>
              <ReorderableListInput
                label="Highlights"
                items={proj.bullets}
                onChange={(bullets) => updateProject(idx, { bullets })}
                placeholder="Bullet point..."
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addProject}
            className="w-full py-2 border border-dashed border-stone-300 hover:border-stone-500 rounded-md text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </CollapsibleSection>

      {/* 7. Awards */}
      <CollapsibleSection
        title="Awards &amp; Honors"
        count={data.awards.length}
        icon={<Award className="w-4 h-4" />}
        defaultOpen={false}
      >
        <ReorderableListInput
          label="Awards"
          items={data.awards}
          onChange={(awards) => updateField('awards', awards)}
          placeholder="e.g. Manager of the Year 2020"
        />
      </CollapsibleSection>

      {/* 8. Publications */}
      <CollapsibleSection
        title="Publications &amp; Presentations"
        count={data.publications?.length || 0}
        icon={<BookOpen className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {(data.publications || []).map((pub, idx) => (
            <div key={pub.id || idx} className={cardClass}>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                  {pub.title || `Publication ${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removePublication(idx)}
                  className="p-1 text-stone-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    className={inputClass}
                    value={pub.title}
                    onChange={(e) => updatePublication(idx, { title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Journal / Venue</label>
                    <input
                      className={inputClass}
                      value={pub.journalOrVenue}
                      onChange={(e) => updatePublication(idx, { journalOrVenue: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Date / Year</label>
                    <input
                      className={inputClass}
                      value={pub.date}
                      onChange={(e) => updatePublication(idx, { date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addPublication}
            className="w-full py-2 border border-dashed border-stone-300 hover:border-stone-500 rounded-md text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Publication
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}
