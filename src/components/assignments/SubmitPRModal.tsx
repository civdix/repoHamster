'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GitPullRequest,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  GitBranch,
  Sliders,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface SubmitPRModalProps {
  assignmentId: string;
  assignmentSlug: string;
  repoUrl: string;
  candidateGithubUsername?: string;
}

export function SubmitPRModal({
  assignmentId,
  assignmentSlug,
  repoUrl,
  candidateGithubUsername,
}: SubmitPRModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');

  // Auto-PR fields
  const [branchName, setBranchName] = useState('main');
  const [prTitle, setPrTitle] = useState('');
  const [autoPrLoading, setAutoPrLoading] = useState(false);
  const [autoPrStatus, setAutoPrStatus] = useState<string | null>(null);

  // Manual fields
  const [prNumber, setPrNumber] = useState('');
  const [commitSha, setCommitSha] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  // Outcome
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    prUrl?: string;
    evaluationId?: string;
    scorePercent?: number;
  } | null>(null);

  // 1-Click Auto Create PR & Run Evaluation
  const handleAutoCreatePRAndEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAutoPrLoading(true);
    setResult(null);
    setAutoPrStatus('Contacting GitHub to open Pull Request...');

    try {
      // 1. Open Pull Request on GitHub
      const prRes = await fetch('/api/candidate/pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          branch: branchName.trim() || 'main',
          title: prTitle.trim() || undefined,
        }),
      });

      const prData = await prRes.json();

      if (!prRes.ok || !prData.success) {
        setResult({
          success: false,
          message: prData.message || 'Failed to open Pull Request on GitHub.',
        });
        setAutoPrLoading(false);
        setAutoPrStatus(null);
        return;
      }

      setAutoPrStatus(`Pull Request #${prData.prNumber} ready! Running evaluation test suites...`);

      // 2. Trigger Evaluation Engine
      const evalRes = await fetch('/api/evaluations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          prNumber: prData.prNumber,
          commitSha: prData.headSha,
          commitMessage: `Candidate submission from branch ${branchName}`,
        }),
      });

      const evalData = await evalRes.json();

      if (evalRes.ok && evalData.success) {
        setResult({
          success: true,
          message: `Evaluation completed for PR #${prData.prNumber}! Final Score: ${evalData.evaluation.scorePercent}% (${evalData.evaluation.passedTests}/${evalData.evaluation.totalTests} tests passed).`,
          prUrl: prData.prUrl,
          evaluationId: evalData.evaluation.id,
          scorePercent: evalData.evaluation.scorePercent,
        });
        router.refresh();
      } else {
        setResult({
          success: false,
          message: `PR #${prData.prNumber} opened on GitHub, but evaluation returned: ${evalData.error || 'Failed to finish'}`,
          prUrl: prData.prUrl,
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Network error executing evaluation.',
      });
    } finally {
      setAutoPrLoading(false);
      setAutoPrStatus(null);
    }
  };

  // Manual Trigger
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/evaluations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          prNumber: prNumber ? parseInt(prNumber, 10) : undefined,
          commitSha: commitSha.trim() || undefined,
          commitMessage: commitMessage.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: `Evaluation completed! Final Score: ${data.evaluation.scorePercent}% (${data.evaluation.passedTests}/${data.evaluation.totalTests} tests passed).`,
          evaluationId: data.evaluation.id,
          scorePercent: data.evaluation.scorePercent,
        });
        router.refresh();
      } else {
        setResult({
          success: false,
          message: data.error || 'Evaluation failed to complete.',
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Network error executing evaluation.',
      });
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 rounded-lg border border-[#30363d] bg-[#21262d] hover:border-yellow-500/60 hover:text-white px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition active:scale-95 shadow-sm"
      >
        <GitPullRequest className="h-3.5 w-3.5 text-yellow-400" />
        <span>Submit PR</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#30363d] bg-[#0d1117] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#161b22] border border-yellow-500/50 p-1">
                  <HamsterMascot variant="normal" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Submit Assessment Solution</h3>
                  <p className="text-xs text-slate-400">Trigger isolated public and hidden test evaluation</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-[#21262d] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="mt-4 flex rounded-xl border border-card-border bg-[#07090e] p-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('auto')}
                className={`flex-1 flex items-center justify-center space-x-1.5 rounded-lg py-1.5 transition ${
                  activeTab === 'auto'
                    ? 'bg-brand-purple text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
                <span>1-Click Auto PR &amp; Test</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 flex items-center justify-center space-x-1.5 rounded-lg py-1.5 transition ${
                  activeTab === 'manual'
                    ? 'bg-card text-white font-bold border border-card-border shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="h-3.5 w-3.5 text-slate-400" />
                <span>Manual Runner</span>
              </button>
            </div>

            {/* Mode A: 1-Click Auto Open PR & Run Evaluation */}
            {activeTab === 'auto' && (
              <form onSubmit={handleAutoCreatePRAndEvaluate} className="mt-4 space-y-4">
                <div className="rounded-xl border border-brand-purple/40 bg-purple-950/20 p-3 text-xs text-purple-200/90 font-mono space-y-1">
                  <div className="flex items-center justify-between text-brand-lime font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Automatic Pull Request Engine</span>
                    </span>
                    {candidateGithubUsername && (
                      <span className="text-[10px] text-purple-300">@{candidateGithubUsername}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    RepoHamster will automatically open a Pull Request from your fork on GitHub to the upstream challenge repository and execute the full public and authoritative hidden test suite.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono flex items-center space-x-1">
                    <GitBranch className="h-3 w-3 text-brand-lime" />
                    <span>Your Fork Branch Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="main or fix/solution"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-brand-lime focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    Branch on your fork containing the bugfix (default: <code className="text-slate-400">main</code>)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                    PR Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. fix: resolve inventory race condition and rounding"
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-lime focus:outline-none"
                  />
                </div>

                {autoPrStatus && (
                  <div className="rounded-xl border border-purple-800/40 bg-purple-950/40 p-2.5 text-xs text-purple-300 font-mono animate-in fade-in flex items-center space-x-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-lime shrink-0" />
                    <span>{autoPrStatus}</span>
                  </div>
                )}

                {result && (
                  <div
                    className={`rounded-xl border p-3 text-xs flex flex-col space-y-1.5 ${
                      result.success
                        ? 'border-brand-lime/40 bg-lime-950/30 text-brand-lime'
                        : 'border-rose-800/50 bg-rose-950/30 text-rose-300'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {result.success ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-lime mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                      )}
                      <span>{result.message}</span>
                    </div>

                    {result.prUrl && (
                      <a
                        href={result.prUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 font-bold underline text-white hover:text-brand-lime text-xs pt-1"
                      >
                        <span>View Pull Request on GitHub</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end space-x-3 border-t border-card-border pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-card-border bg-card px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={autoPrLoading}
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:brightness-110 transition disabled:opacity-50 shadow-glow-purple active:scale-95"
                  >
                    {autoPrLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Processing Submission...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 text-brand-lime" />
                        <span>🚀 1-Click Open PR &amp; Evaluate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Mode B: Manual Evaluation Trigger */}
            {activeTab === 'manual' && (
              <form onSubmit={handleManualSubmit} className="mt-4 space-y-4">
                <div className="rounded-xl border border-brand-purple/40 bg-purple-950/20 p-3 text-xs text-purple-200/90 font-mono space-y-1">
                  <div className="flex items-center space-x-1.5 text-brand-lime font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Sandbox Evaluation Runner Active</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Directly execute the isolated test harness against a specific commit SHA or PR number.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                    Commit SHA (Leave blank to generate test run)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7c34b10b892a4f4e56cd81234..."
                    value={commitSha}
                    onChange={(e) => setCommitSha(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-brand-lime focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                      GitHub PR Number
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1"
                      value={prNumber}
                      onChange={(e) => setPrNumber(e.target.value)}
                      className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-brand-lime focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                      Commit Message
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. fix: resolve race condition"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-lime focus:outline-none"
                    />
                  </div>
                </div>

                {result && (
                  <div
                    className={`rounded-xl border p-3 text-xs flex items-start space-x-2 ${
                      result.success
                        ? 'border-brand-lime/40 bg-lime-950/30 text-brand-lime'
                        : 'border-rose-800/50 bg-rose-950/30 text-rose-300'
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-lime mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    )}
                    <span>{result.message}</span>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end space-x-3 border-t border-card-border pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-card-border bg-card px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={manualLoading}
                    className="flex items-center space-x-2 rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition disabled:opacity-50 shadow-glow-lime active:scale-95"
                  >
                    {manualLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Executing Test Runner...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Run Evaluation Engine</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
