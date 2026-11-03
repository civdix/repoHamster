'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GitPullRequest, Send, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface SubmitPRModalProps {
  assignmentId: string;
  assignmentSlug: string;
  repoUrl: string;
}

export function SubmitPRModal({ assignmentId, assignmentSlug, repoUrl }: SubmitPRModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [prNumber, setPrNumber] = useState('');
  const [commitSha, setCommitSha] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; evaluationId?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 rounded-xl border border-card-border bg-card px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-brand-purple hover:bg-card-hover transition"
      >
        <GitPullRequest className="h-4 w-4 text-brand-purple" />
        <span>Submit PR or Trigger Test Evaluation</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-card-border bg-[#0d101a] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-brand-purple/50">
                  <HamsterMascot variant="detective" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Run Solution Evaluation</h3>
                  <p className="text-xs text-slate-400">Trigger isolated public and hidden test suites</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="rounded-xl border border-brand-purple/40 bg-purple-950/20 p-3 text-xs text-purple-200/90 font-mono space-y-1">
                <div className="flex items-center space-x-1.5 text-brand-lime font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sandbox Evaluation Runner Active</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  You can trigger an isolated test evaluation directly here. Our multi-language sandbox will execute the test harness and display verified public and hidden test results.
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
                  disabled={loading}
                  className="flex items-center space-x-2 rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition disabled:opacity-50 shadow-glow-lime"
                >
                  {loading ? (
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
          </div>
        </div>
      )}
    </>
  );
}
