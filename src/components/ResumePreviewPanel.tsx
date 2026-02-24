'use client';

import { usePDF } from '@react-pdf/renderer';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getTemplate } from './templates';
import type { ResumeData } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  data: ResumeData;
  templateId: string;
}

type Slot = 'A' | 'B';

export default function ResumePreviewPanel({ data, templateId }: Props) {
  const { Component } = getTemplate(templateId);
  const { t, locale } = useI18n();

  const labels = {
    summary: t.sections.summary,
    experience: t.sections.experience,
    education: t.sections.education,
    skills: t.sections.skills,
    projects: t.sections.projects,
    certifications: t.sections.certifications,
    contact: t.sections.contact,
  };

  // Keep labels in a ref so the effect always uses the latest without
  // being in the dependency array (avoids stalling usePDF mid-render)
  const labelsRef = useRef(labels);
  labelsRef.current = labels;

  const [instance, update] = usePDF({ document: <Component data={data} labels={labels} /> });
  const updateRef = useRef(update);
  updateRef.current = update;

  // Use `locale` (string) rather than `t` (object) as the language trigger —
  // same semantics but a stable primitive that won't cause double-fires
  useEffect(() => {
    updateRef.current(<Component data={data} labels={labelsRef.current} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, templateId, locale]);

  // Committed URL — only advances once rendering is done
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!instance.loading && instance.url) setPdfUrl(instance.url);
  }, [instance.loading, instance.url]);

  // ── Double-slot setup ─────────────────────────────────────────────────────
  // Two Document slots mount side-by-side. When a new URL arrives, load it
  // into the hidden slot. Only flip it to the front AFTER its first page
  // fires onRenderSuccess — canvas is already painted, nothing to flash.

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
      // First PDF — just load into slot A and show immediately
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

  // Called when page 1 of a slot finishes painting to canvas
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

  // ── Shared slot renderer ──────────────────────────────────────────────────
  function renderSlot(slot: Slot, url: string | null, numPages: number) {
    if (!url || width === 0) return null;
    return (
      <div
        key={slot}
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          // Render below but keep visible so canvas stays painted; only the
          // front slot is interactive and visible to the user
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
              // Only need page 1's render to confirm the slot is ready
              onRenderSuccess={i === 0 ? () => handleRenderSuccess(slot) : undefined}
            />
          ))}
        </Document>
      </div>
    );
  }

  if (instance.error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 text-sm px-6 text-center">
        Preview error — try switching templates or refreshing.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-zinc-800">
      {!pdfUrl && (
        <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
          {t.builder.generatingPreview}
        </div>
      )}

      {renderSlot('A', urlA, numPagesA)}
      {renderSlot('B', urlB, numPagesB)}

      {instance.loading && pdfUrl && (
        <div className="absolute bottom-3 right-3 pointer-events-none z-20">
          <span className="text-[10px] text-zinc-500 bg-zinc-900/90 px-2 py-1 rounded-full animate-pulse">
            {t.builder.updating}
          </span>
        </div>
      )}
    </div>
  );
}
