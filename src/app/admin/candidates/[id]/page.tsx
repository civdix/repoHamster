import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/db';
import {
  ArrowLeft,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  GitPullRequest,
  ExternalLink,
  Terminal,
  Bot,
  Shield,
} from 'lucide-react';
import { ManualOverrideModal } from '@/components/admin/ManualOverrideModal';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default async function CandidateInspectorPage({ params }: Props) {
  const candidate = await prisma.user.findUnique({
    where: { id: params.id },
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
        include: { assignment: true },
        orderBy: { createdAt: 'desc' },
      },
      pullRequests: true,
    },
  });

  if (!candidate) {
    notFound();
  }

  const completedCount = candidate.assignments.filter((a) => a.status === 'COMPLETED').length;
  const totalTokens = candidate.aiUsages.reduce((sum, u) => sum + u.totalTokens, 0);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Admin Overview</span>
        </Link>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="rounded-2xl border border-card-border bg-[#0d1424] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={candidate.avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'}
              alt={candidate.name || 'Candidate'}
              className="h-16 w-16 rounded-full ring-2 ring-accent-cyan/40"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">{candidate.name || 'Candidate'}</h1>
                <span className="rounded-full border border-card-border bg-card px-2.5 py-0.5 text-xs font-mono text-slate-400">
                  @{candidate.githubUsername || 'candidate'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1">{candidate.email}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                Candidate ID: {candidate.id} • Registered {new Date(candidate.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="rounded-xl border border-card-border bg-card p-3 text-center min-w-[100px]">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Completed</p>
              <p className="text-xl font-bold text-emerald-400">{completedCount}</p>
            </div>
            <div className="rounded-xl border border-card-border bg-card p-3 text-center min-w-[100px]">
              <p className="text-[10px] text-slate-400 uppercase font-mono">AI Queries</p>
              <p className="text-xl font-bold text-purple-400">{candidate.aiUsages.length}</p>
            </div>
            <div className="rounded-xl border border-card-border bg-card p-3 text-center min-w-[100px]">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Total Tokens</p>
              <p className="text-xl font-bold text-white font-mono">{totalTokens.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Challenges & Submissions Breakdown */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white">Assigned Challenges & Evaluations</h2>

        {candidate.assignments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-card-border bg-card/40 p-6 text-center text-xs text-slate-400">
            No active assignment attempts recorded for this candidate yet.
          </div>
        ) : (
          <div className="space-y-4">
            {candidate.assignments.map((ca) => {
              const latestSub = ca.submissions[0];
              const latestEval = latestSub?.evaluation;
              const isPassed = ca.status === 'COMPLETED' || latestEval?.isPassed;

              return (
                <div
                  key={ca.id}
                  className="rounded-xl border border-card-border bg-card p-5 space-y-4"
                >
                  {/* Challenge Row Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border pb-3 gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white text-base">{ca.assignment.title}</h3>
                        <span className="rounded-full border border-card-border bg-[#090d16] px-2 py-0.5 text-[10px] font-mono text-slate-400">
                          {ca.assignment.language} • {ca.assignment.framework}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{ca.assignment.description}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {isPassed ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-800/40 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-amber-800/40 bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          IN PROGRESS
                        </span>
                      )}

                      {latestEval && (
                        <ManualOverrideModal
                          evaluationId={latestEval.id}
                          candidateName={candidate.name || 'Candidate'}
                          assignmentTitle={ca.assignment.title}
                          currentScore={latestEval.scorePercent}
                          currentPassed={latestEval.isPassed}
                        />
                      )}
                    </div>
                  </div>

                  {/* Latest Evaluation & Test Cases Details */}
                  {latestEval ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">
                          Commit: <code className="text-white">{latestSub.commitSha.slice(0, 7)}</code>
                          {latestSub.pullRequest && (
                            <a
                              href={latestSub.pullRequest.prUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-2 text-accent-cyan hover:underline inline-flex items-center"
                            >
                              PR #{latestSub.pullRequest.prNumber}
                              <ExternalLink className="ml-1 h-2.5 w-2.5" />
                            </a>
                          )}
                        </span>
                        <span className={isPassed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          Score: {latestEval.scorePercent}% ({latestEval.passedTests}/{latestEval.totalTests} tests)
                        </span>
                      </div>

                      {/* Test cases list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {latestEval.testResults.map((tr) => (
                          <div
                            key={tr.id}
                            className="flex items-center justify-between rounded-lg border border-card-border bg-[#090d16] px-3 py-2 text-xs"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              {tr.status === 'PASSED' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                              )}
                              <span className="font-mono text-slate-200 truncate">{tr.testName}</span>
                              <span className="text-[10px] font-mono text-slate-500 uppercase">
                                [{tr.testSuite}]
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              {tr.executionTimeMs}ms
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Runner Logs */}
                      {latestEval.logs && (
                        <div>
                          <pre className="max-h-36 overflow-y-auto rounded-lg border border-card-border bg-[#050811] p-3 font-mono text-[11px] text-slate-300 leading-snug whitespace-pre-wrap">
                            {latestEval.logs}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-mono">No submissions recorded yet for this challenge.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Candidate AI Usage History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">AI Assistance Interaction History</h2>
            <p className="text-xs text-slate-400">
              Audit log of all questions asked by this candidate to prevent collusion and monitor AI reliance.
            </p>
          </div>
          <span className="rounded-full border border-purple-800/40 bg-purple-950/40 px-2.5 py-0.5 text-xs font-mono text-purple-300">
            {candidate.aiUsages.length} Total Queries
          </span>
        </div>

        {candidate.aiUsages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-card-border bg-card/40 p-6 text-center text-xs text-slate-400">
            Candidate has not used the AI assistant yet.
          </div>
        ) : (
          <div className="rounded-xl border border-card-border bg-card overflow-hidden">
            <div className="divide-y divide-card-border">
              {candidate.aiUsages.map((usage) => (
                <div key={usage.id} className="p-4 space-y-2 hover:bg-slate-900/40 transition">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-400" />
                      <span className="font-semibold text-white">
                        {usage.assignment?.title || 'General Inquest'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                      <span>{usage.totalTokens} tokens</span>
                      <span>•</span>
                      <span>{new Date(usage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-[#090d16] p-2.5 rounded-lg border border-card-border">
                    <span className="text-slate-500 font-mono mr-1.5">Query:</span>
                    {usage.query}
                  </p>

                  {usage.responseSnippet && (
                    <p className="text-[11px] text-slate-400 italic pl-3 border-l-2 border-purple-800/60">
                      &quot;{usage.responseSnippet}...&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
