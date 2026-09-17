import { ResumeData } from '@/types/resume';

const STORAGE_KEY = 'ats_resume_local_draft_v1';

export function saveDraftToStorage(data: ResumeData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save resume draft to localStorage:', err);
  }
}

export function loadDraftFromStorage(): ResumeData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'name' in parsed) {
      return parsed as ResumeData;
    }
  } catch (err) {
    console.warn('Failed to parse resume draft from localStorage:', err);
  }
  return null;
}

export function clearDraftFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to remove resume draft from localStorage:', err);
  }
}

export function hasSavedDraft(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}
