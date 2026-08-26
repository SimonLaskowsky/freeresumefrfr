'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { locales, rtlLocales, languageNames, type Translations } from './translations';

interface I18nCtx { t: Translations; locale: string; setLocale: (l: string) => void; }
const Ctx = createContext<I18nCtx>({ t: locales.en, locale: 'en', setLocale: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('locale'); } catch { /* storage blocked */ }
    const initial = saved || navigator.language.split('-')[0];
    setLocaleState(locales[initial] ? initial : 'en');
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtlLocales.has(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  function setLocale(l: string) {
    if (!locales[l]) return;
    try { localStorage.setItem('locale', l); } catch { /* storage blocked */ }
    setLocaleState(l);
  }

  return (
    <Ctx.Provider value={{ t: locales[locale], locale, setLocale }}>
      {children}
    </Ctx.Provider>
  );
}

export const useI18n = () => useContext(Ctx);
export { languageNames };
