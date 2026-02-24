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

export interface TemplateLabels {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  contact: string;
}

export interface TemplateProps {
  data: ResumeData;
  labels: TemplateLabels;
}

export interface TemplateConfig {
  id: string;
  label: string;
  description: string;
  accent: string;
  Component: ComponentType<TemplateProps>;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Clean single-column. ATS-safe.',
    accent: '#1a1a1a',
    Component: ClassicTemplate,
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Dark navy sidebar with contact & skills.',
    accent: '#1a2744',
    Component: ModernTemplate,
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Maximum whitespace. Ultra-clean.',
    accent: '#94a3b8',
    Component: MinimalTemplate,
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Dark header. Lime accents. Statement.',
    accent: '#a3e635',
    Component: BoldTemplate,
  },
  {
    id: 'elegant',
    label: 'Elegant',
    description: 'Serif font. Centered header. Formal.',
    accent: '#7c3aed',
    Component: ElegantTemplate,
  },
  {
    id: 'compact',
    label: 'Compact',
    description: 'Dense layout. Fits more on one page.',
    accent: '#374151',
    Component: CompactTemplate,
  },
  {
    id: 'pro',
    label: 'Pro',
    description: 'Teal left-border sections. Structured.',
    accent: '#0891b2',
    Component: ProTemplate,
  },
  {
    id: 'executive',
    label: 'Executive',
    description: 'Wide margins. Label-column layout.',
    accent: '#6b7280',
    Component: ExecutiveTemplate,
  },
];

export function getTemplate(id: string): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
