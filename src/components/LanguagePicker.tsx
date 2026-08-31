'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n, languageNames } from '@/i18n/I18nContext';

const FLAG: Record<string, string> = {
  en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', pt: '🇧🇷',
  zh: '🇨🇳', ja: '🇯🇵', ko: '🇰🇷', ar: '🇸🇦', ru: '🇷🇺',
  it: '🇮🇹', hi: '🇮🇳', tr: '🇹🇷', nl: '🇳🇱', pl: '🇵🇱',
};

export default function LanguagePicker() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const langs = Object.keys(languageNames);

  return (
    <div ref={ref} style={{ position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 9999 }}>
      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 0.5rem)',
            right: 0,
            width: '15rem',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(24,33,22,0.1)',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            boxShadow: '0 12px 40px -10px rgba(24,33,22,0.2)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.375rem',
            }}
          >
            {langs.map((lang) => {
              const active = lang === locale;
              return (
                <button
                  key={lang}
                  onClick={() => { setLocale(lang); setOpen(false); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.125rem',
                    padding: '0.375rem 0.25rem',
                    borderRadius: '0.5rem',
                    border: active ? '1px solid #65a30d' : '1px solid transparent',
                    background: active ? 'rgba(163,230,53,0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(24,33,22,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{FLAG[lang]}</span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: active ? '#4d7c0f' : '#52525b',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      maxWidth: '3.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {languageNames[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Globe button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(24,33,22,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 20px -6px rgba(24,33,22,0.25)',
          transition: 'border-color 0.15s',
          color: open ? '#4d7c0f' : '#71717a',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#65a30d';
          (e.currentTarget as HTMLButtonElement).style.color = '#4d7c0f';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(24,33,22,0.12)';
          (e.currentTarget as HTMLButtonElement).style.color = open ? '#4d7c0f' : '#71717a';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </button>
    </div>
  );
}
