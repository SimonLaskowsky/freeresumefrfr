'use client';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import BulletList from './BulletList';
import { SortableItem } from './SortableItem';
import { inputCls } from './shared';

export default function ProjectsForm() {
  const { data, addProject, updateProject, removeProject, reorderProjects } = useResumeStore();
  const { t } = useI18n();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.projects.findIndex((p) => p.id === active.id);
    const newIndex = data.projects.findIndex((p) => p.id === over.id);
    reorderProjects(arrayMove(data.projects, oldIndex, newIndex));
  }

  return (
    <SectionWrapper
      title={t.sections.projects}
      icon="⬡"
      count={data.projects.length}
      tip={t.tips.projects}
      action={
        <button
          onClick={addProject}
          className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addProject.replace('+ ', '')}
        </button>
      }
    >
      {data.projects.length === 0 && (
        <p className="text-xs text-zinc-600 italic">{t.fields.noneProjects}</p>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <SortableItem key={proj.id} id={proj.id}>
                {(handle) => (
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {handle}
                        <span className="text-xs text-zinc-500">{t.fields.projectLabel} {i + 1}</span>
                      </div>
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        {t.actions.removeProject}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputCls}
                        placeholder={t.fields.projectName}
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      />
                      <input
                        className={inputCls}
                        placeholder={t.fields.url}
                        value={proj.url}
                        onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                      />
                    </div>
                    <input
                      className={inputCls}
                      placeholder={t.fields.description}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    />
                    <div>
                      <p className="text-[11px] text-zinc-600 mb-2">{t.fields.highlightsHint}</p>
                      <BulletList
                        bullets={proj.bullets}
                        onChange={(bullets) => updateProject(proj.id, { bullets })}
                        placeholder={t.fields.bulletPlaceholder}
                      />
                    </div>
                    <input
                      className={inputCls}
                      placeholder={`${t.fields.technologies} — ${t.fields.technologiesPlaceholder}`}
                      value={proj.technologies ?? ''}
                      onChange={(e) => updateProject(proj.id, { technologies: e.target.value })}
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
