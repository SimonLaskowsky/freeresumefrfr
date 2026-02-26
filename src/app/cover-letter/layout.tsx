import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Cover Letter Builder — PDF Download | freeresumefrfr',
  description:
    'Write and download a professional cover letter as PDF for free. 5 templates, instant download, no account needed. Pair with your resume.',
  keywords: [
    'free cover letter builder',
    'cover letter generator free',
    'cover letter template free download',
    'cover letter PDF free',
    'free cover letter maker',
    'cover letter builder no sign up',
    'cover letter no paywall',
    'professional cover letter template',
    'free cover letter writer',
  ],
  openGraph: {
    title: 'Free Cover Letter Builder — No Paywall | freeresumefrfr',
    description:
      'Write and download a professional cover letter as PDF for free. 5 templates, no sign-up, no watermark. frfr.',
    url: 'https://freeresumefrfr.com/cover-letter',
    siteName: 'freeresumefrfr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Cover Letter Builder — No Paywall | freeresumefrfr',
    description:
      'Write and download a cover letter as PDF for free. 5 templates, no sign-up, no watermark. frfr.',
  },
  alternates: {
    canonical: 'https://freeresumefrfr.com/cover-letter',
  },
};

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
