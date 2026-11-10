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
      <body className="min-h-screen bg-[#0a0d14] text-slate-100 antialiased selection:bg-brand-lime/25 selection:text-white flex flex-col">
        <SessionProvider>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <Navbar />
          <ReviewerModeBanner />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-card-border bg-[#07090e] py-8 text-xs text-slate-500">
            <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-card border border-card-border">
                  <HamsterMascot variant="avatar" size={22} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold text-slate-300 font-sans">
                    Repo<span className="text-brand-lime">Hamster</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">— Break Bugs. Ship Fixes.</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-[11px] font-mono text-slate-400">
                <Link href="/dashboard" className="hover:text-brand-lime transition">Challenges</Link>
                <Link href="/admin" className="hover:text-brand-purple-light transition">Admin Console</Link>
                <span>Automated Hidden Test Engine</span>
                <span className="text-slate-600">© 2026 RepoHamster Inc.</span>
              </div>
            </div>
          </footer>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
