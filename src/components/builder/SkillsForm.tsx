'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { textareaCls } from './shared';

export default function SkillsForm() {
  const { data, updateSkills } = useResumeStore();
  const { t } = useI18n();

  return (
    <SectionWrapper
      title={t.sections.skills}
      icon="⚡"
      tip={t.tips.skills}
    >
      <textarea
        className={`${textareaCls} h-20`}
        placeholder={t.fields.skillsPlaceholder}
        value={data.skills}
        onChange={(e) => updateSkills(e.target.value)}
      />
      <p className="text-[11px] text-zinc-600 mt-1.5">Comma-separated. Most relevant first.</p>
    </SectionWrapper>
  );
}
