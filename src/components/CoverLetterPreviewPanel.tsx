'use client';

import { usePDF } from '@react-pdf/renderer';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getCoverLetterTemplate } from './cover-letter-templates';
import type { CoverLetterData } from '@/store/coverLetterStore';
import { useI18n } from '@/i18n/I18nContext';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  data: CoverLetterData;
  templateId: string;
  accentColor: string;
}

type Slot = 'A' | 'B';

export default function CoverLetterPreviewPanel({ data, templateId, accentColor }: Props) {
  const { Component } = getCoverLetterTemplate(templateId);
  const { t, locale } = useI18n();

  const labels = {
    hiringManager: t.coverLetter.hiringManager,
    reSubject: t.coverLetter.reSubject,
  };
  const labelsRef = useRef(labels);
  labelsRef.current = labels;

  const [instance, update] = usePDF({ document: <Component data={data} labels={labels} accentColor={accentColor} /> });
  const updateRef = useRef(update);
  updateRef.current = update;

  useEffect(() => {
    updateRef.current(<Component data={data} labels={labelsRef.current} accentColor={accentColor} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, templateId, locale, accentColor]);

  // Committed URL: only advances once rendering is done
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!instance.loading && instance.url) setPdfUrl(instance.url);
  }, [instance.loading, instance.url]);

  // ── Double-slot setup ─────────────────────────────────────────────────────
  const [urlA, setUrlA] = useState<string | null>(null);
  const [urlB, setUrlB] = useState<string | null>(null);
  const [numPagesA, setNumPagesA] = useState(0);
  const [numPagesB, setNumPagesB] = useState(0);

  const [front, setFront] = useState<Slot>('A');
  const frontRef = useRef<Slot>('A');
  const pendingSlot = useRef<Slot | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!pdfUrl) return;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      setUrlA(pdfUrl);
      pendingSlot.current = 'A';
      return;
    }

    const back: Slot = frontRef.current === 'A' ? 'B' : 'A';
    pendingSlot.current = back;
    if (back === 'A') setUrlA(pdfUrl);
    else setUrlB(pdfUrl);
  }, [pdfUrl]);

  function handleRenderSuccess(slot: Slot) {
    if (slot !== pendingSlot.current) return;
    frontRef.current = slot;
    setFront(slot);
    pendingSlot.current = null;
  }

  // ── Container width for page scaling ─────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => setWidth(e[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function renderSlot(slot: Slot, url: string | null, numPages: number) {
    if (!url || width === 0) return null;
    return (
      <div
        key={slot}
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          zIndex: front === slot ? 1 : 0,
          visibility: front === slot ? 'visible' : 'hidden',
        }}
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages: n }) =>
            slot === 'A' ? setNumPagesA(n) : setNumPagesB(n)
          }
          loading={null}
          error={null}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={width}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading={null}
              onRenderSuccess={i === 0 ? () => handleRenderSuccess(slot) : undefined}
            />
          ))}
        </Document>
      </div>
    );
  }

  if (instance.error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm px-6 text-center">
        Preview error: try switching templates or refreshing.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-zinc-900/5">
      {!pdfUrl && (
        <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
          {t.builder.generatingPreview}
        </div>
      )}

      {renderSlot('A', urlA, numPagesA)}
      {renderSlot('B', urlB, numPagesB)}

      {instance.loading && pdfUrl && (
        <div className="absolute bottom-3 right-3 pointer-events-none z-20">
          <span className="text-[10px] text-zinc-500 bg-white/85 px-2 py-1 rounded-full animate-pulse">
            {t.builder.updating}
          </span>
        </div>
      )}
    </div>
  );
}
