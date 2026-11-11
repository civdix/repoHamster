'use client';

import Link from 'next/link';
import {
  Terminal,
  Code2,
  CheckCircle2,
  Shield,
  Bot,
  Zap,
  ArrowRight,
  GitPullRequest,
  Lock,
  Layers,
  Sparkles,
  Flame,
  Award,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export function LandingBentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-5 text-[var(--gh-text)]">
      {/* =========================================================================
          BENTO ITEM 1 (Spans 8 cols on LG): 1-Click GitHub Codespaces Workspace
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-8 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_top_right,var(--yellow-glow),transparent_70%)] pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-1 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
              <Laptop className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Zero-Config Cloud Development</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[var(--gh-text-muted)]">
              <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] animate-pulse" />
              <span>Devcontainers Pre-Wired</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              1-Click GitHub Codespaces Workspace
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--gh-text-muted)] leading-relaxed max-w-2xl font-sans">
              Launch a full cloud-hosted VS Code IDE directly in your browser. Pre-installed runtimes (Node, Python, Go, Rust), debugger configs, and public test harnesses boot in under 15 seconds.
            </p>
          </div>

          {/* Interactive Terminal Mockup */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-code)] p-4 font-mono text-xs shadow-inner space-y-2 mt-4">
            <div className="flex items-center justify-between border-b border-[var(--gh-border-subtle)] pb-2 text-[11px] text-[var(--gh-text-dim)]">
              <div className="flex items-center space-x-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--status-error)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-primary)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-bright)]" />
                <span className="ml-2 text-[var(--gh-text-muted)]">bash — codespaces-workspace-7v3</span>
              </div>
              <span className="text-[var(--yellow-bright)]">branch: fix/race-condition</span>
            </div>
            <div className="space-y-1 text-[var(--gh-text)]">
              <p className="text-[var(--gh-text-dim)]"># Clone fork, checkout atomic branch &amp; verify failure</p>
              <p>
                <span className="text-[var(--yellow-bright)]">$</span> git checkout -b fix/solution
              </p>
              <p>
                <span className="text-[var(--yellow-bright)]">$</span> npm test -- --runInBand
              </p>
              <p className="text-[var(--amber-badge-text)]">
                FAIL tests/rate_limiter.spec.ts (Assertion: token bucket leaked across concurrent workers)
              </p>
              <p className="text-[var(--yellow-bright)] font-semibold">
                ✓ Solved &amp; Pushed: Commit a84f19b triggers isolated test runner webhook
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--gh-border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--gh-text-muted)]">
          <div className="flex items-center space-x-3">
            <span className="text-[var(--gh-text)] font-bold">&lt;&gt; Code</span>
            <span>•</span>
            <span>Local VS Code Protocol</span>
            <span>•</span>
            <span>Direct Terminal CLI</span>
          </div>
          <span className="text-[var(--yellow-bright)] font-semibold flex items-center">
            Zero Local Setup Required &rarr;
          </span>
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 2 (Spans 4 cols on LG): Controlled Socratic Hamster AI
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-4 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm relative overflow-hidden group">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
              <Bot className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Socratic Mentor</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--yellow-bright)] font-bold">
              15 Queries / 24h
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Hamster AI: Coaches, Never Cheats
            </h3>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] leading-relaxed">
              Guards against full codebase token burning. Explains race patterns and invariants without leaking copy-paste code.
            </p>
          </div>

          {/* AI Dialogue bubble */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 text-xs space-y-2">
            <div className="flex items-center space-x-2">
              <HamsterMascot variant="normal" size={28} />
              <span className="font-mono text-[11px] font-bold text-[var(--yellow-bright)]">
                Hamster Coder
              </span>
            </div>
            <p className="text-[var(--gh-text-secondary)] font-sans text-xs italic leading-relaxed">
              &quot;Notice how the mutex is unlocked before writing to the dirty cache line. If two threads read simultaneously, what happens to the eviction cursor?&quot;
            </p>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)]">
          <span>Anti-Cheating Policy</span>
          <span className="text-[var(--yellow-bright)] font-semibold">10,000 Tokens/Day</span>
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 3 (Spans 4 cols on LG): Authoritative Hidden Test Suites
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-4 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm group">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
              <Lock className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Adversarial Testing</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--yellow-bright)]">Isolated Sandbox</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Authoritative Hidden Test Harness
            </h3>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] leading-relaxed">
              Never trust client-side or candidate CI results. All PRs are evaluated against secret, database-stored edge cases.
            </p>
          </div>

          {/* Verification breakdown */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2">
              <span className="text-[var(--gh-text)]">Public Tests (Repo)</span>
              <span className="text-[var(--yellow-bright)] font-bold">2/2 Passed</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-2">
              <span className="text-[var(--amber-badge-text)]">Hidden Harness (Isolated)</span>
              <span className="text-[var(--yellow-bright)] font-bold">4/4 Passed</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)]">
          <span>Score: <strong className="text-[var(--yellow-bright)]">100%</strong></span>
          <span className="text-[var(--gh-text)] font-semibold">Race-Condition Proof</span>
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 4 (Spans 8 cols on LG): Shareable Profile & 52-Week Contributions
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-8 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm group">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-1 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
              <Award className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Public Developer Reputation</span>
            </div>
            <span className="text-xs font-mono text-[var(--yellow-bright)]">
              https://www.repohamster.com/@username
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Verified Developer Profile &amp; 52-Week Heatmap
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-muted)] leading-relaxed max-w-2xl">
              Turn solved repository bugs into a sharable proof-of-work portfolio. Showcase your verified pull requests, bug-hunting streak calendar, and tier achievements to hiring teams.
            </p>
          </div>

          {/* Mini 52-Week Heatmap Mockup in Yellow + Dark */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--gh-text)] font-bold flex items-center space-x-1.5">
                <Flame className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                <span>142 Contributions in the last year</span>
              </span>
              <span className="text-[11px] text-[var(--yellow-bright)] font-semibold">
                Daily Bug-Hunting Streaks Verified
              </span>
            </div>

            {/* Heatmap Bar Preview */}
            <div className="flex gap-1.5 overflow-x-auto py-1">
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
                    className={`h-4 w-full min-w-[12px] rounded-[3px] border border-[var(--gh-border)]/40 ${colors[level]}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-[var(--gh-border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--gh-text-muted)]">
          <div className="flex items-center space-x-3">
            <span className="text-[var(--yellow-bright)] font-semibold">Tier II Bug Hunter</span>
            <span>•</span>
            <span>Pull Shark PRs</span>
            <span>•</span>
            <span>Python &amp; TypeScript Solves</span>
          </div>
          <Link href="/profile" className="text-[var(--gh-text)] hover:text-[var(--yellow-bright)] hover:underline flex items-center space-x-1">
            <span>Explore Developer Profiles</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 5 (Spans 6 cols on LG): Real Production Outages, Not Leetcode
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-6 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm group">
        <div className="space-y-4">
          <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
            <Zap className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <span>Production Engineering</span>
          </span>

          <div>
            <h3 className="text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Real Multi-File Repositories, Not Leetcode
            </h3>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] leading-relaxed">
              No toy array reversals. Debug distributed Redis connection pools, WebSocket backpressure, SQL injection sanitizer escapes, and JWT expiration race conditions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2.5">
              <span className="text-[var(--yellow-bright)] font-bold">Python</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] mt-0.5">Django ORM N+1 &amp; FastAPI</p>
            </div>
            <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2.5">
              <span className="text-[var(--yellow-bright)] font-bold">TypeScript</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] mt-0.5">Next.js &amp; Async Mutex</p>
            </div>
            <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2.5">
              <span className="text-[var(--yellow-bright)] font-bold">Go</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] mt-0.5">Goroutine Channel Deadlocks</p>
            </div>
            <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2.5">
              <span className="text-[var(--yellow-bright)] font-bold">PostgreSQL</span>
              <p className="text-[11px] text-[var(--gh-text-muted)] mt-0.5">Isolation Level Anomalies</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-[var(--gh-border-subtle)] text-xs font-mono text-[var(--yellow-bright)] font-semibold">
          Multi-Language Curriculum Updated Weekly &rarr;
        </div>
      </div>

      {/* =========================================================================
          BENTO ITEM 6 (Spans 6 cols on LG): Cryptographic Webhook CI & Atomic PRs
          ========================================================================= */}
      <div className="md:col-span-3 lg:col-span-6 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 flex flex-col justify-between hover:border-[var(--yellow-primary)]/50 transition duration-300 shadow-sm group">
        <div className="space-y-4">
          <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
            <GitPullRequest className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <span>GitHub Webhook CI</span>
          </span>

          <div>
            <h3 className="text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Commit SHA Idempotency &amp; Instant Webhooks
            </h3>
            <p className="mt-1 text-xs text-[var(--gh-text-muted)] leading-relaxed">
              Every push or PR opens a cryptographic HMAC-SHA256 authenticated runner. Redundant evaluations are skipped, while new commits evaluate in isolated sandboxes.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--gh-text)] font-bold">Webhook: pull_request.opened</span>
              <span className="text-[var(--yellow-bright)]">200 OK (38ms)</span>
            </div>
            <p className="text-[11px] text-[var(--gh-text-muted)]">
              Isolated runner booted container with memory cap and zero environment secrets.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)]">
          <span>Audit Logged for Reviewers</span>
          <span className="text-[var(--yellow-bright)] font-semibold">100% Deterministic</span>
        </div>
      </div>
    </div>
  );
}
