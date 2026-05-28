'use client';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { SortableItem } from './SortableItem';
import { inputCls } from './shared';

export default function SkillsForm() {
  const { data, addSkillGroup, updateSkillGroup, removeSkillGroup, reorderSkillGroups } = useResumeStore();
  const { t } = useI18n();
  const groups = data.skillGroups ?? [];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = groups.findIndex((g) => g.id === active.id);
    const newIndex = groups.findIndex((g) => g.id === over.id);
    reorderSkillGroups(arrayMove(groups, oldIndex, newIndex));
  }

  return (
    <SectionWrapper
      title={t.sections.skills}
      icon="⚡"
      tip={t.tips.skills}
      count={groups.length}
      action={
        <button
          onClick={addSkillGroup}
          className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addSkillGroup.replace('+ ', '')}
        </button>
      }
    >
      {groups.length === 0 && (
        <p className="text-xs text-zinc-600 italic">{t.fields.skillsPlaceholder}</p>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={groups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {groups.map((group) => (
              <SortableItem key={group.id} id={group.id}>
                {(handle) => (
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        {handle}
                        <input
                          className={`${inputCls} text-xs font-semibold uppercase tracking-wide`}
                          placeholder={t.fields.skillCategory}
                          value={group.category}
                          onChange={(e) => updateSkillGroup(group.id, { category: e.target.value })}
                        />
                      </div>
                      <button
                        onClick={() => removeSkillGroup(group.id)}
                        className="ml-2 text-xs text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                      >
                        {t.actions.removeSkillGroup}
                      </button>
                    </div>
                    <input
                      className={inputCls}
                      placeholder={t.fields.skillsPlaceholder}
                      value={group.items}
                      onChange={(e) => updateSkillGroup(group.id, { items: e.target.value })}
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
