'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { inputCls } from './shared';

export default function LanguagesForm() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useResumeStore();
  const { t } = useI18n();
  const languages = data.languages ?? [];

  return (
    <SectionWrapper
      title={t.sections.languages}
      icon="🌐"
      count={languages.length}
      tip={t.tips.languages}
      action={
        <button
          onClick={addLanguage}
          className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addLanguage.replace('+ ', '')}
        </button>
      }
    >
      {languages.length === 0 && (
        <p className="text-xs text-zinc-600 italic">{t.fields.noneLanguages}</p>
      )}
      <div className="space-y-3">
        {languages.map((lang, i) => (
          <div key={lang.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{t.fields.langLabel} {i + 1}</span>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                {t.actions.removeLanguage}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder={t.fields.langName}
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder={t.fields.langLevelPlaceholder}
                value={lang.level}
                onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
