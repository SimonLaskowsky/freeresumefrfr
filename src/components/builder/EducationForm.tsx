'use client';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { SortableItem } from './SortableItem';
import { inputCls, textareaCls } from './shared';

export default function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation, reorderEducation } = useResumeStore();
  const { t } = useI18n();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.education.findIndex((e) => e.id === active.id);
    const newIndex = data.education.findIndex((e) => e.id === over.id);
    reorderEducation(arrayMove(data.education, oldIndex, newIndex));
  }

  return (
    <SectionWrapper
      title={t.sections.education}

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
        <p className="text-xs text-zinc-600 italic">{t.fields.noneEducation}</p>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <SortableItem key={edu.id} id={edu.id}>
                {(handle) => (
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {handle}
                        <span className="text-xs text-zinc-500">{t.fields.entryLabel} {i + 1}</span>
                      </div>
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
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </SectionWrapper>
  );
}
