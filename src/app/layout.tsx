import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Navbar } from '@/components/layout/Navbar';
import { NavigationProgressBar } from '@/components/layout/NavigationProgressBar';
import { ReviewerModeBanner } from '@/components/layout/ReviewerModeBanner';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RepoHamster | Break Bugs. Ship Fixes.',
  description:
    'RepoHamster is an AI-powered developer debugging and technical assessment platform. Solve real-world bugs in GitHub repositories with Codespaces, controlled AI assistance, and automated hidden test evaluation.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--gh-bg)] text-[var(--gh-text)] antialiased selection:bg-[var(--yellow-primary)]/30 selection:text-white flex flex-col">
        <SessionProvider>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <Navbar />
          <ReviewerModeBanner />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] py-8 text-xs text-[var(--gh-text-muted)]">
            <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--gh-bg)] border border-[var(--gh-border)]">
                  <HamsterMascot variant="avatar" size={22} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold text-white font-sans">
                    Repo<span className="text-[var(--yellow-bright)]">Hamster</span>
                  </span>
                  <span className="text-[11px] text-[var(--gh-text-muted)] font-mono">— Break Bugs. Ship Fixes.</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-[11px] font-mono text-[var(--gh-text-secondary)]">
                <Link href="/dashboard" className="hover:text-[var(--yellow-bright)] transition">Challenges</Link>
                <Link href="/admin" className="hover:text-white transition">Admin Console</Link>
                <span>Automated Hidden Test Engine</span>
                <span className="text-[var(--gh-text-muted)]">© 2026 RepoHamster Inc.</span>
              </div>
            </div>
          </footer>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
