import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import {
  Shield,
  CheckCircle2,
  GitPullRequest,
  ExternalLink,
  Calendar,
  Code2,
  Award,
  Layers,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { ShareProfileBar } from '@/components/profile/ShareProfileBar';

export const dynamic = 'force-dynamic';

interface PublicProfileProps {
  params: {
    username: string;
  };
}

type UserWithProfileData = Prisma.UserGetPayload<{
  include: {
    assignments: {
      include: {
        assignment: true;
        submissions: {
          include: {
            evaluation: {
              include: { testResults: true };
            };
            pullRequest: true;
          };
        };
      };
    };
    pullRequests: true;
  };
}>;

export async function generateMetadata({ params }: PublicProfileProps): Promise<Metadata> {
  const rawUsername = decodeURIComponent(params.username).replace(/^@/, '').toLowerCase().trim();

  let user = null;
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: rawUsername, mode: 'insensitive' } },
          { githubUsername: { equals: rawUsername, mode: 'insensitive' } },
        ],
      },
      select: { name: true, username: true, githubUsername: true },
    });
  } catch {}

  const displayName = user?.name || user?.username || rawUsername;
  const handle = user?.username || user?.githubUsername || rawUsername;

  return {
    title: `${displayName} (@${handle}) | RepoHamster Developer Profile`,
    description: `View ${displayName}'s verified developer coding challenges, bug fixes, and assessment metrics on RepoHamster.`,
    openGraph: {
      title: `${displayName} (@${handle}) - RepoHamster Profile`,
      description: `Verified candidate profile with solved engineering challenges on RepoHamster.`,
      url: `https://www.repohamster.com/@${handle}`,
    },
  };
}

export default async function PublicProfilePage({ params }: PublicProfileProps) {
  const session = await getServerSession(authOptions);
  const rawUsername = decodeURIComponent(params.username).replace(/^@/, '').toLowerCase().trim();

  let user: UserWithProfileData | null = null;
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: rawUsername, mode: 'insensitive' } },
          { githubUsername: { equals: rawUsername, mode: 'insensitive' } },
        ],
      },
      include: {
        assignments: {
          include: {
            assignment: true,
            submissions: {
              include: {
                evaluation: {
                  include: { testResults: true },
                },
                pullRequest: true,
              },
              orderBy: { submittedAt: 'desc' },
            },
          },
          orderBy: { startedAt: 'desc' },
        },
        pullRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  } catch (err) {
    console.error('[PUBLIC_PROFILE] Error querying user:', err);
  }

  // 404 NOT FOUND STATE
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-card border border-card-border shadow-glow-lime mb-6">
          <HamsterMascot variant="thinking" size={64} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Developer Not Found
        </h1>
        <p className="text-sm font-mono text-slate-400 mb-6 max-w-md mx-auto">
          No developer profile matching <span className="text-brand-lime font-bold">@{rawUsername}</span> was found on RepoHamster.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime"
          >
            Explore Challenges
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-card-border bg-card px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const displayHandle = user.username || user.githubUsername || rawUsername;
  const isOwner = session?.user?.email?.toLowerCase() === user.email.toLowerCase();

  // Statistics
  const completedAssignments = user.assignments.filter((a) => a.status === 'COMPLETED');
  const inProgressAssignments = user.assignments.filter((a) => a.status === 'IN_PROGRESS');
  const allSubmissions = user.assignments.flatMap((a) => a.submissions);
  const passedSubmissions = allSubmissions.filter((s) => s.evaluation?.isPassed);
  const passRate =
    allSubmissions.length > 0 ? Math.round((passedSubmissions.length / allSubmissions.length) * 100) : 0;

  // Stacks solved breakdown
  const stacksSolved: string[] = Array.from(
    new Set(
      completedAssignments
        .map((ca) => ca.assignment.language)
        .filter((lang): lang is string => Boolean(lang))
    )
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header Profile Banner */}
      <div className="relative rounded-2xl border border-card-border bg-gradient-to-r from-[#121624] via-card to-[#161228] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-lime/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || displayHandle}
                className="h-20 w-20 rounded-2xl border-2 border-brand-lime/60 shadow-glow-lime object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border-2 border-brand-lime/50 shadow-glow-lime">
                <HamsterMascot variant="avatar" size={54} />
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                  {user.name || displayHandle}
                </h1>

                {user.role === 'ADMIN' ? (
                  <span className="inline-flex items-center rounded-full border border-purple-800/50 bg-purple-950/40 px-2.5 py-0.5 text-xs font-mono font-medium text-brand-purple-light">
                    <Shield className="mr-1 h-3 w-3" />
                    Platform Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-lime-800/40 bg-lime-950/30 px-2.5 py-0.5 text-xs font-mono font-medium text-brand-lime">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Verified Candidate
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono font-bold text-brand-lime">
                  @{displayHandle}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-400 flex items-center">
                  <Calendar className="mr-1 h-3 w-3 text-slate-500" />
                  Member since {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                </span>
              </div>

              {user.githubUsername && (
                <div className="pt-0.5">
                  <a
                    href={`https://github.com/${user.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-brand-lime transition"
                  >
                    <span>github.com/{user.githubUsername}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
            {isOwner && (
              <Link
                href="/profile"
                className="rounded-xl border border-card-border bg-[#0a0d14] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:border-brand-lime/60 transition"
              >
                Edit Profile
              </Link>
            )}
            <Link
              href="/dashboard"
              className="rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime flex items-center space-x-1.5 active:scale-95"
            >
              <span>Explore Challenges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Share Profile Bar in Header */}
        <div className="mt-6 pt-6 border-t border-card-border/60">
          <ShareProfileBar username={displayHandle} />
        </div>
      </div>

      {/* 2. Developer Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Challenges Solved</span>
            <CheckCircle2 className="h-4 w-4 text-brand-lime" />
          </div>
          <div className="mt-2 text-2xl font-bold text-brand-lime font-mono">
            {completedAssignments.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">Verified automated harness pass</p>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Pass Rate</span>
            <Award className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-300 font-mono">
            {passRate}%
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">{passedSubmissions.length} of {allSubmissions.length} PRs passed</p>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>PR Submissions</span>
            <GitPullRequest className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-300 font-mono">
            {allSubmissions.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">Shipped to hidden test runners</p>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>In Progress</span>
            <Terminal className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300 font-mono">
            {inProgressAssignments.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-mono">Active candidate worktrees</p>
        </div>
      </div>

      {/* 3. Stacks Solved */}
      {stacksSolved.length > 0 && (
        <div className="rounded-xl border border-card-border bg-card p-5">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            <Layers className="h-4 w-4 text-brand-lime" />
            <span>Mastered Stacks & Technologies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stacksSolved.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center rounded-lg border border-brand-lime/40 bg-lime-950/20 px-3 py-1 text-xs font-mono font-medium text-brand-lime"
              >
                <Code2 className="mr-1.5 h-3.5 w-3.5" />
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Solved Challenges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Award className="h-5 w-5 text-brand-lime" />
            <span>Completed Challenges</span>
            <span className="rounded-full bg-brand-lime/10 border border-brand-lime/30 px-2.5 py-0.5 text-xs font-mono text-brand-lime">
              {completedAssignments.length}
            </span>
          </h2>
        </div>

        {completedAssignments.length === 0 ? (
          <div className="rounded-2xl border border-card-border bg-card p-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a0d14] border border-card-border">
              <HamsterMascot variant="thinking" size={36} />
            </div>
            <h3 className="text-sm font-bold text-white">No Solved Challenges Yet</h3>
            <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
              @{displayHandle} is currently gearing up to break and fix their first repository bug.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAssignments.map((ca) => {
              const latestSubmission = ca.submissions[0];
              return (
                <div
                  key={ca.id}
                  className="rounded-xl border border-card-border bg-card p-5 hover:border-brand-lime/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-white text-sm line-clamp-1">
                        {ca.assignment.title}
                      </h3>
                      <span className="inline-flex items-center rounded-full border border-lime-800/40 bg-lime-950/30 px-2 py-0.5 text-[10px] font-mono text-brand-lime shrink-0">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        PASSED
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {ca.assignment.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {ca.assignment.language && (
                        <span className="rounded-md bg-[#0a0d14] border border-card-border px-2 py-0.5 text-[10px] font-mono text-slate-300">
                          {ca.assignment.language}
                        </span>
                      )}
                      {ca.assignment.difficulty && (
                        <span className="rounded-md bg-[#0a0d14] border border-card-border px-2 py-0.5 text-[10px] font-mono text-purple-300">
                          {ca.assignment.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>
                      Completed {ca.completedAt ? new Date(ca.completedAt).toLocaleDateString() : (ca.startedAt ? new Date(ca.startedAt).toLocaleDateString() : 'Recently')}
                    </span>
                    {latestSubmission?.pullRequest?.prUrl && (
                      <a
                        href={latestSubmission.pullRequest.prUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-lime hover:underline flex items-center space-x-1"
                      >
                        <span>View PR</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Recent Pull Requests & Assessment Activity */}
      {user.pullRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <GitPullRequest className="h-5 w-5 text-sky-400" />
            <span>Recent Pull Requests</span>
          </h2>

          <div className="rounded-xl border border-card-border bg-card divide-y divide-card-border/60 overflow-hidden">
            {user.pullRequests.map((pr) => (
              <div key={pr.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-950/30 border border-sky-800/40 text-sky-400">
                    <GitPullRequest className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-white">
                        PR #{pr.prNumber}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase ${
                          pr.state === 'MERGED'
                            ? 'bg-purple-950/40 text-purple-300 border border-purple-800/40'
                            : pr.state === 'OPEN'
                            ? 'bg-lime-950/40 text-brand-lime border border-lime-800/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {pr.state}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono truncate">
                      branch: {pr.branchName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0 text-xs font-mono text-slate-500">
                  <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
                  {pr.prUrl && (
                    <a
                      href={pr.prUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-lime hover:underline flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Verified Assessment Footer */}
      <div className="rounded-xl border border-card-border/60 bg-[#07090e] p-4 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-brand-lime" />
          <span>RepoHamster Automated Evaluation Engine & Socratic Integrity Verified</span>
        </div>
        <span>https://www.repohamster.com/@{displayHandle}</span>
      </div>
    </div>
  );
}
