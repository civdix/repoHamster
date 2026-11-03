import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import {
  Code2,
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
  Zap,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

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
        return 'border-brand-lime/40 bg-lime-950/40 text-brand-lime';
      case 'INTERMEDIATE':
        return 'border-amber-800/40 bg-amber-950/40 text-amber-400';
      case 'ADVANCED':
        return 'border-rose-800/40 bg-rose-950/40 text-rose-400';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  // Dynamic Hamster Greeting
  let hamsterQuote = "Put on your coder headphones—we've got pesky bugs to nibble through!";
  if (completedCount === totalAssignments && totalAssignments > 0) {
    hamsterQuote = "Legendary work! Every single challenge is 100% green! RepoHamster salutes you!";
  } else if (completedCount > 0) {
    hamsterQuote = `Awesome pace! You've squashed ${completedCount} bug suites already! Keep shipping fixes!`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Personalized Welcome Card with Hamster Mascot Greeting */}
      <div className="relative rounded-2xl border border-card-border bg-gradient-to-r from-[#121624] via-card to-[#161228] p-6 sm:p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-card border border-brand-lime/40 shadow-glow-lime">
              <HamsterMascot
                variant={completedCount > 0 ? 'celebrating' : 'avatar'}
                size={completedCount > 0 ? 56 : 48}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Welcome back, {candidate?.name || session.user.name || 'Developer'}!
                </h1>
                <span className="rounded-full border border-card-border bg-[#0a0d14] px-2.5 py-0.5 text-xs font-mono text-slate-400">
                  @{candidate?.githubUsername || (session.user as any)?.githubUsername || 'github-user'}
                </span>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm text-brand-lime font-mono">
                &ldquo;{hamsterQuote}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-center">
            <Link
              href="/auth/signin"
              className="rounded-xl border border-card-border bg-[#0a0d14] px-3.5 py-2 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              Switch Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Local Sandbox Demo Indicator */}
      <div className="rounded-xl border border-brand-purple/40 bg-purple-950/20 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2 text-purple-200">
          <Terminal className="h-4 w-4 text-brand-lime shrink-0" />
          <span>
            <strong className="text-white">Sandbox Mode:</strong> Running in local development & assessment mode. You can launch challenges, inspect code, and trigger evaluations without waiting for GitHub organization credentials.
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="rounded-full bg-lime-950 border border-brand-lime/40 px-2.5 py-0.5 text-[10px] text-brand-lime font-bold">
            Sandbox Runner Online
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Total Challenges</span>
            <Layers className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{totalAssignments}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">{availableCount} available to solve</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Completed</span>
            <CheckCircle2 className="h-4 w-4 text-brand-lime" />
          </div>
          <div className="mt-2 text-2xl font-bold text-brand-lime font-mono">{completedCount}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">100% tests verified</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>In Progress</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 font-mono">{inProgressCount}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">Active Codespaces/branches</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>AI Credits Remaining</span>
            <Sparkles className="h-4 w-4 text-brand-purple" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">{remainingRequests}</span>
            <span className="text-xs text-slate-400">/ {dailyRequestLimit} queries left</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            {remainingTokens.toLocaleString()} tokens budget
          </div>
        </div>
      </div>

      {/* Available Assignments Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Zap className="h-4 w-4 text-brand-lime" />
              <span>Debugging Assignments</span>
            </h2>
            <p className="text-xs text-slate-400">
              Open your assigned repository in Codespaces, fix the bugs, and submit a PR for automated hidden test evaluation.
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
                className="group flex flex-col justify-between rounded-xl border border-card-border bg-card p-5 shadow-sm transition hover:border-slate-700 hover:bg-card-hover"
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
                      <span className="inline-flex items-center rounded-full border border-lime-800/40 bg-lime-950/40 px-2 py-0.5 text-[11px] font-mono text-brand-lime">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                      </span>
                    ) : status === 'IN_PROGRESS' ? (
                      <span className="inline-flex items-center rounded-full border border-amber-800/40 bg-amber-950/40 px-2 py-0.5 text-[11px] font-mono text-amber-400">
                        <Clock className="mr-1 h-3 w-3" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-400">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-white text-base group-hover:text-brand-lime transition line-clamp-1">
                    {assignment.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {assignment.description}
                  </p>

                  {/* Meta Specs */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 border-t border-card-border/80 pt-3">
                    <div className="flex items-center space-x-1.5">
                      <Code2 className="h-3.5 w-3.5 text-slate-500" />
                      <span className="truncate">{assignment.language} • {assignment.framework}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 justify-end">
                      <Timer className="h-3.5 w-3.5 text-slate-500" />
                      <span>~{assignment.estimatedTimeMinutes} mins</span>
                    </div>
                  </div>

                  {/* Test score summary if evaluated */}
                  {evaluation && (
                    <div className="mt-3 rounded-lg border border-card-border bg-[#0a0d14] p-2 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-400">Latest Run Score:</span>
                        <span
                          className={`font-semibold ${
                            evaluation.isPassed ? 'text-brand-lime' : 'text-rose-400'
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
                    className={`flex w-full items-center justify-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      status === 'COMPLETED'
                        ? 'border border-card-border bg-card text-slate-200 hover:bg-slate-800'
                        : 'bg-brand-lime text-slate-950 hover:bg-brand-lime-light shadow-glow-lime font-bold'
                    }`}
                  >
                    <span>
                      {status === 'COMPLETED'
                        ? 'Review Solution & Tests'
                        : status === 'IN_PROGRESS'
                        ? 'Resume in Codespaces'
                        : 'Start Challenge'}
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
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <GitPullRequest className="h-4 w-4 text-brand-purple" />
              <span>Recent Pull Requests & Evaluations</span>
            </h2>
            <p className="text-xs text-slate-400">
              Audit trail of commit SHAs evaluated by RepoHamster&apos;s isolated worker engine.
            </p>
          </div>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-border bg-card/40 p-10 text-center space-y-3">
            <HamsterMascot variant="empty" size={120} className="mx-auto" />
            <p className="text-sm font-semibold text-white">No submissions recorded yet</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              RepoHamster is taking a quick nap! Open a challenge above, branch in Codespaces, and open a PR to wake him up with live test evaluations.
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-card-hover transition gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                          isPassed
                            ? 'bg-lime-950/60 border border-lime-800/40 text-brand-lime'
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
                              className="inline-flex items-center text-xs font-mono text-brand-lime hover:underline"
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
                            <span className={isPassed ? 'text-brand-lime' : 'text-rose-400'}>
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
                        className="rounded-lg border border-card-border bg-[#0a0d14] p-2 text-slate-400 hover:text-white transition"
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
