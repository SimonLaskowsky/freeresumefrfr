'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { inputCls } from './shared';
import PhotoUpload from './PhotoUpload';

export default function PersonalInfoForm() {
  const { data, updatePersonal } = useResumeStore();
  const { t } = useI18n();
  const p = data.personal;

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
    </SectionWrapper>
  );
}
