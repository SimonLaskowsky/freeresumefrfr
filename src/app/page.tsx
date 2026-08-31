'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useI18n } from '@/i18n/I18nContext';
import { HeroPreview } from '@/components/HeroPreview';

const ROAST_SITES = ['resumebuilder.com', 'zety.com', 'resume.io'];

const TEMPLATE_DOTS = [
  '#1a1a1a', '#1a2744', '#94a3b8', '#a3e635',
  '#7c3aed', '#374151', '#0891b2', '#6b7280',
];

/* Reveal-on-scroll: adds .is-in once a .reveal element enters the viewport. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Mono stat line with the numbers picked out in accent. */
function ProofLine({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`font-mono text-xs tracking-wide text-zinc-500 ${className}`}>
      {text.split(/(\d+|∞)/).map((part, i) =>
        /^(\d+|∞)$/.test(part)
          ? <span key={i} className="text-lime-700 font-semibold">{part}</span>
          : <span key={i}>{part}</span>
      )}
    </p>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-lime-700 mb-3">
      {children}
    </p>
  );
}

function IconTile({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bento-icon w-11 h-11 rounded-xl bg-lime-400/20 border border-lime-600/15 flex items-center justify-center text-lime-700 shrink-0 ${className}`}>
      {children}
    </div>
  );
}

/* ── Icons (stroke, animated on card hover) ─────────────────────────────── */
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const IconDownload = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
    <path className="icon-anim icon-arrow-down" d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5" />
    <path d="M4 15.5h12" />
  </svg>
);
const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
    <path className="icon-anim icon-arrow-down" d="M10 2.5L17 6l-7 3.5L3 6l7-3.5z" />
    <path d="M3 10l7 3.5 7-3.5" />
    <path d="M3 14l7 3.5 7-3.5" />
  </svg>
);
const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
    <path d="M2 10s3-5.2 8-5.2S18 10 18 10s-3 5.2-8 5.2S2 10 2 10z" />
    <circle className="icon-anim icon-pop" cx="10" cy="10" r="2.3" />
  </svg>
);
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
    <circle className="icon-anim icon-pop" cx="10" cy="6.5" r="3.1" />
    <path d="M3.5 17c1.1-2.9 3.6-4.3 6.5-4.3s5.4 1.4 6.5 4.3" />
  </svg>
);
const IconCheckRing = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
    <circle cx="10" cy="10" r="7.5" />
    <path className="icon-anim icon-pop" d="M6.6 10.3l2.4 2.4 4.4-4.9" />
  </svg>
);
const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
    <rect x="4.5" y="2.5" width="11" height="15" rx="1.6" />
    <path className="icon-anim icon-slide" d="M7.5 7h5M7.5 10h5M7.5 13h3" />
  </svg>
);
const IconImport = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
    <path className="icon-anim icon-arrow-down" d="M10 2.5v8m0 0L6.8 7.3M10 10.5l3.2-3.2" />
    <path d="M3.5 12.5v2.9A2.1 2.1 0 005.6 17.5h8.8a2.1 2.1 0 002.1-2.1v-2.9" />
  </svg>
);
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...stroke}>
    <path d="M10 2.5l6.5 2.4v4.6c0 4-2.6 6.6-6.5 8-3.9-1.4-6.5-4-6.5-8V4.9L10 2.5z" />
    <path className="icon-anim icon-pop" d="M7.2 9.9l2 2 3.6-4" />
  </svg>
);
const IconLetter = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" {...stroke}>
    <rect x="2" y="2" width="12" height="12" rx="1.5" />
    <path d="M4.5 5.5h7M4.5 8h7M4.5 10.5h4" strokeWidth="1.25" />
  </svg>
);
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconLock = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="3.5" y="7" width="9" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const IconDownloadGlyph = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 12L3 7h3V2h4v5h3L8 12z" />
    <rect x="2" y="13" width="12" height="1.5" rx="0.75" />
  </svg>
);

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useI18n();
  useReveal();

  const primaryCta = (big = false) => (
    <Link
      href="/builder"
      className={`cta-sheen inline-flex items-center gap-2.5 bg-lime-400 hover:bg-lime-300 text-zinc-900 font-bold rounded-xl whitespace-nowrap transition-all active:scale-[0.98] ${
        big ? 'px-9 py-4.5 text-lg' : 'px-7 py-3.5 text-[15px]'
      }`}
      style={{ boxShadow: '0 10px 30px -8px rgba(132,204,22,0.55), inset 0 1px 0 rgba(255,255,255,0.5)' }}
    >
      {t.hero.cta}
      <IconArrowRight />
    </Link>
  );

  const secondaryCta = (big = false) => (
    <Link
      href="/cover-letter"
      className={`glass inline-flex items-center gap-2.5 rounded-xl font-semibold text-zinc-700 hover:text-zinc-900 transition-all active:scale-[0.98] hover:bg-white/80 ${
        big ? 'px-8 py-4.5 text-base' : 'px-6 py-3.5 text-sm'
      }`}
    >
      <IconLetter />
      {t.coverLetter.heroCta}
    </Link>
  );

  const tickerItems = [...t.ticker, ...t.ticker];

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-zinc-900 overflow-x-hidden">

      {/* ── Background: soft blobs + dot grid ─────────────── */}
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="blob absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full bg-lime-300/35 blur-[120px]" />
        <div className="blob-slow absolute top-24 -right-40 w-[520px] h-[520px] rounded-full bg-teal-200/45 blur-[120px]" />
        <div className="blob absolute bottom-[-180px] left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-200/35 blur-[130px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(24,33,22,0.055) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }} />
      </div>

      {/* ── Navbar ────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
        <nav className="glass-strong max-w-6xl mx-auto rounded-2xl px-5 py-3 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center text-zinc-900 shadow-sm bento-icon">
              <IconDownloadGlyph size={15} />
            </span>
            <span className="font-black text-[15px] tracking-tight">
              freeresume<span className="text-lime-600">frfr</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-7">
            <Link href="/builder" className="text-[13px] font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
              {t.nav.build}
            </Link>
            <Link href="/cover-letter" className="text-[13px] font-semibold text-zinc-600 hover:text-zinc-900 transition-colors whitespace-nowrap">
              {t.nav.coverLetter}
            </Link>
            <a
              href="https://github.com/SimonLaskowsky/freeresumefrfr"
              target="_blank" rel="noopener noreferrer"
              className="text-[13px] font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              {t.nav.github}
            </a>
          </div>
          <Link
            href="/builder"
            className="cta-sheen bg-lime-400 hover:bg-lime-300 text-zinc-900 text-[13px] font-bold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            style={{ boxShadow: '0 6px 18px -6px rgba(132,204,22,0.55)' }}
          >
            {t.hero.cta}
          </Link>
        </nav>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6">
        <section className="pt-36 lg:pt-44 pb-16 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
          <div>
            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-500 opacity-60" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-lime-500" />
              </span>
              <span className="text-xs font-semibold text-zinc-600">{t.hero.badge}</span>
            </div>

            <h1 className="font-black tracking-tight leading-[0.95] mb-7 select-none">
              <span className="block text-5xl lg:text-[64px] text-zinc-900">{t.hero.headline1}</span>
              <span
                className="block text-5xl lg:text-[64px] bg-clip-text text-transparent pb-1"
                style={{ backgroundImage: 'linear-gradient(92deg, #65a30d, #0d9488)' }}
              >
                {t.hero.headline2}
              </span>
              <span className="block text-5xl lg:text-[64px] text-zinc-300">{t.hero.headline3}</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-lg mb-9 leading-relaxed">
              {t.hero.sub}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-7">
              {primaryCta()}
              {secondaryCta()}
            </div>

            <ProofLine text={t.landing.heroProof} />
          </div>

          {/* Browser-framed live preview */}
          <div className="hidden lg:block relative">
            <div className="glass-strong rounded-2xl overflow-hidden animate-float">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-900/5 bg-white/50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <span className="ml-2 font-mono text-[10px] text-zinc-500 bg-zinc-900/5 rounded-md px-2.5 py-1">
                  freeresumefrfr.com/builder
                </span>
                <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-lime-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                  {t.features.items[2].title}
                </span>
              </div>
              <div className="bg-white/70 px-8 pt-8 pb-5 flex justify-center">
                <HeroPreview />
              </div>
            </div>

            {/* floating glass chips */}
            <div className="glass-strong absolute -left-7 top-16 rounded-xl px-3.5 py-2.5 flex items-center gap-2 animate-float" style={{ animationDelay: '1.2s' }}>
              <span className="text-lime-700"><IconDownloadGlyph size={12} /></span>
              <span className="font-mono text-xs font-bold text-zinc-800">PDF · 0.00</span>
            </div>
            <div className="glass-strong absolute -right-5 bottom-24 rounded-xl px-3.5 py-2.5 flex items-center gap-2 animate-float" style={{ animationDelay: '2.4s' }}>
              <span className="w-4 h-4 rounded-full bg-lime-400/30 text-lime-700 flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1.5 5.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="font-mono text-xs font-bold text-zinc-800">ATS</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Ticker ────────────────────────────────────────── */}
      <div className="marquee glass border-x-0 rounded-none py-3.5 overflow-hidden" aria-hidden>
        <div className="marquee-track">
          {tickerItems.map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500 whitespace-nowrap">{item}</span>
              <span className="mx-6 text-lime-600/70 text-[10px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6">

        {/* ── How it works ────────────────────────────────── */}
        <section className="pt-24 pb-8 reveal">
          <Eyebrow>{t.landing.howEyebrow}</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">{t.landing.howHeading}</h2>
          <div className="glass rounded-2xl grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-900/5">
            {[
              { n: '01', title: t.landing.how1t, desc: t.landing.how1d },
              { n: '02', title: t.landing.how2t, desc: t.landing.how2d },
              { n: '03', title: t.landing.how3t, desc: t.landing.how3d },
            ].map((s) => (
              <div key={s.n} className="p-7 group">
                <p className="font-mono text-xs text-lime-700 mb-3 transition-transform duration-300 group-hover:translate-x-1">{s.n}</p>
                <h3 className="font-bold text-[15px] mb-2">{s.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bento features ──────────────────────────────── */}
        <section className="pt-20 pb-8">
          <div className="reveal">
            <Eyebrow>{t.features.eyebrow}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">{t.features.heading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Always free: wide card */}
            <div className="glass glass-card group rounded-2xl p-7 sm:col-span-2 flex items-start justify-between gap-6 reveal">
              <div className="flex items-start gap-5">
                <IconTile><IconDownload /></IconTile>
                <div>
                  <h3 className="font-black text-lg text-zinc-900 mb-1.5">{t.features.items[0].title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">{t.features.items[0].desc}</p>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0">
                <span className="font-mono font-black text-4xl text-lime-600 tracking-tight">0</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">{t.landing.statFree}</span>
              </div>
            </div>

            {/* Templates */}
            <div className="glass glass-card group rounded-2xl p-6 reveal">
              <IconTile className="mb-4"><IconLayers /></IconTile>
              <h3 className="font-bold text-[15px] mb-1.5">{t.features.items[1].title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-4">{t.features.items[1].desc}</p>
              <div className="flex gap-1.5">
                {TEMPLATE_DOTS.map((c, i) => (
                  <span
                    key={c}
                    className="w-4.5 h-4.5 rounded-full border border-white/70 shadow-sm transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ backgroundColor: c, transitionDelay: `${i * 35}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div className="glass glass-card group rounded-2xl p-6 reveal">
              <IconTile className="mb-4"><IconEye /></IconTile>
              <h3 className="font-bold text-[15px] mb-1.5">{t.features.items[2].title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-4">{t.features.items[2].desc}</p>
              <div className="space-y-1.5">
                <div className="h-1.5 rounded-full bg-zinc-900/8 overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-lime-400/80 transition-all duration-700 group-hover:w-full" />
                </div>
                <div className="h-1.5 rounded-full bg-zinc-900/8 overflow-hidden">
                  <div className="h-full w-1/2 rounded-full bg-teal-400/70 transition-all duration-700 delay-100 group-hover:w-5/6" />
                </div>
              </div>
            </div>

            {/* No account */}
            <div className="glass glass-card group rounded-2xl p-6 reveal">
              <IconTile className="mb-4"><IconUser /></IconTile>
              <h3 className="font-bold text-[15px] mb-1.5">{t.features.items[3].title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">{t.features.items[3].desc}</p>
            </div>

            {/* ATS */}
            <div className="glass glass-card group rounded-2xl p-6 reveal">
              <IconTile className="mb-4"><IconCheckRing /></IconTile>
              <h3 className="font-bold text-[15px] mb-1.5">{t.features.items[4].title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-4">{t.features.items[4].desc}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-zinc-900/8 overflow-hidden">
                  <div className="h-full w-[62%] rounded-full bg-lime-500/80 transition-all duration-700 group-hover:w-[92%]" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">ATS</span>
              </div>
            </div>

            {/* Letter & A4 */}
            <div className="glass glass-card group rounded-2xl p-6 reveal">
              <IconTile className="mb-4"><IconDoc /></IconTile>
              <h3 className="font-bold text-[15px] mb-1.5">{t.features.items[5].title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-4">{t.features.items[5].desc}</p>
              <div className="inline-flex rounded-lg border border-zinc-900/10 overflow-hidden font-mono text-[10px] tracking-widest">
                <span className="px-3.5 py-1.5 text-zinc-400 bg-white/40 transition-colors duration-300 group-hover:text-zinc-500">LETTER</span>
                <span className="px-3.5 py-1.5 bg-lime-400/90 text-zinc-900 font-bold">A4</span>
              </div>
            </div>

            {/* Import CV */}
            <div className="glass glass-card group rounded-2xl p-6 sm:col-span-2 lg:col-span-2 flex items-start gap-5 reveal">
              <IconTile><IconImport /></IconTile>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] mb-1.5">{t.importCv.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed mb-4">{t.importCv.hint}</p>
                <div className="rounded-xl border border-dashed border-zinc-900/15 group-hover:border-lime-600/40 transition-colors px-4 py-3 flex items-center gap-3">
                  <span className="text-zinc-400 group-hover:text-lime-700 transition-colors"><IconDoc /></span>
                  <span className="font-mono text-[11px] text-zinc-400 truncate">cv.pdf</span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-lime-700 opacity-0 group-hover:opacity-100 transition-opacity">100%</span>
                </div>
              </div>
            </div>

            {/* RODO clause */}
            <div className="glass glass-card group rounded-2xl p-6 sm:col-span-2 lg:col-span-3 flex items-start gap-5 reveal">
              <IconTile><IconShield /></IconTile>
              <div>
                <h3 className="font-bold text-[15px] mb-1.5">{t.clause.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed max-w-2xl">{t.clause.hint}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats band ──────────────────────────────────── */}
        <section className="pt-20 pb-8 reveal">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { v: '0', label: t.landing.statFree, hot: true },
              { v: '14', label: t.landing.statTemplates, hot: false },
              { v: '15', label: t.landing.statLanguages, hot: false },
              { v: '∞', label: t.landing.statDownloads, hot: false },
            ].map((s) => (
              <div
                key={s.label}
                className={`glass glass-card rounded-2xl p-6 ${s.hot ? 'glass-accent' : ''}`}
              >
                <p className={`font-mono font-black text-4xl tracking-tight mb-2 ${s.hot ? 'text-lime-700' : 'text-zinc-900'}`}>{s.v}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Roast: competitors vs us ────────────────────── */}
        <section className="pt-20 pb-8">
          <div className="reveal">
            <Eyebrow>{t.roast.eyebrow}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">{t.roast.heading}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.roast.items.map((item, i) => (
              <div key={i} className="glass glass-card rounded-2xl overflow-hidden reveal">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-white/40 border-b border-zinc-900/5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="font-mono text-[10px] text-zinc-400 ml-2 truncate">{ROAST_SITES[i]}</span>
                </div>
                <div className="p-5">
                  <p className="text-[13px] text-zinc-600 mb-5 leading-relaxed min-h-[60px]">
                    &quot;{item.line1} {item.line2}&quot;
                  </p>
                  <div className="relative w-full py-2.5 px-4 bg-zinc-900/5 border border-zinc-900/10 rounded-xl flex items-center justify-center gap-2 overflow-hidden">
                    <span className="text-zinc-400"><IconDownloadGlyph size={12} /></span>
                    <span className="text-xs font-bold text-zinc-400 line-through decoration-red-400/80 decoration-2">
                      {t.download.button.split(':')[0].trim()}
                    </span>
                    <span className="text-zinc-400"><IconLock /></span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-3 text-center">{t.roast.cardNote}</p>
                </div>
              </div>
            ))}

            {/* our card */}
            <div className="glass-strong glass-accent glass-card rounded-2xl overflow-hidden reveal">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-lime-100/50 border-b border-lime-600/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/90" />
                <span className="font-mono text-[10px] text-lime-800 ml-2 truncate">freeresumefrfr.com</span>
              </div>
              <div className="p-5">
                <p className="text-[13px] text-zinc-700 mb-5 leading-relaxed min-h-[60px] font-medium">
                  &quot;{t.builder.noAccountWatermark}&quot;
                </p>
                <Link
                  href="/builder"
                  className="cta-sheen w-full py-2.5 px-4 bg-lime-400 hover:bg-lime-300 rounded-xl flex items-center justify-center gap-2 text-zinc-900 transition-colors"
                  style={{ boxShadow: '0 8px 20px -8px rgba(132,204,22,0.6)' }}
                >
                  <IconDownloadGlyph size={12} />
                  <span className="text-xs font-bold">{t.download.button}</span>
                </Link>
                <p className="font-mono text-[10px] text-lime-700 mt-3 text-center uppercase tracking-widest">frfr</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────── */}
        <section className="py-24 reveal">
          <div className="glass-strong rounded-3xl px-8 py-16 sm:px-16 text-center relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-lime-300/30 blur-[100px] pointer-events-none" aria-hidden />
            <p className="text-zinc-500 text-sm mb-4 tracking-wide relative">{t.finalCta.note}</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-10 leading-tight relative">
              {t.finalCta.headline1}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(92deg, #65a30d, #0d9488)' }}
              >
                {t.finalCta.headline2}
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              {primaryCta(true)}
              {secondaryCta(true)}
            </div>
            <ProofLine text={t.landing.heroProof} className="mt-8 relative text-center" />
          </div>
        </section>
      </main>

      {/* ── Support / feedback ────────────────────────────── */}
      <div className="px-6 pb-14 text-center reveal">
        <div className="max-w-sm mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-400 mb-2">{t.support.builtBy}</p>
          <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{t.support.message}</p>
          <div className="flex items-center justify-center gap-5">
            <a
              href="https://suppi.pl/simonlaskowski"
              target="_blank" rel="noopener noreferrer"
              className="glass inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-white/80 transition-all"
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
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              {t.support.feedback}
            </a>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="px-6 py-8 border-t border-zinc-900/5 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-black text-sm tracking-tight text-zinc-400">
            freeresume<span className="text-lime-600/70">frfr</span>
          </span>
          <p className="text-xs text-zinc-400 text-center">{t.footer.tagline}</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
              Privacy Policy
            </Link>
            <a
              href="https://github.com/SimonLaskowsky"
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              {t.nav.github}
            </a>
            <a
              href="https://szymonlaskowski.pl"
              target="_blank" rel="noopener noreferrer"
              className="text-xs font-medium text-zinc-500 hover:text-lime-700 transition-colors whitespace-nowrap"
            >
              Szymon Laskowski
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
