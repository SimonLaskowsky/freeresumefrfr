'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { textareaCls } from './shared';

export default function ClauseForm() {
  const { data, updateRodoClause } = useResumeStore();
  const { t } = useI18n();

  return (
    <SectionWrapper
      title={t.clause.title}

      action={
        !data.rodoClause?.trim() ? (
          <button
            onClick={() => updateRodoClause(t.clause.defaultText)}
            className="text-xs font-semibold text-lime-700 hover:text-lime-600 transition-colors flex items-center gap-1"
          >
            <span className="text-base leading-none">+</span> {t.clause.insertDefault}
          </button>
        ) : undefined
      }
    >
      <textarea
        className={`${textareaCls} h-[88px]`}
        placeholder={t.clause.defaultText}
        value={data.rodoClause ?? ''}
        onChange={(e) => updateRodoClause(e.target.value)}
      />
      <p className="text-[11px] text-zinc-400 mt-1.5">{t.clause.hint}</p>
    </SectionWrapper>
  );
}
