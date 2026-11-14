import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import prisma, { ensureDatabaseColumns } from '@/lib/db';
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
import { ChallengeExplorer } from '@/components/assignments/ChallengeExplorer';

export const dynamic = 'force-dynamic';

export default async function CandidateDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  // Ensure any newly added schema columns exist in PostgreSQL database
  await ensureDatabaseColumns().catch(() => {});

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
    } catch (err: any) {
      console.error('[CANDIDATE DASHBOARD] DB query error:', err?.message || err);
      if (err?.code === 'P2022') {
        await ensureDatabaseColumns().catch(() => {});
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
          },
        }).catch(() => null);
      }
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
  } catch (err: any) {
    console.error('[CANDIDATE DASHBOARD] Assignment query error:', err?.message || err);
    if (err?.code === 'P2022') {
      await ensureDatabaseColumns().catch(() => {});
      allAssignments = await prisma.assignment.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      }).catch(() => []);
    }
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

  // Status mapping object for client component
  const statusMapObj: Record<string, { status: string; latestEvaluation?: any; candidateAssignmentId?: string }> = {};
  assignmentStatusMap.forEach((value, key) => {
    statusMapObj[key] = value;
  });

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
      <div className="relative rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 sm:p-6 overflow-hidden shadow-none dark:shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,var(--yellow-glow),transparent_70%)] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--gh-bg)] border border-[var(--yellow-primary)]/50 shadow-none dark:shadow-[var(--yellow-glow)] p-1">
              <HamsterMascot
                variant={completedCount > 0 ? 'normal' : 'normal'}
                size={48}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--gh-text)] font-sans">
                  Welcome back, {displayName}!
                </h1>
                <Link
                  href="/profile"
                  className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-bold text-[var(--amber-badge-text)] hover:border-[var(--yellow-bright)] transition"
                  title="Claim / Manage Unique Developer Handle"
                >
                  @{displayHandle}
                </Link>
              </div>
              <p className="mt-1 text-xs text-[var(--yellow-bright)] font-mono">
                &ldquo;{hamsterQuote}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            <Link
              href="/profile"
              className="rounded-xl border border-[var(--yellow-primary)]/60 bg-[var(--amber-badge-bg)] px-3.5 py-2 text-xs font-mono font-bold text-[var(--amber-badge-text)] hover:border-[var(--yellow-bright)] transition active:scale-95 shadow-none dark:shadow-[var(--yellow-glow)]"
            >
              Developer Profile
            </Link>
            <ShareProfileBar username={displayHandle} variant="compact" />
          </div>
        </div>
      </div>

      {/* 2. TWO MAJOR DIVS LAYOUT: Challenges Explorer (Left) & Stats Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* MAJOR DIV 1 (Left 8 cols): All Challenges + Search & Filters */}
        <div className="lg:col-span-8 space-y-4">
          <div className="border-b border-[var(--gh-border-subtle)] pb-3">
            <h2 className="text-lg font-bold text-[var(--gh-text)] flex items-center space-x-2 font-sans">
              <BookMarked className="h-5 w-5 text-[var(--yellow-bright)]" />
              <span>Repository Debugging Challenges</span>
            </h2>
            {/* <p className="text-xs text-[var(--gh-text-muted)] font-mono mt-0.5">
              Launch an assigned repository in Codespaces, fix the bugs, and submit a PR for automated hidden test evaluation.
            </p> */}
          </div>

          {/* Interactive Challenge Explorer with Real Language & Framework Icons */}
          <ChallengeExplorer
            assignments={allAssignments}
            statusMap={statusMapObj}
          />
        </div>

        {/* MAJOR DIV 2 (Right 4 cols, sticky): Compact Stats Sidebar */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6">
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 sm:p-5 space-y-4 shadow-none dark:shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--gh-border-subtle)]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--gh-text)]">
                Assessment Metrics
              </span>
              <span className="rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2 py-0.5 text-[10px] font-mono text-[var(--amber-badge-text)] font-bold">
                Live Status
              </span>
            </div>

            {/* Compact Metric Cards Stack */}
            <div className="space-y-2.5 font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)]">
                <div className="flex items-center space-x-2.5">
                  <Layers className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <span className="text-xs text-[var(--gh-text-secondary)]">Total Challenges</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[var(--gh-text)]">{totalAssignments}</span>
                  <span className="text-[10px] text-[var(--gh-text-muted)] block">{availableCount} available</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/60">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                  <span className="text-xs text-[var(--amber-badge-text)] font-semibold">Completed</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[var(--yellow-bright)]">{completedCount}</span>
                  <span className="text-[10px] text-[#10B981] font-semibold block">100% verified</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)]">
                <div className="flex items-center space-x-2.5">
                  <Clock className="h-4 w-4 text-[var(--yellow-primary)]" />
                  <span className="text-xs text-[var(--gh-text-secondary)]">In Progress</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[var(--yellow-primary)]">{inProgressCount}</span>
                  <span className="text-[10px] text-[var(--gh-text-muted)] block">active workspaces</span>
                </div>
              </div>
            </div>

            {/* AI Credit Budget Progress Meter */}
            <div className="p-3.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-[var(--gh-text-muted)]">
                <span className="flex items-center space-x-1.5 font-bold text-[var(--gh-text)]">
                  <Bot className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                  <span>Daily AI Queries</span>
                </span>
                <span className="text-[var(--yellow-bright)] font-bold">
                  {remainingRequests} / {dailyRequestLimit}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--gh-bg-tertiary)] overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (remainingRequests / dailyRequestLimit) * 100)}%` }}
                  className="h-full bg-[var(--yellow-bright)] rounded-full transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[var(--gh-text-muted)] pt-1">
                <span>Daily Token Limit</span>
                <span className="font-bold text-[var(--gh-text)]">{remainingTokens.toLocaleString()} tokens</span>
              </div>
            </div>

            {/* Quick Profile Link */}
            <div className="pt-2">
              <Link
                href="/profile"
                className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] hover:border-[var(--yellow-primary)]/60 text-xs font-mono transition text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]"
              >
                <span>View Full Developer Profile</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Pull Requests & Evaluations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--gh-border-subtle)] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--gh-text)] flex items-center space-x-2 font-sans">
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
            <p className="text-sm font-semibold text-[var(--gh-text)]">No Submissions Recorded Yet</p>
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
                        className={`mt-1 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${isPassed
                            ? 'bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--yellow-bright)]'
                            : 'bg-[var(--gh-bg-tertiary)] border border-[var(--gh-border)] text-[var(--yellow-primary)]'
                          }`}
                      >
                        {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-[var(--gh-text)] text-sm">
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
                        className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2 text-[var(--gh-text-muted)] hover:text-[var(--yellow-bright)] transition"
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
