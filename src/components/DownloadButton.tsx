'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { getTemplate } from './templates';
import type { ResumeData } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';

interface Props {
  data: ResumeData;
  templateId: string;
}

function incrementPaywallsDodged() {
  try {
    const count = parseInt(localStorage.getItem('paywalls_dodged') || '0', 10);
    localStorage.setItem('paywalls_dodged', String(count + 1));
  } catch {
    // localStorage unavailable
  }
}

export default function DownloadButton({ data, templateId }: Props) {
  const { Component } = getTemplate(templateId);
  const { t } = useI18n();
  const fileName = `${
    data.personal.name ? data.personal.name.toLowerCase().replace(/\s+/g, '-') : 'resume'
  }.pdf`;

  const labels = {
    summary: t.sections.summary,
    experience: t.sections.experience,
    education: t.sections.education,
    skills: t.sections.skills,
    projects: t.sections.projects,
    certifications: t.sections.certifications,
    contact: t.sections.contact,
  };

  return (
    <PDFDownloadLink
      document={<Component data={data} labels={labels} />}
      fileName={fileName}
      onClick={incrementPaywallsDodged}
      className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold rounded-lg transition-colors text-sm"
    >
      {({ loading }) =>
        loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
            {t.download.preparing}
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12L3 7h3V2h4v5h3L8 12z" />
              <rect x="2" y="13" width="12" height="1.5" rx="0.75" />
            </svg>
            {t.download.button}
          </>
        )
      }
    </PDFDownloadLink>
  );
}
