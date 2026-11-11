'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code2,
  GitPullRequest,
  CheckCircle2,
  Terminal,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bot,
  Laptop,
  Check,
  Copy,
  Layers,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import {
  HamsterSpeechCloud,
  DrawnHighlightCircle,
  CurvedDrawnArrow,
  HamsterMascotCallout,
} from '@/components/guide/HamsterGraphics';

interface Step {
  id: number;
  title: string;
  shortTitle: string;
  tagline: string;
  mascotVariant: 'avatar' | 'workstation' | 'detective' | 'thinking' | 'celebrating';
  hamsterQuote: string;
  hamsterBadge: string;
  accent: 'lime' | 'purple' | 'amber';
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Select Challenge & Claim Handle',
    shortTitle: '1. Pick Challenge',
    tagline: 'Authenticate with GitHub and select Still & Form',
    mascotVariant: 'avatar',
    hamsterQuote:
      'Welcome coder! Sign in with your GitHub account, get your unique developer handle (@yourname), and pick our featured challenge Still & Form!',
    hamsterBadge: 'Welcome Aboard!',
    accent: 'amber',
  },
  {
    id: 2,
    title: 'Launch Workspace in 1-Click',
    shortTitle: '2. Launch Workspace',
    tagline: 'Zero-setup coding in GitHub Codespaces or VS Code Desktop',
    mascotVariant: 'workstation',
    hamsterQuote:
      'Skip installing Node, React, and packages locally! Hit "Open in GitHub Codespaces" to spin up a full browser-based VS Code IDE in 10 seconds.',
    hamsterBadge: 'Zero Setup Needed',
    accent: 'amber',
  },
  {
    id: 3,
    title: 'Run Tests & Consult Hamster AI Mentor',
    shortTitle: '3. Debug & Ask AI',
    tagline: 'Reproduce bugs with npm test and get Socratic hints',
    mascotVariant: 'detective',
    hamsterQuote:
      'Run `npm test` in the terminal to see what fails. Stuck on race conditions or tax math? Ask me! I give architectural hints without leaking the answers.',
    hamsterBadge: 'Bug Hunter Mode',
    accent: 'amber',
  },
  {
    id: 4,
    title: 'Commit Fix & Open Pull Request',
    shortTitle: '4. Push & PR',
    tagline: 'Push your branch and target repohamster/Still-Form:main',
    mascotVariant: 'thinking',
    hamsterQuote:
      'Once all local tests pass, push your git branch and open a Pull Request targeting main. Our GitHub App webhook will instantly catch your PR!',
    hamsterBadge: 'Ship It!',
    accent: 'amber',
  },
  {
    id: 5,
    title: 'Automated Evaluation & Profile Badge',
    shortTitle: '5. Live Evaluation',
    tagline: 'Hidden test suite execution and live verified scorecard',
    mascotVariant: 'celebrating',
    hamsterQuote:
      'WOOHOO! Our isolated sandbox runs hidden edge-case tests. Pass the threshold to earn your verified badge and claim your spot on the leaderboard!',
    hamsterBadge: 'Victory Lap!',
    accent: 'amber',
  },
];

export function HowToUseHamsterGuide() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 1. Header with Hamster Mascot Branding */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3.5 py-1 text-xs font-mono font-medium text-[var(--amber-badge-text)] mb-4">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--yellow-primary)]/20">
            <HamsterMascot variant="avatar" size={16} />
          </span>
          <span>Beginner&apos;s Interactive Guide</span>
          <span className="text-[var(--gh-text-muted)]">•</span>
          <span>5-Minute Walkthrough</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--gh-text)] tracking-tight">
          How to Use{' '}
          <span className="text-[var(--yellow-bright)]">
            RepoHamster
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[var(--gh-text-secondary)] leading-relaxed font-sans">
          Follow the step-by-step visual road below to pick your challenge, code in GitHub
          Codespaces, consult the Hamster AI Mentor, and get automatically evaluated.
        </p>

        {/* View Toggle */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setViewAll(false)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              !viewAll
                ? 'bg-[var(--yellow-primary)] text-black font-bold shadow-[var(--yellow-glow)]'
                : 'bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-white'
            }`}
          >
            Step-by-Step Interactive View
          </button>
          <button
            onClick={() => setViewAll(true)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              viewAll
                ? 'bg-[var(--yellow-primary)] text-black font-bold shadow-[var(--yellow-glow)]'
                : 'bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-white'
            }`}
          >
            View Full Visual Roadmap (All 5 Steps)
          </button>
        </div>
      </div>

      {/* 2. Step Selector Tabs (Interactive Mode) */}
      {!viewAll && (
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)]">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`relative flex items-center justify-center gap-2 p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[var(--gh-bg)] border border-[var(--yellow-primary)]/60 shadow-[var(--yellow-glow)] text-white'
                      : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg)]/40'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold ${
                      isActive
                        ? 'bg-[var(--yellow-primary)] text-black'
                        : 'bg-[var(--gh-bg)] text-[var(--gh-text-muted)]'
                    }`}
                  >
                    0{step.id}
                  </span>
                  <span className="text-xs font-semibold truncate hidden sm:inline">
                    {step.shortTitle.replace(/^\d+\.\s*/, '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Main Step Stage Content */}
      <div className="space-y-12">
        {STEPS.map((step) => {
          if (!viewAll && activeStep !== step.id) return null;

          return (
            <div
              key={step.id}
              className="relative rounded-3xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300"
            >
              {/* Background Step Watermark */}
              <div className="absolute top-4 right-8 text-7xl sm:text-9xl font-mono font-extrabold text-[var(--gh-text-muted)]/10 select-none pointer-events-none">
                0{step.id}
              </div>

              {/* Step Title Header */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--gh-border)]/60 pb-6 mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border border-[var(--amber-badge-border)]">
                      STEP 0{step.id} OF 05
                    </span>
                    <span className="text-xs font-mono text-[var(--gh-text-muted)]">
                      Target: repohamster/Still-Form
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)] mt-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] mt-1">{step.tagline}</p>
                </div>

                {/* Quick Next/Prev for single step mode */}
                {!viewAll && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={activeStep === 1}
                      onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                      className="p-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      disabled={activeStep === 5}
                      onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                      className="p-2 rounded-xl border border-[var(--yellow-primary)] bg-[var(--yellow-primary)] text-black font-bold hover:bg-[var(--yellow-bright)] disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Visual Stage Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                {/* Left Column: Mascot + Speech Cloud + Explanatory Steps */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Mascot Speech Cloud with Animated Bubble */}
                  <div className="relative flex flex-col items-start gap-4">
                    <HamsterSpeechCloud
                      accent="amber"
                      badge={step.hamsterBadge}
                      tailPosition="bottom-left"
                    >
                      <p className="text-[var(--gh-text)] font-sans leading-relaxed">
                        {step.hamsterQuote}
                      </p>
                    </HamsterSpeechCloud>

                    {/* Hamster Mascot Illustration */}
                    <div className="flex items-center gap-4 pl-2">
                      <div className="relative">
                        <HamsterMascot
                          variant={step.mascotVariant}
                          size={step.mascotVariant === 'avatar' ? 68 : 88}
                        />
                        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[var(--yellow-bright)] ring-2 ring-[var(--gh-bg-secondary)] animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-[var(--gh-text)]">
                          RepoHamster Mentor
                        </div>
                        <div className="text-[11px] font-mono text-[var(--yellow-bright)]">
                          {step.mascotVariant === 'detective'
                            ? 'Inspecting Race Conditions'
                            : step.mascotVariant === 'workstation'
                            ? 'Ready in Codespaces'
                            : step.mascotVariant === 'celebrating'
                            ? '100% Tests Passing!'
                            : 'Online & Socratic'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Beginner Action Checklist for this Step */}
                  <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-5 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--gh-text-muted)] font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--yellow-bright)]" />
                      <span>What You Need To Do:</span>
                    </h4>

                    {step.id === 1 && (
                      <ol className="text-xs text-[var(--gh-text-secondary)] space-y-2.5 font-sans">
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">1.</span>
                          <span>
                            Click <strong className="text-white">Start Debugging</strong> on the top right
                            to sign in via GitHub or preview with a Project Review Passcode.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">2.</span>
                          <span>
                            Confirm your assigned developer handle (e.g.{' '}
                            <code className="text-[var(--yellow-bright)] bg-[var(--yellow-primary)]/15 border border-[var(--yellow-primary)]/30 px-1 py-0.5 rounded font-mono">
                              @coder
                            </code>
                            ) in the header.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">3.</span>
                          <span>
                            Open <strong className="text-white">Still & Form</strong> from the challenge list.
                          </span>
                        </li>
                      </ol>
                    )}

                    {step.id === 2 && (
                      <ol className="text-xs text-[var(--gh-text-secondary)] space-y-2.5 font-sans">
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">1.</span>
                          <span>
                            Click the{' '}
                            <strong className="text-[var(--yellow-bright)]">Open in GitHub Codespaces</strong> button on
                            the challenge page.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">2.</span>
                          <span>
                            GitHub will spin up an isolated virtual container with Node 20, dependencies, and
                            VS Code in your browser.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">3.</span>
                          <span>
                            Prefer your local editor? Click{' '}
                            <strong className="text-white">VS Code Desktop</strong> or clone via git terminal.
                          </span>
                        </li>
                      </ol>
                    )}

                    {step.id === 3 && (
                      <ol className="text-xs text-[var(--gh-text-secondary)] space-y-2.5 font-sans">
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">1.</span>
                          <span>
                            Open the integrated terminal and run{' '}
                            <code className="text-[var(--yellow-bright)] bg-[var(--yellow-primary)]/15 border border-[var(--yellow-primary)]/30 px-1 py-0.5 rounded font-mono">
                              npm test
                            </code>{' '}
                            to reproduce the failing tests.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">2.</span>
                          <span>
                            Notice the failing test: Cart Item Deductions allows negative stock or checkout race
                            conditions.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">3.</span>
                          <span>
                            Need guidance? Click the floating{' '}
                            <strong className="text-[var(--yellow-bright)]">Ask Hamster AI</strong> button to get
                            architectural hints.
                          </span>
                        </li>
                      </ol>
                    )}

                    {step.id === 4 && (
                      <ol className="text-xs text-[var(--gh-text-secondary)] space-y-2.5 font-sans">
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">1.</span>
                          <span>
                            Create a feature branch (e.g.{' '}
                            <code className="text-[var(--yellow-bright)] bg-[var(--yellow-primary)]/15 border border-[var(--yellow-primary)]/30 px-1 py-0.5 rounded font-mono">
                              git checkout -b fix/cart-bugs
                            </code>
                            ).
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">2.</span>
                          <span>
                            Commit your fixes and push to GitHub:{' '}
                            <code className="text-[var(--gh-text)] bg-[var(--gh-bg-secondary)] px-1 py-0.5 rounded font-mono border border-[var(--gh-border)]">
                              git push origin fix/cart-bugs
                            </code>
                            .
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">3.</span>
                          <span>
                            Open a Pull Request on GitHub targeting base{' '}
                            <code className="text-[var(--yellow-bright)] font-mono">repohamster/Still-Form</code> on{' '}
                            <code className="text-white font-mono">main</code>.
                          </span>
                        </li>
                      </ol>
                    )}

                    {step.id === 5 && (
                      <ol className="text-xs text-[var(--gh-text-secondary)] space-y-2.5 font-sans">
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">1.</span>
                          <span>
                            Our GitHub App webhook detects your PR and triggers our isolated test runner.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">2.</span>
                          <span>
                            The runner executes both public tests and authoritative hidden test suites in an
                            isolated sandbox.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-mono text-[var(--yellow-bright)] font-bold">3.</span>
                          <span>
                            Check your Candidate Dashboard to view your score breakdown, pass status, and
                            verified profile badge.
                          </span>
                        </li>
                      </ol>
                    )}
                  </div>
                </div>

                {/* Right Column: Visual Mockup with Hand-Drawn Indicators, Highlight Circles & Curved Arrows */}
                <div className="lg:col-span-7">
                  <div className="relative rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-4 sm:p-6 shadow-inner">
                    {/* Mock Window Title Bar */}
                    <div className="flex items-center justify-between border-b border-[var(--gh-border)]/60 pb-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="h-3 w-3 rounded-full bg-[var(--yellow-primary)]/40 inline-block" />
                        <span className="h-3 w-3 rounded-full bg-[var(--yellow-primary)]/70 inline-block" />
                        <span className="h-3 w-3 rounded-full bg-[var(--yellow-bright)] inline-block" />
                        <span className="text-[11px] font-mono text-[var(--gh-text-muted)] pl-2">
                          {step.id === 1 && 'repohamster.app ~ candidate-console'}
                          {step.id === 2 && 'github.com/repohamster/Still-Form ~ codespaces-setup'}
                          {step.id === 3 && 'vscode ~ terminal & hamster-ai-mentor'}
                          {step.id === 4 && 'github.com/repohamster/Still-Form/pulls'}
                          {step.id === 5 && 'repohamster.app ~ verified-evaluation-report'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[var(--yellow-bright)] uppercase">
                        Live Flow Mockup
                      </span>
                    </div>

                    {/* Step 1 Visual Mockup: Challenge Card + Highlight Circle */}
                    {step.id === 1 && (
                      <div className="relative p-2 space-y-4">
                        {/* Curved Arrow pointing to Still-Form */}
                        <div className="absolute -top-3 -left-3 w-28 h-20 z-20 hidden sm:block">
                          <CurvedDrawnArrow direction="down-right" color="amber" label="1. Click Here!" />
                        </div>

                        {/* Challenge Mock Card */}
                        <div className="rounded-xl border border-[var(--yellow-primary)]/40 bg-[var(--gh-bg-secondary)] p-5 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border border-[var(--amber-badge-border)]">
                              INTERMEDIATE • 45 MINS
                            </span>
                            <span className="text-xs font-mono text-[var(--gh-text-muted)]">
                              repohamster/Still-Form
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-white mt-3">
                            Still & Form: Commerce API & React Storefront
                          </h4>
                          <p className="text-xs text-[var(--gh-text-secondary)] mt-1 leading-relaxed">
                            A realistic home-goods storefront built with React 19 and Express 5. Track down
                            cart deduction race conditions, tax calculation discrepancies, and checkout flow
                            bugs.
                          </p>

                          <div className="mt-5 flex items-center justify-between pt-4 border-t border-[var(--gh-border)]/60">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-[var(--yellow-bright)] font-bold">
                                4 Public Suites
                              </span>
                              <span className="text-[var(--gh-text-muted)]">•</span>
                              <span className="text-xs font-mono text-[var(--yellow-primary)] font-bold">
                                3 Hidden Suites
                              </span>
                            </div>

                            {/* Hand-drawn glowing circle around action button */}
                            <DrawnHighlightCircle color="amber" label="Target Action" dashed>
                              <div className="px-4 py-2 rounded-xl bg-[var(--yellow-primary)] text-black font-bold text-xs flex items-center gap-1.5 shadow-[var(--yellow-glow)]">
                                <span>Start Challenge</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </DrawnHighlightCircle>
                          </div>
                        </div>

                        {/* Tip Cloud */}
                        <div className="text-[11px] font-mono text-[var(--gh-text-muted)] flex items-center gap-2 pt-2">
                          <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)]" />
                          <span>Tip: You don&apos;t need credit cards or paid keys. It runs 100% free.</span>
                        </div>
                      </div>
                    )}

                    {/* Step 2 Visual Mockup: 1-Click Codespaces & Highlight */}
                    {step.id === 2 && (
                      <div className="relative p-2 space-y-4">
                        {/* Codespaces Dialog Mockup */}
                        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[var(--yellow-primary)]/15 border border-[var(--yellow-primary)]/30 flex items-center justify-center text-[var(--yellow-bright)]">
                              <Laptop className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">
                                Instant Cloud Development Environment
                              </h4>
                              <p className="text-xs text-[var(--gh-text-muted)]">
                                Powered by GitHub Codespaces Devcontainer
                              </p>
                            </div>
                          </div>

                          <div className="my-5 p-4 rounded-xl bg-[var(--gh-bg)] border border-[var(--gh-border)] space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[var(--gh-text-muted)]">Node.js Runtime</span>
                              <span className="text-[var(--yellow-bright)]">v20.18 LTS pre-installed</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[var(--gh-text-muted)]">Dependencies</span>
                              <span className="text-white">Express 5 + React 19 + Vitest</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[var(--gh-text-muted)]">RAM / Cores</span>
                              <span className="text-[var(--gh-text)]">4-core 8GB Cloud VM</span>
                            </div>
                          </div>

                          {/* Action Options with Hand-Drawn Circle on Codespaces */}
                          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            <DrawnHighlightCircle color="amber" label="Recommended (1-Click)" dashed>
                              <div className="px-5 py-2.5 rounded-xl bg-[var(--yellow-primary)] text-black font-bold text-xs flex items-center gap-2 shadow-[var(--yellow-glow)]">
                                <ExternalLink className="h-4 w-4" />
                                <span>Open in GitHub Codespaces</span>
                              </div>
                            </DrawnHighlightCircle>

                            <div className="text-xs font-mono text-[var(--gh-text-muted)]">or</div>

                            <div className="px-4 py-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] text-xs font-semibold text-[var(--gh-text-secondary)] flex items-center gap-1.5">
                              <Terminal className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                              <span>VS Code Desktop</span>
                            </div>
                          </div>
                        </div>

                        {/* Local alternative snippet with copy button */}
                        <div className="flex items-center justify-between rounded-xl bg-[var(--gh-bg)] border border-[var(--gh-border)] p-3 text-xs font-mono">
                          <span className="text-[var(--gh-text-muted)] truncate">
                            git clone https://github.com/repohamster/Still-Form.git
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard('git clone https://github.com/repohamster/Still-Form.git')
                            }
                            className="ml-2 text-[var(--yellow-bright)] hover:text-white transition flex items-center gap-1"
                          >
                            {copiedCmd ===
                            'git clone https://github.com/repohamster/Still-Form.git' ? (
                              <Check className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            <span className="text-[10px]">Copy</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3 Visual Mockup: npm test & Socratic AI Mentor */}
                    {step.id === 3 && (
                      <div className="relative p-2 space-y-4">
                        {/* Terminal Window Output */}
                        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 font-mono text-xs space-y-2">
                          <div className="flex items-center justify-between text-[var(--gh-text-muted)] pb-2 border-b border-[var(--gh-border)]/40">
                            <span>bash - Still-Form Workspace</span>
                            <button
                              onClick={() => copyToClipboard('npm test')}
                              className="text-[var(--yellow-bright)] hover:underline flex items-center gap-1 text-[11px]"
                            >
                              {copiedCmd === 'npm test' ? 'Copied!' : 'Copy: npm test'}
                            </button>
                          </div>

                          <div className="text-white">
                            $ <span className="text-[var(--yellow-bright)] font-bold">npm test</span>
                          </div>
                          <div className="text-[var(--gh-text-muted)]">RUN Vitest v2.1.8 in Still-Form</div>
                          <div className="text-[var(--yellow-bright)]">
                            ✓ test/api/store.test.ts (6 passed)
                          </div>
                          <div className="text-[var(--yellow-primary)] font-bold">
                            ✕ test/cart/deductions.test.ts (2 failed)
                          </div>
                          <div className="pl-4 text-[var(--gh-text-secondary)] text-[11px]">
                            AssertionError: expected cart.items[0].qty to be 1, but received -1
                          </div>
                        </div>

                        {/* Hand-drawn curved arrow linking failure to Socratic AI */}
                        <div className="relative flex items-center justify-end">
                          <div className="w-24 h-12">
                            <CurvedDrawnArrow
                              direction="arc-left"
                              color="amber"
                              label="Ask Mentor!"
                            />
                          </div>
                        </div>

                        {/* AI Socratic Chat Drawer Mockup */}
                        <div className="rounded-xl border border-[var(--yellow-primary)]/40 bg-[var(--gh-bg-secondary)] p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4 text-[var(--yellow-bright)]" />
                              <span className="text-xs font-mono font-bold text-[var(--yellow-bright)]">
                                Hamster Socratic AI Mentor
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[var(--gh-text-muted)]">
                              Tokens: 9,450 / 10,000 remaining
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-[var(--gh-bg)] border border-[var(--gh-border)] text-xs text-[var(--gh-text)] leading-relaxed">
                            💡 <strong>Mentor Hint:</strong> Look into{' '}
                            <code className="text-[var(--yellow-bright)] font-mono">src/services/cart.ts</code> line 42.
                            Notice how parallel decrement requests read the state before the prior write
                            finishes? What invariant should prevent <code className="text-[var(--yellow-primary)]">qty &lt; 0</code>?
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4 Visual Mockup: Git Push & GitHub PR Banner */}
                    {step.id === 4 && (
                      <div className="relative p-2 space-y-4">
                        {/* Git Commands Terminal */}
                        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 font-mono text-xs space-y-2">
                          <div className="text-[var(--gh-text-secondary)]">
                            $ <span className="text-[var(--yellow-bright)]">git checkout -b fix/cart-deductions</span>
                          </div>
                          <div className="text-[var(--gh-text-secondary)]">
                            $ <span className="text-[var(--yellow-bright)]">git commit -am &quot;fix(cart): enforce non-negative bounds&quot;</span>
                          </div>
                          <div className="text-[var(--gh-text-secondary)]">
                            $ <span className="text-[var(--yellow-bright)]">git push origin fix/cart-deductions</span>
                          </div>
                          <div className="text-[var(--gh-text-muted)] text-[11px]">
                            &gt; Branch fix/cart-deductions set up to track origin/fix/cart-deductions.
                          </div>
                        </div>

                        {/* Mock GitHub PR Banner with Highlighted Target */}
                        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GitPullRequest className="h-5 w-5 text-[var(--yellow-bright)]" />
                              <span className="text-sm font-bold text-white">
                                Open a pull request
                              </span>
                            </div>
                            <span className="text-xs font-mono text-[var(--gh-text-muted)]">Able to merge</span>
                          </div>

                          <div className="p-3 rounded-lg bg-[var(--gh-bg)] border border-[var(--gh-border)] text-xs font-mono flex flex-wrap items-center gap-2">
                            <span className="text-[var(--gh-text-muted)]">base repository:</span>
                            <span className="text-[var(--yellow-bright)] font-bold">repohamster/Still-Form</span>
                            <span className="text-[var(--gh-text-muted)]">base:</span>
                            <span className="text-white font-bold">main</span>
                            <span className="text-[var(--gh-text-muted)]">←</span>
                            <span className="text-[var(--gh-text-muted)]">head repository:</span>
                            <span className="text-white">your-user/Still-Form</span>
                          </div>

                          <div className="flex items-center justify-end pt-2">
                            <DrawnHighlightCircle color="amber" label="Click to Submit" dashed>
                              <div className="px-5 py-2 rounded-xl bg-[var(--yellow-primary)] hover:bg-[var(--yellow-bright)] text-black font-bold text-xs flex items-center gap-1.5 shadow-[var(--yellow-glow)]">
                                <GitPullRequest className="h-3.5 w-3.5" />
                                <span>Create pull request</span>
                              </div>
                            </DrawnHighlightCircle>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 5 Visual Mockup: Verified Scorecard & Hamster Trophy */}
                    {step.id === 5 && (
                      <div className="relative p-2 space-y-4">
                        <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-6 space-y-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-2xl bg-[var(--yellow-primary)]/20 border border-[var(--yellow-primary)]/40 flex items-center justify-center text-[var(--yellow-bright)] shadow-[var(--yellow-glow)]">
                                <ShieldCheck className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-bold text-white">
                                    Evaluation Passed
                                  </h4>
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border border-[var(--amber-badge-border)]">
                                    VERIFIED
                                  </span>
                                </div>
                                <p className="text-xs text-[var(--gh-text-muted)] font-mono">
                                  Commit: #a8f4c29 • Isolated Sandbox Runner
                                </p>
                              </div>
                            </div>

                            {/* Score Pill with Highlight */}
                            <DrawnHighlightCircle color="amber" label="100% Mastery!">
                              <div className="text-center px-4 py-1.5 bg-[var(--gh-bg)] rounded-xl border border-[var(--yellow-primary)]/60">
                                <div className="text-2xl font-mono font-extrabold text-[var(--yellow-bright)]">
                                  100<span className="text-xs text-[var(--gh-text-muted)]">/100</span>
                                </div>
                                <div className="text-[9px] font-mono text-[var(--gh-text-muted)]">
                                  GRADE A+
                                </div>
                              </div>
                            </DrawnHighlightCircle>
                          </div>

                          {/* Test Suites Breakdown */}
                          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                            <div className="p-3 rounded-xl bg-[var(--gh-bg)] border border-[var(--gh-border)]">
                              <div className="text-[var(--gh-text-muted)] text-[10px]">PUBLIC SUITES</div>
                              <div className="text-[var(--yellow-bright)] font-bold mt-1">✓ 4 of 4 Passed</div>
                              <div className="text-[10px] text-[var(--gh-text-muted)]">Vitest API &amp; Storefront</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[var(--gh-bg)] border border-[var(--gh-border)]">
                              <div className="text-[var(--gh-text-muted)] text-[10px]">HIDDEN TEST SUITES</div>
                              <div className="text-[var(--yellow-bright)] font-bold mt-1">
                                ✓ 3 of 3 Passed (100 pts)
                              </div>
                              <div className="text-[10px] text-[var(--gh-text-muted)]">Atomic Invariant Sandbox</div>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between text-xs text-[var(--gh-text-muted)]">
                            <span>Badge unlocked: 🐹 Still &amp; Form Master</span>
                            <span className="text-[var(--yellow-bright)] font-mono font-bold">
                              Added to Coding Profile
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Call To Action Banner */}
      <div className="mt-12 rounded-3xl border border-[var(--yellow-primary)]/50 bg-[var(--amber-badge-bg)]/60 p-8 sm:p-12 text-center relative overflow-hidden shadow-[var(--yellow-glow-lg)]">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--amber-badge-text)] text-xs font-mono font-bold">
            <span>Ready to test your engineering mettle?</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Start Your First Challenge in Under 60 Seconds
          </h3>
          <p className="text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
            Jump directly into Still & Form. Launch in GitHub Codespaces with zero setup, reproduce the
            bugs, and ship your solution.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assignments/still-form"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--yellow-primary)] text-black font-bold text-sm shadow-[var(--yellow-glow)] hover:bg-[var(--yellow-bright)] transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Launch Still & Form Challenge</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-white font-semibold text-sm transition"
            >
              <span>View Candidate Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
