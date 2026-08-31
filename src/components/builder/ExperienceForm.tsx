'use client';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import BulletList from './BulletList';
import { SortableItem } from './SortableItem';
import { inputCls } from './shared';

export default function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience, reorderExperience } = useResumeStore();
  const { t } = useI18n();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.experience.findIndex((e) => e.id === active.id);
    const newIndex = data.experience.findIndex((e) => e.id === over.id);
    reorderExperience(arrayMove(data.experience, oldIndex, newIndex));
  }

  return (
    <SectionWrapper
      title={t.sections.experience}

      count={data.experience.length}
      tip={t.tips.experience}
      action={
        <button
          onClick={addExperience}
          className="text-xs font-semibold text-lime-700 hover:text-lime-600 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addExperience.replace('+ ', '')}
        </button>
      }
    >
      {data.experience.length === 0 && (
        <p className="text-xs text-zinc-400 italic">{t.fields.noneExperience}</p>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <SortableItem key={exp.id} id={exp.id}>
                {(handle) => (
                  <div className="bg-white/60 border border-zinc-900/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {handle}
                        <span className="text-xs text-zinc-500">{t.fields.positionLabel} {i + 1}</span>
                      </div>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
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
                          <span className="text-xs text-zinc-600">{t.fields.currentRole}</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-400 mb-2">{t.fields.bulletPointsHint}</p>
                      <BulletList
                        bullets={exp.bullets}
                        onChange={(bullets) => updateExperience(exp.id, { bullets })}
                        placeholder={t.fields.bulletPlaceholder}
                      />
                    </div>
                    <input
                      className={inputCls}
                      placeholder={`${t.fields.technologies}: ${t.fields.technologiesPlaceholder}`}
                      value={exp.technologies ?? ''}
                      onChange={(e) => updateExperience(exp.id, { technologies: e.target.value })}
                    />
                  </div>
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </SectionWrapper>
  );
}
