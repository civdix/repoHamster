import Link from 'next/link';
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

export const dynamic = 'force-dynamic';

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
          SECTION A: HERO SECTION (2-Column Split as specified in Design.md)
          ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 pt-10 pb-12 sm:pt-16 sm:pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3.5 py-1 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
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
                className="inline-flex items-center justify-center space-x-2 rounded-full bg-[var(--yellow-button-bg)] px-7 py-3.5 text-xs sm:text-sm font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] shadow-sm transition active:scale-95"
              >
                <span>Launch a Repo Challenge</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/guide"
                className="inline-flex items-center justify-center space-x-2 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-6 py-3.5 text-xs sm:text-sm font-semibold text-[var(--gh-text)] hover:border-[var(--yellow-primary)] hover:text-[var(--yellow-primary)] transition active:scale-95"
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

          {/* Right Column: Interactive Visual / Attachment Container */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[24px] border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-hidden group">
              
              {/* Corner Overlay Floating Pills */}
              <div className="absolute top-6 left-6 z-20 flex items-center space-x-1.5 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)]/95 px-3 py-1 text-xs font-mono font-bold text-[var(--gh-text)] backdrop-blur shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="h-2 w-2 rounded-full bg-[#10B981] -ml-2" />
                <span>Sandbox Ready</span>
              </div>

              <div className="absolute top-6 right-6 z-20 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/95 px-3 py-1 text-xs font-mono font-bold text-[var(--amber-badge-text)] backdrop-blur shadow-sm">
                Mode: AI-Assisted
              </div>

              <div className="absolute bottom-6 left-6 z-20 flex items-center space-x-1.5 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)]/95 px-3.5 py-1 text-xs font-mono font-bold text-[#10B981] backdrop-blur shadow-sm">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>14/14 Unit Tests Passing</span>
              </div>

              <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-1 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)]/95 px-3 py-1 text-xs font-mono font-bold text-[#F59E0B] backdrop-blur shadow-sm">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>+3 Repo Stars</span>
              </div>

              {/* Dedicated Image Attachment Slot specified in Design.md */}
              <div
                id="hero-visual-attachment"
                className="relative rounded-2xl overflow-hidden border border-[var(--gh-border-subtle)] bg-[var(--gh-bg)] aspect-[640/460]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://placehold.co/640x460/FAF7F2/141413?text=repoHamster+Interactive+IDE+Preview+%0A(Replace+with+Custom+Graphic)"
                  alt="repoHamster Interactive IDE Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  loading="eager"
                />
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
              className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 flex flex-col justify-between hover:border-[var(--yellow-primary)]/60 transition shadow-sm group"
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vishakhaAvatar}
                alt="Vishakha Chaudhary"
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={civdixAvatar}
                alt="Shivam Dixit"
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
                  href="mailto:shivam@repohamster.dev"
                  className="font-bold text-[var(--yellow-primary)] hover:underline"
                >
                  shivam@repohamster.dev
                </a>
              </div>
            </div>

            {/* Right Column: Clean Minimal Contact Form */}
            <div className="lg:col-span-6">
              <form
                action="mailto:shivam@repohamster.dev"
                method="POST"
                encType="text/plain"
                className="space-y-3 text-left font-sans"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Work / College Email"
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="organization"
                    placeholder="Role / Organization"
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
                  />
                  <select
                    name="use_case"
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
                  >
                    <option value="Hiring Team Assessment">Use Case: Hiring Team</option>
                    <option value="University / Campus Prep">Use Case: University / Campus</option>
                    <option value="Individual Big Tech Prep">Use Case: Individual Prep</option>
                  </select>
                </div>

                <textarea
                  name="message"
                  rows={3}
                  required
                  placeholder="How can repoHamster help your team or campus?"
                  className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition resize-none"
                />

                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--yellow-button-bg)] py-3 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-sm active:scale-95 flex items-center justify-center space-x-1.5"
                >
                  <span>Send Message</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
