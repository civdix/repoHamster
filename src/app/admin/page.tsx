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

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.toLowerCase() || '';

  // 1. Fetch Aggregated Metrics
  const totalCandidates = await prisma.user.count({ where: { role: 'CANDIDATE' } });
  const totalAssignments = await prisma.assignment.count();
  const completedAssignments = await prisma.candidateAssignment.count({ where: { status: 'COMPLETED' } });
  const failedEvaluations = await prisma.evaluation.count({ where: { isPassed: false } });
  const pendingEvaluations = await prisma.evaluation.count({ where: { status: 'RUNNING' } });

  // AI Usage
  const aiStats = await prisma.aIUsage.aggregate({
    _sum: { totalTokens: true },
    _count: { id: true },
  });
  const totalAiTokens = aiStats._sum.totalTokens || 0;
  const totalAiQueries = aiStats._count.id || 0;

  // 2. Fetch Candidates (with search filter)
  const candidates = await prisma.user.findMany({
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
  const recentSubmissions = await prisma.submission.findMany({
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

  return (
    <div className="space-y-8">
      {/* 5 High-Level Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Registered Candidates</span>
            <Users className="h-4 w-4 text-accent-cyan" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalCandidates}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">Persistent PostgreSQL</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Completed Challenges</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{completedAssignments}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">100% tests verified</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Failed Runs</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400">{failedEvaluations}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">Awaiting revision</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Active Repositories</span>
            <Layers className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalAssignments}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">Managed assignments</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>AI Token Consumption</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-300">
            {totalAiTokens.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            {totalAiQueries} queries tracked
          </div>
        </div>
      </div>

      {/* GitHub Integration Status Bar */}
      <div className="rounded-xl border border-card-border bg-[#0d1424] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Webhook className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">GitHub Webhook & Codespaces Engine Active</h4>
            <p className="text-[11px] text-slate-400 font-mono">
              Payload URL: <code className="text-accent-cyan">/api/webhooks/github</code> • HMAC SHA-256 Enabled
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="inline-flex items-center rounded-full bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 text-emerald-400">
            ● Ready for Incoming PRs
          </span>
        </div>
      </div>

      {/* Candidates Management Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Registered Candidates ({candidates.length})</h2>
            <p className="text-xs text-slate-400">
              Click a candidate to inspect their submitted PRs, commit SHAs, test results, and AI queries.
            </p>
          </div>

          <form method="GET" className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by name, email, or GitHub..."
              className="w-full rounded-lg border border-card-border bg-card pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-accent-cyan focus:outline-none"
            />
          </form>
        </div>

        <div className="rounded-xl border border-card-border bg-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-card-border bg-[#090d16] text-[11px] font-mono text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Verified Email</th>
                <th className="px-4 py-3 text-center">Completed</th>
                <th className="px-4 py-3 text-center">AI Queries</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {candidates.map((candidate) => {
                const completed = candidate.assignments.filter((a) => a.status === 'COMPLETED').length;
                const totalAssigned = candidate.assignments.length;
                const aiQueriesCount = candidate.aiUsages.length;

                return (
                  <tr key={candidate.id} className="hover:bg-slate-900/50 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={candidate.avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'}
                          alt={candidate.name || 'User'}
                          className="h-7 w-7 rounded-full ring-1 ring-card-border"
                        />
                        <div>
                          <p className="font-semibold text-white">{candidate.name || 'Candidate'}</p>
                          <p className="text-[11px] font-mono text-slate-400">@{candidate.githubUsername || 'candidate'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {candidate.email}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center rounded-full border border-card-border bg-[#090d16] px-2.5 py-0.5 font-mono font-medium text-emerald-400">
                        {completed} / {totalAssignments}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono text-slate-400">
                      {aiQueriesCount}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/candidates/${candidate.id}`}
                        className="inline-flex items-center space-x-1 rounded-lg border border-card-border bg-[#090d16] px-3 py-1.5 font-medium text-slate-200 hover:text-accent-cyan hover:border-accent-cyan/40 transition"
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
          <p className="text-xs text-slate-400">
            Real-time evaluation outcomes with administrative override controls.
          </p>
        </div>

        <div className="rounded-xl border border-card-border bg-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-card-border bg-[#090d16] text-[11px] font-mono text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3">Commit & PR</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Assignment</th>
                <th className="px-4 py-3 text-center">Score / Tests</th>
                <th className="px-4 py-3 text-center">Outcome</th>
                <th className="px-4 py-3 text-right">Admin Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {recentSubmissions.map((sub) => {
                const evalData = sub.evaluation;
                const isPassed = evalData?.isPassed;
                const candidate = sub.candidateAssignment.candidate;
                const assignment = sub.candidateAssignment.assignment;

                return (
                  <tr key={sub.id} className="hover:bg-slate-900/50 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-slate-200 font-semibold">{sub.commitSha.slice(0, 7)}</span>
                        {sub.pullRequest && (
                          <a
                            href={sub.pullRequest.prUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-[11px] font-mono text-accent-cyan hover:underline"
                          >
                            PR #{sub.pullRequest.prNumber}
                            <ExternalLink className="ml-1 h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                        {sub.commitMessage || 'Automated commit'}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-white">{candidate.name}</p>
                      <p className="text-[11px] font-mono text-slate-500">@{candidate.githubUsername}</p>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-300">
                      {assignment.title}
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono">
                      {evalData ? (
                        <span className={isPassed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                          {evalData.scorePercent}% ({evalData.passedTests}/{evalData.totalTests})
                        </span>
                      ) : (
                        <span className="text-amber-400">Running</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {evalData?.status === 'MANUAL_OVERRIDE' ? (
                        <span className="inline-flex items-center rounded-full border border-purple-800/40 bg-purple-950/40 px-2.5 py-0.5 text-[10px] font-mono text-purple-300">
                          OVERRIDDEN
                        </span>
                      ) : isPassed ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-800/40 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400">
                          PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-rose-800/40 bg-rose-950/40 px-2.5 py-0.5 text-[10px] font-mono text-rose-400">
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
