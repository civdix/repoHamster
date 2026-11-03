'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GitPullRequest, Send, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';

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
        className="flex items-center space-x-2 rounded-xl border border-card-border bg-card px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition"
      >
        <GitPullRequest className="h-4 w-4 text-purple-400" />
        <span>Submit PR or Trigger Test Evaluation</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-card-border bg-[#0d1424] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
                  <GitPullRequest className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Evaluate Pull Request / Solution</h3>
                  <p className="text-xs text-slate-400">Run isolated public and hidden test suites</p>
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
              <div className="rounded-lg border border-card-border bg-[#090d16] p-3 text-xs text-slate-400">
                <p>
                  <strong className="text-slate-200">Automatic Webhook Sync:</strong> When you open a PR on GitHub, our webhook processes it automatically. You can also trigger verification manually below using your commit SHA or PR number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Commit SHA (Leave blank to generate simulated evaluation)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7c34b10b892a4f4e56cd81234..."
                  value={commitSha}
                  onChange={(e) => setCommitSha(e.target.value)}
                  className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    GitHub PR Number
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={prNumber}
                    onChange={(e) => setPrNumber(e.target.value)}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Commit Message
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. fix: resolve race condition"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-accent-cyan focus:outline-none"
                  />
                </div>
              </div>

              {result && (
                <div
                  className={`rounded-xl border p-3 text-xs flex items-start space-x-2 ${
                    result.success
                      ? 'border-emerald-800/50 bg-emerald-950/30 text-emerald-300'
                      : 'border-rose-800/50 bg-rose-950/30 text-rose-300'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
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
                  className="rounded-lg border border-card-border bg-card px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 rounded-lg bg-accent-cyan px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition disabled:opacity-50"
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
