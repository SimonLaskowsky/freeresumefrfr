import type { ComponentType } from 'react';
import { ClassicCoverLetter } from './ClassicCoverLetter';
import { ModernCoverLetter } from './ModernCoverLetter';
import { MinimalCoverLetter } from './MinimalCoverLetter';
import { BoldCoverLetter } from './BoldCoverLetter';
import { CreativeCoverLetter } from './CreativeCoverLetter';
import type { CoverLetterData } from '@/store/coverLetterStore';

export interface CoverLetterLabels {
  hiringManager: string;
  reSubject: string;
}

export interface CoverLetterTemplateProps {
  data: CoverLetterData;
  labels: CoverLetterLabels;
  accentColor: string;
}

export interface CoverLetterTemplateEntry {
  id: string;
  name: string;
  accent: string;
  defaultColors: string[];
  Component: ComponentType<CoverLetterTemplateProps>;
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplateEntry[] = [
  {
    id: 'classic',
    name: 'Classic',
    accent: '#1a1a1a',
    defaultColors: ['#1a1a1a', '#1e3a5f', '#7c3aed', '#0891b2', '#dc2626', '#065f46'],
    Component: ClassicCoverLetter,
  },
  {
    id: 'modern',
    name: 'Modern',
    accent: '#1a2744',
    defaultColors: ['#1a2744', '#0f172a', '#1e3a5f', '#0c4a6e', '#1a1a1a', '#312e81'],
    Component: ModernCoverLetter,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    accent: '#94a3b8',
    defaultColors: ['#94a3b8', '#1a1a1a', '#6366f1', '#0891b2', '#7c3aed', '#374151'],
    Component: MinimalCoverLetter,
  },
  {
    id: 'bold',
    name: 'Bold',
    accent: '#a3e635',
    defaultColors: ['#a3e635', '#f59e0b', '#ec4899', '#60a5fa', '#34d399', '#f87171'],
    Component: BoldCoverLetter,
  },
  {
    id: 'creative',
    name: 'Creative',
    accent: '#ec4899',
    defaultColors: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
    Component: CreativeCoverLetter,
  },
];

export function getCoverLetterTemplate(id: string): CoverLetterTemplateEntry {
  return COVER_LETTER_TEMPLATES.find((t) => t.id === id) ?? COVER_LETTER_TEMPLATES[0];
}
