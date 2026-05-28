'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { inputCls } from './shared';
import PhotoUpload from './PhotoUpload';

export default function PersonalInfoForm() {
  const { data, updatePersonal, addPersonalLink, updatePersonalLink, removePersonalLink } = useResumeStore();
  const { t } = useI18n();
  const p = data.personal;
  const links = p.links ?? [];

  return (
    <SectionWrapper
      title={t.sections.personal}
      icon="👤"
      tip={t.tips.personal}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <PhotoUpload />
        </div>
        <div className="col-span-2">
          <input
            className={inputCls}
            placeholder={t.fields.name}
            value={p.name}
            onChange={(e) => updatePersonal({ name: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <input
            className={inputCls}
            placeholder={t.fields.jobTitle}
            value={p.title}
            onChange={(e) => updatePersonal({ title: e.target.value })}
          />
        </div>
        <input
          className={inputCls}
          placeholder={t.fields.email}
          type="email"
          value={p.email}
          onChange={(e) => updatePersonal({ email: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder={t.fields.phone}
          type="tel"
          value={p.phone}
          onChange={(e) => updatePersonal({ phone: e.target.value })}
        />
        <div className="col-span-2">
          <input
            className={inputCls}
            placeholder={t.fields.location}
            value={p.location}
            onChange={(e) => updatePersonal({ location: e.target.value })}
          />
        </div>
        <input
          className={inputCls}
          placeholder={t.fields.linkedin}
          value={p.linkedin}
          onChange={(e) => updatePersonal({ linkedin: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder={t.fields.website}
          value={p.website}
          onChange={(e) => updatePersonal({ website: e.target.value })}
        />
      </div>

      {/* Custom links */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">{t.fields.linkLabel}</span>
          <button
            onClick={addPersonalLink}
            className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1"
          >
            <span className="text-base leading-none">+</span> {t.actions.addLink}
          </button>
        </div>
        {links.map((link) => (
          <div key={link.id} className="flex gap-2 items-center">
            <input
              className={`${inputCls} w-28 shrink-0`}
              placeholder={t.fields.linkLabelPlaceholder}
              value={link.label}
              onChange={(e) => updatePersonalLink(link.id, { label: e.target.value })}
            />
            <input
              className={`${inputCls} flex-1 min-w-0`}
              placeholder={t.fields.linkUrl}
              value={link.url}
              onChange={(e) => updatePersonalLink(link.id, { url: e.target.value })}
            />
            <button
              onClick={() => removePersonalLink(link.id)}
              className="text-xs text-zinc-600 hover:text-red-400 transition-colors shrink-0"
            >
              {t.actions.removeLink}
            </button>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
