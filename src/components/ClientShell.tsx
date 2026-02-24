'use client';

import dynamic from 'next/dynamic';
import { I18nProvider } from '@/i18n/I18nContext';

const LanguagePicker = dynamic(() => import('@/components/LanguagePicker'), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <LanguagePicker />
    </I18nProvider>
  );
}
