'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import { inputCls } from './shared';

export default function CertificationsForm() {
  const { data, addCertification, updateCertification, removeCertification } = useResumeStore();
  const { t } = useI18n();

  return (
    <SectionWrapper
      title={t.sections.certifications}
      icon="✪"
      count={data.certifications.length}
      tip={t.tips.certifications}
      action={
        <button
          onClick={addCertification}
          className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addCertification.replace('+ ', '')}
        </button>
      }
    >
      {data.certifications.length === 0 && (
        <p className="text-xs text-zinc-600 italic">{t.fields.noneCertifications}</p>
      )}
      <div className="space-y-3">
        {data.certifications.map((cert, i) => (
          <div key={cert.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{t.fields.certLabel} {i + 1}</span>
              <button
                onClick={() => removeCertification(cert.id)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
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
        ))}
      </div>
    </SectionWrapper>
  );
}
