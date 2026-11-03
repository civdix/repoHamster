import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import {
  Code,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  GitPullRequest,
  ExternalLink,
  ChevronRight,
  Layers,
  Timer,
  Terminal,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CandidateDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  const userEmail = session.user.email?.toLowerCase();

  // Fetch or resolve candidate
  let candidate = null;
  if (userEmail) {
    try {
      candidate = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          assignments: {
            include: {
              assignment: true,
              submissions: {
                include: {
                  evaluation: true,
                  pullRequest: true,
                },
                orderBy: { submittedAt: 'desc' },
                take: 1,
              },
            },
          },
          aiUsages: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
              },
            },
          },
        },
      });
    } catch (err) {
      console.error('[CANDIDATE DASHBOARD] DB query error:', err);
    }
  }

  // Fetch all active assignments
  let allAssignments: any[] = [];
  let systemSettings: Record<string, string> = {
    ai_daily_request_limit: '15',
    ai_token_limit: '10000',
  };

  try {
    allAssignments = await prisma.assignment.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    const settingsRows = await prisma.adminSettings.findMany();
    for (const row of settingsRows) {
      systemSettings[row.key] = row.value;
    }
  } catch (err) {
    console.error('[CANDIDATE DASHBOARD] Assignment query error:', err);
  }

  // AI Usage Calculations
  const dailyRequestLimit = parseInt(systemSettings.ai_daily_request_limit || '15', 10);
  const dailyTokenLimit = parseInt(systemSettings.ai_token_limit || '10000', 10);

  const usedRequestsToday = candidate?.aiUsages?.length || 0;
  const usedTokensToday = candidate?.aiUsages?.reduce((sum, u) => sum + u.totalTokens, 0) || 0;

  const remainingRequests = Math.max(0, dailyRequestLimit - usedRequestsToday);
  const remainingTokens = Math.max(0, dailyTokenLimit - usedTokensToday);

  // Status mapping
  const assignmentStatusMap = new Map<string, { status: string; latestEvaluation?: any; candidateAssignmentId?: string }>();
  if (candidate?.assignments) {
    for (const ca of candidate.assignments) {
      const latestSub = ca.submissions[0];
      assignmentStatusMap.set(ca.assignmentId, {
        status: ca.status,
        latestEvaluation: latestSub?.evaluation,
        candidateAssignmentId: ca.id,
      });
    }
  }

  const totalAssignments = allAssignments.length;
  const completedCount = Array.from(assignmentStatusMap.values()).filter((v) => v.status === 'COMPLETED').length;
  const inProgressCount = Array.from(assignmentStatusMap.values()).filter((v) => v.status === 'IN_PROGRESS').length;
  const availableCount = totalAssignments - completedCount;

  // Recent Submissions
  let recentSubmissions: any[] = [];
  try {
    if (candidate) {
      recentSubmissions = await prisma.submission.findMany({
        where: {
          candidateAssignment: {
            candidateId: candidate.id,
          },
        },
        include: {
          candidateAssignment: {
            include: { assignment: true },
          },
          evaluation: true,
          pullRequest: true,
        },
        orderBy: { submittedAt: 'desc' },
        take: 5,
      });
    }
  } catch (err) {
    console.error('[CANDIDATE DASHBOARD] Recent submissions error:', err);
  }

  const difficultyBadge = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return 'border-emerald-800/40 bg-emerald-950/40 text-emerald-400';
      case 'INTERMEDIATE':
        return 'border-amber-800/40 bg-amber-950/40 text-amber-400';
      case 'ADVANCED':
        return 'border-rose-800/40 bg-rose-950/40 text-rose-400';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back, {candidate?.name || session.user.name || 'Candidate'}
            </h1>
            <span className="rounded-full border border-card-border bg-card px-2.5 py-0.5 text-xs font-mono text-slate-400">
              @{candidate?.githubUsername || (session.user as any)?.githubUsername || 'github-user'}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Select an assigned debugging repository, launch your GitHub Codespace, and submit your Pull Request for automated evaluation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/auth/signin"
            className="rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
          >
            Switch Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Total Challenges</span>
            <Layers className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalAssignments}</div>
          <div className="mt-1 text-[11px] text-slate-500">{availableCount} remaining to solve</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{completedCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">Passing all verification tests</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>In Progress</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400">{inProgressCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">Active Codespaces/branches</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>AI Assistance Quota</span>
            <Sparkles className="h-4 w-4 text-accent-cyan" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{remainingRequests}</span>
            <span className="text-xs text-slate-400">/ {dailyRequestLimit} queries left</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>{remainingTokens.toLocaleString()} tokens remaining</span>
          </div>
        </div>
      </div>

      {/* Available Assignments Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Debugging Assignments</h2>
            <p className="text-xs text-slate-400">
              Each repository contains production code with known defects. Pass all public and hidden test cases to complete.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allAssignments.map((assignment) => {
            const tracking = assignmentStatusMap.get(assignment.id);
            const status = tracking?.status || 'NOT_STARTED';
            const evaluation = tracking?.latestEvaluation;

            return (
              <div
                key={assignment.id}
                className="group flex flex-col justify-between rounded-xl border border-card-border bg-card/90 p-5 shadow-sm transition hover:border-slate-700 hover:shadow-md"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase ${difficultyBadge(
                        assignment.difficulty
                      )}`}
                    >
                      {assignment.difficulty}
                    </span>

                    {/* Status Badge */}
                    {status === 'COMPLETED' ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-800/40 bg-emerald-950/40 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                      </span>
                    ) : status === 'IN_PROGRESS' ? (
                      <span className="inline-flex items-center rounded-full border border-amber-800/40 bg-amber-950/40 px-2 py-0.5 text-[11px] font-medium text-amber-400">
                        <Clock className="mr-1 h-3 w-3" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                        Not Started
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-semibold text-white text-base group-hover:text-accent-cyan transition line-clamp-1">
                    {assignment.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">
                    {assignment.description}
                  </p>

                  {/* Meta Specs */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 border-t border-card-border/80 pt-3">
                    <div className="flex items-center space-x-1.5">
                      <Code className="h-3.5 w-3.5 text-slate-500" />
                      <span className="truncate">{assignment.language} • {assignment.framework}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 justify-end">
                      <Timer className="h-3.5 w-3.5 text-slate-500" />
                      <span>~{assignment.estimatedTimeMinutes} mins</span>
                    </div>
                  </div>

                  {/* Test score summary if evaluated */}
                  {evaluation && (
                    <div className="mt-3 rounded-lg border border-card-border bg-[#090d16] p-2 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-400">Latest Run Score:</span>
                        <span
                          className={`font-semibold ${
                            evaluation.isPassed ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {evaluation.scorePercent}% ({evaluation.passedTests}/{evaluation.totalTests} tests)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="mt-5 border-t border-card-border pt-4">
                  <Link
                    href={`/assignments/${assignment.slug}`}
                    className={`flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      status === 'COMPLETED'
                        ? 'border border-card-border bg-slate-800 text-slate-200 hover:bg-slate-700'
                        : 'bg-accent-cyan text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/10'
                    }`}
                  >
                    <span>
                      {status === 'COMPLETED'
                        ? 'Review Solution & Tests'
                        : status === 'IN_PROGRESS'
                        ? 'Resume in Codespaces'
                        : 'Start Assignment'}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Submissions History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Your Recent Pull Requests & Evaluations</h2>
            <p className="text-xs text-slate-400">
              Auditable log of commit SHAs evaluated by the isolated test worker engine.
            </p>
          </div>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-card-border bg-card/40 p-8 text-center">
            <GitPullRequest className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400">No submissions yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Open an assignment, branch from main, and create a Pull Request to see automatic test results here.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-card-border bg-card overflow-hidden">
            <div className="divide-y divide-card-border">
              {recentSubmissions.map((sub) => {
                const isPassed = sub.evaluation?.isPassed;
                const commitShort = sub.commitSha.slice(0, 7);

                return (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-900/50 transition gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                          isPassed
                            ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-400'
                            : 'bg-rose-950/60 border border-rose-800/40 text-rose-400'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white text-sm">
                            {sub.candidateAssignment.assignment.title}
                          </span>
                          {sub.pullRequest && (
                            <a
                              href={sub.pullRequest.prUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center text-xs font-mono text-accent-cyan hover:underline"
                            >
                              PR #{sub.pullRequest.prNumber}
                              <ExternalLink className="ml-1 h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {sub.commitMessage || 'Automated commit submission'}
                        </p>

                        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500 mt-1">
                          <span>commit: {commitShort}</span>
                          <span>•</span>
                          <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-xs font-mono font-semibold">
                          {sub.evaluation ? (
                            <span className={isPassed ? 'text-emerald-400' : 'text-rose-400'}>
                              {sub.evaluation.scorePercent}% ({sub.evaluation.passedTests}/{sub.evaluation.totalTests} tests)
                            </span>
                          ) : (
                            <span className="text-amber-400">Evaluating...</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {sub.evaluation?.executionTimeMs ? `${sub.evaluation.executionTimeMs}ms runner time` : 'queued'}
                        </div>
                      </div>

                      <Link
                        href={`/assignments/${sub.candidateAssignment.assignment.slug}`}
                        className="rounded-lg border border-card-border bg-[#090d16] p-2 text-slate-400 hover:text-white transition"
                        title="View details"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
