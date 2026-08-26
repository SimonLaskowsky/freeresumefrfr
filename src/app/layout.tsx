import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://freeresumefrfr.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'freeresumefrfr: Free Resume Builder. No Paywall. frfr.',
    template: '%s | freeresumefrfr',
  },
  description:
    'Build and download your resume as PDF for free. No sign-up, no paywall, no watermark. 14 professional templates, live preview. Actually free, frfr.',
  keywords: [
    'free resume builder',
    'free resume builder no sign up',
    'resume builder no paywall',
    'free resume maker',
    'free CV builder online',
    'resume builder no watermark',
    'resume builder no account',
    'free resume template download',
    'resume PDF free',
    'professional resume builder free',
    'free cover letter builder',
    'resume builder 2026',
  ],
  authors: [{ name: 'freeresumefrfr' }],
  creator: 'freeresumefrfr',
  openGraph: {
    type: 'website',
    siteName: 'freeresumefrfr',
    title: 'freeresumefrfr: Free Resume Builder. No Paywall. frfr.',
    description:
      'Build and download your resume as PDF for free. No sign-up, no paywall, no watermark. 14 professional templates. Actually free, frfr.',
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'freeresumefrfr: Free Resume Builder. No Paywall. frfr.',
    description:
      'Build and download your resume as PDF for free. No sign-up, no paywall, no watermark. Actually free, frfr.',
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        {/* The app ships its own 16 language picker. Edge auto-translate rewrites
            text nodes before React hydrates, which kills hydration (React #418). */}
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientShell>
          {children}
        </ClientShell>
        <Analytics />
      </body>
    </html>
  );
}
