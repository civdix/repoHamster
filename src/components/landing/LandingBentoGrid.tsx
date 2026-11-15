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

/* -------------------------------------------------------------------------- */
/* Company Brand Logos for Big Tech OA Tracks                                 */
/* -------------------------------------------------------------------------- */
function AmazonLogo({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Amazon">
      <path d="M1.04 17.52q.1-.16.32-.02a21.3 21.3 0 0 0 10.88 2.9a21.5 21.5 0 0 0 7.74-1.46q.1-.04.29-.12t.27-.12a.356.356 0 0 1 .47.12q.17.24-.11.44q-.36.26-.92.6a15 15 0 0 1-3.84 1.58A16.2 16.2 0 0 1 12 22a16 16 0 0 1-5.9-1.09a16.3 16.3 0 0 1-4.98-3.07a.27.27 0 0 1-.12-.2a.2.2 0 0 1 .04-.12m6.02-5.7a4.04 4.04 0 0 1 .68-2.36A4.2 4.2 0 0 1 9.6 7.98a10 10 0 0 1 2.66-.66q.54-.06 1.76-.16v-.34a3.56 3.56 0 0 0-.28-1.72a1.5 1.5 0 0 0-1.32-.6h-.16a2.2 2.2 0 0 0-1.14.42a1.64 1.64 0 0 0-.62 1 .51.51 0 0 1-.4.46L7.8 6.1q-.34-.08-.34-.36a.6.6 0 0 1 .02-.14a3.83 3.83 0 0 1 1.67-2.64A6.27 6.27 0 0 1 12.26 2h.5a5.05 5.05 0 0 1 3.56 1.18 4 4 0 0 1 .37.43 4 4 0 0 1 .27.41 2 2 0 0 1 .18.52q.08.34.12.47a3 3 0 0 1 .06.56q.02.43.02.51v4.84a2.9 2.9 0 0 0 .15.95 2.5 2.5 0 0 0 .29.62q.14.19.46.61a.6.6 0 0 1 .12.32a.35.35 0 0 1-.16.28q-1.66 1.44-1.8 1.56a.56.56 0 0 1-.58.04q-.28-.24-.49-.46t-.3-.32a5 5 0 0 1-.29-.39q-.2-.29-.28-.39a4.9 4.9 0 0 1-2.2 1.52 6 6 0 0 1-1.68.2a3.5 3.5 0 0 1-2.53-.95 3.55 3.55 0 0 1-.99-2.69m3.44-.4a1.9 1.9 0 0 0 .39 1.25 1.3 1.3 0 0 0 1.05.47 1 1 0 0 0 .17-.02 1 1 0 0 1 .15-.02 2.03 2.03 0 0 0 1.3-1.08 3.1 3.1 0 0 0 .33-.83 4 4 0 0 0 .12-.73q.01-.28.01-.92v-.5a7.3 7.3 0 0 0-1.76.16 2.144 2.144 0 0 0-1.76 2.22m8.4 6.44a.6.6 0 0 1 .12-.16 3.1 3.1 0 0 1 .96-.46 6.5 6.5 0 0 1 1.48-.22 1.2 1.2 0 0 1 .38.02q.9.08 1.08.3a.66.66 0 0 1 .08.36v.14a4.6 4.6 0 0 1-.38 1.65 3.84 3.84 0 0 1-1.06 1.53.3.3 0 0 1-.18.08.2.2 0 0 1-.08-.02q-.12-.06-.06-.22a7.6 7.6 0 0 0 .74-2.42.5.5 0 0 0-.08-.32q-.2-.24-1.12-.24q-.34 0-.8.04q-.5.06-.92.12a.23.23 0 0 0-.16.12z" />
    </svg>
  );
}

function ShopifyLogo({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="-18 0 292 292" aria-label="Shopify">
      <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.806 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-11.131-10.537c1.617 0 3.246.549 4.805 1.622-12.007 5.65-24.877 19.88-30.312 48.297l-22.886 7.088C75.694 46.16 90.81 10.828 117.72 10.828z" fill="#95BF46"/>
      <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.959-2.394-1.099l-12.527 256.233 89.762-19.418S223.972 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357" fill="#5E8E3E"/>
      <path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338" fill="#FFF"/>
    </svg>
  );
}

function IbmLogo({ className = 'h-3.5 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1000 401.15" fill="currentColor" aria-label="IBM">
      <g>
        <g>
          <rect y="373.17" width="194.43" height="27.932"/>
          <rect y="319.83" width="194.43" height="27.932"/>
          <rect x="55.468" y="266.54" width="83.399" height="27.932"/>
          <rect x="55.468" y="213.25" width="83.399" height="27.932"/>
          <rect x="55.468" y="159.96" width="83.399" height="27.932"/>
          <rect x="55.468" y="106.58" width="83.399" height="27.932"/>
          <rect y="53.288" width="194.43" height="27.932"/>
          <rect width="194.43" height="27.932"/>
        </g>
        <g>
          <path d="m222.17 400.85 207.11 0.297c27.734 0 52.793-10.697 71.513-27.932h-278.62z"/>
          <path d="m222.17 347.76h299.03c5.051-8.617 8.815-18.027 11.094-27.932h-310.12z"/>
          <rect x="277.73" y="266.54" width="83.3" height="27.932"/>
          <path d="m444.43 266.54v27.932h90.927c0-9.608-1.288-19.017-3.764-27.932z"/>
          <path d="m497.92 213.25h-220.19v27.932h243.46c-6.34-10.698-14.165-20.107-23.277-27.932z"/>
          <path d="m277.73 159.96v27.932h220.19c9.311-7.825 17.135-17.235 23.277-27.932z"/>
          <rect x="277.73" y="106.58" width="83.3" height="27.932"/>
          <path d="m444.43 134.51h87.163c2.476-8.914 3.764-18.324 3.764-27.932h-90.927z"/>
          <path d="m521.2 53.288h-299.03v27.932h310.12c-2.575-9.905-6.339-19.314-11.093-27.932z"/>
          <path d="m429.28 0h-207.11v27.932h278.53c-18.621-17.235-43.878-27.932-71.414-27.932z"/>
        </g>
        <g>
          <polygon points="555.57 81.22 742.67 81.22 733.06 53.288 555.57 53.288"/>
          <polygon points="555.57 27.932 724.25 27.932 714.64 0 555.57 0"/>
          <polygon points="861.03 401.17 861.03 373.24 1000 373.24 1000 401.17"/>
          <polygon points="861.03 347.76 861.03 319.83 1000 319.83 1000 347.76"/>
          <polygon points="777.73 182.54 769.91 159.96 694.43 159.96 611.03 159.96 611.03 187.89 694.43 187.89 694.43 162.24 703.25 187.89 852.22 187.89 861.03 162.24 861.03 187.89 944.43 187.89 944.43 159.96 861.03 159.96 785.56 159.96"/>
          <polygon points="944.43 106.58 803.98 106.58 794.37 134.51 944.43 134.51"/>
          <polygon points="1000 27.932 1000 0 840.93 0 831.32 27.932"/>
          <polygon points="768.13 373.22 777.73 400.85 787.34 373.22"/>
          <polygon points="749.5 319.83 759.31 347.76 796.16 347.76 806.06 319.83"/>
          <polygon points="730.78 266.54 740.59 294.47 814.88 294.47 824.68 266.54"/>
          <polygon points="721.97 241.18 833.6 241.18 843.11 213.25 712.36 213.25"/>
          <polygon points="611.03 134.51 761.09 134.51 751.49 106.58 611.03 106.58"/>
          <polygon points="1000 53.288 822.4 53.288 812.9 81.22 1000 81.22"/>
          <rect x="555.57" y="373.22" width="138.97" height="27.932"/>
          <rect x="555.57" y="319.83" width="138.97" height="27.932"/>
          <rect x="611.03" y="266.54" width="83.399" height="27.932"/>
          <rect x="611.03" y="213.25" width="83.399" height="27.932"/>
          <rect x="861.03" y="213.25" width="83.399" height="27.932"/>
          <rect x="861.03" y="266.54" width="83.399" height="27.932"/>
        </g>
      </g>
    </svg>
  );
}

function GoogleLogo({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Google">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function MetaLogo({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Meta">
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a7 7 0 0 0 .265.86a5.3 5.3 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927c1.497 0 2.633-.671 3.965-2.444c.76-1.012 1.144-1.626 2.663-4.32l.756-1.339l.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314c1.046.987 1.992 1.22 3.06 1.22c1.075 0 1.876-.355 2.455-.843a3.7 3.7 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745c0-2.72-.681-5.357-2.084-7.45c-1.282-1.912-2.957-2.93-4.716-2.93c-1.047 0-2.088.467-3.053 1.308c-.652.57-1.257 1.29-1.82 2.05c-.69-.875-1.335-1.547-1.958-2.056c-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999c1.132 1.748 1.647 4.195 1.647 6.4c0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004c-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a45 45 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327c1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446c.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338c-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.26 2.26 0 0 1 1.088-.285Z" />
    </svg>
  );
}

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
              <Image
                key={selectedLang.image}
                src={`/images/${selectedLang.image}`}
                alt={`${selectedLang.name} Online Assessment (OA) Challenge Screen`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-top transition-opacity duration-300 animate-in fade-in"
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
              <div className="pt-2 border-t border-[var(--amber-badge-border)]/40 space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--amber-badge-text)] flex items-center space-x-1">
                  <span>Real Big Tech Formats:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-[var(--gh-bg)] border border-[var(--amber-badge-border)] text-[var(--gh-text)] shadow-none hover:border-[var(--yellow-primary)] transition">
                    <AmazonLogo className="h-3.5 w-3.5 fill-current text-[var(--gh-text)]" />
                    <span className="font-semibold text-[11px] font-sans">Amazon</span>
                    <span className="text-[10px] font-mono text-[var(--gh-text-secondary)] font-normal">• AI-Assisted SDE OA</span>
                  </div>
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-[var(--gh-bg)] border border-[var(--amber-badge-border)] text-[var(--gh-text)] shadow-none hover:border-[var(--yellow-primary)] transition">
                    <ShopifyLogo className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-semibold text-[11px] font-sans">Shopify</span>
                    <span className="text-[10px] font-mono text-[var(--gh-text-secondary)] font-normal">• BYOE Pair Coding</span>
                  </div>
                </div>
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
              <div className="pt-2 border-t border-[var(--gh-border)]/60 space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--gh-text-muted)] flex items-center space-x-1">
                  <span>Real Big Tech Formats:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] text-[var(--gh-text)] shadow-none hover:border-[var(--yellow-primary)] transition">
                    <IbmLogo className="h-3.5 w-5 fill-current text-[var(--gh-text)]" />
                    <span className="font-semibold text-[11px] font-sans">IBM</span>
                    <span className="text-[10px] font-mono text-[var(--gh-text-secondary)] font-normal">• HackerRank Non-AI OA</span>
                  </div>
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] text-[var(--gh-text)] shadow-none hover:border-[var(--yellow-primary)] transition">
                    <MetaLogo className="h-3.5 w-3.5 fill-current text-[var(--gh-text)]" />
                    <span className="font-semibold text-[11px] font-sans">Meta</span>
                    <span className="text-[10px] font-mono text-[var(--gh-text-secondary)] font-normal">• Systems OA</span>
                  </div>
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] text-[var(--gh-text)] shadow-none hover:border-[var(--yellow-primary)] transition">
                    <GoogleLogo className="h-3.5 w-3.5 fill-current text-[var(--gh-text)]" />
                    <span className="font-semibold text-[11px] font-sans">Google</span>
                    <span className="text-[10px] font-mono text-[var(--gh-text-secondary)] font-normal">• Proctored OA</span>
                  </div>
                </div>
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
