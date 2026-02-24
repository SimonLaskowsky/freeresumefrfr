'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { inputCls, textareaCls } from './shared';

export default function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore();
  const { t } = useI18n();

  return (
    <SectionWrapper
      title={t.sections.education}
      icon="🎓"
      count={data.education.length}
      tip={t.tips.education}
      action={
        <button
          onClick={addEducation}
          className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addEducation.replace('+ ', '')}
        </button>
      }
    >
      {data.education.length === 0 && (
        <p className="text-xs text-zinc-600 italic">No education added yet.</p>
      )}
      <div className="space-y-4">
        {data.education.map((edu, i) => (
          <div key={edu.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Entry {i + 1}</span>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                {t.actions.removeEducation}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder={t.fields.degree}
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder={t.fields.school}
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder={t.fields.startDate}
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder={t.fields.endDate}
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
              />
            </div>
            <textarea
              className={`${textareaCls} h-14`}
              placeholder={t.fields.notes}
              value={edu.notes}
              onChange={(e) => updateEducation(edu.id, { notes: e.target.value })}
            />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
