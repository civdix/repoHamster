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
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { LandingFaq } from '@/components/landing/LandingFaq';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  let assignments: any[] = [];
  try {
    assignments = await prisma.assignment.findMany({
      where: { isActive: true },
      take: 5,
      orderBy: { createdAt: 'asc' },
    });
  } catch (err) {
    // fallback
  }

  const difficultyBadge = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return 'border-brand-lime/40 bg-lime-950/40 text-brand-lime';
      case 'INTERMEDIATE':
        return 'border-amber-800/40 bg-amber-950/40 text-amber-400';
      case 'ADVANCED':
        return 'border-rose-800/40 bg-rose-950/40 text-rose-400';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="relative overflow-hidden bg-dev-grid">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-radial-glow pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow badge with mascot avatar */}
          <div className="inline-flex items-center space-x-2.5 rounded-full border border-card-border bg-card/80 px-3.5 py-1 text-xs font-mono font-medium text-slate-300 mb-6 backdrop-blur shadow-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-lime/10">
              <HamsterMascot variant="avatar" size={16} />
            </span>
            <span className="text-brand-lime font-semibold">RepoHamster v1.0</span>
            <span className="text-slate-600">•</span>
            <span>Break Bugs. Ship Fixes.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            The Code Has Bugs.{' '}
            <span className="bg-gradient-to-r from-brand-lime via-emerald-300 to-brand-purple bg-clip-text text-transparent">
              Let&apos;s Find Them.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Real-world debugging challenges. AI-assisted problem solving. Automated evaluation.
            Prove your engineering skills one bug at a time.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="flex w-full sm:w-auto items-center justify-center space-x-2.5 rounded-xl bg-brand-lime px-7 py-3.5 text-sm font-bold text-slate-950 shadow-glow-lime hover:bg-brand-lime-light transition"
              >
                <span>Go to Candidate Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="flex w-full sm:w-auto items-center justify-center space-x-2.5 rounded-xl bg-brand-lime px-7 py-3.5 text-sm font-bold text-slate-950 shadow-glow-lime hover:bg-brand-lime-light transition"
                >
                  <span>Start Debugging</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#challenges"
                  className="flex w-full sm:w-auto items-center justify-center space-x-2 rounded-xl border border-card-border bg-card px-6 py-3.5 text-sm font-semibold text-slate-300 hover:bg-card-hover hover:text-white transition"
                >
                  <Terminal className="h-4 w-4 text-brand-purple" />
                  <span>Explore Challenges</span>
                </a>
              </>
            )}
          </div>

          {/* Trust Metrics Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span className="flex items-center">
              <Check className="mr-1.5 h-3.5 w-3.5 text-brand-lime" /> 1-Click Codespaces IDE
            </span>
            <span className="flex items-center">
              <Check className="mr-1.5 h-3.5 w-3.5 text-brand-purple" /> Authoritative Hidden Tests
            </span>
            <span className="flex items-center">
              <Check className="mr-1.5 h-3.5 w-3.5 text-brand-lime" /> Controlled Hamster AI
            </span>
          </div>
        </div>

        {/* Hero Workstation Illustration */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="relative rounded-2xl border border-card-border bg-[#0d101a]/90 p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute -top-3 left-6 flex items-center space-x-2 rounded-full border border-card-border bg-[#131826] px-3 py-0.5 text-[11px] font-mono text-slate-400">
              <span className="h-2 w-2 rounded-full bg-brand-lime animate-ping" />
              <span>Hamster Workstation v1.0.4</span>
            </div>
            <HamsterMascot variant="workstation" />
          </div>
        </div>
      </section>

      {/* 2. How RepoHamster Works */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-card-border/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-lime font-semibold">
            Workflow Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            How RepoHamster Evaluates Engineering Talent
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            No trivia questions or artificial leetcode puzzles. Pure real-world software debugging in realistic Git repositories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="rounded-xl border border-card-border bg-card p-6 relative">
            <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-700">01</div>
            <div className="h-10 w-10 rounded-xl bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Select Challenge</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Choose from 5 production-grade codebases in TypeScript, Python, or Go, each with deliberate concurrency bugs, memory leaks, or CVEs.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-card-border bg-card p-6 relative">
            <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-700">02</div>
            <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-brand-purple mb-4">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Launch Codespaces</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              One click opens the exact repository in GitHub Codespaces. Full VS Code in your browser with pre-installed runtimes and dependencies.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-card-border bg-card p-6 relative">
            <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-700">03</div>
            <div className="h-10 w-10 rounded-xl bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime mb-4">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Controlled AI Assist</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Stuck on a tricky stack trace? Ask the Socratic Hamster AI Assistant. Token budgets and quotas prevent cheating while guiding your diagnosis.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border border-card-border bg-card p-6 relative">
            <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-slate-700">04</div>
            <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-brand-purple mb-4">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">PR & Hidden Tests</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Open a GitHub Pull Request. Webhooks trigger our isolated test runner, executing public tests and authoritative hidden security test suites.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Explore Debugging Challenges */}
      <section id="challenges" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-card-border/60">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-lime font-semibold">
              Curriculum Catalog
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Explore Debugging Challenges</h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Each repository represents a real production outage or vulnerability. Pass all hidden assertions to prove mastery.
            </p>
          </div>

          <Link
            href="/auth/signin"
            className="flex items-center space-x-1.5 rounded-xl border border-card-border bg-card px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-card-hover transition"
          >
            <span>View All Challenges</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col justify-between rounded-xl border border-card-border bg-card p-6 hover:border-slate-700 hover:bg-card-hover transition group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase ${difficultyBadge(
                      assignment.difficulty
                    )}`}
                  >
                    {assignment.difficulty}
                  </span>
                  <span className="flex items-center text-xs font-mono text-slate-400">
                    <Timer className="mr-1 h-3.5 w-3.5 text-slate-500" />
                    ~{assignment.estimatedTimeMinutes} min
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-brand-lime transition line-clamp-1">
                  {assignment.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {assignment.description}
                </p>

                <div className="mt-4 flex items-center space-x-2 text-[11px] font-mono text-slate-400 border-t border-card-border pt-3">
                  <span className="text-brand-purple font-semibold">{assignment.language}</span>
                  <span>•</span>
                  <span>{assignment.framework}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-card-border pt-4">
                <Link
                  href={`/assignments/${assignment.slug}`}
                  className="flex w-full items-center justify-center space-x-2 rounded-lg bg-card border border-card-border py-2 text-xs font-semibold text-slate-200 group-hover:bg-brand-lime group-hover:text-slate-950 group-hover:border-transparent transition"
                >
                  <span>Inspect Challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. AI-Assisted Development Deep Dive */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-card-border/60">
        <div className="rounded-2xl border border-card-border bg-[#0d101a] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-full border border-purple-800/50 bg-purple-950/40 px-3 py-1 text-xs font-mono text-brand-purple-light">
                <Sparkles className="h-3.5 w-3.5 text-brand-purple" />
                <span>Controlled Socratic Mentorship</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                AI Assistance That Coaches, Not Cheats
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Most AI tools just paste the answer, defeating the purpose of an engineering assessment.
                RepoHamster uses a strictly controlled Socratic AI Assistant with daily query and token quotas.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    <strong className="text-white">Daily Credit Limits:</strong> 15 questions & 10,000 tokens per candidate, tracked in PostgreSQL with rolling 24-hour resets.
                  </span>
                </div>
                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    <strong className="text-white">Zero Spoiler Policy:</strong> Mentors the candidate through architectural hints, stack trace analysis, and reproduction logs without generating direct code fixes.
                  </span>
                </div>
                <div className="flex items-start space-x-3 text-xs text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    <strong className="text-white">Auditable Query History:</strong> Administrators can inspect every question asked by each candidate to evaluate their debugging thought process.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="rounded-2xl border border-card-border bg-[#131826] p-6 shadow-xl w-full max-w-sm text-center space-y-4">
                <HamsterMascot variant="thinking" size={90} className="mx-auto" />
                <div className="rounded-xl border border-card-border bg-[#0a0d14] p-3 text-left font-mono text-[11px] text-slate-300">
                  <p className="text-brand-purple font-semibold">Hamster Assistant:</p>
                  <p className="text-slate-400 mt-1 italic">
                    &quot;Notice how `Date.now() - windowMs` compares timestamps. If you prune on read, check if your mutex lock covers the eviction array mutation.&quot;
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-card-border pt-3">
                  <span>Quota: <strong className="text-brand-lime">14/15 left</strong></span>
                  <span>9,420 tokens left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Automated Testing & Evaluation Engine */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-card-border/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-purple-light font-semibold">
            Execution Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Isolated Sandboxes & Authoritative Hidden Tests
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Never trust client-side or candidate GitHub Action results. All submissions are verified on isolated test workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-brand-purple mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Hidden Test Suites</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Maintained strictly in RepoHamster&apos;s secure database. Tests execute on candidate commits without ever exposing assertion code, expected outputs, or test payloads.
            </p>
          </div>

          <div className="rounded-xl border border-card-border bg-card p-6">
            <div className="h-10 w-10 rounded-xl bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Sanitized Worker Sandboxes</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Execution environment scrubs all host secrets (`DATABASE_URL`, API keys). Enforces 30-second kill timeouts and isolated memory buffers to prevent resource exhaustion.
            </p>
          </div>

          <div className="rounded-xl border border-card-border bg-card p-6">
            <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-brand-purple mb-4">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Commit SHA Idempotency</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Each unique commit SHA is cryptographically verified against the candidate&apos;s PR. Redundant evaluations are skipped, while new pushed commits trigger fresh runs.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Why Developers Love RepoHamster */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-card-border/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-lime font-semibold">
            Developer Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Built for Engineers Who Care About Craft
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Real developers love solving real software bugs in familiar GitHub environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-card-border bg-card p-6 space-y-4">
            <div className="flex items-center space-x-1 text-brand-lime">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;The Codespaces integration is seamless. I didn&apos;t have to spend 2 hours configuring local Go and Python runtimes; I clicked launch, reproduced the race condition, and opened a PR.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-card-border">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                SC
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Sarah Connor</p>
                <p className="text-[10px] text-slate-400 font-mono">Senior Distributed Systems Engineer</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card p-6 space-y-4">
            <div className="flex items-center space-x-1 text-brand-lime">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;Finally an assessment platform that evaluates real engineering judgment. The hidden test suite caught a subtle edge case in our rate limiter that traditional tests completely missed.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-card-border">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                AC
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Alex Chen</p>
                <p className="text-[10px] text-slate-400 font-mono">Full-Stack Architect</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card p-6 space-y-4">
            <div className="flex items-center space-x-1 text-brand-lime">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              &quot;As an engineering director, the candidate inspector gives me complete visibility into how candidates think, their commit history, test results, and even their AI queries.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-card-border">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                MV
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Marcus Vance</p>
                <p className="text-[10px] text-slate-400 font-mono">VP of Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-card-border/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-lime font-semibold">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
        </div>

        <LandingFaq />
      </section>

      {/* 8. Call to Action Banner */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-brand-lime/30 bg-gradient-to-r from-lime-950/30 via-card to-purple-950/30 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-brand-lime/50 shadow-glow-lime">
              <HamsterMascot variant="avatar" size={36} />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Ready to break bugs and ship fixes?
            </h2>
            <p className="text-sm text-slate-300">
              Sign in with your GitHub account, launch Codespaces in seconds, and prove your real-world debugging prowess.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/signin"
                className="inline-flex items-center space-x-2 rounded-xl bg-brand-lime px-8 py-3.5 text-sm font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime"
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
