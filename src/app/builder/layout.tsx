import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Resume Builder — PDF Download in Seconds | freeresumefrfr',
  description:
    'Build your professional resume online for free. 14 templates, live preview, instant PDF download. No sign-up, no paywall, no watermark. Just your resume.',
  keywords: [
    'free resume builder',
    'resume builder no sign up',
    'resume builder no paywall',
    'free resume maker',
    'resume PDF download free',
    'free CV builder',
    'resume builder no account',
    'resume builder no watermark',
    'professional resume templates',
    'free resume template download',
  ],
  openGraph: {
    title: 'Free Resume Builder — No Paywall, No Account | freeresumefrfr',
    description:
      'Build and download your resume as PDF for free. 14 professional templates, live preview. No sign-up, no watermark, no paywall. frfr.',
    url: 'https://freeresumefrfr.com/builder',
    siteName: 'freeresumefrfr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder — No Paywall | freeresumefrfr',
    description:
      'Build and download your resume as PDF for free. 14 templates, no sign-up, no watermark. frfr.',
  },
  alternates: {
    canonical: 'https://freeresumefrfr.com/builder',
  },
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
