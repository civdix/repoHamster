import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Navbar } from '@/components/layout/Navbar';
import { NavigationProgressBar } from '@/components/layout/NavigationProgressBar';
import { ReviewerModeBanner } from '@/components/layout/ReviewerModeBanner';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Link from 'next/link';

const baseUrl = process.env.NEXTAUTH_URL || 'https://repohamster.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'RepoHamster | Real Repository Assessments & Debugging Challenges',
    template: '%s | RepoHamster',
  },
  description:
    'RepoHamster is the authentic developer debugging and technical assessment platform. Replace artificial LeetCode whiteboard algorithms with real-world multi-file repository challenges in GitHub Codespaces with automated CI test verification.',
  applicationName: 'RepoHamster',
  keywords: [
    'repo online assessment',
    'repo oa',
    'repository coding challenge',
    'leetcode alternative',
    'github codespaces coding interview',
    'developer debugging assessment',
    'technical assessment platform',
    'socratic ai mentor',
    'software engineering assessment',
    'real world coding test',
    'full stack debugging challenges',
    'python debugging challenge',
    'golang repository assessment',
    'typescript coding interview',
    'take home coding test',
    'automated ci evaluation',
  ],
  authors: [{ name: 'RepoHamster Team', url: baseUrl }],
  creator: 'RepoHamster',
  publisher: 'RepoHamster',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RepoHamster | Real Repository Assessments & Debugging Challenges',
    description:
      'Replace whiteboard algorithms with real-world multi-file repositories. 1-click GitHub Codespaces, automated CI testing, and Socratic AI mentoring.',
    url: baseUrl,
    siteName: 'RepoHamster',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RepoHamster Platform Preview - Real Repository Assessments',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RepoHamster | Real Repository Assessments',
    description: 'Break bugs. Ship fixes. Real-world repository OAs with GitHub Codespaces and automated CI testing.',
    creator: '@repohamster',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/icon.png', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${baseUrl}/#app`,
      name: 'RepoHamster',
      url: baseUrl,
      description:
        'Developer debugging and technical assessment platform featuring authentic multi-file GitHub repository challenges.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All (Web, Linux, macOS, Windows)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Authentic multi-file GitHub repository challenges',
        '1-Click GitHub Codespaces integration with zero local setup',
        'Automated GitHub Actions CI test verification',
        'Socratic AI engineering guidance and multi-IDE anti-cheat guardrails',
      ],
    },
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'RepoHamster',
      url: baseUrl,
      logo: `${baseUrl}/icon.png`,
      sameAs: ['https://github.com/civdix/repoHamster'],
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'RepoHamster',
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--gh-bg)] text-[var(--gh-text)] antialiased selection:bg-[var(--yellow-primary)]/30 selection:text-inherit flex flex-col transition-colors duration-200 overflow-x-hidden max-w-full">
        <SessionProvider>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <Navbar />
          <ReviewerModeBanner />
          <main className="flex-1 overflow-x-hidden w-full max-w-full">{children}</main>
          <footer className="border-t border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] py-8 text-xs text-[var(--gh-text-muted)] transition-colors">
            <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--gh-bg)] border border-[var(--gh-border)] shadow-sm">
                  <HamsterMascot variant="avatar" size={22} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold text-[var(--gh-text)] font-sans">
                    Repo<span className="text-[var(--yellow-bright)]">Hamster</span>
                  </span>
                  <span className="text-[11px] text-[var(--gh-text-muted)] font-mono">— Break Bugs. Ship Fixes.</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2 text-[11px] font-mono text-[var(--gh-text-secondary)]">
                <Link href="/dashboard" className="hover:text-[var(--yellow-primary)] transition">Challenges</Link>
                <Link
                  href="/traffic-lab"
                  className="hover:text-[var(--yellow-bright)] transition inline-flex items-center space-x-1.5 text-[var(--yellow-bright)]/90 font-semibold"
                >
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] animate-pulse" />
                  <span>Traffic Lab (Coming Soon)</span>
                </Link>
                <Link href="/contact" className="hover:text-[var(--yellow-primary)] transition">Enterprise &amp; Campus</Link>
                <Link href="/admin" className="hover:text-[var(--gh-text)] transition">Admin Console</Link>
                <span className="text-[var(--gh-text-muted)]">© 2026 repoHamster</span>
              </div>
            </div>
          </footer>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
