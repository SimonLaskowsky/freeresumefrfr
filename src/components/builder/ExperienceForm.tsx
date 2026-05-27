'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import BulletList from './BulletList';
import { inputCls } from './shared';

export default function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();
  const { t } = useI18n();

  return (
    <SectionWrapper
      title={t.sections.experience}
      icon="💼"
      count={data.experience.length}
      tip={t.tips.experience}
      action={
        <button
          onClick={addExperience}
          className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addExperience.replace('+ ', '')}
        </button>
      }
    >
      {data.experience.length === 0 && (
        <p className="text-xs text-zinc-600 italic">{t.fields.noneExperience}</p>
      )}
      <div className="space-y-4">
        {data.experience.map((exp, i) => (
          <div key={exp.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{t.fields.positionLabel} {i + 1}</span>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                {t.actions.removeExperience}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder={t.fields.role}
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder={t.fields.company}
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder={t.fields.startDate}
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
              />
              <div className="space-y-1.5">
                <input
                  className={inputCls}
                  placeholder={t.fields.endDate}
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  disabled={exp.current}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-lime-400 w-3.5 h-3.5"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                  />
                  <span className="text-xs text-zinc-400">{t.fields.currentRole}</span>
                </label>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-zinc-600 mb-2">{t.fields.bulletPointsHint}</p>
              <BulletList
                bullets={exp.bullets}
                onChange={(bullets) => updateExperience(exp.id, { bullets })}
                placeholder={t.fields.bulletPlaceholder}
              />
            </div>
            <input
              className={inputCls}
              placeholder={`${t.fields.technologies} — ${t.fields.technologiesPlaceholder}`}
              value={exp.technologies ?? ''}
              onChange={(e) => updateExperience(exp.id, { technologies: e.target.value })}
            />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
