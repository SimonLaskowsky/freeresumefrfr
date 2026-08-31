'use client';

import { useState } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  count?: number;
  tip?: string;
  action?: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SectionWrapper({
  title, children, count, tip, action, defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 group flex-1 text-left min-w-0"
        >
          <span className="w-1 h-3.5 rounded-full bg-lime-400/70 flex-shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-800 transition-colors truncate">
            {title}
          </span>
          {count !== undefined && count > 0 && (
            <span className="text-[10px] text-zinc-400 bg-zinc-900/10 rounded-full px-1.5 py-0.5 tabular-nums flex-shrink-0">
              {count}
            </span>
          )}
          <svg
            className={`w-3 h-3 text-zinc-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 12 12"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          {tip && (
            <button
              onClick={() => setTipOpen((t) => !t)}
              className={`text-[11px] transition-colors ${tipOpen ? 'text-lime-700' : 'text-zinc-500 hover:text-zinc-700'}`}
              title="ATS tip"
            >
              ⓘ
            </button>
          )}
          {action}
        </div>
      </div>

      {tipOpen && tip && (
        <div className="mb-3 px-3 py-2.5 bg-white/80 border border-lime-600/20 rounded-xl text-xs text-zinc-500 leading-relaxed">
          <span className="text-lime-700 font-semibold">ATS tip: </span>{tip}
        </div>
      )}

      {open && <div>{children}</div>}
    </section>
  );
}
