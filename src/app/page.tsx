import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import {
  Code2,
  GitPullRequest,
  CheckCircle2,
  Shield,
  Bot,
  Zap,
  ArrowRight,
  Terminal,
  Lock,
  Layers,
  Sparkles,
  Cpu,
  Timer,
  Check,
  ExternalLink,
  Flame,
  BookMarked,
  Award,
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-radial-glow pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow badge with mascot avatar */}
          <div className="inline-flex items-center space-x-2.5 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3.5 py-1 text-xs font-mono font-medium text-[var(--gh-text-muted)] backdrop-blur shadow-sm">
            <span className="flex h-5 w-5 items-center justify-center">
              <HamsterMascot variant="normal" size={20} />
            </span>
            <span className="text-[var(--yellow-bright)] font-bold">RepoHamster v1.0</span>
            <span className="text-[var(--gh-text-dim)]">•</span>
            <span>Break Bugs. Ship Fixes.</span>
          </div>

          {/* Main Headline (Yellow + Dark) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--gh-text)] leading-[1.1] font-sans">
            The Code Has Bugs.{' '}
            <span className="text-[var(--yellow-bright)] drop-shadow-[0_0_25px_var(--yellow-glow)]">
              Let&apos;s Find Them.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-[var(--gh-text-muted)] max-w-2xl mx-auto leading-relaxed font-sans">
            Real-world debugging challenges. AI-assisted problem solving. Automated evaluation.
            Prove your engineering skills one bug at a time in authentic GitHub environments.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex w-full sm:w-auto items-center justify-center space-x-2.5 rounded-xl bg-[var(--yellow-button-bg)] px-7 py-3.5 text-sm font-bold text-[var(--yellow-button-text)] shadow-[var(--yellow-glow-lg)] hover:bg-[var(--yellow-button-hover)] transition active:scale-95"
                >
                  <span>Go to Candidate Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/guide"
                  className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-6 py-3.5 text-sm font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-[var(--yellow-bright)] transition active:scale-95"
                >
                  <Terminal className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <span>How to Use Guide</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="flex w-full sm:w-auto items-center justify-center space-x-2.5 rounded-xl bg-[var(--yellow-button-bg)] px-7 py-3.5 text-sm font-bold text-[var(--yellow-button-text)] shadow-[var(--yellow-glow-lg)] hover:bg-[var(--yellow-button-hover)] transition active:scale-95"
                >
                  <span>Start Debugging</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/guide"
                  className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-6 py-3.5 text-sm font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-[var(--yellow-bright)] transition active:scale-95"
                >
                  <Terminal className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <span>How to Use Guide</span>
                </Link>
              </>
            )}
          </div>

          {/* Trust Metrics Pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[var(--gh-text-muted)]">
            <span className="flex items-center">
              <Check className="mr-1.5 h-3.5 w-3.5 text-[var(--yellow-bright)]" /> 1-Click Codespaces IDE
            </span>
            <span className="flex items-center">
              <Check className="mr-1.5 h-3.5 w-3.5 text-[var(--yellow-bright)]" /> Authoritative Hidden Tests
            </span>
            <span className="flex items-center">
              <Check className="mr-1.5 h-3.5 w-3.5 text-[var(--yellow-bright)]" /> Controlled Hamster AI
            </span>
          </div>
        </div>

        {/* Hero Workstation Live Showcase Card */}
        <div className="mt-14 mx-auto max-w-4xl">
          <LandingHeroWorkstation />
        </div>
      </section>

      {/* 2. BENTO GRID SECTION (User Requested Highlight) */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
            Platform Architecture &amp; Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--gh-text)] tracking-tight">
            Engineered Like GitHub. Built for Craft.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--gh-text-muted)] leading-relaxed">
            Everything you need to test true engineering judgment—from zero-config cloud IDEs to secret test harnesses and shareable developer profiles.
          </p>
        </div>

        {/* The Responsive Bento Grid */}
        <LandingBentoGrid />
      </section>

      {/* 3. Explore Debugging Challenges (Curriculum Catalog) */}
      <section id="challenges" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
              Curriculum Catalog
            </span>
            <h2 className="text-3xl font-extrabold text-[var(--gh-text)] mt-1">Explore Debugging Challenges</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[var(--gh-text-muted)] max-w-xl">
              Each repository represents a real production bug or vulnerability. Pass all hidden assertions to prove mastery.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
            Developer Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--gh-text)]">
            Built for Engineers Who Care About Craft
          </h2>
          <p className="text-xs sm:text-sm text-[var(--gh-text-muted)]">
            Developers love solving real software bugs in familiar GitHub environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Vishakha Chaudhary */}
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;The instant 1-Click Codespaces setup is incredible. I didn&apos;t waste hours configuring runtimes; within 30 seconds I had the codebase running, traced the concurrency race condition, used Hamster AI for Socratic invariant hints, and shipped a passing PR.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vishakhaAvatar}
                alt="Vishakha Chaudhary"
                className="h-10 w-10 rounded-full object-cover border border-[var(--yellow-primary)]/50 shadow-sm"
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
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;RepoHamster mirrors real-life software engineering far better than leetcode puzzles. The hidden test harnesses catch actual production edge cases, memory leaks, and rate-limiting bugs that standard unit tests overlook.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={civdixAvatar}
                alt="Shivam Dixit"
                className="h-10 w-10 rounded-full object-cover border border-[var(--yellow-primary)]/50 shadow-sm"
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
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;The developer profile and 52-week streak calendar give genuine proof-of-work. In tech hiring, seeing a candidate systematically isolate regressions, review CI logs, and commit clean fixes is 10x more informative than any synthetic whiteboard interview.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              <div className="h-10 w-10 rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center p-1.5 shadow-sm">
                <HamsterMascot variant="normal" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--gh-text)] flex items-center space-x-1">
                  <span>Verified Engineer</span>
                  <span className="text-[10px] text-[var(--yellow-bright)]">✓</span>
                </p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                  @anonymous • Staff Infrastructure (FAANG)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-[var(--gh-text)]">Frequently Asked Questions</h2>
        </div>

        <LandingFaq />
      </section>

      {/* 6. Call to Action Banner (Yellow + Dark) */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--yellow-primary)]/50 bg-[var(--amber-badge-bg)]/60 p-8 sm:p-12 text-center relative overflow-hidden shadow-[var(--yellow-glow-lg)]">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gh-bg-secondary)] border border-[var(--yellow-primary)]/60 shadow-[var(--yellow-glow)] p-1">
              <HamsterMascot variant="normal" size={44} />
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--gh-text)] tracking-tight font-sans">
              Ready to break bugs and ship fixes?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
              Sign in with your GitHub account, launch Codespaces in seconds, and prove your real-world debugging prowess with RepoHamster.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/signin"
                className="inline-flex items-center space-x-2 rounded-xl bg-[var(--yellow-button-bg)] px-8 py-3.5 text-sm font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-[var(--yellow-glow-lg)] active:scale-95"
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
