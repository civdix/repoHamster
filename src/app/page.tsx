import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import {
  ArrowRight,
  Terminal,
  Check,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { LandingFaq } from '@/components/landing/LandingFaq';
import { LandingBentoGrid } from '@/components/landing/LandingBentoGrid';
import { LandingHeroWorkstation } from '@/components/landing/LandingHeroWorkstation';
import { GitHubRepoCard } from '@/components/github/GitHubRepoCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  let assignments: any[] = [];
  let vishakhaUser: { name: string | null; avatarUrl: string | null } | null = null;
  let civdixUser: { name: string | null; avatarUrl: string | null } | null = null;

  try {
    const [fetchedAssignments, u1, u2] = await Promise.all([
      prisma.assignment.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.findFirst({
        where: {
          OR: [
            { username: { contains: 'vishakha', mode: 'insensitive' } },
            { name: { contains: 'vishakha', mode: 'insensitive' } },
            { email: { contains: 'vishakha', mode: 'insensitive' } },
          ],
        },
        select: { name: true, avatarUrl: true },
      }),
      prisma.user.findFirst({
        where: {
          OR: [
            { username: { contains: 'civdix', mode: 'insensitive' } },
            { name: { contains: 'civdix', mode: 'insensitive' } },
          ],
        },
        select: { name: true, avatarUrl: true },
      }),
    ]);
    assignments = fetchedAssignments;
    vishakhaUser = u1;
    civdixUser = u2;
  } catch (err) {
    // fallback gracefully
  }

  const vishakhaAvatar =
    vishakhaUser?.avatarUrl || 'https://avatars.githubusercontent.com/u/184405638?v=4';
  const civdixAvatar =
    civdixUser?.avatarUrl || 'https://avatars.githubusercontent.com/u/113282955?v=4';

  return (
    <div className="relative overflow-hidden bg-dev-grid text-[var(--gh-text)] min-h-screen">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] sm:h-[600px] bg-radial-glow pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-12 sm:pt-14 sm:pb-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-5">
          {/* Eyebrow badge with mascot avatar */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-1 text-xs font-mono font-medium text-[var(--gh-text-muted)] backdrop-blur shadow-sm">
            <span className="flex h-4 w-4 items-center justify-center">
              <HamsterMascot variant="normal" size={18} />
            </span>
            <span className="text-[var(--yellow-bright)] font-bold">RepoHamster</span>
            <span className="text-[var(--gh-text-dim)]">•</span>
            <span>Break Bugs. Ship Fixes.</span>
          </div>

          {/* Main Headline (Yellow + Dark) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--gh-text)] leading-[1.15] font-sans">
            The Code Has Bugs.{' '}
            <span className="text-[var(--yellow-bright)] drop-shadow-[0_0_20px_var(--yellow-glow)]">
              Let&apos;s Find Them.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xs sm:text-base text-[var(--gh-text-muted)] max-w-2xl mx-auto leading-relaxed font-sans">
            Real-world debugging in authentic GitHub repositories. Launch cloud Codespaces, consult Socratic AI, and prove your engineering skills with hidden test evaluation.
          </p>

          {/* Primary CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center space-x-2 rounded-xl bg-[var(--yellow-button-bg)] px-6 py-3 text-xs sm:text-sm font-bold text-[var(--yellow-button-text)] shadow-sm hover:bg-[var(--yellow-button-hover)] transition active:scale-95"
                >
                  <span>Go to Challenges</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/guide"
                  className="flex items-center justify-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-5 py-3 text-xs sm:text-sm font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-[var(--yellow-bright)] transition active:scale-95"
                >
                  <Terminal className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <span>How It Works</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center space-x-2 rounded-xl bg-[var(--yellow-button-bg)] px-6 py-3 text-xs sm:text-sm font-bold text-[var(--yellow-button-text)] shadow-sm hover:bg-[var(--yellow-button-hover)] transition active:scale-95"
                >
                  <span>Start Debugging</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/guide"
                  className="flex items-center justify-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-5 py-3 text-xs sm:text-sm font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-[var(--yellow-bright)] transition active:scale-95"
                >
                  <Terminal className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <span>How It Works</span>
                </Link>
              </>
            )}
          </div>

          {/* Trust Metrics */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-mono text-[var(--gh-text-muted)]">
            <span className="flex items-center">
              <Check className="mr-1 h-3.5 w-3.5 text-[var(--yellow-bright)] shrink-0" /> 1-Click Codespaces
            </span>
            <span className="flex items-center">
              <Check className="mr-1 h-3.5 w-3.5 text-[var(--yellow-bright)] shrink-0" /> Hidden Test Harness
            </span>
            <span className="flex items-center">
              <Check className="mr-1 h-3.5 w-3.5 text-[var(--yellow-bright)] shrink-0" /> Socratic Hamster AI
            </span>
            <span className="flex items-center">
              <Check className="mr-1 h-3.5 w-3.5 text-[var(--yellow-bright)] shrink-0" /> Verified Profiles
            </span>
          </div>
        </div>

        {/* Hero Workstation Live Showcase Card */}
        <div className="mt-8 sm:mt-12 mx-auto max-w-4xl">
          <LandingHeroWorkstation />
        </div>
      </section>

      {/* 2. BENTO GRID SECTION (Core Architecture) */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--gh-text)] tracking-tight">
            Engineered Like GitHub. Built for Craft.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--gh-text-muted)] leading-relaxed">
            Everything you need to test engineering depth—from cloud IDEs to secret test harnesses and verified portfolios.
          </p>
        </div>

        {/* The Responsive Bento Grid */}
        <LandingBentoGrid />
      </section>

      {/* 3. Explore Debugging Challenges (Curriculum Catalog) */}
      <section id="challenges" className="relative mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
              Curriculum Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)] mt-1">Explore Debugging Challenges</h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-muted)] max-w-xl">
              Each repository represents an authentic bug or vulnerability. Pass all hidden assertions to prove mastery.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-4 py-2 text-xs font-semibold text-[var(--gh-text)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/50 transition"
          >
            <span>View All Challenges</span>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {assignments.map((assignment) => (
            <GitHubRepoCard
              key={assignment.id}
              title={assignment.title}
              slug={assignment.slug}
              description={assignment.description}
              language={assignment.language}
              difficulty={assignment.difficulty}
              isPassed={false}
              status="AVAILABLE"
            />
          ))}
        </div>
      </section>

      {/* 4. Why Developers Love RepoHamster (Testimonials & Social Proof) */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
            Developer Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)]">
            Built for Engineers Who Care About Craft
          </h2>
          <p className="text-xs sm:text-sm text-[var(--gh-text-muted)]">
            Developers love solving real software bugs in familiar GitHub environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Vishakha Chaudhary */}
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 space-y-3 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;The 1-Click Codespaces setup had the codebase running in 30 seconds with zero runtime hassle. Traced the concurrency race condition with Hamster AI and shipped a passing PR.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vishakhaAvatar}
                alt="Vishakha Chaudhary"
                className="h-9 w-9 rounded-full object-cover border border-[var(--yellow-primary)]/50 shadow-sm"
              />
              <div>
                <p className="text-xs font-bold text-[var(--gh-text)] flex items-center space-x-1">
                  <span>Vishakha Chaudhary</span>
                  <span className="text-[10px] text-[var(--yellow-bright)]">✓</span>
                </p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                  @vishakhaa05 • Full-Stack Engineer
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Shivam Dixit (civdix) */}
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 space-y-3 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;RepoHamster mirrors actual engineering far better than leetcode puzzles. The hidden test harness catches edge cases, memory leaks, and race conditions that normal tests miss.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={civdixAvatar}
                alt="Shivam Dixit"
                className="h-9 w-9 rounded-full object-cover border border-[var(--yellow-primary)]/50 shadow-sm"
              />
              <div>
                <p className="text-xs font-bold text-[var(--gh-text)] flex items-center space-x-1">
                  <span>Shivam Dixit</span>
                  <span className="text-[10px] text-[var(--yellow-bright)]">✓</span>
                </p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                  @civdix • Core Systems &amp; Backend
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Anonymous Review */}
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 space-y-3 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;Seeing a candidate isolate regressions, review CI logs, and commit clean fixes in real codebases is 10x more informative than any whiteboard interview.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              <div className="h-9 w-9 rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center p-1.5 shadow-sm">
                <HamsterMascot variant="normal" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--gh-text)] flex items-center space-x-1">
                  <span>Verified Engineer</span>
                  <span className="text-[10px] text-[var(--yellow-bright)]">✓</span>
                </p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                  Staff Infrastructure (FAANG)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)]">Frequently Asked Questions</h2>
        </div>

        <LandingFaq />
      </section>

      {/* 6. Call to Action Banner (Yellow + Dark) */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl border border-[var(--yellow-primary)]/50 bg-[var(--amber-badge-bg)]/60 p-6 sm:p-10 lg:p-12 text-center relative overflow-hidden shadow-[var(--yellow-glow-lg)]">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3.5">
            <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[var(--gh-bg-secondary)] border border-[var(--yellow-primary)]/60 shadow-[var(--yellow-glow)] p-1">
              <HamsterMascot variant="normal" size={38} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)] tracking-tight font-sans">
              Ready to break bugs and ship fixes?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
              Sign in with your GitHub account, launch Codespaces in seconds, and prove your real-world debugging prowess with RepoHamster.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/signin"
                className="inline-flex items-center space-x-2 rounded-xl bg-[var(--yellow-button-bg)] px-7 py-3 text-xs sm:text-sm font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-sm active:scale-95"
              >
                <span>Start Debugging Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
