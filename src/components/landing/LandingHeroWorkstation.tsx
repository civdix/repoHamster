'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Sparkles,
  ArrowRight,
  Code2,
  Laptop,
  Lock,
  GitPullRequest,
  Check,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

type Stage = 'failing' | 'hint' | 'solved';

export function LandingHeroWorkstation() {
  const [activeStage, setActiveStage] = useState<Stage>('failing');

  return (
    <div className="relative rounded-3xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden text-[var(--gh-text)]">
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--yellow-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Clear Platform Story & Interactive Steps */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3.5 py-1 text-xs font-mono text-[var(--amber-badge-text)] font-semibold">
            <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] animate-ping" />
            <span>Interactive Platform Simulation</span>
            <span className="opacity-40">•</span>
            <span>Zero Setup Required</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--gh-text)] font-sans tracking-tight leading-tight">
              Real Outages. Real Repositories. Real PRs.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans max-w-xl">
              No whiteboard algorithm puzzles or fake trivia tests. RepoHamster drops you directly into
              realistic, multi-file production repositories with genuine bugs, race conditions, and failing tests.
              Prove your skills by shipping real code fixes.
            </p>
          </div>

          {/* 3 Clickable Workflow Step Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveStage('failing')}
              className={`text-left p-3 rounded-xl border transition active:scale-95 ${
                activeStage === 'failing'
                  ? 'border-[var(--yellow-primary)] bg-[var(--gh-bg)] shadow-[var(--yellow-glow)]'
                  : 'border-[var(--gh-border)] bg-[var(--gh-bg)]/50 hover:bg-[var(--gh-bg)] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1 font-bold">
                <span className={activeStage === 'failing' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-muted)]'}>
                  1. Catch Bug
                </span>
                <AlertTriangle className={`h-3.5 w-3.5 ${activeStage === 'failing' ? 'text-rose-400' : 'text-[var(--gh-text-dim)]'}`} />
              </div>
              <p className="text-[11px] text-[var(--gh-text-muted)] leading-snug">
                Reproduce real concurrency &amp; logic defects.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveStage('hint')}
              className={`text-left p-3 rounded-xl border transition active:scale-95 ${
                activeStage === 'hint'
                  ? 'border-[var(--yellow-primary)] bg-[var(--gh-bg)] shadow-[var(--yellow-glow)]'
                  : 'border-[var(--gh-border)] bg-[var(--gh-bg)]/50 hover:bg-[var(--gh-bg)] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1 font-bold">
                <span className={activeStage === 'hint' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-muted)]'}>
                  2. Socratic AI
                </span>
                <Bot className={`h-3.5 w-3.5 ${activeStage === 'hint' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-dim)]'}`} />
              </div>
              <p className="text-[11px] text-[var(--gh-text-muted)] leading-snug">
                Ask our AI mentor for architectural clues.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveStage('solved')}
              className={`text-left p-3 rounded-xl border transition active:scale-95 ${
                activeStage === 'solved'
                  ? 'border-[var(--yellow-primary)] bg-[var(--gh-bg)] shadow-[var(--yellow-glow)]'
                  : 'border-[var(--gh-border)] bg-[var(--gh-bg)]/50 hover:bg-[var(--gh-bg)] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1 font-bold">
                <span className={activeStage === 'solved' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-muted)]'}>
                  3. Ship Solution
                </span>
                <CheckCircle2 className={`h-3.5 w-3.5 ${activeStage === 'solved' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-dim)]'}`} />
              </div>
              <p className="text-[11px] text-[var(--gh-text-muted)] leading-snug">
                Hidden test harness verifies 100% pass.
              </p>
            </button>
          </div>

          {/* Simple, intuitive primary CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 rounded-xl bg-[var(--yellow-button-bg)] px-5 py-3 text-xs font-bold text-[var(--yellow-button-text)] shadow-[var(--yellow-glow)] hover:bg-[var(--yellow-button-hover)] transition active:scale-95"
            >
              <Code2 className="h-4 w-4" />
              <span>Explore All Challenges</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>

            <Link
              href="/guide"
              className="inline-flex items-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-3 text-xs font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-[var(--yellow-bright)] transition active:scale-95"
            >
              <Terminal className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>How It Works (Guide)</span>
            </Link>
          </div>

          {/* Quality Features Footer Strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono text-[var(--gh-text-muted)] pt-1">
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5" />
              Zero Local Installation
            </span>
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5" />
              Isolated Hidden Assertions
            </span>
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5" />
              Verifiable Developer Profile
            </span>
          </div>
        </div>

        {/* Right Column: Live Interactive Developer Workspace Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-4 shadow-xl text-left font-mono">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-2.5 mb-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--status-error)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-primary)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-bright)]" />
                <span className="text-[11px] text-[var(--gh-text-muted)] pl-1.5">
                  workspace ~ repohamster/runner
                </span>
              </div>
              <span className="text-[10px] text-[var(--yellow-bright)] uppercase tracking-wider font-bold">
                {activeStage === 'failing' && 'Step 1: Test Failure'}
                {activeStage === 'hint' && 'Step 2: AI Assistance'}
                {activeStage === 'solved' && 'Step 3: Verification 100%'}
              </span>
            </div>

            {/* STAGE 1: Failing Test State */}
            {activeStage === 'failing' && (
              <div className="text-[11px] space-y-2 leading-relaxed animate-in fade-in duration-200">
                <div className="text-[var(--gh-text)]">
                  <span className="text-[var(--yellow-bright)] font-bold">$</span> npm test -- --runInBand
                </div>
                <div className="text-[var(--yellow-bright)]">
                  ✓ test/api/auth.test.ts (4 passed)
                </div>
                <div className="text-rose-500 font-bold flex items-center space-x-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>✕ test/concurrency/deduction.test.ts (2 failed)</span>
                </div>
                <div className="rounded-lg bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] p-2.5 text-[10px] text-[var(--gh-text-secondary)] space-y-1">
                  <p className="text-rose-400 font-semibold">
                    AssertionError: expected inventory.balance to be &gt;= 0, but received -2
                  </p>
                  <p className="text-[var(--gh-text-muted)]">
                    Defect: Two concurrent checkout workers drained the same locked row without atomic mutex protection.
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 2: Socratic AI Hint Dialogue */}
            {activeStage === 'hint' && (
              <div className="space-y-2 text-[11px] leading-relaxed animate-in fade-in duration-200">
                <div className="text-[var(--gh-text)]">
                  <span className="text-[var(--yellow-bright)] font-bold">$</span> ask-hamster &quot;Why does balance go negative?&quot;
                </div>
                <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/80 p-3 flex items-start space-x-3">
                  <HamsterMascot variant="normal" size={36} className="shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--amber-badge-text)]">
                      <span>Hamster Socratic Mentor</span>
                      <span className="bg-[var(--yellow-primary)]/20 px-1.5 py-0.5 rounded text-[9px]">Anti-Cheat Active</span>
                    </div>
                    <p className="text-[11px] text-[var(--amber-badge-text)] font-sans leading-relaxed">
                      &ldquo;Notice how line 42 reads the stock level before the transaction lock is acquired.
                      If two requests read at the exact same millisecond, what invariant is broken before write-back?&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: All Tests Passed State */}
            {activeStage === 'solved' && (
              <div className="text-[11px] space-y-2 leading-relaxed animate-in fade-in duration-200">
                <div className="text-[var(--gh-text)]">
                  <span className="text-[var(--yellow-bright)] font-bold">$</span> git push origin fix/atomic-mutex
                </div>
                <div className="text-[var(--gh-text-muted)] text-[10px]">
                  &gt; HMAC Webhook triggered: Isolated Sandbox Runner #842...
                </div>
                <div className="rounded-lg bg-[var(--amber-badge-bg)]/70 border border-[var(--yellow-bright)] p-2.5 text-[10px] text-[var(--amber-badge-text)] space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-[var(--yellow-bright)]">
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>All Public &amp; Hidden Testcases Passed (10/10)</span>
                  </div>
                  <p className="text-[var(--amber-badge-text)]">
                    Race conditions eliminated • Boundary invariants verified • Score: 100%
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stage Indicator Bar */}
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-2.5 flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--gh-text-muted)] text-[11px]">Workflow Phase:</span>
            <div className="flex items-center space-x-2">
              <span
                onClick={() => setActiveStage('failing')}
                className={`cursor-pointer px-2 py-0.5 rounded text-[10px] transition ${
                  activeStage === 'failing'
                    ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40'
                    : 'text-[var(--gh-text-dim)] hover:text-[var(--gh-text)]'
                }`}
              >
                1. Bug
              </span>
              <span
                onClick={() => setActiveStage('hint')}
                className={`cursor-pointer px-2 py-0.5 rounded text-[10px] transition ${
                  activeStage === 'hint'
                    ? 'bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] font-bold border border-[var(--amber-badge-border)]'
                    : 'text-[var(--gh-text-dim)] hover:text-[var(--gh-text)]'
                }`}
              >
                2. AI Hint
              </span>
              <span
                onClick={() => setActiveStage('solved')}
                className={`cursor-pointer px-2 py-0.5 rounded text-[10px] transition ${
                  activeStage === 'solved'
                    ? 'bg-[var(--yellow-button-bg)] text-[var(--yellow-button-text)] font-bold shadow-sm'
                    : 'text-[var(--gh-text-dim)] hover:text-[var(--gh-text)]'
                }`}
              >
                3. Solved ✓
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
