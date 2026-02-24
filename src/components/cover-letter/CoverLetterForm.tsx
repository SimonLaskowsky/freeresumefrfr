'use client';

import { useCoverLetterStore } from '@/store/coverLetterStore';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from '@/components/builder/SectionWrapper';
import { inputCls, textareaCls } from '@/components/builder/shared';

export default function CoverLetterForm() {
  const { data, updateField, syncFromResume } = useCoverLetterStore();
  const resumePersonal = useResumeStore((s) => s.data.personal);
  const { t } = useI18n();
  const cl = t.coverLetter;

  return (
    <div className="space-y-5">
      {/* Sender Info */}
      <SectionWrapper title={cl.senderSection} icon="✍️">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex gap-2">
            <input
              className={inputCls}
              placeholder={t.fields.name}
              value={data.senderName}
              onChange={(e) => updateField('senderName', e.target.value)}
            />
            <button
              onClick={() => syncFromResume(resumePersonal)}
              className="flex-shrink-0 text-[11px] text-zinc-500 hover:text-lime-400 transition-colors font-medium whitespace-nowrap border border-zinc-700/60 rounded-lg px-3 py-2"
              title={cl.syncFromResume}
            >
              {cl.syncFromResume}
            </button>
          </div>
          <input
            className={inputCls}
            placeholder={t.fields.email}
            type="email"
            value={data.senderEmail}
            onChange={(e) => updateField('senderEmail', e.target.value)}
          />
          <input
            className={inputCls}
            placeholder={t.fields.phone}
            type="tel"
            value={data.senderPhone}
            onChange={(e) => updateField('senderPhone', e.target.value)}
          />
          <div className="col-span-2">
            <input
              className={inputCls}
              placeholder={t.fields.location}
              value={data.senderLocation}
              onChange={(e) => updateField('senderLocation', e.target.value)}
            />
          </div>
        </div>
      </SectionWrapper>

      <div className="border-t border-zinc-800/60" />

      {/* Recipient */}
      <SectionWrapper title={cl.recipientSection} icon="🏢">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <input
              className={inputCls}
              placeholder={cl.companyName}
              value={data.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
            />
          </div>
          <input
            className={inputCls}
            placeholder={cl.recipientName}
            value={data.recipientName}
            onChange={(e) => updateField('recipientName', e.target.value)}
          />
          <input
            className={inputCls}
            placeholder={cl.recipientTitle}
            value={data.recipientTitle}
            onChange={(e) => updateField('recipientTitle', e.target.value)}
          />
        </div>
      </SectionWrapper>

      <div className="border-t border-zinc-800/60" />

      {/* Letter details */}
      <SectionWrapper title={cl.letterSection} icon="📋">
        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputCls}
            placeholder={cl.dateField}
            value={data.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
          <input
            className={inputCls}
            placeholder={cl.jobTitleField}
            value={data.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
          />
          <div className="col-span-2">
            <input
              className={inputCls}
              placeholder={cl.salutationPlaceholder}
              value={data.salutation}
              onChange={(e) => updateField('salutation', e.target.value)}
            />
            <p className="text-[11px] text-zinc-600 mt-1.5 px-0.5">{cl.salutationLabel}</p>
          </div>
        </div>
      </SectionWrapper>

      <div className="border-t border-zinc-800/60" />

      {/* Body */}
      <SectionWrapper title="Body" icon="📝">
        <div className="space-y-3">
          <textarea
            className={`${textareaCls} min-h-[90px]`}
            placeholder={cl.openingPlaceholder}
            value={data.opening}
            onChange={(e) => updateField('opening', e.target.value)}
            rows={4}
          />
          <textarea
            className={`${textareaCls} min-h-[90px]`}
            placeholder={cl.bodyPlaceholder}
            value={data.body}
            onChange={(e) => updateField('body', e.target.value)}
            rows={4}
          />
          <textarea
            className={`${textareaCls} min-h-[90px]`}
            placeholder={cl.closingPlaceholder}
            value={data.closing}
            onChange={(e) => updateField('closing', e.target.value)}
            rows={3}
          />
        </div>
      </SectionWrapper>

      <div className="border-t border-zinc-800/60" />

      {/* Sign-off */}
      <SectionWrapper title={cl.signOffLabel} icon="✒️">
        <input
          className={inputCls}
          placeholder={cl.signOffLabel}
          value={data.signOff}
          onChange={(e) => updateField('signOff', e.target.value)}
        />
      </SectionWrapper>
    </div>
  );
}
