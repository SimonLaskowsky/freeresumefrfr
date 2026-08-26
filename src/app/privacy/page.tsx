import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for freeresumefrfr: what data we collect and how we use it.',
};

const LAST_UPDATED = 'May 27, 2026';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Nav */}
      <div className="sticky top-4 z-50 flex justify-center px-4 pt-4">
        <nav
          className="flex items-center justify-between px-5 py-2.5 border border-zinc-800/60 rounded-full gap-6"
          style={{ background: 'rgba(9,9,11,0.75)', backdropFilter: 'blur(12px)' }}
        >
          <Link href="/" className="font-black text-sm tracking-tight hover:text-zinc-300 transition-colors">
            freeresumefrfr
          </Link>
          <Link href="/builder" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
            Build my resume →
          </Link>
        </nav>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-20">

        <p className="text-xs text-zinc-600 font-mono mb-4">Last updated: {LAST_UPDATED}</p>
        <h1 className="text-4xl font-black mb-3">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-16">
          Short version: we collect almost nothing, your resume data never leaves your browser, and we don&apos;t sell anything.
        </p>

        <div className="space-y-12 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-white mb-3">1. What we collect</h2>
            <div className="text-zinc-400 space-y-3">
              <p>
                <span className="text-zinc-300 font-medium">Resume and cover letter data</span>: everything you type into the builder (name, job history, skills, etc.) is stored only in your browser&apos;s <code className="text-lime-500/80 bg-zinc-900 px-1 py-0.5 rounded text-xs">localStorage</code>. It is never sent to our servers. We have no database of your personal information.
              </p>
              <p>
                <span className="text-zinc-300 font-medium">Anonymous page analytics</span>: we use <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors">Vercel Analytics</a> to count page views and understand which features are used. This data is aggregated and does not include any personally identifiable information. No cookies are set for this purpose.
              </p>
              <p>
                <span className="text-zinc-300 font-medium">Font loading</span>: we use Geist fonts served via Google Fonts. When your browser loads the page, it makes a request to Google&apos;s CDN. Google&apos;s own <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors">privacy policy</a> applies to that request.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">2. What we do not collect</h2>
            <ul className="text-zinc-400 space-y-2">
              {[
                'No account creation: we never ask for your email or password.',
                'No payment data: the service is free, we process no payments.',
                'No uploaded files stored on our servers: photos and logos you add are processed client-side and stored in localStorage only.',
                'No tracking cookies.',
                'No third-party ad networks.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-lime-600 mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">3. Your resume data</h2>
            <p className="text-zinc-400">
              Your resume content is saved to <code className="text-lime-500/80 bg-zinc-900 px-1 py-0.5 rounded text-xs">localStorage</code> in your browser automatically as you type. This data persists between sessions on the same device and browser. It is never transmitted to any server. You can clear it at any time by resetting the builder or clearing your browser&apos;s local storage.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">4. PDF generation</h2>
            <p className="text-zinc-400">
              PDF files are generated entirely in your browser using <a href="https://react-pdf.org" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors">react-pdf</a>. The file is downloaded directly to your device. We never receive, store, or process the contents of your resume PDF.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">5. Third-party services</h2>
            <div className="text-zinc-400 space-y-3">
              <p>
                <span className="text-zinc-300 font-medium">Vercel</span>: the site is hosted on <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors">Vercel</a>. Standard server logs (IP address, user agent, request path) may be retained by Vercel for infrastructure purposes. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors">Vercel&apos;s privacy policy</a>.
              </p>
              <p>
                <span className="text-zinc-300 font-medium">GitHub</span>: links to GitHub on this site are external. GitHub&apos;s own privacy policy applies when you visit them.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">6. Children</h2>
            <p className="text-zinc-400">
              This service is not directed at children under 13. We do not knowingly collect any information from children.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">7. Changes to this policy</h2>
            <p className="text-zinc-400">
              If we make material changes, we will update the date at the top of this page. Continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">8. Contact</h2>
            <p className="text-zinc-400">
              Questions? Open an issue on{' '}
              <a
                href="https://github.com/SimonLaskowsky/freeresumefrfr/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
              >
                GitHub
              </a>.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/40 px-6 py-8 mt-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-sm text-zinc-700 tracking-tight hover:text-zinc-400 transition-colors">
            freeresumefrfr
          </Link>
          <Link href="/" className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
