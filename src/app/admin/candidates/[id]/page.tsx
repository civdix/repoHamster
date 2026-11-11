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
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default async function CandidateInspectorPage({ params }: Props) {
  let candidate: any = null;
  try {
    candidate = await prisma.user.findUnique({
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
  } catch (err) {
    console.error('[CANDIDATE INSPECTOR] Query error:', err);
  }

  if (!candidate) {
    notFound();
  }

  const completedCount = (candidate.assignments || []).filter((a: any) => a.status === 'COMPLETED').length;
  const totalTokens = (candidate.aiUsages || []).reduce((sum: number, u: any) => sum + (u.totalTokens || 0), 0);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[var(--gh-text-secondary)] hover:text-[var(--yellow-bright)] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Admin Overview</span>
        </Link>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={candidate.avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'}
              alt={candidate.name || 'Candidate'}
              className="h-16 w-16 rounded-2xl ring-2 ring-[var(--yellow-primary)]/40"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">{candidate.name || 'Candidate'}</h1>
                <span className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--gh-text-secondary)]">
                  @{candidate.githubUsername || 'candidate'}
                </span>
              </div>
              <p className="text-xs text-[var(--gh-text-secondary)] font-mono mt-1">{candidate.email}</p>
              <p className="text-[11px] text-[var(--gh-text-muted)] mt-0.5 font-mono">
                Candidate ID: {candidate.id} • Registered {new Date(candidate.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 font-mono">
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-center min-w-[100px]">
              <p className="text-[10px] text-[var(--gh-text-muted)] uppercase">Completed</p>
              <p className="text-xl font-bold text-[var(--yellow-bright)]">{completedCount}</p>
            </div>
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-center min-w-[100px]">
              <p className="text-[10px] text-[var(--gh-text-muted)] uppercase">AI Queries</p>
              <p className="text-xl font-bold text-[var(--yellow-primary)]">{candidate.aiUsages.length}</p>
            </div>
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-center min-w-[100px]">
              <p className="text-[10px] text-[var(--gh-text-muted)] uppercase">Total Tokens</p>
              <p className="text-xl font-bold text-white">{totalTokens.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Challenges & Submissions Breakdown */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white">Assigned Challenges & Evaluations</h2>

        {candidate.assignments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/40 p-8 text-center text-xs text-[var(--gh-text-muted)] space-y-2">
            <HamsterMascot variant="empty" size={80} className="mx-auto" />
            <p>No active assignment attempts recorded for this candidate yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(candidate.assignments || []).map((ca: any) => {
              const latestSub = ca.submissions?.[0];
              const latestEval = latestSub?.evaluation;
              const isPassed = ca.status === 'COMPLETED' || latestEval?.isPassed;

              return (
                <div
                  key={ca.id}
                  className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-4"
                >
                  {/* Challenge Row Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--gh-border)] pb-3 gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white text-base">{ca.assignment.title}</h3>
                        <span className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2 py-0.5 text-[10px] font-mono text-[var(--gh-text-secondary)]">
                          {ca.assignment.language} • {ca.assignment.framework}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--gh-text-secondary)] mt-0.5">{ca.assignment.description}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {isPassed ? (
                        <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-semibold text-[var(--amber-badge-text)]">
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 text-xs font-mono font-semibold text-[var(--gh-text-secondary)]">
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
                        <span className="text-[var(--gh-text-muted)]">
                          Commit: <code className="text-white">{latestSub.commitSha.slice(0, 7)}</code>
                          {latestSub.pullRequest && (
                            <a
                              href={latestSub.pullRequest.prUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-2 text-[var(--yellow-bright)] hover:underline inline-flex items-center"
                            >
                              PR #{latestSub.pullRequest.prNumber}
                              <ExternalLink className="ml-1 h-2.5 w-2.5" />
                            </a>
                          )}
                        </span>
                        <span className={isPassed ? 'text-[var(--yellow-bright)] font-bold' : 'text-[var(--yellow-primary)] font-bold'}>
                          Score: {latestEval.scorePercent}% ({latestEval.passedTests}/{latestEval.totalTests} tests)
                        </span>
                      </div>

                      {/* Test cases list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(latestEval.testResults || []).map((tr: any) => (
                          <div
                            key={tr.id}
                            className="flex items-center justify-between rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              {tr.status === 'PASSED' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--yellow-bright)] shrink-0" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-[var(--yellow-primary)] shrink-0" />
                              )}
                              <span className="font-mono text-[var(--gh-text)] truncate">{tr.testName}</span>
                              <span className="text-[10px] font-mono text-[var(--gh-text-muted)] uppercase">
                                [{tr.testSuite}]
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[var(--gh-text-muted)] shrink-0">
                              {tr.executionTimeMs}ms
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Runner Logs */}
                      {latestEval.logs && (
                        <div>
                          <pre className="max-h-36 overflow-y-auto rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 font-mono text-[11px] text-[var(--gh-text-secondary)] leading-snug whitespace-pre-wrap">
                            {latestEval.logs}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--gh-text-muted)] font-mono">No submissions recorded yet for this challenge.</p>
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
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Bot className="h-4 w-4 text-[var(--yellow-bright)]" />
              <span>AI Assistance Interaction History</span>
            </h2>
            <p className="text-xs text-[var(--gh-text-secondary)]">
              Audit log of all questions asked by this candidate to evaluate reasoning and verify AI reliance.
            </p>
          </div>
          <span className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--amber-badge-text)] font-semibold">
            {candidate.aiUsages.length} Total Queries
          </span>
        </div>

        {candidate.aiUsages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/40 p-6 text-center text-xs text-[var(--gh-text-muted)]">
            Candidate has not used the AI assistant yet.
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] overflow-hidden">
            <div className="divide-y divide-[var(--gh-border)]">
              {(candidate.aiUsages || []).map((usage: any) => (
                <div key={usage.id} className="p-4 space-y-2 hover:bg-[var(--gh-bg)]/60 transition">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-[var(--yellow-bright)]" />
                      <span className="font-semibold text-white">
                        {usage.assignment?.title || 'General Inquest'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] font-mono text-[var(--gh-text-muted)]">
                      <span>{usage.totalTokens} tokens</span>
                      <span>•</span>
                      <span>{new Date(usage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--gh-text-secondary)] bg-[var(--gh-bg)] p-2.5 rounded-lg border border-[var(--gh-border)] font-mono">
                    <span className="text-[var(--gh-text-muted)] mr-1.5">Query:</span>
                    {usage.query}
                  </p>

                  {usage.responseSnippet && (
                    <p className="text-[11px] text-[var(--gh-text-muted)] italic pl-3 border-l-2 border-[var(--yellow-primary)]/60">
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
