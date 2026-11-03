import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { CodespacesLaunchModal } from '@/components/assignments/CodespacesLaunchModal';
import { SubmitPRModal } from '@/components/assignments/SubmitPRModal';
import { AIChatDrawer } from '@/components/ai/AIChatDrawer';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  Code,
  ShieldAlert,
  GitPullRequest,
  Check,
  Timer,
  ExternalLink,
  Lock,
  Layers,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default async function AssignmentDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/assignments/${params.slug}`);
  }

  const userEmail = session.user.email?.toLowerCase();

  // Find assignment by slug
  const assignment = await prisma.assignment.findUnique({
    where: { slug: params.slug },
  });

  if (!assignment) {
    notFound();
  }

  // Find or provision candidate assignment tracking
  let candidate = null;
  let candidateAssignment = null;
  let remainingRequests = 15;
  let remainingTokens = 10000;

  if (userEmail) {
    try {
      candidate = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          aiUsages: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      });

      if (candidate) {
        // Look up or auto-start candidate assignment
        candidateAssignment = await prisma.candidateAssignment.upsert({
          where: {
            candidateId_assignmentId: {
              candidateId: candidate.id,
              assignmentId: assignment.id,
            },
          },
          update: {},
          create: {
            candidateId: candidate.id,
            assignmentId: assignment.id,
            status: 'IN_PROGRESS',
          },
          include: {
            submissions: {
              include: {
                evaluation: {
                  include: {
                    testResults: true,
                  },
                },
                pullRequest: true,
              },
              orderBy: { submittedAt: 'desc' },
            },
          },
        });

        // AI Quota calculation
        const usedRequests = candidate.aiUsages?.length || 0;
        const usedTokens = candidate.aiUsages?.reduce((sum, u) => sum + u.totalTokens, 0) || 0;
        remainingRequests = Math.max(0, assignment.aiRequestLimit - usedRequests);
        remainingTokens = Math.max(0, assignment.aiTokenLimit - usedTokens);
      }
    } catch (err) {
      console.error('[ASSIGNMENT DETAIL] Query error:', err);
    }
  }

  const latestSubmission = candidateAssignment?.submissions?.[0];
  const latestEvaluation = latestSubmission?.evaluation;
  const isCompleted = candidateAssignment?.status === 'COMPLETED' || latestEvaluation?.isPassed;

  // Split test results into public vs hidden
  const publicTestResults = latestEvaluation?.testResults?.filter((t) => t.testSuite === 'PUBLIC') || [];
  const hiddenTestResults = latestEvaluation?.testResults?.filter((t) => t.testSuite === 'HIDDEN') || [];

  const hiddenPassCount = hiddenTestResults.filter((t) => t.status === 'PASSED').length;
  const hiddenTotalCount = hiddenTestResults.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-card-border pb-4">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Candidate Dashboard</span>
        </Link>

        <div className="flex items-center space-x-3">
          {isCompleted ? (
            <span className="flex items-center rounded-full border border-emerald-800/50 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Assignment Completed (100% Tests Passing)
            </span>
          ) : (
            <span className="flex items-center rounded-full border border-amber-800/50 bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-400">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              In Progress
            </span>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-card-border bg-[#0d1424] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono text-slate-300">
                {assignment.language} • {assignment.framework}
              </span>
              <span className="rounded-full border border-amber-800/40 bg-amber-950/40 px-2.5 py-0.5 text-[11px] font-mono text-amber-400 uppercase">
                {assignment.difficulty}
              </span>
              <span className="flex items-center text-xs font-mono text-slate-400">
                <Timer className="mr-1 h-3.5 w-3.5" />
                ~{assignment.estimatedTimeMinutes} min estimated
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {assignment.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {assignment.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <CodespacesLaunchModal
              repoUrl={assignment.repoUrl}
              assignmentTitle={assignment.title}
            />

            <SubmitPRModal
              assignmentId={assignment.id}
              assignmentSlug={assignment.slug}
              repoUrl={assignment.repoUrl}
            />

            <AIChatDrawer
              assignmentId={assignment.id}
              assignmentTitle={assignment.title}
              initialRemainingRequests={remainingRequests}
              initialRemainingTokens={remainingTokens}
            />
          </div>
        </div>
      </div>

      {/* Grid: Instructions & Test Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Instructions & Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Instructions Box */}
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-accent-cyan" />
              <span>Assignment Instructions & Acceptance Criteria</span>
            </h2>

            <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
              {assignment.instructions}
            </div>
          </div>

          {/* Public Tests Information */}
          <div className="rounded-xl border border-card-border bg-card p-6">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <Code className="h-4 w-4 text-emerald-400" />
              <span>Public Test Cases (Included in Repository)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {assignment.publicTestInfo}
            </p>
          </div>

          {/* Hidden Tests Assurance */}
          <div className="rounded-xl border border-card-border bg-[#0a0f1e] p-5">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-accent-indigo shrink-0 mt-0.5">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Authoritative Hidden Verification</h4>
                <p className="text-xs text-slate-400 mt-1">
                  In addition to public tests, our isolated runner injects secure hidden edge-case tests
                  (concurrency load, timezone offset spoofing, boundary validation).
                  Hidden assertions and source code are never exposed to prevent hardcoding workarounds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Latest Evaluation Results & Audit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-card-border bg-card p-6">
            <div className="flex items-center justify-between border-b border-card-border pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Latest Evaluation Result</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {latestSubmission ? `Commit: ${latestSubmission.commitSha.slice(0, 7)}` : 'No submissions yet'}
                </p>
              </div>

              {latestEvaluation && (
                <div
                  className={`rounded-lg px-3 py-1 font-mono text-sm font-bold ${
                    latestEvaluation.isPassed
                      ? 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-400'
                      : 'bg-rose-950/60 border border-rose-800/50 text-rose-400'
                  }`}
                >
                  {latestEvaluation.scorePercent}%
                </div>
              )}
            </div>

            {latestEvaluation ? (
              <div className="space-y-4">
                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-card-border bg-[#090d16] p-2.5">
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Total Tests</p>
                    <p className="text-lg font-bold text-white mt-0.5">{latestEvaluation.totalTests}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-2.5">
                    <p className="text-[10px] text-emerald-400 uppercase font-mono">Passed</p>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">{latestEvaluation.passedTests}</p>
                  </div>
                  <div className="rounded-lg border border-rose-900/30 bg-rose-950/20 p-2.5">
                    <p className="text-[10px] text-rose-400 uppercase font-mono">Failed</p>
                    <p className="text-lg font-bold text-rose-400 mt-0.5">{latestEvaluation.failedTests}</p>
                  </div>
                </div>

                {/* Public Tests Breakdown */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Public Tests Status
                  </h4>
                  <div className="space-y-1.5">
                    {publicTestResults.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-lg border border-card-border bg-[#090d16] px-3 py-2 text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {t.status === 'PASSED' ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                          )}
                          <span className="font-mono text-slate-200 truncate">{t.testName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {t.executionTimeMs}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hidden Tests Summary (Secure Masking) */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Hidden Test Suite
                  </h4>
                  <div className="rounded-lg border border-card-border bg-[#090d16] p-3 text-xs">
                    <div className="flex items-center justify-between font-mono mb-1">
                      <span className="text-slate-400">Security & Edge Cases:</span>
                      <span
                        className={
                          hiddenPassCount === hiddenTotalCount && hiddenTotalCount > 0
                            ? 'text-emerald-400 font-semibold'
                            : 'text-amber-400 font-semibold'
                        }
                      >
                        {hiddenPassCount}/{hiddenTotalCount} Passed
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Hidden test details are redacted. All hidden test criteria must pass for assignment completion.
                    </p>
                  </div>
                </div>

                {/* Masked Execution Logs */}
                {latestEvaluation.logs && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                      Test Runner Output
                    </h4>
                    <pre className="max-h-48 overflow-y-auto rounded-lg border border-card-border bg-[#050811] p-3 font-mono text-[11px] text-slate-300 leading-snug whitespace-pre-wrap">
                      {latestEvaluation.logs}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-card-border bg-[#090d16] p-8 text-center">
                <GitPullRequest className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                <p className="text-xs font-medium text-slate-300">No evaluations recorded yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Launch Codespaces, branch, fix the issues, and open a PR or click &quot;Submit PR&quot; above.
                </p>
              </div>
            )}
          </div>

          {/* Submission History Accordion / List */}
          {candidateAssignment?.submissions && candidateAssignment.submissions.length > 1 && (
            <div className="rounded-xl border border-card-border bg-card p-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">
                Previous Submissions ({candidateAssignment.submissions.length})
              </h4>
              <div className="space-y-2">
                {candidateAssignment.submissions.slice(1, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-card-border bg-[#090d16] p-2.5 text-xs font-mono"
                  >
                    <div>
                      <span className="text-slate-300">{sub.commitSha.slice(0, 7)}</span>
                      <span className="text-slate-500 ml-2 text-[10px]">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={
                        sub.evaluation?.isPassed ? 'text-emerald-400 font-semibold' : 'text-rose-400'
                      }
                    >
                      {sub.evaluation?.scorePercent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
