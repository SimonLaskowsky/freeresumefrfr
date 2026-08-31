'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n/I18nContext';
import { HeroPreview } from '@/components/HeroPreview';

const ROAST_SITES = [
  'resumebuilder.com',
  'zety.com',
  'resume.io',
];

const TEMPLATE_DOTS = [
  '#1a1a1a', '#1a2744', '#94a3b8',
  '#a3e635', '#7c3aed', '#374151', '#0891b2', '#6b7280',
];

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

      {/* ── Background ──────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.032) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 100% 55% at 50% -5%, rgba(163,230,53,0.11) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── Nav ─────────────────────────────────────────── */}
      <div className="sticky top-4 z-50 flex justify-center px-4 pt-4">
        <nav
          className="flex items-center justify-between px-5 py-2.5 border border-zinc-800/60 rounded-full w-auto gap-6"
          style={{ background: 'rgba(9,9,11,0.75)', backdropFilter: 'blur(12px)' }}
        >
          <span className="font-black text-sm tracking-tight">freeresumefrfr</span>
          <div className="flex items-center gap-5">
            <Link href="/builder" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
              {t.nav.build}
            </Link>
            <Link href="/cover-letter" className="text-xs font-semibold text-zinc-600 hover:text-zinc-300 transition-colors whitespace-nowrap">
              {t.nav.coverLetter}
            </Link>
            <a
              href="https://github.com/SimonLaskowsky"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {t.nav.github}
            </a>
          </div>
        </nav>
      </div>

      {/* ── Hero ────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 overflow-x-clip">
        <div className="pt-20 pb-16 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-10 items-center">

          {/* Left: copy + CTA */}
          <div>
            <h1 className="font-black tracking-tight leading-[0.92] mb-8 select-none">
              <div className="text-5xl lg:text-[62px] text-white whitespace-nowrap">{t.hero.headline1}</div>
              <div
                className="text-5xl lg:text-[62px] bg-clip-text text-transparent whitespace-nowrap"
                style={{ backgroundImage: 'linear-gradient(90deg, #a3e635, #34d399)' }}
              >
                {t.hero.headline2}
              </div>
              <div className="text-5xl lg:text-[62px] text-zinc-700 whitespace-nowrap">{t.hero.headline3}</div>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-lg mb-10 leading-relaxed">
              {t.hero.sub}
            </p>

            <div className="flex flex-col items-start gap-3">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2.5 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black px-7 py-3.5 rounded-xl text-base whitespace-nowrap transition-all active:scale-95"
                style={{ boxShadow: '0 0 32px rgba(163,230,53,0.35), 0 0 64px rgba(163,230,53,0.1)' }}
              >
                {t.hero.cta}
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                href="/cover-letter"
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white font-medium px-6 py-3 rounded-xl text-sm whitespace-nowrap transition-all active:scale-95"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                  <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4.5 5.5h7M4.5 8h7M4.5 10.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                {t.coverLetter.heroCta}
              </Link>
            </div>
          </div>

          {/* Right: floating resume preview */}
          <div className="hidden lg:flex justify-center">
            <HeroPreview />
          </div>

        </div>

        {/* ── Roast section ───────────────────────────────── */}
        <div className="pb-20 border-t border-zinc-800/40 pt-16">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
            {t.roast.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black mb-10 text-zinc-100">
            {t.roast.heading}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {t.roast.items.map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-zinc-800/50 border-b border-zinc-700/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span className="text-[10px] text-zinc-600 ml-2 font-mono truncate">{ROAST_SITES[i]}</span>
                </div>
                <div className="p-5">
                  <div className="text-sm text-zinc-300 mb-4 leading-relaxed">
                    &quot;{item.line1} {item.line2}&quot;
                  </div>
                  <div className="relative w-full py-2.5 px-4 bg-zinc-800/60 border border-zinc-700/60 rounded-xl flex items-center justify-center gap-2 overflow-hidden">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className="text-zinc-600 shrink-0">
                      <path d="M8 12L3 7h3V2h4v5h3L8 12z" />
                      <rect x="2" y="13" width="12" height="1.5" rx="0.75" />
                    </svg>
                    <span className="text-xs font-bold text-zinc-500 line-through decoration-red-500/70 decoration-2">
                      {t.download.button.split(':')[0].trim()}
                    </span>
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" className="text-zinc-600 shrink-0">
                      <rect x="3.5" y="7" width="9" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(239,68,68,0.06) 6px, rgba(239,68,68,0.06) 7px)',
                    }} />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-3 text-center">
                    {t.roast.cardNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features bento ──────────────────────────────── */}
        <div className="pb-20 border-t border-zinc-800/40 pt-16">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
            {t.features.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black mb-10 text-zinc-100">
            {t.features.heading}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-start gap-4">
              <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor" className="text-lime-400 mt-0.5 shrink-0">
                <path d="M8 12L3 7h3V2h4v5h3L8 12z" />
                <rect x="2" y="13" width="12" height="1.5" rx="0.75" />
              </svg>
              <div>
                <div className="font-black text-lg text-lime-400 mb-1.5">{t.features.items[0].title}</div>
                <div className="text-sm text-zinc-500">{t.features.items[0].desc}</div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" className="text-lime-400 mb-3">
                <circle cx="8" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2.8 13.5c.9-2.3 2.9-3.5 5.2-3.5s4.3 1.2 5.2 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="font-bold text-sm text-white mb-1">{t.features.items[3].title}</div>
              <div className="text-xs text-zinc-600">{t.features.items[3].desc}</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" className="text-lime-400 mb-3">
                <path d="M1.5 8S3.9 3.8 8 3.8 14.5 8 14.5 8s-2.4 4.2-6.5 4.2S1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="font-bold text-sm text-white mb-1">{t.features.items[2].title}</div>
              <div className="text-xs text-zinc-600">{t.features.items[2].desc}</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" className="text-lime-400 mb-3">
                <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.2 8.2l2 2 3.6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="font-bold text-sm text-white mb-1">{t.features.items[4].title}</div>
              <div className="text-xs text-zinc-600">{t.features.items[4].desc}</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" className="text-lime-400 mb-3">
                <rect x="3.5" y="2" width="9" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 5.5h4M6 8h4M6 10.5h2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              <div className="font-bold text-sm text-white mb-1">{t.features.items[5].title}</div>
              <div className="text-xs text-zinc-600">{t.features.items[5].desc}</div>
            </div>

            <div className="col-span-2 bg-zinc-900 border border-lime-400/15 rounded-2xl p-5 flex items-center justify-between gap-4 overflow-hidden">
              <div>
                <div className="font-black text-base text-white mb-1">{t.features.items[1].title}</div>
                <div className="text-xs text-zinc-600">{t.features.items[1].desc}</div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {TEMPLATE_DOTS.map((c) => (
                  <div
                    key={c}
                    className="w-5 h-5 rounded-full border border-zinc-700/50"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Final CTA ───────────────────────────────────── */}
        <div className="py-24 text-center border-t border-zinc-800/40">
          <p className="text-zinc-600 text-sm mb-4 tracking-wide">
            {t.finalCta.note}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black mb-10 leading-tight">
            {t.finalCta.headline1}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #a3e635, #34d399)' }}
            >
              {t.finalCta.headline2}
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="inline-flex items-center gap-3 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black px-10 py-5 rounded-2xl text-xl transition-all active:scale-95"
              style={{ boxShadow: '0 0 50px rgba(163,230,53,0.45), 0 0 120px rgba(163,230,53,0.12)' }}
            >
              {t.hero.cta}
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/cover-letter"
              className="inline-flex items-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-white font-bold px-8 py-5 rounded-2xl text-base transition-all active:scale-95"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4.5 5.5h7M4.5 8h7M4.5 10.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              {t.coverLetter.heroCta}
            </Link>
          </div>
        </div>
      </main>

      {/* ── Support / feedback ──────────────────────────── */}
      <div className="border-t border-zinc-800/40 px-6 py-14 text-center">
        <div className="max-w-sm mx-auto">
          <p className="text-[11px] uppercase tracking-widest text-zinc-600 mb-2">{t.support.builtBy}</p>
          <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
            {t.support.message}
          </p>
          <div className="flex items-center justify-center gap-5">
            <a
              href="https://suppi.pl/simonlaskowski"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M3 6h8v4.5A2.5 2.5 0 018.5 13h-3A2.5 2.5 0 013 10.5V6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M11 7h1a1.8 1.8 0 010 3.6h-1" stroke="currentColor" strokeWidth="1.4" />
                <path d="M5.5 2.5V4M8.5 2.5V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {t.support.coffee}
            </a>
            <a
              href="https://github.com/SimonLaskowsky/freeresumefrfr/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              {t.support.feedback}
            </a>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/40 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-black text-sm text-zinc-700 tracking-tight">freeresumefrfr</span>
          <p className="text-xs text-zinc-600 text-center">
            {t.footer.tagline}
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="https://github.com/SimonLaskowsky"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              {t.nav.github}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
