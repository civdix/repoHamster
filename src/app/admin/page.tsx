import Link from 'next/link';
import prisma from '@/lib/db';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  GitPullRequest,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Webhook,
} from 'lucide-react';
import { ManualOverrideModal } from '@/components/admin/ManualOverrideModal';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.toLowerCase() || '';

  let totalCandidates = 0;
  let totalAssignments = 0;
  let completedAssignments = 0;
  let failedEvaluations = 0;
  let pendingEvaluations = 0;
  let totalAiTokens = 0;
  let totalAiQueries = 0;
  let candidates: any[] = [];
  let recentSubmissions: any[] = [];
  let dbError: string | null = null;

  try {
    // 1. Fetch Aggregated Metrics
    totalCandidates = await prisma.user.count({ where: { role: 'CANDIDATE' } });
    totalAssignments = await prisma.assignment.count();
    completedAssignments = await prisma.candidateAssignment.count({ where: { status: 'COMPLETED' } });
    failedEvaluations = await prisma.evaluation.count({ where: { isPassed: false } });
    pendingEvaluations = await prisma.evaluation.count({ where: { status: 'RUNNING' } });

    // AI Usage
    const aiStats = await prisma.aIUsage.aggregate({
      _sum: { totalTokens: true },
      _count: { id: true },
    });
    totalAiTokens = aiStats._sum.totalTokens || 0;
    totalAiQueries = aiStats._count.id || 0;

    // 2. Fetch Candidates (with search filter)
    candidates = await prisma.user.findMany({
      where: {
        role: 'CANDIDATE',
        OR: query
          ? [
              { name: { contains: query } },
              { email: { contains: query } },
              { githubUsername: { contains: query } },
            ]
          : undefined,
      },
      include: {
        assignments: {
          include: { assignment: true },
        },
        aiUsages: true,
        pullRequests: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // 3. Fetch Recent Submissions & Evaluations
    recentSubmissions = await prisma.submission.findMany({
      include: {
        candidateAssignment: {
          include: {
            candidate: true,
            assignment: true,
          },
        },
        evaluation: true,
        pullRequest: true,
      },
      orderBy: { submittedAt: 'desc' },
      take: 8,
    });
  } catch (error: any) {
    console.error('[ADMIN OVERVIEW] Database query error:', error);
    dbError = error?.message || 'Database query failed';
  }

  return (
    <div className="space-y-8">
      {dbError && (
        <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-4 text-xs font-mono text-[var(--amber-badge-text)] flex items-start space-x-3">
          <AlertCircle className="h-4 w-4 text-[var(--yellow-bright)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">Database Synchronization Notice</p>
            <p className="text-[var(--amber-badge-text)]">{dbError}</p>
            <p className="text-[var(--gh-text-muted)] text-[11px]">Run <code>npm run db:push</code> and <code>npm run db:seed</code> on your server to sync tables.</p>
          </div>
        </div>
      )}
      {/* 5 High-Level Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--gh-text-secondary)]">
            <span>Registered Candidates</span>
            <Users className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--gh-text)] font-mono">{totalCandidates}</div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-mono">Persistent PostgreSQL</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--gh-text-secondary)]">
            <span>Completed Challenges</span>
            <CheckCircle2 className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--yellow-bright)] font-mono">{completedAssignments}</div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-mono">100% tests verified</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--gh-text-secondary)]">
            <span>Failed Runs</span>
            <AlertCircle className="h-4 w-4 text-[var(--yellow-primary)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--yellow-primary)] font-mono">{failedEvaluations}</div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-mono">Awaiting revision</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--gh-text-secondary)]">
            <span>Active Repositories</span>
            <Layers className="h-4 w-4 text-[var(--yellow-primary)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--gh-text)] font-mono">{totalAssignments}</div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-mono">Curated challenges</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--gh-text-secondary)]">
            <span>AI Credits Consumed</span>
            <Sparkles className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--yellow-bright)] font-mono">
            {totalAiTokens.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-mono">
            {totalAiQueries} queries tracked
          </div>
        </div>
      </div>

      {/* GitHub Integration Status Bar */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--yellow-primary)]/15 border border-[var(--yellow-primary)]/30 text-[var(--yellow-bright)] shrink-0">
            <Webhook className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">GitHub Webhook & Codespaces Engine Active</h4>
            <p className="text-[11px] text-[var(--gh-text-secondary)] font-mono">
              Payload URL: <code className="text-[var(--yellow-bright)] bg-[var(--yellow-primary)]/15 border border-[var(--yellow-primary)]/25 px-1 py-0.5 rounded font-mono">/api/webhooks/github</code> • HMAC SHA-256 Enabled
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="inline-flex items-center rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2.5 py-0.5 text-[var(--amber-badge-text)] font-semibold">
            ● Ready for Incoming PRs
          </span>
        </div>
      </div>

      {/* Candidates Management Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Registered Candidates ({candidates.length})</h2>
            <p className="text-xs text-[var(--gh-text-secondary)]">
              Click a candidate to inspect their submitted PRs, commit SHAs, test results, and AI queries.
            </p>
          </div>

          <form method="GET" className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--gh-text-muted)]" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by name, email, or GitHub..."
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] pl-9 pr-3 py-1.5 text-xs text-white placeholder-[var(--gh-text-muted)] focus:border-[var(--yellow-primary)] focus:outline-none"
            />
          </form>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--gh-border)] bg-[var(--gh-bg)] text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Verified Email</th>
                <th className="px-4 py-3 text-center">Completed</th>
                <th className="px-4 py-3 text-center">AI Queries</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gh-border)]">
              {candidates.map((candidate: any) => {
                const completed = (candidate.assignments || []).filter((a: any) => a.status === 'COMPLETED').length;
                const totalAssigned = (candidate.assignments || []).length;
                const aiQueriesCount = (candidate.aiUsages || []).length;

                return (
                  <tr key={candidate.id} className="hover:bg-[var(--gh-bg)]/60 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={candidate.avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'}
                          alt={candidate.name || 'User'}
                          className="h-7 w-7 rounded-full ring-1 ring-[var(--gh-border)]"
                        />
                        <div>
                          <p className="font-semibold text-white">{candidate.name || 'Candidate'}</p>
                          <p className="text-[11px] font-mono text-[var(--gh-text-muted)]">@{candidate.githubUsername || 'candidate'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[var(--gh-text-secondary)]">
                      {candidate.email}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 font-mono font-medium text-[var(--amber-badge-text)]">
                        {completed} / {totalAssignments}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono text-[var(--gh-text-muted)]">
                      {aiQueriesCount}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/candidates/${candidate.id}`}
                        className="inline-flex items-center space-x-1 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-1.5 font-mono text-[var(--gh-text-secondary)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/40 transition"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Submissions & Evaluations Audit Trail */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Submissions & Test Execution Stream</h2>
          <p className="text-xs text-[var(--gh-text-secondary)]">
            Real-time evaluation outcomes with administrative override controls.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--gh-border)] bg-[var(--gh-bg)] text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">
              <tr>
                <th className="px-4 py-3">Commit & PR</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Assignment</th>
                <th className="px-4 py-3 text-center">Score / Tests</th>
                <th className="px-4 py-3 text-center">Outcome</th>
                <th className="px-4 py-3 text-right">Admin Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gh-border)]">
              {recentSubmissions.map((sub: any) => {
                const evalData = sub.evaluation;
                const isPassed = evalData?.isPassed;
                const candidate = sub.candidateAssignment?.candidate || {};
                const assignment = sub.candidateAssignment?.assignment || {};

                return (
                  <tr key={sub.id} className="hover:bg-[var(--gh-bg)]/60 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[var(--gh-text)] font-semibold">{sub.commitSha.slice(0, 7)}</span>
                        {sub.pullRequest && (
                          <a
                            href={sub.pullRequest.prUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-[11px] font-mono text-[var(--yellow-bright)] hover:underline"
                          >
                            PR #{sub.pullRequest.prNumber}
                            <ExternalLink className="ml-1 h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--gh-text-muted)] mt-0.5 truncate max-w-xs">
                        {sub.commitMessage || 'Automated commit'}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-white">{candidate.name}</p>
                      <p className="text-[11px] font-mono text-[var(--gh-text-muted)]">@{candidate.githubUsername}</p>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-[var(--gh-text-secondary)]">
                      {assignment.title}
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono">
                      {evalData ? (
                        <span className={isPassed ? 'text-[var(--yellow-bright)] font-semibold' : 'text-[var(--yellow-primary)] font-semibold'}>
                          {evalData.scorePercent}% ({evalData.passedTests}/{evalData.totalTests})
                        </span>
                      ) : (
                        <span className="text-[var(--yellow-bright)]">Running</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {evalData?.status === 'MANUAL_OVERRIDE' ? (
                        <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--amber-badge-text)]">
                          OVERRIDDEN
                        </span>
                      ) : isPassed ? (
                        <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--amber-badge-text)] font-bold">
                          PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--gh-text-secondary)]">
                          FAILED
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {evalData && (
                        <ManualOverrideModal
                          evaluationId={evalData.id}
                          candidateName={candidate.name || 'Candidate'}
                          assignmentTitle={assignment.title}
                          currentScore={evalData.scorePercent}
                          currentPassed={evalData.isPassed}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
