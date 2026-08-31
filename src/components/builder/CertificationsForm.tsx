'use client';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { SortableItem } from './SortableItem';
import { inputCls } from './shared';

export default function CertificationsForm() {
  const { data, addCertification, updateCertification, removeCertification, reorderCertifications } = useResumeStore();
  const { t } = useI18n();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.certifications.findIndex((c) => c.id === active.id);
    const newIndex = data.certifications.findIndex((c) => c.id === over.id);
    reorderCertifications(arrayMove(data.certifications, oldIndex, newIndex));
  }

  return (
    <SectionWrapper
      title={t.sections.certifications}

      count={data.certifications.length}
      tip={t.tips.certifications}
      action={
        <button
          onClick={addCertification}
          className="text-xs font-semibold text-lime-700 hover:text-lime-600 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addCertification.replace('+ ', '')}
        </button>
      }
    >
      {data.certifications.length === 0 && (
        <p className="text-xs text-zinc-400 italic">{t.fields.noneCertifications}</p>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.certifications.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {data.certifications.map((cert, i) => (
              <SortableItem key={cert.id} id={cert.id}>
                {(handle) => (
                  <div className="bg-white/60 border border-zinc-900/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {handle}
                        <span className="text-xs text-zinc-500">{t.fields.certLabel} {i + 1}</span>
                      </div>
                      <button
                        onClick={() => removeCertification(cert.id)}
                        className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        {t.actions.removeCertification}
                      </button>
                    </div>
                    <input
                      className={inputCls}
                      placeholder={t.fields.certName}
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputCls}
                        placeholder={t.fields.issuer}
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                      />
                      <input
                        className={inputCls}
                        placeholder={t.fields.date}
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
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
