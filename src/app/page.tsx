import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import {
  ArrowRight,
  Terminal,
  Check,
  Star,
  ExternalLink,
  Laptop,
  Sparkles,
  Bot,
  Lock,
  Code2,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { LandingMNCLogos } from '@/components/landing/LandingMNCLogos';
import { LandingBentoGrid } from '@/components/landing/LandingBentoGrid';
import { LandingFaq } from '@/components/landing/LandingFaq';
import { ContactForm } from '@/components/contact/ContactForm';

// ISR: Cached at Vercel Edge CDN; auto-warmed in background on git/webhook/admin events
export const revalidate = 600; // 10 minutes

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  let assignments: any[] = [];
  let vishakhaUser: { name: string | null; avatarUrl: string | null } | null = null;
  let civdixUser: { name: string | null; avatarUrl: string | null } | null = null;

  try {
    const [fetchedAssignments, u1, u2] = await Promise.all([
      prisma.assignment.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.findFirst({
        where: {
          OR: [
            { username: { contains: 'vishakha', mode: 'insensitive' } },
            { name: { contains: 'vishakha', mode: 'insensitive' } },
            { email: { contains: 'vishakha', mode: 'insensitive' } },
          ],
        },
        select: { name: true, avatarUrl: true },
      }),
      prisma.user.findFirst({
        where: {
          OR: [
            { username: { contains: 'civdix', mode: 'insensitive' } },
            { name: { contains: 'civdix', mode: 'insensitive' } },
          ],
        },
        select: { name: true, avatarUrl: true },
      }),
    ]);
    assignments = fetchedAssignments;
    vishakhaUser = u1;
    civdixUser = u2;
  } catch (err) {
    // fallback gracefully
  }

  const vishakhaAvatar =
    vishakhaUser?.avatarUrl || 'https://avatars.githubusercontent.com/u/184405638?v=4';
  const civdixAvatar =
    civdixUser?.avatarUrl || 'https://avatars.githubusercontent.com/u/113282955?v=4';

  return (
    <div className="relative overflow-hidden bg-[var(--gh-bg)] bg-dev-grid text-[var(--gh-text)] min-h-screen transition-colors duration-200">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[550px] bg-radial-glow pointer-events-none" />

      {/* =========================================================================
          SECTION A: HERO SECTION (Full-Bleed Rolling-Field Landscape + Refined Computer-Screen Interface)
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[var(--gh-border)]">
        {/* Full-bleed rolling-field background with no additional imagery */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/nature.png"
            alt="Rolling nature field landscape background"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Atmospheric Glass & Vignette Overlay: Luminous Alabaster in Light Theme, Deep Cinematic Charcoal in Dark Mode */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/92 via-[#FAF7F2]/80 to-[#FAF7F2]/50 dark:from-black/90 dark:via-black/80 dark:to-black/65 transition-colors duration-200" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,90,31,0.08),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.14),transparent_65%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--gh-bg)] dark:from-black/35 dark:via-transparent dark:to-[var(--gh-bg)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Eyebrow Badge - Sharp Square Developer Tag */}
              <div className="inline-flex items-center space-x-2 rounded-sm border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-[var(--amber-badge-text)] shadow-none dark:shadow-xs">
                <span className="flex h-4 w-4 items-center justify-center">
                  <HamsterMascot variant="normal" size={18} />
                </span>
                <span>repoHamster OA Engine</span>
                <span className="opacity-40">•</span>
                <span className="text-[var(--gh-text)]">Production Ready</span>
              </div>

              {/* Editorial Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-[var(--gh-text)] leading-[1.12] font-sans">
                Master Real-World Repo Assessments{' '}
                <span className="italic font-serif text-[var(--yellow-primary)]">At Scale</span>
                <br />
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--gh-text-secondary)] font-mono block mt-2">
                  <span className="text-[var(--yellow-primary)]">With AI</span> •{' '}
                  <span className="italic">Without AI</span> •{' '}
                  <span className="text-[var(--gh-text)]">Production Ready</span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-[var(--gh-text-secondary)] max-w-xl leading-relaxed font-sans">
                Practice authentic, multi-file repository engineering assessments designed like actual Big Tech Online Assessments (OAs). Debug, build features, and pass automated test suites in real time.
              </p>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center space-x-2 rounded-full bg-[var(--yellow-button-bg)] px-7 py-3.5 text-xs sm:text-sm font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] shadow-none dark:shadow-sm transition active:scale-95"
                >
                  <span>Launch a Repo Challenge</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/guide"
                  className="inline-flex items-center justify-center space-x-2 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/90 backdrop-blur-md px-6 py-3.5 text-xs sm:text-sm font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)] hover:text-[var(--yellow-primary)] shadow-none dark:shadow-sm transition active:scale-95"
                >
                  <Terminal className="h-4 w-4 text-[var(--yellow-primary)]" />
                  <span>Explore Sample Repo</span>
                </Link>
              </div>

              {/* Value Highlights Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono text-[var(--gh-text-muted)]">
                <span className="flex items-center">
                  <Check className="mr-1.5 h-3.5 w-3.5 text-[#10B981] stroke-[3]" />
                  Zero-Config Cloud Dev
                </span>
                <span className="flex items-center">
                  <Check className="mr-1.5 h-3.5 w-3.5 text-[#10B981] stroke-[3]" />
                  Hidden Edge-Case Suites
                </span>
                <span className="flex items-center">
                  <Check className="mr-1.5 h-3.5 w-3.5 text-[#10B981] stroke-[3]" />
                  Dual OA Mode Evaluation
                </span>
              </div>
            </div>

            {/* Right Column: Refined Computer-Screen-Style Interface Layered Over the Landscape */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl border border-[var(--gh-border)] dark:border-white/20 bg-white/90 dark:bg-black/60 backdrop-blur-xl p-3 sm:p-4 shadow-none dark:shadow-2xl overflow-hidden group transition-all duration-300 hover:border-[var(--yellow-primary)]/50">
                {/* Computer Screen Window Titlebar */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-[var(--gh-border)] dark:border-white/10 text-xs font-mono">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#FF5F56] shrink-0" />
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#FFBD2E] shrink-0" />
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#27C93F] shrink-0" />
                    <span className="ml-1 sm:ml-2 text-[var(--gh-text)] dark:text-white/70 text-[10px] sm:text-[11px] font-semibold truncate max-w-[120px] sm:max-w-none">
                      repohamster-workstation — zsh
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] text-[var(--gh-text-muted)] dark:text-white/60 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>Codespace Active</span>
                  </div>
                </div>

                {/* Layered Workstation Screen Preview */}
                <div className="relative mt-3 rounded-xl overflow-hidden border border-[var(--gh-border)] dark:border-white/10 bg-[var(--gh-bg)] dark:bg-black/40 aspect-[640/440]">
                  <Image
                    src="/images/developer-coding-workspace.png"
                    alt="repoHamster Interactive IDE and Workstation Preview"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--gh-bg)]/80 dark:from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Glassmorphic Floating Badges */}
                  {/* <div className="absolute top-3 left-3 flex items-center space-x-1.5 rounded-full border border-[var(--gh-border)] dark:border-white/15 bg-white/95 dark:bg-black/75 px-3 py-1 text-xs font-mono font-bold text-[var(--gh-text)] dark:text-white backdrop-blur shadow-none dark:shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
                    <span className="h-2 w-2 rounded-full bg-[#10B981] -ml-2" />
                    <span>Sandbox Ready</span>
                  </div> */}

                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/95 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-[var(--amber-badge-text)] backdrop-blur shadow-none dark:shadow-sm whitespace-nowrap">
                    Mode: Dual OA Track
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center space-x-1 rounded-full border border-[var(--gh-border)] dark:border-white/15 bg-white/95 dark:bg-black/75 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-mono font-bold text-[#F59E0B] backdrop-blur shadow-none dark:shadow-sm whitespace-nowrap">
                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                    <span>+3 Repo Stars</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: SOCIAL PROOF & CREDIBILITY STRIP (MNC Logos)
          ========================================================================= */}
      <section className="border-y border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/50">
        <LandingMNCLogos />
      </section>

      {/* =========================================================================
          SECTION C: BENTO FEATURES GRID ("Built for Engineers. Ready for Big Tech.")
          ========================================================================= */}
      <section id="features" className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--yellow-primary)] font-bold">
            FEATURES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--gh-text)] tracking-tight font-sans">
            Built for real codebases. Ready for interviews.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed max-w-2xl mx-auto">
            Everything you need to master modern software engineering assessments—from containerized multi-language sandboxes to dual OA modes and line-by-line QA.
          </p>
        </div>

        {/* 5-Card Asymmetric Bento Grid */}
        <LandingBentoGrid />
      </section>

      {/* =========================================================================
          SECTION D: REPO CHALLENGES DIRECTORY PREVIEW
          ========================================================================= */}
      <section id="challenges" className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--yellow-primary)] font-bold">
              CURRICULUM DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)] mt-1 font-sans">
              Explore Practice Challenges
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--gh-text-secondary)] max-w-xl">
              Authentic multi-file repository scenarios mirroring actual FAANG and Big Tech Online Assessments.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-4 py-2 text-xs font-semibold text-[var(--gh-text)] hover:text-[var(--yellow-primary)] hover:border-[var(--yellow-primary)] transition"
          >
            <span>View All Challenges</span>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--yellow-primary)]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 flex flex-col justify-between hover:border-[var(--yellow-primary)]/60 transition shadow-none dark:shadow-sm group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[var(--amber-badge-text)] uppercase">
                    {assignment.difficulty || 'INTERMEDIATE'}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-mono font-bold text-[#F59E0B]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>+3 ★ Repo Stars</span>
                  </div>
                </div>

                <div>
                  <Link
                    href={`/assignments/${assignment.slug}`}
                    className="text-base font-bold text-[var(--gh-text)] group-hover:text-[var(--yellow-primary)] hover:underline transition"
                  >
                    {assignment.title}
                  </Link>
                  <p className="mt-1.5 text-xs text-[var(--gh-text-secondary)] line-clamp-2 leading-relaxed">
                    {assignment.description || 'Fix race conditions, implement mutexes, and pass edge-case test suites.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-[var(--gh-text-secondary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--yellow-primary)]" />
                  <span>{assignment.language || 'TypeScript'}</span>
                </div>

                <Link
                  href={`/assignments/${assignment.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--yellow-primary)] hover:underline"
                >
                  <span>Clone &amp; Solve</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION E: TESTIMONIALS & FAQ
          ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8 border-t border-[var(--gh-border)]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--yellow-primary)] font-bold">
            COMMUNITY &amp; EXPERIENCES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)]">
            Built for Engineers Who Care About Craft
          </h2>
          <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)]">
            Developers love solving real software bugs in familiar GitHub environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Vishakha */}
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-3 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[#F59E0B] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;The 1-Click Codespaces setup had the codebase running in 30 seconds with zero runtime hassle. Traced the concurrency race condition with Hamster AI and shipped a passing PR.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              <Image
                src={vishakhaAvatar}
                alt="Vishakha Chaudhary"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover border border-[var(--yellow-primary)]/50 shadow-sm"
              />
              <div>
                <p className="text-xs font-bold text-[var(--gh-text)]">
                  Vishakha Chaudhary
                </p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                  @vishakhaa05 • Full-Stack Engineer
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Shivam */}
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-3 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[#F59E0B] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;RepoHamster mirrors actual engineering far better than leetcode puzzles. The hidden test harness catches edge cases, memory leaks, and race conditions that normal tests miss.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              <Image
                src={civdixAvatar}
                alt="Shivam Dixit"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover border border-[var(--yellow-primary)]/50 shadow-sm"
              />
              <div>
                <p className="text-xs font-bold text-[var(--gh-text)]">
                  Shivam Dixit
                </p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                  @civdix • Core Systems &amp; Backend
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Anonymous Staff */}
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-3 shadow-sm hover:border-[var(--yellow-primary)]/40 transition">
            <div className="flex items-center space-x-1 text-[#F59E0B] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed italic">
              &quot;Seeing a candidate isolate regressions, review CI logs, and commit clean fixes in real codebases is 10x more informative than any whiteboard interview.&quot;
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-[var(--gh-border-subtle)]">
              <div className="h-9 w-9 rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center p-1.5 shadow-sm">
                <HamsterMascot variant="normal" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--gh-text)]">
                  Verified Engineer
                </p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                  Staff Infrastructure (FAANG)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-16 max-w-3xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--yellow-primary)] font-bold">
              QUESTIONS
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--gh-text)] mt-1">
              Frequently Asked Questions
            </h3>
          </div>
          <LandingFaq />
        </div>
      </section>

      {/* =========================================================================
          SECTION F: ENTERPRISE & CAMPUS FORM (Page 5 in Design.md)
          ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Pitch & Contact Details */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gh-bg)] border border-[var(--gh-border)] p-1 shadow-sm">
                <HamsterMascot variant="normal" size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)] tracking-tight font-sans">
                Bring repoHamster to your team or campus.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans max-w-md">
                Empower your hiring pipelines or students with production-grade repository debugging assessments, automated hidden grading, and anti-cheat AI rate limiting.
              </p>
              <div className="pt-2 text-xs font-mono text-[var(--gh-text-secondary)]">
                Direct Contact:{' '}
                <a
                  href="mailto:shivdix.work+repohamster@gmail.com"
                  className="font-bold text-[var(--yellow-primary)] hover:underline"
                >
                  shivdix.work+repohamster@gmail.com
                </a>
              </div>
            </div>

            {/* Right Column: Clean Minimal Contact Form */}
            <div className="lg:col-span-6">
              <ContactForm compact defaultUseCase="Hiring Team Assessment" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
