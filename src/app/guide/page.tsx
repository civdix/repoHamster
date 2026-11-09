import React from 'react';
import Link from 'next/link';
import {
  Terminal,
  Code2,
  GitPullRequest,
  CheckCircle2,
  Shield,
  Bot,
  Zap,
  ArrowRight,
  ExternalLink,
  Laptop,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { HowToUseHamsterGuide } from '@/components/guide/HowToUseHamsterGuide';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { HamsterMascotCallout } from '@/components/guide/HamsterGraphics';

export const metadata = {
  title: 'How to Use RepoHamster | Beginner Guide & Visual Walkthrough',
  description:
    'Complete visual guide on how to pick a challenge, launch GitHub Codespaces, consult the Hamster AI Mentor, and get evaluated on RepoHamster.',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-dev-grid pb-24">
      {/* 1. Interactive Visual Component */}
      <HowToUseHamsterGuide />

      {/* 2. Deep Dive Beginner Reference Section */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        {/* Section Header */}
        <div className="border-t border-card-border/60 pt-16 text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-lime font-semibold">
            Documentation & Reference
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            The Complete Beginner&apos;s Playbook
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed font-sans">
            Everything you need to know about navigating the platform, running tests, avoiding
            common beginner pitfalls, and understanding the automated grading sandbox.
          </p>
        </div>

        {/* Deep Dive 1: Challenge Setup & Prerequisites */}
        <div className="rounded-2xl border border-card-border bg-[#0d101a] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                1. Prerequisites & Codespaces vs Local Setup
              </h3>
              <p className="text-xs text-slate-400">Zero machine requirements with GitHub Codespaces</p>
            </div>
          </div>

          <div className="text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
            <p>
              RepoHamster is designed so you can code directly from any device—even a Chromebook or tablet—using{' '}
              <strong className="text-brand-lime">GitHub Codespaces</strong>. Every repository includes a{' '}
              <code className="text-brand-lime bg-lime-950/40 px-1.5 py-0.5 rounded font-mono text-xs">
                .devcontainer
              </code>{' '}
              configuration that automatically installs the required Node.js LTS, dependencies, and VS Code extensions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#090c15] border border-card-border space-y-2">
                <div className="text-xs font-mono font-bold text-brand-lime flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Option A: GitHub Codespaces (Recommended)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click &ldquo;Open in GitHub Codespaces&rdquo; from the challenge page. No Git CLI or Node install is needed.
                  Your work is saved automatically in the cloud container.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#090c15] border border-card-border space-y-2">
                <div className="text-xs font-mono font-bold text-brand-purple-light flex items-center gap-1.5">
                  <Terminal className="h-4 w-4" />
                  <span>Option B: Local VS Code Desktop</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clone your fork locally:
                  <code className="block mt-1 p-2 rounded bg-[#06080e] text-slate-200 font-mono text-[11px]">
                    git clone https://github.com/repohamster/Still-Form.git
                  </code>
                  Ensure you have Node.js 20+ installed, run <code className="text-brand-lime">npm install</code> and{' '}
                  <code className="text-brand-lime">npm test</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive 2: Problem Scope in Still & Form */}
        <div className="rounded-2xl border border-card-border bg-[#0d101a] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-brand-purple">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                2. Anatomy of the Still & Form Challenge
              </h3>
              <p className="text-xs text-slate-400">What bugs are you tasked with fixing?</p>
            </div>
          </div>

          <div className="text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
            <p>
              Still & Form is a modern React 19 storefront paired with an Express 5 commerce API. It simulates a small-batch home goods business.
              The repository contains 3 critical problem areas:
            </p>

            <div className="space-y-3 font-sans">
              <div className="p-3.5 rounded-xl bg-[#090c15] border border-card-border">
                <span className="text-xs font-mono font-bold text-amber-300">
                  Bug 1: Cart Deduction Race Condition
                </span>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  When rapid decrement requests are fired concurrently, in-memory cart quantities can drop below 1 or become negative numbers.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090c15] border border-card-border">
                <span className="text-xs font-mono font-bold text-amber-300">
                  Bug 2: Sales Tax & Promotional Discount Math
                </span>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Subtotal calculations fail to correctly apply tiered coupon codes when state sales tax rules are evaluated in boundary edge cases.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090c15] border border-card-border">
                <span className="text-xs font-mono font-bold text-amber-300">
                  Bug 3: Order Checkout Idempotency
                </span>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Submitting the checkout form multiple times with the same cart token should be idempotent and prevent double-charging or duplicate orders.
                </p>
              </div>
            </div>

            <HamsterMascotCallout
              title="Pro Hamster Tip: Run Targeted Test Suites"
              message="Instead of running all tests simultaneously every time, you can run `npm run test:backend` to inspect the API only, or `npm run test:business` to inspect discount calculation logic quickly."
              stepNumber={3}
              highlightText="Vitest Command"
            />
          </div>
        </div>

        {/* Deep Dive 3: How Evaluation & Hidden Tests Work */}
        <div className="rounded-2xl border border-card-border bg-[#0d101a] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                3. How the Automated Evaluator Works
              </h3>
              <p className="text-xs text-slate-400">Zero human intervention • HMAC-signed webhooks • Isolated sandbox</p>
            </div>
          </div>

          <div className="text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
            <p>
              When you open a Pull Request targeting <code className="text-brand-lime font-mono">repohamster/Still-Form:main</code>, here is what happens behind the scenes:
            </p>

            <ol className="list-decimal list-inside space-y-3 text-xs text-slate-400 font-sans">
              <li>
                <strong className="text-white">GitHub Webhook Dispatch:</strong> GitHub signs the payload with our secret key and pings RepoHamster at <code className="text-brand-lime font-mono">/api/webhooks/github</code>.
              </li>
              <li>
                <strong className="text-white">Sandbox Worker Spawn:</strong> An isolated test worker clones your exact PR commit SHA in a clean container with stripped environment variables and network egress restrictions.
              </li>
              <li>
                <strong className="text-white">Public Tests Execution:</strong> The runner executes all 4 public test suites to verify that standard behavior remains intact.
              </li>
              <li>
                <strong className="text-white">Authoritative Hidden Tests Execution:</strong> The runner injects our proprietary hidden assertions (verifying atomic cart bounds, concurrent checkout tokens, and coupon invariants).
              </li>
              <li>
                <strong className="text-white">Live Scorecard & Profile Sync:</strong> If your code satisfies 100% of the assertions, the PR status is marked Passed, your scorecard updates with Grade A+, and the badge appears on your profile.
              </li>
            </ol>
          </div>
        </div>

        {/* Deep Dive 4: Beginner FAQs */}
        <div className="rounded-2xl border border-card-border bg-[#0d101a] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                4. Frequently Asked Questions by Beginners
              </h3>
              <p className="text-xs text-slate-400">Common questions and troubleshooting</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans text-slate-300">
            <div className="p-4 rounded-xl bg-[#090c15] border border-card-border space-y-1.5">
              <h4 className="font-bold text-white text-sm">
                Q: What if I don&apos;t have a GitHub Codespaces allowance?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                GitHub provides 60 free Codespaces hours every month to all personal GitHub accounts! If you ever run low, you can simply clone the repository with standard git and run it locally.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090c15] border border-card-border space-y-1.5">
              <h4 className="font-bold text-white text-sm">
                Q: Can I push multiple commits to improve my score?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Yes! Every new commit pushed to your Pull Request triggers a fresh evaluation run. If your first attempt scores 70/100, read the public test feedback, fix the remaining edge case, push again, and your score will update to 100/100.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090c15] border border-card-border space-y-1.5">
              <h4 className="font-bold text-white text-sm">
                Q: Why did the Hamster AI Mentor refuse to write the code for me?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                The Hamster AI Mentor is deliberately programmed as a Socratic engineering coach. It asks probing questions, points you to the exact source lines, and explains distributed systems concepts, but it will never generate copy-paste answers. This ensures your evaluation is authentic and respected by hiring engineering teams.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8">
          <Link
            href="/assignments/still-form"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-lime px-8 py-4 text-sm font-bold text-slate-950 shadow-glow-lime hover:bg-brand-lime-light transition active:scale-95"
          >
            <span>Ready? Launch Still & Form Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
