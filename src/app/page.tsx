import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  Terminal,
  Code2,
  GitPullRequest,
  CheckCircle2,
  ShieldAlert,
  Bot,
  Zap,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers,
} from 'lucide-react';
import prisma from '@/lib/db';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  let assignmentsCount = 5;
  try {
    assignmentsCount = await prisma.assignment.count();
  } catch (err) {
    // fallback
  }

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-accent-cyan mb-6 backdrop-blur">
            <Zap className="h-3.5 w-3.5" />
            <span>Next-Generation Technical Debugging Assessment</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Real Software Bugs.{' '}
            <span className="bg-gradient-to-r from-accent-cyan via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Real Repositories.
            </span>{' '}
            Automated Evaluation.
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Evaluate engineering talent where real work happens: in GitHub repositories with Codespaces,
            multi-layered public and hidden test suites, and controlled AI assistance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 rounded-xl bg-accent-cyan px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition"
              >
                <span>Go to Candidate Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-2 rounded-xl bg-accent-cyan px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition"
                >
                  <span>Sign In with GitHub</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-2 rounded-xl border border-card-border bg-card px-6 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  <Terminal className="h-4 w-4 text-purple-400" />
                  <span>Admin & Demo Access</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 4 Feature Columns */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-card-border bg-card/60 p-6 backdrop-blur transition hover:border-slate-700">
            <div className="h-10 w-10 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-accent-cyan mb-4">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-base">GitHub Codespaces</h3>
            <p className="mt-2 text-sm text-slate-400">
              One-click cloud environment setup. Candidates debug inside full-fledged VS Code browser instances with zero local toolchain setup.
            </p>
          </div>

          <div className="rounded-xl border border-card-border bg-card/60 p-6 backdrop-blur transition hover:border-slate-700">
            <div className="h-10 w-10 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-accent-indigo mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Hidden Test Suites</h3>
            <p className="mt-2 text-sm text-slate-400">
              Untrusted candidate code cannot see hidden edge cases or pass by hardcoding test returns. Verification is isolated and authoritative.
            </p>
          </div>

          <div className="rounded-xl border border-card-border bg-card/60 p-6 backdrop-blur transition hover:border-slate-700">
            <div className="h-10 w-10 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-4">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Controlled AI Assist</h3>
            <p className="mt-2 text-sm text-slate-400">
              Configurable daily quotas, token caps, and Socratic guidance. Candidates can ask questions without having solutions given away.
            </p>
          </div>

          <div className="rounded-xl border border-card-border bg-card/60 p-6 backdrop-blur transition hover:border-slate-700">
            <div className="h-10 w-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-accent-emerald mb-4">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Webhook Automated PRs</h3>
            <p className="mt-2 text-sm text-slate-400">
              Native GitHub webhooks detect every commit, execute containerized test jobs, record audit trails, and stream real-time logs.
            </p>
          </div>
        </div>

        {/* 5 Repositories Showcase */}
        <div className="mt-20 rounded-2xl border border-card-border bg-[#0d1424] p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-card-border gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent-cyan">Standard Curriculum</span>
              <h2 className="text-2xl font-bold text-white mt-1">Five Predefined Debugging Challenges</h2>
            </div>
            <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-mono text-slate-300">
              {assignmentsCount} Active Repositories
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-lg border border-card-border bg-card p-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-accent-cyan">TypeScript / Next.js</span>
                <span className="text-amber-400">INTERMEDIATE</span>
              </div>
              <h4 className="font-semibold text-white text-sm">E-Commerce Checkout Concurrency</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Fix inventory double-allocation race conditions and sliding-window rate limiter timestamp leaks.
              </p>
            </div>

            <div className="rounded-lg border border-card-border bg-card p-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-emerald-400">Python / FastAPI</span>
                <span className="text-amber-400">INTERMEDIATE</span>
              </div>
              <h4 className="font-semibold text-white text-sm">JWT Auth Revocation & Roles</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Patch timezone-naive token expiration parsing and role authorization case-sensitivity escalation.
              </p>
            </div>

            <div className="rounded-lg border border-card-border bg-card p-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-indigo-400">Node.js / Worker</span>
                <span className="text-rose-400">ADVANCED</span>
              </div>
              <h4 className="font-semibold text-white text-sm">Distributed Event Queue Deadlock</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Resolve worker unhandled rejection lockups and circular retry counter heap memory exhaustion.
              </p>
            </div>

            <div className="rounded-lg border border-card-border bg-card p-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-cyan-400">Go / Gin</span>
                <span className="text-rose-400">ADVANCED</span>
              </div>
              <h4 className="font-semibold text-white text-sm">Metrics Aggregator Goroutine Leak</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Diagnose unbuffered channels blocking on context cancellation and concurrent slice append data races.
              </p>
            </div>

            <div className="rounded-lg border border-card-border bg-card p-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-amber-400">Python / Data</span>
                <span className="text-emerald-400">BEGINNER</span>
              </div>
              <h4 className="font-semibold text-white text-sm">Financial Ledger Precision Loss</h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Eliminate binary floating point drift and implement banking standard Round-Half-Up arithmetic.
              </p>
            </div>

            <div className="rounded-lg border border-dashed border-card-border bg-card/30 p-4 flex flex-col justify-center items-center text-center">
              <Layers className="h-6 w-6 text-slate-500 mb-2" />
              <p className="text-xs font-medium text-slate-300">Custom Assignment Extensible</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Admins can connect and manage any new GitHub repository directly from the Admin console.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
