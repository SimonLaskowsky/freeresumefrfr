'use client';

import { useRef } from 'react';
import { useI18n } from '@/i18n/I18nContext';

interface Props {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  placeholder?: string;
}

export default function BulletList({ bullets, onChange, placeholder = 'Add a bullet point...' }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useI18n();
  const list = bullets.length > 0 ? bullets : [''];

  const update = (i: number, val: string) => {
    const next = [...list];
    next[i] = val;
    onChange(next);
  };

  const addAfter = (i: number) => {
    const next = [...list];
    next.splice(i + 1, 0, '');
    onChange(next);
    setTimeout(() => refs.current[i + 1]?.focus(), 30);
  };

  const remove = (i: number) => {
    if (list.length === 1) { onChange(['']); return; }
    const next = list.filter((_, idx) => idx !== i);
    onChange(next);
    setTimeout(() => refs.current[Math.max(0, i - 1)]?.focus(), 30);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Enter') { e.preventDefault(); addAfter(i); }
    if (e.key === 'Backspace' && list[i] === '') { e.preventDefault(); remove(i); }
  };

  return (
    <div className="space-y-1.5">
      {list.map((bullet, i) => (
        <div key={i} className="flex items-center gap-2 group">
          <span className="text-lime-500/60 text-xs w-3 flex-shrink-0 select-none">•</span>
          <input
            ref={(el) => { refs.current[i] = el; }}
            className="form-input flex-1 bg-white/70 border border-zinc-900/10 rounded-lg px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-lime-500/60 transition-colors"
            value={bullet}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all w-5 text-sm flex-shrink-0 text-center"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addAfter(list.length - 1)}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-lime-700 transition-colors pl-5 mt-1"
      >
        <span className="text-sm leading-none">+</span> {t.fields.addBullet}
        <span className="text-zinc-400 ml-1 hidden sm:inline">{t.fields.enterToAddFaster}</span>
      </button>
    </div>
  );
}
