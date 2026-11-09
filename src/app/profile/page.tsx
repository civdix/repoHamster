import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import {
  User,
  Shield,
  CheckCircle2,
  Clock,
  Code2,
  GitPullRequest,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  Terminal,
  Calendar,
  Zap,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { UsernameEditor } from '@/components/profile/UsernameEditor';

export const dynamic = 'force-dynamic';

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin?callbackUrl=/profile');
  }

  const userEmail = session.user.email.toLowerCase();

  // Fetch candidate record and all associated coding activity
  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { email: userEmail },
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
        },
        aiUsages: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
        pullRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  } catch (err) {
    console.error('[PROFILE] Error querying user profile:', err);
  }

  if (!user) {
    redirect('/auth/signin');
  }

  // System settings for AI
  let systemSettings: Record<string, string> = {
    ai_daily_request_limit: '15',
    ai_token_limit: '10000',
  };
  try {
    const settings = await prisma.adminSettings.findMany();
    for (const s of settings) {
      systemSettings[s.key] = s.value;
    }
  } catch {
    // defaults
  }

  const dailyRequestLimit = parseInt(systemSettings.ai_daily_request_limit || '15', 10);
  const dailyTokenLimit = parseInt(systemSettings.ai_token_limit || '10000', 10);

  const usedRequests = user.aiUsages.length;
  const usedTokens = user.aiUsages.reduce((sum, u) => sum + u.totalTokens, 0);

  const remainingRequests = Math.max(0, dailyRequestLimit - usedRequests);
  const remainingTokens = Math.max(0, dailyTokenLimit - usedTokens);

  // Coding statistics
  const completedAssignments = user.assignments.filter((a) => a.status === 'COMPLETED');
  const inProgressAssignments = user.assignments.filter((a) => a.status === 'IN_PROGRESS');

  const allSubmissions = user.assignments.flatMap((a) => a.submissions);
  const passedSubmissions = allSubmissions.filter((s) => s.evaluation?.isPassed);
  const passRate =
    allSubmissions.length > 0 ? Math.round((passedSubmissions.length / allSubmissions.length) * 100) : 0;

  // Stacks solved breakdown
  const languagesSolved = new Set(
    completedAssignments.map((ca) => ca.assignment.language).filter(Boolean)
  );

  const displayUsername = user.username || user.githubUsername || user.email.split('@')[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Profile Header & Username Banner */}
      <div className="relative rounded-2xl border border-card-border bg-gradient-to-r from-[#121624] via-card to-[#161228] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User avatar'}
                className="h-20 w-20 rounded-2xl border-2 border-brand-lime/60 shadow-glow-lime object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border-2 border-brand-lime/50 shadow-glow-lime">
                <HamsterMascot variant="avatar" size={54} />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {user.name || 'Software Engineer'}
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

              {/* Username Feature Component */}
              <UsernameEditor initialUsername={displayUsername} userId={user.id} />

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span>{user.email}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3 text-slate-500" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
                {user.githubUsername && (
                  <>
                    <span>•</span>
                    <a
                      href={`https://github.com/${user.githubUsername}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-lime hover:underline flex items-center"
                    >
                      <span>github.com/{user.githubUsername}</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-center">
            <Link
              href="/dashboard"
              className="rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime flex items-center space-x-1.5 active:scale-95"
            >
              <span>Explore Challenges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Coding Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Challenges Solved</span>
            <CheckCircle2 className="h-4 w-4 text-brand-lime" />
          </div>
          <div className="mt-2 text-2xl font-bold text-brand-lime font-mono">
            {completedAssignments.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            {inProgressAssignments.length} currently in progress
          </div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Evaluation Pass Rate</span>
            <Zap className="h-4 w-4 text-brand-lime" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{passRate}%</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            {passedSubmissions.length} of {allSubmissions.length} PR test runs passed
          </div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Daily AI Queries Left</span>
            <Sparkles className="h-4 w-4 text-brand-purple" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">{remainingRequests}</span>
            <span className="text-xs text-slate-400">/ {dailyRequestLimit} today</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            {remainingTokens.toLocaleString()} tokens remaining
          </div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Languages Mastered</span>
            <Code2 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{languagesSolved.size}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono truncate">
            {languagesSolved.size > 0 ? Array.from(languagesSolved).join(', ') : 'None yet'}
          </div>
        </div>
      </div>

      {/* 3. Challenge Activity & Submissions History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Challenge Progress (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="h-4 w-4 text-brand-lime" />
              <span>Assigned & Attempted Challenges</span>
            </h2>
          </div>

          {user.assignments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-card-border bg-card/40 p-8 text-center space-y-3">
              <HamsterMascot variant="empty" size={96} className="mx-auto" />
              <p className="text-sm font-semibold text-white">No challenges started yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select a challenge from the Candidate Dashboard to launch an isolated Codespaces workspace.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-1.5 rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime active:scale-95"
              >
                <span>Browse Challenges</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {user.assignments.map((ca) => {
                const latestSub = ca.submissions[0];
                const latestEval = latestSub?.evaluation;
                const isPassed = ca.status === 'COMPLETED' || latestEval?.isPassed;

                return (
                  <div
                    key={ca.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-card-border bg-card p-4 hover:border-slate-700 transition gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-card-border bg-[#0a0d14] text-slate-300">
                          {ca.assignment.language} • {ca.assignment.framework}
                        </span>

                        {isPassed ? (
                          <span className="inline-flex items-center rounded-full border border-lime-800/40 bg-lime-950/40 px-2 py-0.5 text-[10px] font-mono font-medium text-brand-lime">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-amber-800/50 bg-amber-950/40 px-2 py-0.5 text-[10px] font-mono font-medium text-amber-400">
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-white text-sm">{ca.assignment.title}</h3>

                      {latestEval && (
                        <p className="text-xs font-mono text-slate-400">
                          Latest score:{' '}
                          <span className={latestEval.isPassed ? 'text-brand-lime font-bold' : 'text-rose-400'}>
                            {latestEval.scorePercent}%
                          </span>{' '}
                          ({latestEval.passedTests}/{latestEval.totalTests} tests)
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <Link
                        href={`/assignments/${ca.assignment.slug}`}
                        className="rounded-xl border border-card-border bg-[#0a0d14] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-brand-lime transition flex items-center space-x-1 active:scale-95"
                      >
                        <span>{isPassed ? 'Review Solution' : 'Resume Challenge'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Pull Request & Evaluation History (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <GitPullRequest className="h-4 w-4 text-brand-purple" />
            <span>Recent Pull Requests</span>
          </h2>

          {user.pullRequests.length === 0 ? (
            <div className="rounded-xl border border-card-border bg-card p-6 text-center text-xs text-slate-400 font-mono">
              No pull requests submitted yet.
            </div>
          ) : (
            <div className="rounded-xl border border-card-border bg-card divide-y divide-card-border">
              {user.pullRequests.map((pr) => (
                <div key={pr.id} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-white">PR #{pr.prNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(pr.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate font-mono">{pr.branchName}</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{pr.repoFullName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
