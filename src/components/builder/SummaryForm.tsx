'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { textareaCls } from './shared';

export default function SummaryForm() {
  const { data, updateSummary } = useResumeStore();
  const { t } = useI18n();

  return (
    <SectionWrapper
      title={t.sections.summary}

      tip={t.tips.summary}
    >
      <textarea
        className={`${textareaCls} h-[72px]`}
        placeholder={t.fields.summaryPlaceholder}
        value={data.summary}
        onChange={(e) => updateSummary(e.target.value)}
      />
      <p className="text-[11px] text-zinc-400 mt-1.5">{t.fields.summaryOptional}</p>
    </SectionWrapper>
  );
}
