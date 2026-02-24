'use client';

import { TEMPLATES } from './templates';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import type { Translations } from '@/i18n/translations';

type TemplateKey = keyof Translations['templates'];

export default function TemplatePicker() {
  const templateId = useResumeStore((s) => s.templateId);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const { t } = useI18n();

  return (
    <div className="flex gap-1.5 overflow-x-auto py-0.5">
      {TEMPLATES.map((tmpl) => {
        const active = templateId === tmpl.id;
        const labelKey = tmpl.id as TemplateKey;
        const localizedLabel = t.templates[labelKey] ?? tmpl.label;
        return (
          <button
            key={tmpl.id}
            onClick={() => setTemplate(tmpl.id)}
            title={tmpl.description}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              active
                ? 'bg-lime-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: active ? '#1a1a1a' : tmpl.accent }}
            />
            {localizedLabel}
          </button>
        );
      })}
    </div>
  );
}
