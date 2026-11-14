'use client';

import Link from 'next/link';
import {
  Laptop,
  Bot,
  Lock,
  Award,
  Zap,
  GitPullRequest,
  Flame,
  ExternalLink,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export function LandingBentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-4 sm:gap-5 text-[var(--gh-text)]">
      {/* =========================================================================
          BENTO ITEM 1 (Spans 8 cols on LG): 1-Click GitHub Codespaces Workspace
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-8 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,var(--yellow-glow),transparent_70%)] pointer-events-none" />

        <div className="space-y-3 sm:space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
              <Laptop className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Zero-Config Cloud IDE</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[var(--gh-text-muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] animate-pulse" />
              <span>Devcontainers Pre-Wired</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              1-Click GitHub Codespaces
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-muted)] leading-relaxed font-sans max-w-xl">
              Launch a full VS Code cloud editor in seconds. Pre-installed runtimes (Node, Python, Go), debugger configurations, and test suites are ready instantly.
            </p>
          </div>

          {/* Interactive Terminal Mockup */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-code)] p-3 sm:p-4 font-mono text-xs shadow-inner space-y-1.5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--gh-border-subtle)] pb-2 text-[10px] text-[var(--gh-text-dim)]">
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--status-error)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--yellow-primary)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)]" />
                <span className="ml-1 text-[var(--gh-text-muted)] truncate max-w-[140px] sm:max-w-none">
                  codespaces-workspace-7v3
                </span>
              </div>
              <span className="text-[var(--yellow-bright)] font-semibold text-[10px]">fix/race-condition</span>
            </div>
            <div className="space-y-1 text-[var(--gh-text)] text-[11px]">
              <p className="truncate">
                <span className="text-[var(--yellow-bright)] font-bold">$</span> npm test -- --runInBand
              </p>
              <p className="text-rose-400 font-semibold text-[10px] truncate">
                FAIL tests/rate_limiter.spec.ts (Token bucket leaked across concurrent workers)
              </p>
              <p className="text-[var(--yellow-bright)] font-semibold text-[10px] truncate">
                ✓ Solved &amp; Pushed: Commit a84f19b triggered isolated sandbox runner
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--gh-border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--gh-text-muted)]">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-[var(--gh-text)] font-bold">&lt;&gt; Browser VS Code</span>
            <span>•</span>
            <span>Direct Terminal CLI</span>
          </div>
          <span className="text-[var(--yellow-bright)] font-semibold text-[11px]">
            Zero Local Setup &rarr;
          </span>
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 2 (Spans 4 cols on LG): Controlled Socratic Hamster AI
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-4 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm relative overflow-hidden group">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
              <Bot className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Socratic Mentor</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--yellow-bright)] font-bold">
              Anti-Cheat Active
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Hamster AI: Coaches, Never Cheats
            </h3>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] leading-relaxed">
              Provides architectural guidance and invariant clues without leaking copy-paste code or burning full token limits.
            </p>
          </div>

          {/* AI Dialogue bubble */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-xs space-y-2">
            <div className="flex items-center space-x-2">
              <HamsterMascot variant="normal" size={24} />
              <span className="font-mono text-[11px] font-bold text-[var(--yellow-bright)]">
                Hamster Mentor
              </span>
            </div>
            <p className="text-[var(--gh-text-secondary)] font-sans text-[11px] italic leading-relaxed">
              &quot;Notice how the mutex unlocks before writing to dirty cache. If two threads read concurrently, what happens to the eviction cursor?&quot;
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--gh-text-muted)]">
          <span>Daily Rate Limit</span>
          <span className="text-[var(--yellow-bright)] font-semibold">15 Queries / 24h</span>
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 3 (Spans 4 cols on LG): Authoritative Hidden Test Suites
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-4 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm group">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
              <Lock className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Adversarial Testing</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--yellow-bright)]">Isolated Sandbox</span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Authoritative Hidden Tests
            </h3>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] leading-relaxed">
              Every PR is evaluated against secret, database-stored edge cases to eliminate hardcoded solutions.
            </p>
          </div>

          {/* Verification breakdown */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-[11px]">
              <span className="text-[var(--gh-text)]">Public Tests (Repo)</span>
              <span className="text-[var(--yellow-bright)] font-bold">2/2 Passed</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-2 text-[11px]">
              <span className="text-[var(--amber-badge-text)]">Hidden Harness (Secret)</span>
              <span className="text-[var(--yellow-bright)] font-bold">4/4 Passed</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--gh-text-muted)]">
          <span>Passing Score: <strong className="text-[var(--yellow-bright)]">100%</strong></span>
          <span className="text-[var(--gh-text)] font-semibold">Anti-Hardcode</span>
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 4 (Spans 8 cols on LG): Shareable Profile & 52-Week Contributions
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-8 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm group">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
              <Award className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Public Profile</span>
            </div>
            <span className="text-[11px] font-mono text-[var(--yellow-bright)] truncate">
              repohamster.com/@username
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Verified Developer Portfolio &amp; Streaks
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-muted)] leading-relaxed max-w-xl">
              Turn verified fixes into authentic proof-of-work. Showcase solved pull requests, bug-hunting streaks, and tier rankings to recruiters.
            </p>
          </div>

          {/* Mini Heatmap Mockup (Responsive: 16 blocks on mobile, 32 on sm+) */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--gh-text)] font-bold flex items-center space-x-1.5 text-[11px]">
                <Flame className="h-3.5 w-3.5 text-[var(--yellow-bright)] shrink-0" />
                <span>142 Contributions this year</span>
              </span>
              <span className="text-[10px] text-[var(--yellow-bright)] font-semibold">
                Daily Streaks Verified
              </span>
            </div>

            {/* Heatmap Bar Preview */}
            <div className="flex gap-1 overflow-hidden py-0.5">
              {/* Show 16 blocks on mobile, 32 blocks on sm+ */}
              {Array.from({ length: 32 }).map((_, i) => {
                const level = (i % 5) as 0 | 1 | 2 | 3 | 4;
                const colors = [
                  'bg-[var(--contrib-0)]',
                  'bg-[var(--contrib-1)]',
                  'bg-[var(--contrib-2)]',
                  'bg-[var(--contrib-3)]',
                  'bg-[var(--contrib-4)] shadow-[0_0_6px_var(--yellow-glow)]',
                ];
                return (
                  <div
                    key={i}
                    className={`h-4 flex-1 min-w-[7px] sm:min-w-[12px] rounded-[3px] border border-[var(--gh-border)]/40 ${colors[level]} ${
                      i >= 16 ? 'hidden sm:block' : ''
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--gh-border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--gh-text-muted)]">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-[var(--yellow-bright)] font-semibold">Tier II Bug Hunter</span>
            <span>•</span>
            <span>Pull Shark PRs</span>
          </div>
          <Link href="/profile" className="text-[var(--gh-text)] hover:text-[var(--yellow-bright)] hover:underline flex items-center space-x-1 text-[11px]">
            <span>View Developer Profiles</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 5 (Spans 6 cols on LG): Real Production Outages, Not Leetcode
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-6 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm group">
        <div className="space-y-3 sm:space-y-4">
          <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
            <Zap className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <span>Production Engineering</span>
          </span>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Real Repositories, Not Leetcode
            </h3>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] leading-relaxed">
              No toy array puzzles. Debug Redis connection pools, async mutexes, SQL injection flaws, and JWT race conditions in multi-file systems.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2">
              <span className="text-[var(--yellow-bright)] font-bold text-[11px]">Python</span>
              <p className="text-[10px] text-[var(--gh-text-muted)] mt-0.5 truncate">Django ORM N+1 &amp; FastAPI</p>
            </div>
            <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2">
              <span className="text-[var(--yellow-bright)] font-bold text-[11px]">TypeScript</span>
              <p className="text-[10px] text-[var(--gh-text-muted)] mt-0.5 truncate">Next.js &amp; Async Mutex</p>
            </div>
            <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2">
              <span className="text-[var(--yellow-bright)] font-bold text-[11px]">Go</span>
              <p className="text-[10px] text-[var(--gh-text-muted)] mt-0.5 truncate">Goroutine Deadlocks</p>
            </div>
            <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2">
              <span className="text-[var(--yellow-bright)] font-bold text-[11px]">PostgreSQL</span>
              <p className="text-[10px] text-[var(--gh-text-muted)] mt-0.5 truncate">Isolation Anomalies</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--gh-border-subtle)] text-[11px] font-mono text-[var(--yellow-bright)] font-semibold">
          Multi-Language Curriculum Updated Weekly &rarr;
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 6 (Spans 6 cols on LG): Cryptographic Webhook CI & Atomic PRs
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-6 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm group">
        <div className="space-y-3 sm:space-y-4">
          <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
            <GitPullRequest className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <span>GitHub Webhook CI</span>
          </span>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Cryptographic HMAC Verification
            </h3>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] leading-relaxed">
              Every push triggers an isolated execution container with strict memory caps, 30s timeouts, and zero candidate credentials.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2.5 sm:p-3 space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--gh-text)] font-bold truncate max-w-[160px] sm:max-w-none">
                Webhook: pull_request.opened
              </span>
              <span className="text-[var(--yellow-bright)] shrink-0">200 OK (38ms)</span>
            </div>
            <p className="text-[10px] text-[var(--gh-text-muted)]">
              Isolated runner booted container with memory cap and zero environment secrets.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--gh-text-muted)]">
          <span>Audit Logged for Reviewers</span>
          <span className="text-[var(--yellow-bright)] font-semibold">100% Deterministic</span>
        </div>
      </div>
    </div>
  );
}
