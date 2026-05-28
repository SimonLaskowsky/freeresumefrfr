import type { ComponentType } from 'react';
import type { ResumeData } from '@/store/resumeStore';

import { ClassicTemplate } from './Classic';
import { ModernTemplate } from './Modern';
import { MinimalTemplate } from './Minimal';
import { BoldTemplate } from './Bold';
import { ElegantTemplate } from './Elegant';
import { CompactTemplate } from './Compact';
import { ProTemplate } from './Pro';
import { ExecutiveTemplate } from './Executive';
import { TimelineTemplate } from './Timeline';
import { CreativeTemplate } from './Creative';
import { SplitTemplate } from './Split';
import { SharpTemplate } from './Sharp';
import { SleekTemplate } from './Sleek';
import { DevTemplate } from './Dev';

export interface TemplateLabels {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  languages: string;
  contact: string;
  present: string;
}

export interface TemplateProps {
  data: ResumeData;
  labels: TemplateLabels;
  accentColor: string;
  companyLogo?: string;
}

export interface TemplateConfig {
  id: string;
  label: string;
  description: string;
  accent: string;
  defaultColors: string[];
  Component: ComponentType<TemplateProps>;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Clean single-column. ATS-safe.',
    accent: '#1a1a1a',
    defaultColors: ['#1a1a1a', '#1e3a5f', '#7c3aed', '#0891b2', '#dc2626', '#065f46'],
    Component: ClassicTemplate,
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Dark navy sidebar with contact & skills.',
    accent: '#1a2744',
    defaultColors: ['#1a2744', '#0f172a', '#1e3a5f', '#0c4a6e', '#1a1a1a', '#312e81'],
    Component: ModernTemplate,
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Maximum whitespace. Ultra-clean.',
    accent: '#94a3b8',
    defaultColors: ['#94a3b8', '#1a1a1a', '#6366f1', '#0891b2', '#7c3aed', '#374151'],
    Component: MinimalTemplate,
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Dark header. Lime accents. Statement.',
    accent: '#a3e635',
    defaultColors: ['#a3e635', '#f59e0b', '#ec4899', '#60a5fa', '#34d399', '#f87171'],
    Component: BoldTemplate,
  },
  {
    id: 'elegant',
    label: 'Elegant',
    description: 'Serif font. Centered header. Formal.',
    accent: '#7c3aed',
    defaultColors: ['#7c3aed', '#1a1a1a', '#0891b2', '#dc2626', '#065f46', '#92400e'],
    Component: ElegantTemplate,
  },
  {
    id: 'compact',
    label: 'Compact',
    description: 'Dense layout. Fits more on one page.',
    accent: '#374151',
    defaultColors: ['#374151', '#1a1a1a', '#0891b2', '#6366f1', '#7c3aed', '#0f766e'],
    Component: CompactTemplate,
  },
  {
    id: 'pro',
    label: 'Pro',
    description: 'Teal left-border sections. Structured.',
    accent: '#0891b2',
    defaultColors: ['#0891b2', '#6366f1', '#dc2626', '#059669', '#d97706', '#7c3aed'],
    Component: ProTemplate,
  },
  {
    id: 'executive',
    label: 'Executive',
    description: 'Wide margins. Label-column layout.',
    accent: '#6b7280',
    defaultColors: ['#6b7280', '#1a1a1a', '#1e3a5f', '#374151', '#0f172a', '#292524'],
    Component: ExecutiveTemplate,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    description: 'Vertical timeline accent line for experience.',
    accent: '#6366f1',
    defaultColors: ['#6366f1', '#8b5cf6', '#0891b2', '#059669', '#dc2626', '#d97706'],
    Component: TimelineTemplate,
  },
  {
    id: 'creative',
    label: 'Creative',
    description: 'Accent sidebar with white content panel.',
    accent: '#ec4899',
    defaultColors: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
    Component: CreativeTemplate,
  },
  {
    id: 'split',
    label: 'Split',
    description: 'Two-column layout with pill section labels.',
    accent: '#f59e0b',
    defaultColors: ['#f59e0b', '#0891b2', '#6366f1', '#059669', '#ec4899', '#dc2626'],
    Component: SplitTemplate,
  },
  {
    id: 'sharp',
    label: 'Sharp',
    description: 'Bold accent header. Left-bar sections.',
    accent: '#ef4444',
    defaultColors: ['#ef4444', '#1a1a1a', '#dc2626', '#0891b2', '#7c3aed', '#059669'],
    Component: SharpTemplate,
  },
  {
    id: 'sleek',
    label: 'Sleek',
    description: 'Editorial feel. Right-aligned header.',
    accent: '#8b5cf6',
    defaultColors: ['#8b5cf6', '#6366f1', '#1a1a1a', '#0891b2', '#ec4899', '#059669'],
    Component: SleekTemplate,
  },
  {
    id: 'dev',
    label: 'Dev',
    description: 'Code-comment sections. Arrow bullets.',
    accent: '#10b981',
    defaultColors: ['#10b981', '#6366f1', '#a3e635', '#0891b2', '#f59e0b', '#ec4899'],
    Component: DevTemplate,
  },
];

export function getTemplate(id: string): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
