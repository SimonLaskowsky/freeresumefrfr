'use client';

import { TEMPLATES, getTemplate } from './templates';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import type { Translations } from '@/i18n/translations';

type TemplateKey = keyof Translations['templates'];

export default function TemplatePicker() {
  const templateId = useResumeStore((s) => s.templateId);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const accentColor = useResumeStore((s) => s.accentColor);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const { t } = useI18n();

  const activeTmpl = getTemplate(templateId);

  return (
    <div className="flex flex-col gap-2">
      {/* Template pills */}
      <div className="flex gap-1.5 overflow-x-auto py-0.5">
        {TEMPLATES.map((tmpl) => {
          const active = templateId === tmpl.id;
          const labelKey = tmpl.id as TemplateKey;
          const localizedLabel = t.templates[labelKey] ?? tmpl.label;
          return (
            <button
              key={tmpl.id}
              onClick={() => {
                setTemplate(tmpl.id);
                setAccentColor(tmpl.defaultColors[0]);
              }}
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

      {/* Color swatches */}
      <div className="flex gap-2 px-0.5">
        {activeTmpl.defaultColors.map((color) => {
          const isActive = accentColor === color;
          return (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              title={color}
              style={{ backgroundColor: color }}
              className={`w-[18px] h-[18px] rounded-full flex-shrink-0 transition-all ${
                isActive ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900' : 'opacity-70 hover:opacity-100'
              }`}
            />
          );
        })}
      </div>

    </div>
  );
}
