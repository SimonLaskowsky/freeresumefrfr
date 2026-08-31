'use client';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { SortableItem } from './SortableItem';
import { inputCls } from './shared';

export default function LanguagesForm() {
  const { data, addLanguage, updateLanguage, removeLanguage, reorderLanguages } = useResumeStore();
  const { t } = useI18n();
  const languages = data.languages ?? [];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = languages.findIndex((l) => l.id === active.id);
    const newIndex = languages.findIndex((l) => l.id === over.id);
    reorderLanguages(arrayMove(languages, oldIndex, newIndex));
  }

  return (
    <SectionWrapper
      title={t.sections.languages}

      count={languages.length}
      tip={t.tips.languages}
      action={
        <button
          onClick={addLanguage}
          className="text-xs font-semibold text-lime-700 hover:text-lime-600 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addLanguage.replace('+ ', '')}
        </button>
      }
    >
      {languages.length === 0 && (
        <p className="text-xs text-zinc-400 italic">{t.fields.noneLanguages}</p>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={languages.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {languages.map((lang, i) => (
              <SortableItem key={lang.id} id={lang.id}>
                {(handle) => (
                  <div className="bg-white/60 border border-zinc-900/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {handle}
                        <span className="text-xs text-zinc-500">{t.fields.langLabel} {i + 1}</span>
                      </div>
                      <button
                        onClick={() => removeLanguage(lang.id)}
                        className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
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
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </SectionWrapper>
  );
}
