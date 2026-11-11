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
import { GitHubRepoCard } from '@/components/github/GitHubRepoCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  let assignments: any[] = [];
  try {
    assignments = await prisma.assignment.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: 'asc' },
    });
  } catch (err) {
    // fallback
  }

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
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
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
                  className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-6 py-3.5 text-sm font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-white transition active:scale-95"
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
                  className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-6 py-3.5 text-sm font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-white transition active:scale-95"
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

        {/* Hero Workstation Illustration Card */}
        <div className="mt-14 mx-auto max-w-4xl">
          <div className="relative rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-0.5 text-[11px] font-mono text-[var(--amber-badge-text)] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] animate-ping" />
                <span>Hamster Workstation v1.0.4</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-sans">
                Real Outages. Real Repositories. Real PRs.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--gh-text-muted)] leading-relaxed">
                Connect directly with your GitHub account. No fake leetcode questions—tackle concurrency race conditions, memory leaks, and broken API contracts in a real multi-file codebase.
              </p>
              <div className="flex items-center space-x-3 pt-2 font-mono text-xs">
                <span className="rounded-md bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2.5 py-1 text-[var(--yellow-bright)]">
                  codespaces.new/repohamster
                </span>
                <span className="text-[var(--gh-text-dim)]">•</span>
                <span className="text-slate-300">100% Automated Runner</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-center p-4 rounded-2xl bg-[var(--gh-bg)] border border-[var(--gh-border)] shadow-[var(--yellow-glow)]">
              <HamsterMascot variant="normal" size={140} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO GRID SECTION (User Requested Highlight) */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--yellow-bright)] font-bold">
            Platform Architecture &amp; Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
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
            <h2 className="text-3xl font-extrabold text-white mt-1">Explore Debugging Challenges</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[var(--gh-text-muted)] max-w-xl">
              Each repository represents a real production bug or vulnerability. Pass all hidden assertions to prove mastery.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-[var(--yellow-primary)]/50 transition"
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Engineers Who Care About Craft
          </h2>
          <p className="text-xs sm:text-sm text-[var(--gh-text-muted)]">
            Developers love solving real software bugs in familiar GitHub environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;The Codespaces integration is seamless. I didn&apos;t have to spend 2 hours configuring local Go and Python runtimes; I clicked launch, reproduced the race condition, and opened a PR.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-[var(--gh-border-subtle)]">
              <div className="h-8 w-8 rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center font-bold text-xs text-[var(--amber-badge-text)]">
                SC
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Sarah Connor</p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">Senior Distributed Systems Engineer</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;Finally an assessment platform that evaluates real engineering judgment. The hidden test suite caught a subtle edge case in our rate limiter that traditional tests completely missed.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-[var(--gh-border-subtle)]">
              <div className="h-8 w-8 rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center font-bold text-xs text-[var(--amber-badge-text)]">
                AC
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Alex Chen</p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">Full-Stack Architect</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-1 text-[var(--yellow-bright)]">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;The developer profile and 52-week contribution calendar give me complete visibility into how engineers think, their commit history, test results, and their AI queries.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-[var(--gh-border-subtle)]">
              <div className="h-8 w-8 rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center font-bold text-xs text-[var(--amber-badge-text)]">
                MV
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Marcus Vance</p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">VP of Engineering</p>
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
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
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
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">
              Ready to break bugs and ship fixes?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
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
