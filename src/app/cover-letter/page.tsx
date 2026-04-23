'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { useCoverLetterStore } from '@/store/coverLetterStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useI18n } from '@/i18n/I18nContext';
import { COVER_LETTER_TEMPLATES, getCoverLetterTemplate } from '@/components/cover-letter-templates';
import CoverLetterForm from '@/components/cover-letter/CoverLetterForm';

const CoverLetterPreviewPanel = dynamic(() => import('@/components/CoverLetterPreviewPanel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
      Loading preview...
    </div>
  ),
});

const DownloadCoverLetterButton = dynamic(() => import('@/components/DownloadCoverLetterButton'), {
  ssr: false,
  loading: () => (
    <div className="w-full py-3 bg-zinc-700 text-zinc-500 font-bold rounded-lg text-sm text-center">
      Loading...
    </div>
  ),
});

export default function CoverLetterPage() {
  const data = useCoverLetterStore((s) => s.data);
  const templateId = useCoverLetterStore((s) => s.templateId);
  const setTemplate = useCoverLetterStore((s) => s.setTemplate);
  const loadSampleData = useCoverLetterStore((s) => s.loadSampleData);
  const resetData = useCoverLetterStore((s) => s.resetData);
  const accentColor = useCoverLetterStore((s) => s.accentColor);
  const setAccentColor = useCoverLetterStore((s) => s.setAccentColor);
  const debouncedData = useDebounce(data, 600);
  const { t } = useI18n();

  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
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
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-white overflow-hidden">

      {/* ── Mobile tab bar ──────────────────────────────────────── */}
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

      {/* ── Left panel — form ─────────────────────────────────── */}
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
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 truncate">
              {t.coverLetter.pageTitle}
            </span>
            <Link
              href="/builder"
              className="text-[11px] text-zinc-400 hover:text-lime-400 transition-colors font-medium flex-shrink-0 whitespace-nowrap"
            >
              Resume →
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
            >
              {resetState === 'confirm' ? t.builder.resetConfirm : t.builder.reset}
            </button>
            <span className="text-zinc-600">·</span>
            <span className="text-[11px] text-zinc-500">{t.builder.saved}</span>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <CoverLetterForm />
          <div className="h-8" />
        </div>
      </div>

      {/* ── Right panel — template + preview + download ───── */}
      <div
        className={`md:flex-1 flex flex-col bg-zinc-900 min-w-0 ${
          mobileTab === 'preview' ? 'flex flex-1' : 'hidden md:flex'
        }`}
      >
        {/* Template picker + page size toggle */}
        <div className="px-4 py-3 border-b border-zinc-800 flex-shrink-0 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex gap-1.5 overflow-x-auto py-0.5">
              {COVER_LETTER_TEMPLATES.map((tmpl) => {
                const active = templateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setTemplate(tmpl.id);
                      setAccentColor(tmpl.defaultColors[0]);
                    }}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      active
                        ? 'bg-lime-400 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {tmpl.name}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 px-0.5">
              {getCoverLetterTemplate(templateId).defaultColors.map((color) => {
                const isActive = accentColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    title={color}
                    style={{ backgroundColor: color }}
                    className={`w-[18px] h-[18px] rounded-full flex-shrink-0 transition-all ${
                      isActive ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* PDF viewer */}
        <div className="flex-1 min-h-0">
          <CoverLetterPreviewPanel data={debouncedData} templateId={templateId} accentColor={accentColor} />
        </div>

        {/* Download */}
        <div className="px-5 py-4 border-t border-zinc-800 flex-shrink-0">
          <DownloadCoverLetterButton data={debouncedData} templateId={templateId} accentColor={accentColor} />
          <p className="text-center text-[11px] text-zinc-700 mt-2">
            {t.builder.noAccountWatermark}
          </p>
        </div>
      </div>
    </div>
  );
}
