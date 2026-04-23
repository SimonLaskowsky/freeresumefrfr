'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { useResumeStore, sampleData } from '@/store/resumeStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useI18n } from '@/i18n/I18nContext';
import SummaryForm from '@/components/builder/SummaryForm';
import PersonalInfoForm from '@/components/builder/PersonalInfoForm';
import ExperienceForm from '@/components/builder/ExperienceForm';
import EducationForm from '@/components/builder/EducationForm';
import ProjectsForm from '@/components/builder/ProjectsForm';
import CertificationsForm from '@/components/builder/CertificationsForm';
import SkillsForm from '@/components/builder/SkillsForm';
import TemplatePicker from '@/components/TemplatePicker';
import CompletenessScore from '@/components/CompletenessScore';

const ResumePreviewPanel = dynamic(() => import('@/components/ResumePreviewPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
      Loading preview...
    </div>
  ),
});

const DownloadButton = dynamic(() => import('@/components/DownloadButton'), {
  ssr: false,
  loading: () => (
    <div className="w-full py-3 bg-zinc-700 text-zinc-500 font-bold rounded-lg text-sm text-center">
      Loading...
    </div>
  ),
});

const DIVIDER = <div className="border-t border-zinc-800/60" />;

export default function BuilderPage() {
  const data = useResumeStore((state) => state.data);
  const templateId = useResumeStore((state) => state.templateId);
  const accentColor = useResumeStore((state) => state.accentColor);
  const loadSampleData = useResumeStore((state) => state.loadSampleData);
  const resetData = useResumeStore((state) => state.resetData);
  const debouncedData = useDebounce(data, 600);

  const isExampleMode =
    !debouncedData.personal.name.trim() &&
    !debouncedData.summary.trim() &&
    debouncedData.experience.length === 0 &&
    debouncedData.education.length === 0;

  const previewData = isExampleMode ? sampleData : debouncedData;
  const { t } = useI18n();

  // Mobile tab state
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  // Reset confirm: null = idle, 'confirm' = waiting second click
  const [resetState, setResetState] = useState<'idle' | 'confirm'>('idle');

  function handleReset() {
    if (resetState === 'idle') {
      setResetState('confirm');
      setTimeout(() => setResetState('idle'), 3000);
    } else {
      resetData();
      setResetState('idle');
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-white">

      {/* ── Mobile tab bar ──────────────────────────────────── */}
      <div className="md:hidden flex border-b border-zinc-800 flex-shrink-0">
        {(['form', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
              mobileTab === tab
                ? 'text-lime-400 border-b-2 border-lime-400 -mb-px'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab === 'form' ? '✏ Edit' : '👁 Preview'}
          </button>
        ))}
      </div>

      {/* ── Left panel — form ─────────────────────────────── */}
      <div
        className={`md:w-[48%] flex flex-col border-zinc-800 md:border-r min-w-0 ${
          mobileTab === 'form' ? 'flex flex-1' : 'hidden md:flex'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col border-b border-zinc-800 flex-shrink-0">
          {/* Row 1: nav */}
          <div className="flex items-center justify-between px-4 pt-2.5 pb-1.5 gap-3">
            <Link href="/" className="text-sm font-bold text-lime-400 hover:text-lime-300 transition-colors flex-shrink-0">
              ← frfr
            </Link>
            <CompletenessScore />
            <Link href="/cover-letter" className="text-[11px] text-zinc-400 hover:text-lime-400 transition-colors font-medium flex-shrink-0 whitespace-nowrap">
              Cover Letter →
            </Link>
          </div>
          {/* Row 2: actions */}
          <div className="flex items-center justify-end gap-2 px-4 pb-2">
            <button
              onClick={loadSampleData}
              className="text-[11px] text-zinc-400 hover:text-lime-400 transition-colors font-medium whitespace-nowrap"
              title="Fill with example data"
            >
              {t.builder.fillExample}
            </button>
            <span className="text-zinc-600">·</span>
            <button
              onClick={handleReset}
              className={`text-[11px] transition-colors font-medium whitespace-nowrap ${
                resetState === 'confirm'
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Clear all data"
            >
              {resetState === 'confirm' ? t.builder.resetConfirm : t.builder.reset}
            </button>
            <span className="text-zinc-600">·</span>
            <span className="text-[11px] text-zinc-500">{t.builder.saved}</span>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <SummaryForm />
          {DIVIDER}
          <PersonalInfoForm />
          {DIVIDER}
          <ExperienceForm />
          {DIVIDER}
          <EducationForm />
          {DIVIDER}
          <ProjectsForm />
          {DIVIDER}
          <CertificationsForm />
          {DIVIDER}
          <SkillsForm />
          <div className="h-8" />
        </div>
      </div>

      {/* ── Right panel — template + preview + download ───── */}
      <div
        className={`md:flex-1 flex flex-col bg-zinc-900 min-w-0 ${
          mobileTab === 'preview' ? 'flex flex-1' : 'hidden md:flex'
        }`}
      >
        {/* Template picker */}
        <div className="px-4 py-3 border-b border-zinc-800 flex-shrink-0">
          <TemplatePicker />
        </div>

        {/* PDF viewer */}
        <div className="flex-1 min-h-0 relative">
          <ResumePreviewPanel data={previewData} templateId={templateId} accentColor={accentColor} />
          {isExampleMode && (
            <div className="absolute top-3 inset-x-0 flex justify-center z-10 pointer-events-none">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 border border-zinc-700/50 rounded-full text-[11px] text-zinc-500 font-mono backdrop-blur-sm whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block" />
                example · start typing to replace
              </div>
            </div>
          )}
        </div>

        {/* Download */}
        <div className="px-5 py-4 border-t border-zinc-800 flex-shrink-0">
          <DownloadButton data={previewData} templateId={templateId} accentColor={accentColor} />
          <p className="text-center text-[11px] text-zinc-700 mt-2">
            {t.builder.noAccountWatermark}
          </p>
        </div>
      </div>
    </div>
  );
}
