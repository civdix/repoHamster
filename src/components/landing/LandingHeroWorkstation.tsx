'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Play,
  GitPullRequest,
  ShieldCheck,
  Bot,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export function LandingHeroWorkstation() {
  const [copied, setCopied] = useState(false);
  const cloneCmd = 'git clone https://github.com/repohamster/Still-Form.git';

  const handleCopy = () => {
    navigator.clipboard.writeText(cloneCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--yellow-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Context & Explicit Actions */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Header pill */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3.5 py-1 text-xs font-mono text-[var(--amber-badge-text)] font-semibold">
            <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] animate-ping" />
            <span>Featured Challenge Workspace</span>
            <span className="opacity-40">•</span>
            <span className="text-white font-bold">repohamster/Still-Form</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
              Real Outages. Real Repositories. Real PRs.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
              No whiteboard puzzles or fake algorithm quizzes. RepoHamster drops you into an authentic,
              multi-file <strong>Express 5 + React 19</strong> production codebase with failing tests,
              race conditions, and broken API contracts. Spin up a full browser IDE in seconds or clone
              locally to ship your fix.
            </p>
          </div>

          {/* Explicit 1-Click Codespaces & Challenge Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Action: Direct Codespaces Launch Link */}
            <a
              href="https://codespaces.new/repohamster/Still-Form?ref=main"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 rounded-xl bg-[var(--yellow-primary)] px-5 py-2.5 text-xs font-bold text-black shadow-[var(--yellow-glow)] hover:bg-[var(--yellow-bright)] transition active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>1-Click GitHub Codespaces</span>
            </a>

            {/* In-app challenge workspace link */}
            <Link
              href="/assignments/still-form"
              className="inline-flex items-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-2.5 text-xs font-semibold text-white hover:border-[var(--yellow-primary)]/50 hover:bg-[var(--gh-bg)]/80 transition active:scale-95"
            >
              <Code2 className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Inspect Challenge Specs</span>
              <ArrowRight className="h-3 w-3 text-[var(--gh-text-muted)]" />
            </Link>
          </div>

          {/* Quick Clone Terminal Bar */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2 text-xs font-mono">
            <div className="flex items-center space-x-2 text-[var(--gh-text-secondary)] truncate">
              <span className="text-[var(--yellow-bright)] font-bold">$</span>
              <span className="truncate">{cloneCmd}</span>
            </div>
            <button
              onClick={handleCopy}
              className="ml-3 shrink-0 flex items-center space-x-1 text-xs text-[var(--yellow-bright)] hover:text-white transition"
              title="Copy clone command"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                  <span className="text-[11px] font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Quality Gates Trust Strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono text-[var(--gh-text-muted)] pt-1">
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5" />
              4 Public Test Suites
            </span>
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5" />
              3 Secret Invariant Suites
            </span>
            <span className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] mr-1.5" />
              HMAC-SHA256 Webhook CI
            </span>
          </div>
        </div>

        {/* Right Column: Live Simulated Codespaces Terminal & Mascot Mentor */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-4 shadow-xl text-left font-mono">
            {/* Terminal Window Chrome */}
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-2.5 mb-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-primary)]/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-primary)]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow-bright)]" />
                <span className="text-[11px] text-[var(--gh-text-muted)] pl-1.5">
                  bash ~ Still-Form/test
                </span>
              </div>
              <span className="text-[10px] text-[var(--yellow-bright)] uppercase tracking-wider font-bold">
                Live Codespaces Runner
              </span>
            </div>

            {/* Test Execution Output */}
            <div className="text-[11px] space-y-1.5 leading-relaxed">
              <div className="text-white">
                <span className="text-[var(--yellow-bright)] font-bold">$</span> vitest run
              </div>
              <div className="text-[var(--yellow-bright)]">
                ✓ test/api/storefront.test.ts (6 passed)
              </div>
              <div className="text-rose-400 font-bold">
                ✕ test/cart/deductions.test.ts (2 failed)
              </div>
              <div className="text-[var(--gh-text-muted)] text-[10px] pl-3">
                AssertionError: expected cart.items[0].qty to be 1, but received -1
              </div>
            </div>
          </div>

          {/* Socratic Hamster AI Hint Callout with Mascot */}
          <div className="relative rounded-2xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/60 p-4 flex items-center space-x-3.5 shadow-md">
            <div className="relative shrink-0">
              <HamsterMascot variant="normal" size={56} />
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[var(--yellow-bright)] ring-2 ring-[var(--gh-bg-secondary)] animate-pulse" />
            </div>

            <div className="text-left space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white flex items-center space-x-1.5">
                  <Bot className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                  <span>Hamster Socratic Mentor</span>
                </span>
                <span className="text-[9px] font-mono uppercase bg-[var(--yellow-primary)]/20 text-[var(--yellow-bright)] px-1.5 py-0.5 rounded font-bold">
                  Anti-Cheat Active
                </span>
              </div>
              <p className="text-[11px] text-[var(--gh-text)] leading-snug font-sans">
                &ldquo;Look at <code className="text-[var(--yellow-bright)] font-mono">src/services/cart.ts:42</code>.
                Notice how parallel checkout requests read quantity before writes finish? What invariant prevents <code className="text-[var(--yellow-bright)] font-mono">qty &lt; 0</code>?&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
