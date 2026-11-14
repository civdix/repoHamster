'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Code2,
  CheckCircle2,
  Bot,
  Terminal,
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
  Star,
  FileCode,
  FolderTree,
  Check,
  Cpu,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

const SANDBOXES = [
  {
    name: 'Python',
    icon: '🐍',
    framework: 'FastAPI / Redis Async',
    challenge: 'Distributed Token Bucket Rate Limiter',
    image: 'python_sandbox.png',
  },
  {
    name: 'Django',
    icon: '🎸',
    framework: 'DRF / Celery / PostgreSQL',
    challenge: 'Idempotent Order Processing & Webhook Lock',
    image: 'django_sandbox.png',
  },
  {
    name: 'Go',
    icon: '🐹',
    framework: 'Goroutines / Worker Pool',
    challenge: 'Bounded Worker Pool & Channel Buffer',
    image: 'go_sandbox.png',
  },
  {
    name: 'JavaScript',
    icon: '⚡',
    framework: 'Node.js / Express / Redis',
    challenge: 'Cryptographic JWT & Sliding Window Interceptor',
    image: 'javascript_sandbox.png',
  },
];

export function LandingBentoGrid() {
  const [selectedLang, setSelectedLang] = useState(SANDBOXES[0]);
  const [activeTrack, setActiveTrack] = useState<'ai' | 'strict'>('ai');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 text-[var(--gh-text)]">
      {/* =========================================================================
          CARD 1 (Spans 12 cols): Multi-Language Sandboxes
          ========================================================================= */}
      <div className="lg:col-span-12 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 sm:p-8 shadow-none dark:shadow-sm hover:border-[var(--yellow-primary)]/40 transition duration-300 relative overflow-hidden group">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="lg:w-5/12 space-y-4 text-left">
            <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
              <Laptop className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>MULTI-LANGUAGE SANDBOXES</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--gh-text)] tracking-tight font-sans">
              Code in the stack you actually ship
            </h3>

            <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed">
              Spin up containerized multi-file repositories across your target language and framework with pre-configured dependencies, devcontainers, and instant test execution.
            </p>

            {/* Language Selection Buttons */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-mono text-[var(--gh-text-muted)] block font-semibold uppercase tracking-wider">
                Select Language Challenge:
              </span>
              <div className="flex flex-wrap gap-2">
                {SANDBOXES.map((lang) => (
                  <button
                    key={lang.name}
                    type="button"
                    onClick={() => setSelectedLang(lang)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono transition font-semibold active:scale-95 ${
                      selectedLang.name === lang.name
                        ? 'bg-[var(--yellow-primary)] text-white shadow-none dark:shadow-sm'
                        : 'bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/40'
                    }`}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Challenge Details Callout */}
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--gh-text-muted)]">Active Challenge</span>
                <span className="text-[var(--yellow-bright)] font-bold">{selectedLang.framework}</span>
              </div>
              <p className="text-xs font-bold text-[var(--gh-text)] font-sans">
                {selectedLang.challenge}
              </p>
              <div className="pt-1 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-[11px] text-[var(--gh-text-muted)]">
                <span className="flex items-center space-x-1 text-[#10B981]">
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>Hidden Tests Harness</span>
                </span>
                <span className="text-[var(--yellow-bright)] font-semibold">Live OA Screen</span>
              </div>
            </div>
          </div>

          {/* Right: Authentic OA Screen Display for Selected Language */}
          <div className="lg:w-7/12 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] overflow-hidden shadow-none dark:shadow-inner text-left flex flex-col">
            <div className="relative aspect-[16/9.2] w-full bg-[var(--gh-bg-code)] overflow-hidden group/canvas">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={selectedLang.image}
                src={`/images/${selectedLang.image}`}
                alt={`${selectedLang.name} Online Assessment (OA) Challenge Screen`}
                className="w-full h-full object-cover object-top transition-opacity duration-300 animate-in fade-in"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CARD 2 (Spans 6 cols): Instant Verification (Automated Test Grading)
          ========================================================================= */}
      <div className="lg:col-span-6 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 sm:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/40 transition duration-300 shadow-none dark:shadow-sm text-left group">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
              <Zap className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>INSTANT VERIFICATION</span>
            </span>
            <span className="text-[10px] font-mono text-[#10B981] font-bold flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span>Executed in 240 ms</span>
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Automated test case grading in real time
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
              Every repository comes with hidden edge-case suites, performance benchmarks, and concurrency checks—just like real company OAs.
            </p>
          </div>

          {/* Simulated Test Runner Card */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 font-mono text-xs space-y-2.5 shadow-none dark:shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--gh-border-subtle)] text-[11px]">
              <span className="text-[var(--gh-text)] font-bold">
                <span className="text-[var(--yellow-bright)]">$</span> RUN pytest tests/test_rate_limiter.py
              </span>
              <span className="bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded text-[10px] font-bold">
                PASSED 3/3
              </span>
            </div>

            {/* Checkmarks */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-2 text-[#10B981] font-medium">
                <Check className="h-3.5 w-3.5 stroke-[3] shrink-0" />
                <span>Handles burst concurrency under 1,000 req/s</span>
              </div>
              <div className="flex items-center space-x-2 text-[#10B981] font-medium">
                <Check className="h-3.5 w-3.5 stroke-[3] shrink-0" />
                <span>Redis connection fallback intact with zero drops</span>
              </div>
              <div className="flex items-center space-x-2 text-[#10B981] font-medium">
                <Check className="h-3.5 w-3.5 stroke-[3] shrink-0" />
                <span>Memory footprint maintained &lt; 64MB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)]">
          <span>Authoritative Hidden Harness</span>
          <span className="text-[var(--yellow-bright)] font-semibold">100% Deterministic &rarr;</span>
        </div>
      </div>

      {/* =========================================================================
          CARD 3 (Spans 6 cols): Dual OA Modes (AI-Assisted vs Strict Non-AI)
          ========================================================================= */}
      <div className="lg:col-span-6 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 sm:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/40 transition duration-300 shadow-none dark:shadow-sm text-left group">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
              <Bot className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>DUAL OA MODES</span>
            </span>
            <div className="flex items-center space-x-1 rounded-lg bg-[var(--gh-bg)] border border-[var(--gh-border)] p-0.5">
              <button
                type="button"
                onClick={() => setActiveTrack('ai')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition font-bold ${
                  activeTrack === 'ai'
                    ? 'bg-[var(--yellow-primary)] text-white shadow-none dark:shadow-xs'
                    : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
                }`}
              >
                Track A: AI Mode
              </button>
              <button
                type="button"
                onClick={() => setActiveTrack('strict')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition font-bold ${
                  activeTrack === 'strict'
                    ? 'bg-[var(--gh-text)] text-[var(--gh-bg)] shadow-none dark:shadow-xs'
                    : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
                }`}
              >
                Track B: Strict OA
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Practice AI-Assisted and Non-AI Big Tech OAs
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
              Prepare for both modern AI-enabled pair-programming rounds and strict, locked-down algorithmic/system-repo assessments.
            </p>
          </div>

          {/* Switchable Track UI */}
          {activeTrack === 'ai' ? (
            <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/60 p-3.5 text-xs space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HamsterMascot variant="normal" size={24} />
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[var(--amber-badge-text)] block">
                      Track A: AI Copilot Enabled
                    </span>
                    <span className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                      Modeled on Amazon SDE &amp; Shopify BYOE Pairing
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[var(--yellow-bright)] font-semibold">15 Queries/Day</span>
              </div>
              <p className="text-[var(--amber-badge-text)] text-[11px] leading-relaxed">
                Evaluates real-world software engineering with integrated AI. Candidates use Socratic AI hints to navigate multi-file codebases, synthesize bug fixes, and verify edge cases without hallucinating errors.
              </p>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[var(--amber-badge-text)] opacity-90 pt-1 border-t border-[var(--amber-badge-border)]/40">
                <span>Real Example:</span>
                <span className="font-bold underline">Amazon AI-Assisted SDE OA</span>
                <span>•</span>
                <span className="font-bold underline">Shopify BYOE Pair Coding</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 text-xs space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[var(--gh-text)]">
                  <Lock className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <div>
                    <span className="font-mono text-[11px] font-bold block">
                      Track B: Strict Non-AI Environment
                    </span>
                    <span className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                      Modeled on IBM, Google &amp; Meta Assessments
                    </span>
                  </div>
                </div>
                <span className="bg-rose-500/10 text-rose-500 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                  AI Locked
                </span>
              </div>
              <p className="text-[var(--gh-text-secondary)] text-[11px] leading-relaxed">
                Locked-down testing environment with zero external AI tools. Sharpen raw algorithmic instincts, manual terminal debugging, and deep concurrency invariants using language documentation only.
              </p>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-[var(--gh-text-muted)] pt-1 border-t border-[var(--gh-border)]/60">
                <span>Real Example:</span>
                <span className="font-bold text-[var(--gh-text)] underline">IBM HackerRank Non-AI OA</span>
                <span>•</span>
                <span className="font-bold text-[var(--gh-text)] underline">Meta / Google Proctored</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)]">
          <span>Configurable per Challenge</span>
          <span className="text-[var(--yellow-bright)] font-semibold">Dual Mode Ready &rarr;</span>
        </div>
      </div>

      {/* =========================================================================
          CARD 4 (Spans 6 cols): Progression & Rewards (Repo Stars)
          ========================================================================= */}
      <div className="lg:col-span-6 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 sm:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/40 transition duration-300 shadow-none dark:shadow-sm text-left group">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
              <Award className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>PROGRESSION &amp; REWARDS</span>
            </span>
            <div className="flex items-center space-x-1 text-xs font-mono font-bold text-[#F59E0B]">
              <Star className="h-4 w-4 fill-current" />
              <span>42 Repo Stars</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Every solved assignment earns a Repo Star
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
              Build a verifiable engineering portfolio. Earn Repo Stars for clean commits, edge-case coverage, and optimal runtime—unlocking harder tier challenges.
            </p>
          </div>

          {/* Gamification Tracker Box */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--gh-text)] flex items-center space-x-1.5">
                <Flame className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                <span>Distributed Systems • Gold</span>
              </span>
              <span className="text-[10px] text-[var(--yellow-bright)] font-semibold">Tier II Unlocked</span>
            </div>

            {/* Channel Chips */}
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2 py-0.5 text-[var(--gh-text-secondary)]">
                ✓ GitHub Sync
              </span>
              <span className="rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2 py-0.5 text-[var(--gh-text-secondary)]">
                ✓ Public Profile
              </span>
              <span className="rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2 py-0.5 text-[var(--gh-text-secondary)]">
                ✓ Global Leaderboard
              </span>
              <span className="rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2 py-0.5 text-[var(--yellow-bright)] font-semibold">
                ★ Badges
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)]">
          <span>Weekly Leaderboard Reset</span>
          <Link href="/profile" className="text-[var(--yellow-bright)] hover:underline font-semibold flex items-center space-x-1">
            <span>Explore Developer Profiles &rarr;</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          CARD 5 (Spans 6 cols): Automated Code QA (Post-Mortem Review)
          ========================================================================= */}
      <div className="lg:col-span-6 rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 sm:p-7 flex flex-col justify-between hover:border-[var(--yellow-primary)]/40 transition duration-300 shadow-none dark:shadow-sm text-left group">
        <div className="space-y-4">
          <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
            <GitPullRequest className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <span>AUTOMATED CODE QA</span>
          </span>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--gh-text)] font-sans tracking-tight">
              Line-by-line review the moment you submit
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
              Don&apos;t just see pass/fail. Get granular feedback on time complexity, race conditions, error handling, and missed edge cases.
            </p>
          </div>

          {/* Annotated Diff Snippet */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 space-y-2 font-mono text-xs shadow-none dark:shadow-inner">
            <div className="space-y-1 text-[11px]">
              <div className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                + if (!ctx.acquireLock(key, 5000)) &#123; return Error(&quot;Lock conflict&quot;); &#125;
              </div>
              <div className="text-[var(--gh-text-muted)] px-2 py-0.5">
                &nbsp;&nbsp;return db.transact(func(tx) &#123; ... &#125;)
              </div>
            </div>

            {/* Inline Mentor Notes */}
            <div className="space-y-1 pt-1.5 border-t border-[var(--gh-border-subtle)] text-[10px]">
              <div className="text-[#10B981] font-semibold flex items-center space-x-1.5">
                <Check className="h-3 w-3 stroke-[3]" />
                <span>Good: Idempotency key validated with distributed redis lock.</span>
              </div>
              <div className="text-[var(--yellow-bright)] font-semibold flex items-center space-x-1.5">
                <Zap className="h-3 w-3" />
                <span>Improve: Handle exponential backoff on upstream retry.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)]">
          <span>Continuous Evaluation</span>
          <span className="text-[var(--yellow-bright)] font-semibold">Post-Mortem Ready &rarr;</span>
        </div>
      </div>
    </div>
  );
}
