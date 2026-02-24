import { ClassicCoverLetter } from './ClassicCoverLetter';
import { ModernCoverLetter } from './ModernCoverLetter';
import type { CoverLetterData } from '@/store/coverLetterStore';

export interface CoverLetterLabels {
  hiringManager: string;
  reSubject: string;
}

export interface CoverLetterTemplateProps {
  data: CoverLetterData;
  labels: CoverLetterLabels;
}

export interface CoverLetterTemplateEntry {
  id: string;
  name: string;
  Component: React.ComponentType<CoverLetterTemplateProps>;
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplateEntry[] = [
  { id: 'classic', name: 'Classic', Component: ClassicCoverLetter },
  { id: 'modern', name: 'Modern', Component: ModernCoverLetter },
];

export function getCoverLetterTemplate(id: string): CoverLetterTemplateEntry {
  return COVER_LETTER_TEMPLATES.find((t) => t.id === id) ?? COVER_LETTER_TEMPLATES[0];
}
