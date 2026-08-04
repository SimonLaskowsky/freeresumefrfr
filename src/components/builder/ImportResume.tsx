'use client';

import { useRef, useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { parseResumeText, isEmptyParse, textFromPages, type Box } from '@/lib/parseResume';

const MAX_BYTES = 15 * 1024 * 1024;

/**
 * Text from a PDF. Columns are detected and emitted one after another, never
 * interleaved: the parser does not care about section order, but it does care
 * that a sidebar is not shuffled into the middle of the job history.
 */
async function pdfToText(file: File): Promise<string> {
  const { pdfjs } = await import('react-pdf');
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: Box[][] = [];
  const urls = new Set<string>();

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    pages.push(content.items.flatMap((item) =>
      'str' in item && item.str.trim()
        ? [{ x: item.transform[4], y: Math.round(item.transform[5]), w: item.width, s: item.str }]
        : []));
    // Sidebar links are often a label ("GitHub") with the URL only in the annotation.
    for (const a of await page.getAnnotations()) {
      if (typeof a.url === 'string' && a.url) urls.add(a.url);
    }
  }
  return textFromPages(pages, [...urls]);
}

export default function ImportResume() {
  const data = useResumeStore((s) => s.data);
  const setData = useResumeStore((s) => s.setData);
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ kind: 'busy' | 'done' | 'error'; text: string } | null>(null);
  const [over, setOver] = useState(false);

  const hasData = !!(data.personal.name.trim() || data.summary.trim() || data.experience.length || data.education.length);

  async function handleFile(file: File) {
    if (file.size > MAX_BYTES) return setStatus({ kind: 'error', text: 'That file is over 15MB' });
    setStatus({ kind: 'busy', text: 'Reading your CV…' });
    try {
      const text = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        ? await pdfToText(file)
        : await file.text();
      const parsed = parseResumeText(text);
      if (isEmptyParse(parsed)) {
        return setStatus({ kind: 'error', text: 'No text in that PDF. Scans and photos need a text layer.' });
      }
      if (hasData && !confirm('Importing replaces everything you have here. Continue?')) return setStatus(null);
      setData(parsed);
      setStatus({ kind: 'done', text: 'Imported. Now check every field, parsing is a guess.' });
    } catch {
      setStatus({ kind: 'error', text: 'Could not open that file' });
    }
  }

  const tone = status?.kind === 'error' ? 'text-red-400'
    : status?.kind === 'done' ? 'text-lime-400'
    : 'text-zinc-500';

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status?.kind === 'busy'}
        className={`w-full rounded-lg border border-dashed px-4 py-3 text-center transition-colors ${
          over ? 'border-lime-400 bg-lime-400/5' : 'border-zinc-700/60 hover:border-lime-400/60'
        }`}
      >
        <span className="block text-xs font-bold uppercase tracking-widest text-zinc-300">
          {status?.kind === 'busy' ? 'Reading…' : 'Have a CV already? Drop it here'}
        </span>
        <span className={`mt-1 block text-[11px] leading-snug ${tone}`}>
          {status?.text ?? 'PDF or TXT. Nothing leaves your browser.'}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
