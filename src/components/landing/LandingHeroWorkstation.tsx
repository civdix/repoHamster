'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ArrowRight,
  Code2,
  Check,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

type Stage = 'failing' | 'hint' | 'solved';

export function LandingHeroWorkstation() {
  const [activeStage, setActiveStage] = useState<Stage>('failing');

  return (
    <div className="relative rounded-2xl sm:rounded-3xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-7 lg:p-9 shadow-xl backdrop-blur-xl overflow-hidden text-[var(--gh-text)]">
      {/* Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-[var(--yellow-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Column: Core Value & Step Triggers */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-1 text-xs font-mono text-[var(--amber-badge-text)] font-semibold">
            <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] animate-ping" />
            <span>Interactive Workflow</span>
            <span className="opacity-40">•</span>
            <span>Zero Local Setup</span>
          </div>

          <div className="space-y-2 sm:space-y-2.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--gh-text)] font-sans tracking-tight leading-tight">
              Real Repos. Real Bugs. Real PRs.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans max-w-xl">
              No whiteboard trivia. RepoHamster drops you into genuine multi-file codebases with concurrency defects, failing tests, and production race conditions.
            </p>
          </div>

          {/* Segmented Step Switcher (Mobile-Optimized Pills) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 p-1 rounded-xl bg-[var(--gh-bg)] border border-[var(--gh-border)]">
            <button
              type="button"
              onClick={() => setActiveStage('failing')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 p-2 sm:px-3 sm:py-2.5 rounded-lg text-center sm:text-left transition ${
                activeStage === 'failing'
                  ? 'bg-[var(--gh-bg-secondary)] text-[var(--yellow-bright)] shadow-sm border border-[var(--yellow-primary)]/40 font-bold'
                  : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
              }`}
            >
              <AlertTriangle className={`h-3.5 w-3.5 shrink-0 ${activeStage === 'failing' ? 'text-rose-500' : 'opacity-60'}`} />
              <div className="truncate">
                <span className="block text-[11px] sm:text-xs font-mono font-semibold">1. Catch Bug</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveStage('hint')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 p-2 sm:px-3 sm:py-2.5 rounded-lg text-center sm:text-left transition ${
                activeStage === 'hint'
                  ? 'bg-[var(--gh-bg-secondary)] text-[var(--yellow-bright)] shadow-sm border border-[var(--yellow-primary)]/40 font-bold'
                  : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
              }`}
            >
              <Bot className={`h-3.5 w-3.5 shrink-0 ${activeStage === 'hint' ? 'text-[var(--yellow-bright)]' : 'opacity-60'}`} />
              <div className="truncate">
                <span className="block text-[11px] sm:text-xs font-mono font-semibold">2. AI Mentor</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveStage('solved')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 p-2 sm:px-3 sm:py-2.5 rounded-lg text-center sm:text-left transition ${
                activeStage === 'solved'
                  ? 'bg-[var(--gh-bg-secondary)] text-[var(--yellow-bright)] shadow-sm border border-[var(--yellow-primary)]/40 font-bold'
                  : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
              }`}
            >
              <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${activeStage === 'solved' ? 'text-[var(--yellow-bright)]' : 'opacity-60'}`} />
              <div className="truncate">
                <span className="block text-[11px] sm:text-xs font-mono font-semibold">3. Verify Fix</span>
              </div>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[var(--yellow-button-bg)] px-5 py-2.5 text-xs font-bold text-[var(--yellow-button-text)] shadow-sm hover:bg-[var(--yellow-button-hover)] transition active:scale-95"
            >
              <Code2 className="h-4 w-4" />
              <span>Explore Challenges</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>

            <Link
              href="/guide"
              className="inline-flex items-center justify-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-2.5 text-xs font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-[var(--yellow-bright)] transition active:scale-95"
            >
              <Terminal className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>How It Works</span>
            </Link>
          </div>

          {/* Quality Feature Badges */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono text-[var(--gh-text-muted)] pt-1">
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5 shrink-0" />
              1-Click Codespaces
            </span>
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5 shrink-0" />
              Hidden Test Runner
            </span>
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5 shrink-0" />
              Anti-Cheat Socratic AI
            </span>
          </div>
        </div>

        {/* Right Column: Live Terminal Visualizer */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 sm:p-4 shadow-xl text-left font-mono">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-2.5 mb-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--status-error)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-primary)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-bright)]" />
                <span className="text-[10px] sm:text-[11px] text-[var(--gh-text-muted)] pl-1.5 truncate max-w-[130px] sm:max-w-none">
                  workspace ~ repohamster
                </span>
              </div>
              <span className="text-[10px] text-[var(--yellow-bright)] uppercase tracking-wider font-bold">
                {activeStage === 'failing' && '1: Test Failure'}
                {activeStage === 'hint' && '2: Socratic Clue'}
                {activeStage === 'solved' && '3: Verified 100%'}
              </span>
            </div>

            {/* STAGE 1: Failing Test State */}
            {activeStage === 'failing' && (
              <div className="text-[11px] space-y-2 leading-relaxed animate-in fade-in duration-200">
                <div className="text-[var(--gh-text)] flex items-center space-x-1.5">
                  <span className="text-[var(--yellow-bright)] font-bold">$</span>
                  <span className="truncate">npm test -- --runInBand</span>
                </div>
                <div className="text-[var(--yellow-bright)] text-[10px] sm:text-[11px]">
                  ✓ test/api/auth.test.ts (4 passed)
                </div>
                <div className="text-rose-500 font-bold flex items-center space-x-1.5 text-[10px] sm:text-[11px]">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">✕ test/concurrency/deduction.test.ts (2 failed)</span>
                </div>
                <div className="rounded-lg bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] p-2.5 text-[10px] text-[var(--gh-text-secondary)] space-y-1">
                  <p className="text-rose-400 font-semibold break-words">
                    AssertionError: expected inventory.balance &gt;= 0, got -2
                  </p>
                  <p className="text-[var(--gh-text-muted)] text-[10px]">
                    Root Cause: Two concurrent checkout workers drained the same locked row without atomic mutex protection.
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 2: Socratic AI Hint Dialogue */}
            {activeStage === 'hint' && (
              <div className="space-y-2 text-[11px] leading-relaxed animate-in fade-in duration-200">
                <div className="text-[var(--gh-text)] flex items-center space-x-1.5">
                  <span className="text-[var(--yellow-bright)] font-bold">$</span>
                  <span className="truncate">ask-hamster &quot;Why does balance go negative?&quot;</span>
                </div>
                <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/80 p-2.5 sm:p-3 flex items-start space-x-2.5 sm:space-x-3">
                  <HamsterMascot variant="normal" size={32} className="shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--amber-badge-text)]">
                      <span>Hamster Mentor</span>
                      <span className="bg-[var(--yellow-primary)]/20 px-1.5 py-0.2 rounded text-[9px]">Anti-Cheat Active</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[var(--amber-badge-text)] font-sans leading-relaxed">
                      &ldquo;Line 42 reads stock before acquiring the mutex. If two requests read concurrently, what invariant breaks before write-back?&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: All Tests Passed State */}
            {activeStage === 'solved' && (
              <div className="text-[11px] space-y-2 leading-relaxed animate-in fade-in duration-200">
                <div className="text-[var(--gh-text)] flex items-center space-x-1.5">
                  <span className="text-[var(--yellow-bright)] font-bold">$</span>
                  <span className="truncate">git push origin fix/atomic-mutex</span>
                </div>
                <div className="text-[var(--gh-text-muted)] text-[10px]">
                  &gt; HMAC Webhook triggered: Isolated Runner #842...
                </div>
                <div className="rounded-lg bg-[var(--amber-badge-bg)]/70 border border-[var(--yellow-bright)] p-2.5 text-[10px] text-[var(--amber-badge-text)] space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-[var(--yellow-bright)]">
                    <Check className="h-4 w-4 stroke-[3] shrink-0" />
                    <span>All Public &amp; Hidden Tests Passed (10/10)</span>
                  </div>
                  <p className="text-[var(--amber-badge-text)] text-[10px]">
                    Race conditions resolved • Invariants preserved • Score: 100%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
