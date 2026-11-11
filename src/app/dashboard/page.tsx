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
  BookMarked,
  Bot,
  User,
  ShieldCheck,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { getTestCaseSummary } from '@/lib/test-case-utils';
import { ShareProfileBar } from '@/components/profile/ShareProfileBar';

export const dynamic = 'force-dynamic';

export default async function CandidateDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  const userEmail = session.user.email?.toLowerCase();

  // Fetch or resolve candidate
  let candidate: any = null;
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
  const usedTokensToday = candidate?.aiUsages?.reduce((sum: number, u: any) => sum + u.totalTokens, 0) || 0;

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
        take: 6,
      });
    }
  } catch (err) {
    console.error('[CANDIDATE DASHBOARD] Recent submissions error:', err);
  }

  const displayHandle = candidate?.username || candidate?.githubUsername || (session.user as any)?.githubUsername || 'coder';
  const displayName = candidate?.name || session.user.name || 'Developer';

  // Dynamic Hamster Greeting based on pass count
  let hamsterQuote = "Put on your coder headphones—we've got pesky bugs to nibble through!";
  if (completedCount === totalAssignments && totalAssignments > 0) {
    hamsterQuote = "Legendary work! Every single challenge is 100% green! RepoHamster salutes you!";
  } else if (completedCount > 0) {
    hamsterQuote = `Awesome pace! You've squashed ${completedCount} bug suites already! Keep shipping fixes!`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-[var(--gh-text)]">
      {/* 1. Personalized Welcome Card with Hamster Mascot (Yellow + Dark Theme) */}
      <div className="relative rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,var(--yellow-glow),transparent_70%)] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--gh-bg)] border border-[var(--yellow-primary)]/50 shadow-[var(--yellow-glow)] p-1">
              <HamsterMascot
                variant={completedCount > 0 ? 'normal' : 'normal'}
                size={54}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                  Welcome back, {displayName}!
                </h1>
                <Link
                  href="/profile"
                  className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)] hover:border-[var(--yellow-bright)] transition"
                  title="Claim / Manage Unique Developer Handle"
                >
                  @{displayHandle}
                </Link>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm text-[var(--yellow-bright)] font-mono">
                &ldquo;{hamsterQuote}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            <Link
              href="/profile"
              className="rounded-xl border border-[var(--yellow-primary)]/60 bg-[var(--amber-badge-bg)] px-4 py-2 text-xs font-mono font-bold text-[var(--amber-badge-text)] hover:border-[var(--yellow-bright)] transition active:scale-95 shadow-[var(--yellow-glow)]"
            >
              Developer Profile
            </Link>
            <ShareProfileBar username={displayHandle} variant="compact" />
          </div>
        </div>
      </div>

      {/* 2. Metrics Row (Yellow + Dark Theme) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--gh-text-muted)]">
            <span>Total Challenges</span>
            <Layers className="h-4 w-4 text-[var(--gh-text-dim)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalAssignments}</div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)]">{availableCount} available to solve</div>
        </div>

        <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/80 p-4">
          <div className="flex items-center justify-between text-xs text-[var(--amber-badge-text)]">
            <span>Completed</span>
            <CheckCircle2 className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--yellow-bright)]">{completedCount}</div>
          <div className="mt-1 text-[11px] text-[var(--amber-badge-text)]">100% tests verified</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--gh-text-muted)]">
            <span>In Progress</span>
            <Clock className="h-4 w-4 text-[var(--yellow-primary)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--yellow-primary)]">{inProgressCount}</div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)]">Active cloud workspaces</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--gh-text-muted)]">
            <span>AI Credit Budget</span>
            <Bot className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold text-white">{remainingRequests}</span>
            <span className="text-xs text-[var(--gh-text-muted)]">/ {dailyRequestLimit} queries</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--gh-bg-tertiary)] overflow-hidden mt-1">
            <div
              style={{ width: `${Math.min(100, (remainingRequests / dailyRequestLimit) * 100)}%` }}
              className="h-full bg-[var(--yellow-bright)] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 3. Available Assignments Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--gh-border-subtle)] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 font-sans">
              <BookMarked className="h-5 w-5 text-[var(--yellow-bright)]" />
              <span>Repository Debugging Challenges</span>
            </h2>
            <p className="text-xs text-[var(--gh-text-muted)] font-mono mt-0.5">
              Open your assigned repository in Codespaces, fix the bugs, and submit a PR for automated hidden test evaluation.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--gh-text-muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)]" />
            <span>Interactive Evaluation Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allAssignments.map((assignment) => {
            const tracking = assignmentStatusMap.get(assignment.id);
            const status = tracking?.status || 'NOT_STARTED';
            const evaluation = tracking?.latestEvaluation;
            const isCompleted = status === 'COMPLETED';
            const testSummary = getTestCaseSummary(assignment);

            return (
              <div
                key={assignment.id}
                className="group flex flex-col justify-between rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-5 shadow-sm transition hover:border-[var(--yellow-primary)]/60"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-md bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2 py-0.5 text-[10px] text-[var(--amber-badge-text)] font-mono font-semibold uppercase">
                      {assignment.difficulty}
                    </span>

                    {/* Status Badge */}
                    {isCompleted ? (
                      <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[var(--amber-badge-text)]">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        PASSED
                      </span>
                    ) : status === 'IN_PROGRESS' ? (
                      <span className="inline-flex items-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--yellow-primary)]">
                        <Clock className="mr-1 h-3 w-3" />
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--gh-text-muted)]">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-white text-base group-hover:text-[var(--yellow-bright)] transition line-clamp-1">
                    {assignment.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[var(--gh-text-muted)] line-clamp-2 leading-relaxed">
                    {assignment.description}
                  </p>

                  {/* Meta Specs */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono text-[var(--gh-text-muted)] border-t border-[var(--gh-border-subtle)] pt-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] inline-block" />
                      <span className="truncate text-slate-300">{assignment.language} • {assignment.framework || 'Standard'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 justify-end">
                      <Timer className="h-3.5 w-3.5 text-[var(--gh-text-dim)]" />
                      <span>~{assignment.estimatedTimeMinutes} mins</span>
                    </div>
                  </div>

                  {/* Testcases Present Block */}
                  <div className="mt-2.5 rounded-lg border border-[var(--gh-border-subtle)] bg-[var(--gh-bg-secondary)] px-2.5 py-1.5 text-[10px] font-mono flex items-center justify-between">
                    <span className="text-[var(--gh-text-muted)]">Testcases Present:</span>
                    <span
                      className={`truncate font-semibold ${
                        testSummary.hasTestCases ? 'text-[var(--yellow-bright)]' : 'text-[var(--yellow-primary)]'
                      }`}
                      title={testSummary.displayText}
                    >
                      {testSummary.displayText}
                    </span>
                  </div>

                  {/* Test score summary if evaluated */}
                  {evaluation && (
                    <div className="mt-2.5 rounded-lg border border-[var(--gh-border-subtle)] bg-[var(--gh-bg-secondary)] p-2 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[var(--gh-text-muted)]">Latest Run:</span>
                        <span
                          className={`font-semibold ${
                            evaluation.isPassed ? 'text-[var(--yellow-bright)]' : 'text-[var(--yellow-primary)]'
                          }`}
                        >
                          {evaluation.scorePercent}% ({evaluation.passedTests}/{evaluation.totalTests} tests)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card CTA (Variables) */}
                <div className="mt-5 border-t border-[var(--gh-border-subtle)] pt-4">
                  <Link
                    href={`/assignments/${assignment.slug}`}
                    className={`flex w-full items-center justify-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition active:scale-95 ${
                      isCompleted
                        ? 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-slate-200 hover:text-white hover:border-[var(--yellow-primary)]/50'
                        : 'bg-[var(--yellow-button-bg)] text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] shadow-[var(--yellow-glow)] font-bold'
                    }`}
                  >
                    <span>
                      {isCompleted
                        ? 'Review Solution & Workspace'
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

      {/* 4. Recent Pull Requests & Evaluations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--gh-border-subtle)] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 font-sans">
              <GitPullRequest className="h-5 w-5 text-[var(--yellow-bright)]" />
              <span>Recent Pull Requests &amp; Evaluations</span>
            </h2>
            <p className="text-xs text-[var(--gh-text-muted)] font-mono mt-0.5">
              Audit trail of commit SHAs evaluated by RepoHamster&apos;s isolated worker engine.
            </p>
          </div>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/50 p-10 text-center space-y-3">
            <HamsterMascot variant="mercy" size={80} className="mx-auto" />
            <p className="text-sm font-semibold text-white">No Submissions Recorded Yet</p>
            <p className="text-xs text-[var(--gh-text-muted)] max-w-md mx-auto font-mono">
              Launch a challenge above via Codespaces, fix the bugs, and submit a PR to initiate automated test runner evaluations.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] overflow-hidden">
            <div className="divide-y divide-[var(--gh-border-subtle)]">
              {recentSubmissions.map((sub) => {
                const isPassed = sub.evaluation?.isPassed;
                const commitShort = sub.commitSha.slice(0, 7);

                return (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-[var(--gh-bg-secondary)]/40 transition gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`mt-1 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isPassed
                            ? 'bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--yellow-bright)]'
                            : 'bg-[var(--gh-bg-tertiary)] border border-[var(--gh-border)] text-[var(--yellow-primary)]'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
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
                              className="inline-flex items-center text-xs font-mono text-[var(--yellow-bright)] hover:underline"
                            >
                              PR #{sub.pullRequest.prNumber}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>

                        <p className="text-xs text-[var(--gh-text-muted)] mt-0.5 line-clamp-1 font-mono">
                          {sub.commitMessage || 'Automated commit submission'}
                        </p>

                        <div className="flex items-center space-x-3 text-[11px] font-mono text-[var(--gh-text-dim)] mt-1">
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
                            <span className={isPassed ? 'text-[var(--yellow-bright)]' : 'text-[var(--yellow-primary)]'}>
                              {sub.evaluation.scorePercent}% ({sub.evaluation.passedTests}/{sub.evaluation.totalTests} tests)
                            </span>
                          ) : (
                            <span className="text-[var(--yellow-primary)]">Evaluating...</span>
                          )}
                        </div>
                        <div className="text-[10px] text-[var(--gh-text-dim)] font-mono">
                          {sub.evaluation?.executionTimeMs ? `${sub.evaluation.executionTimeMs}ms execution` : 'queued'}
                        </div>
                      </div>

                      <Link
                        href={`/assignments/${sub.candidateAssignment.assignment.slug}`}
                        className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2 text-[var(--gh-text-muted)] hover:text-white transition"
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
