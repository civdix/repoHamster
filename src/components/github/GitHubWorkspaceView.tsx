'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Terminal,
  FileCode,
  CheckCircle2,
  GitPullRequest,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { GitHubWorkspaceHeader, WorkspaceTab } from './GitHubWorkspaceHeader';
import { CodespacesLaunchModal } from '@/components/assignments/CodespacesLaunchModal';
import { SubmitPRModal } from '@/components/assignments/SubmitPRModal';
import { AIChatDrawer } from '@/components/ai/AIChatDrawer';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface GitHubWorkspaceViewProps {
  assignment: {
    id: string;
    slug: string;
    title: string;
    description: string;
    instructions: string;
    repoUrl: string;
    baseBranch: string;
    language: string;
    framework?: string;
    difficulty: string;
    estimatedTimeMinutes: number;
    publicTestInfo?: string;
    testCaseCount?: number;
    hiddenTestCaseCount?: number;
  };
  candidateAssignment: any;
  latestSubmission: any;
  latestEvaluation: any;
  publicTestResults: any[];
  hiddenPassCount: number;
  hiddenTotalCount: number;
  testSummary: {
    hasTestCases: boolean;
    displayText: string;
  };
  remainingRequests: number;
  remainingTokens: number;
  candidateGithubUsername?: string;
}

export function GitHubWorkspaceView({
  assignment,
  candidateAssignment,
  latestSubmission,
  latestEvaluation,
  publicTestResults,
  hiddenPassCount,
  hiddenTotalCount,
  testSummary,
  remainingRequests,
  remainingTokens,
  candidateGithubUsername,
}: GitHubWorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('code');
  const isCompleted = candidateAssignment?.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-[var(--gh-bg)] text-[var(--gh-text)]">
      {/* 1. Top GitHub Repo Header with Breadcrumb, Star, Submit PR & <> Code Buttons */}
      <GitHubWorkspaceHeader
        assignment={assignment}
        isCompleted={isCompleted}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        candidateGithubUsername={candidateGithubUsername}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--gh-border-subtle)] pb-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 text-xs font-mono text-[var(--gh-text-muted)] hover:text-[var(--yellow-bright)] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Candidate Dashboard</span>
          </Link>

          <div className="flex items-center space-x-3">
            {/* AI Chat Drawer Button */}
            <AIChatDrawer
              assignmentId={assignment.id}
              assignmentTitle={assignment.title}
              initialRemainingRequests={remainingRequests}
              initialRemainingTokens={remainingTokens}
            />
          </div>
        </div>

        {/* TAB 1: CODE & PROBLEM */}
        {activeTab === 'code' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Repository Info Banner */}
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] border border-[var(--amber-badge-border)]">
                  <FileCode className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="text-base font-bold text-white font-mono">
                    {assignment.title}
                  </h1>
                  <p className="text-xs text-[var(--gh-text-muted)] font-mono mt-0.5">
                    {assignment.language} • {assignment.framework || 'Standard'} • ~{assignment.estimatedTimeMinutes} min
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="rounded-md bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2.5 py-1 text-[var(--yellow-bright)]">
                  branch: {assignment.baseBranch}
                </span>
                <span className="rounded-md bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2.5 py-1 text-[var(--amber-badge-text)] font-bold uppercase">
                  {assignment.difficulty}
                </span>
              </div>
            </div>

            {/* GitHub README Box Layout */}
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] overflow-hidden shadow-sm">
              <div className="border-b border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-200">
                  <BookOpen className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <span>README.md</span>
                </div>
                <span className="text-[11px] font-mono text-[var(--gh-text-muted)]">
                  Problem Specification &amp; Acceptance Criteria
                </span>
              </div>

              <div className="p-6 text-slate-300 leading-relaxed font-sans prose prose-invert max-w-none">
                <MarkdownRenderer content={assignment.instructions || assignment.description} />
              </div>
            </div>

            {/* Public Test Information */}
            {assignment.publicTestInfo && (
              <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-5 space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--yellow-bright)] flex items-center space-x-2">
                  <Terminal className="h-4 w-4" />
                  <span>Public Test Cases (Included in Repository)</span>
                </h3>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {assignment.publicTestInfo}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TESTS & EVALUATION */}
        {activeTab === 'tests' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--gh-border-subtle)] pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--yellow-bright)]" />
                    <span>Automated Evaluation Harness</span>
                  </h3>
                  <p className="text-xs text-[var(--gh-text-muted)] font-mono mt-1">
                    {latestSubmission ? `Latest Commit: ${latestSubmission.commitSha.slice(0, 7)}` : 'No test evaluations triggered yet'}
                  </p>
                </div>

                {latestEvaluation && (
                  <div
                    className={`rounded-xl px-4 py-1.5 font-mono text-lg font-bold ${
                      latestEvaluation.isPassed
                        ? 'bg-[var(--amber-badge-bg)] border border-[var(--yellow-bright)] text-[var(--yellow-bright)] shadow-[var(--yellow-glow)]'
                        : 'bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--yellow-primary)]'
                    }`}
                  >
                    {latestEvaluation.scorePercent}%
                  </div>
                )}
              </div>

              {latestEvaluation ? (
                <div className="space-y-6">
                  {/* Summary Metric Cards (Yellow + Dark) */}
                  <div className="grid grid-cols-3 gap-3 font-mono">
                    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 text-center">
                      <p className="text-[11px] text-[var(--gh-text-muted)] uppercase">Total Tests</p>
                      <p className="text-2xl font-bold text-white mt-1">{latestEvaluation.totalTests}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] p-4 text-center">
                      <p className="text-[11px] text-[var(--amber-badge-text)] uppercase">Passed</p>
                      <p className="text-2xl font-bold text-[var(--yellow-bright)] mt-1">{latestEvaluation.passedTests}</p>
                    </div>
                    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 text-center">
                      <p className="text-[11px] text-[var(--gh-text-muted)] uppercase">Failed</p>
                      <p className="text-2xl font-bold text-[var(--yellow-primary)] mt-1">{latestEvaluation.failedTests}</p>
                    </div>
                  </div>

                  {/* Mascot Alert based on Pass/Fail */}
                  {latestEvaluation.isPassed ? (
                    <div className="rounded-xl border border-[var(--yellow-primary)]/50 bg-[var(--amber-badge-bg)]/70 p-4 flex items-center space-x-4">
                      <HamsterMascot variant="normal" size={56} />
                      <div>
                        <h4 className="text-sm font-bold text-[var(--amber-badge-text)]">All Tests Passed! 🎉</h4>
                        <p className="text-xs text-slate-300 font-mono mt-0.5">
                          Both public testcases and isolated hidden harness assertions passed with flying colors.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/70 p-4 flex items-center space-x-4">
                      <HamsterMascot variant="angry" size={56} />
                      <div>
                        <h4 className="text-sm font-bold text-[var(--yellow-bright)]">Assertions Failed</h4>
                        <p className="text-xs text-slate-300 font-mono mt-0.5">
                          The hamster found failing assertions in your patch. Check the test logs below to debug!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Public Tests Status */}
                  {publicTestResults && publicTestResults.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--gh-text-muted)]">
                        Public Test Cases
                      </h4>
                      <div className="space-y-1.5 font-mono text-xs">
                        {publicTestResults.map((t: any) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3.5 py-2.5"
                          >
                            <div className="flex items-center space-x-2 truncate">
                              {t.status === 'PASSED' ? (
                                <CheckCircle2 className="h-4 w-4 text-[var(--yellow-bright)] shrink-0" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-[var(--yellow-primary)] shrink-0" />
                              )}
                              <span className="text-slate-200 truncate">{t.testName}</span>
                            </div>
                            <span className="text-[var(--gh-text-dim)] text-[11px] shrink-0">{t.executionTimeMs}ms</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hidden Test Suite Status */}
                  <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-1">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-300 font-semibold">Hidden Test Suite (Adversarial Edge Cases):</span>
                      <span className="text-[var(--yellow-bright)] font-bold">
                        {hiddenPassCount}/{hiddenTotalCount} Passed
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--gh-text-muted)] font-mono">
                      Hidden assertions verify race conditions, boundary conditions, and memory leaks securely.
                    </p>
                  </div>

                  {/* Runner Logs */}
                  {latestEvaluation.logs && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--gh-text-muted)]">
                        Test Runner Output
                      </h4>
                      <pre className="max-h-64 overflow-y-auto rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-code)] p-4 font-mono text-xs text-[var(--yellow-bright)] leading-snug whitespace-pre-wrap">
                        {latestEvaluation.logs}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/50 p-10 text-center space-y-4">
                  <HamsterMascot variant="mercy" size={72} className="mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">No Evaluation Triggered Yet</h4>
                    <p className="text-xs font-mono text-[var(--gh-text-muted)] max-w-md mx-auto mt-1">
                      Launch Codespaces via the <strong className="text-[var(--yellow-bright)]">&lt;&gt; Code</strong> button above, apply your fix, and submit a PR to initiate the runner.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <CodespacesLaunchModal
                      repoUrl={assignment.repoUrl}
                      assignmentTitle={assignment.title}
                      assignmentId={assignment.id}
                      candidateGithubUsername={candidateGithubUsername}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PULL REQUESTS */}
        {activeTab === 'pull-requests' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--gh-border-subtle)] pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <GitPullRequest className="h-5 w-5 text-[var(--yellow-bright)]" />
                    <span>Pull Request Submissions</span>
                  </h3>
                  <p className="text-xs text-[var(--gh-text-muted)] font-mono mt-1">
                    Every pull request triggers an automated evaluation against the isolated test runner.
                  </p>
                </div>

                <SubmitPRModal
                  assignmentId={assignment.id}
                  assignmentSlug={assignment.slug}
                  repoUrl={assignment.repoUrl}
                  candidateGithubUsername={candidateGithubUsername}
                />
              </div>

              {candidateAssignment?.submissions && candidateAssignment.submissions.length > 0 ? (
                <div className="divide-y divide-[var(--gh-border-subtle)] rounded-xl border border-[var(--gh-border)] overflow-hidden">
                  {candidateAssignment.submissions.map((sub: any) => (
                    <div key={sub.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--gh-bg-secondary)]/40 transition">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] shrink-0">
                          <GitPullRequest className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-white">
                              Commit: {sub.commitSha.slice(0, 7)}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase font-bold ${
                                sub.evaluation?.isPassed
                                  ? 'bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] border border-[var(--yellow-primary)]/60'
                                  : 'bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border border-[var(--amber-badge-border)]'
                              }`}
                            >
                              {sub.evaluation?.isPassed ? 'PASSED' : 'EVALUATED'}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--gh-text-muted)] font-mono truncate mt-0.5">
                            Submitted {new Date(sub.submittedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {sub.pullRequest?.prUrl && (
                        <a
                          href={sub.pullRequest.prUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-1.5 text-xs font-mono text-[var(--yellow-bright)] hover:text-white hover:border-[var(--yellow-primary)]/60 transition flex items-center space-x-1"
                        >
                          <span>View on GitHub</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/50 p-8 text-center space-y-2">
                  <HamsterMascot variant="normal" size={52} className="mx-auto" />
                  <p className="text-xs font-medium text-slate-200">No PRs submitted yet</p>
                  <p className="text-[11px] font-mono text-[var(--gh-text-muted)]">
                    Once you push your code to your GitHub fork or click &quot;Submit PR&quot;, your submission will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AI GUARDRAILS */}
        {activeTab === 'guardrails' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-[var(--yellow-bright)]" />
                <span>RepoHamster AI Guardrails &amp; Socratic Policy</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                To guarantee assessment integrity, all AI interactions are bounded to platform queries, repo access instructions, and testcase verification.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-[var(--yellow-bright)] uppercase">
                    Controlled Socratic Tutoring
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hamster AI points out architectural invariants, concurrency race patterns, and testing boundaries without leaking complete solution code.
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-[var(--yellow-bright)] uppercase">
                    Zero Full-Codebase Token Burn
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The platform never indexes or leaks private production files into open LLM training pipelines, keeping token costs minimal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
