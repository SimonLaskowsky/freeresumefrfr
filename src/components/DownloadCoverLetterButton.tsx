'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { getCoverLetterTemplate } from './cover-letter-templates';
import type { CoverLetterData } from '@/store/coverLetterStore';
import { useI18n } from '@/i18n/I18nContext';

interface Props {
  data: CoverLetterData;
  templateId: string;
}

export default function DownloadCoverLetterButton({ data, templateId }: Props) {
  const { Component } = getCoverLetterTemplate(templateId);
  const { t } = useI18n();

  const labels = {
    hiringManager: t.coverLetter.hiringManager,
    reSubject: t.coverLetter.reSubject,
  };

  return (
    <PDFDownloadLink
      document={<Component data={data} labels={labels} />}
      fileName="cover-letter.pdf"
      className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black rounded-xl transition-all text-sm active:scale-[0.98]"
      style={{ boxShadow: '0 0 28px rgba(163,230,53,0.35), 0 0 60px rgba(163,230,53,0.1)' }}
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
