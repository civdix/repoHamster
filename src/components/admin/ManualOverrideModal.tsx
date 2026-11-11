'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ManualOverrideModalProps {
  evaluationId: string;
  candidateName: string;
  assignmentTitle: string;
  currentScore: number;
  currentPassed: boolean;
}

export function ManualOverrideModal({
  evaluationId,
  candidateName,
  assignmentTitle,
  currentScore,
  currentPassed,
}: ManualOverrideModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [markAsPassed, setMarkAsPassed] = useState(!currentPassed);
  const [newScore, setNewScore] = useState(currentScore.toString());
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide an administrative audit reason for this override.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluationId,
          isPassed: markAsPassed,
          scorePercent: parseFloat(newScore) || 100,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(data.error || 'Failed to apply manual override.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error applying override.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-1 text-[11px] font-medium text-[var(--amber-badge-text)] hover:bg-[var(--yellow-primary)]/20 transition"
      >
        Override
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-[var(--yellow-bright)]" />
                <h3 className="font-bold text-white text-base">Manual Evaluation Override</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[var(--gh-text-muted)] hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleOverride} className="mt-4 space-y-4">
              <div className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-xs text-[var(--gh-text-secondary)] space-y-1">
                <p>
                  <span className="text-[var(--gh-text-muted)]">Candidate:</span> <strong className="text-white">{candidateName}</strong>
                </p>
                <p>
                  <span className="text-[var(--gh-text-muted)]">Challenge:</span> <strong className="text-white">{assignmentTitle}</strong>
                </p>
                <p>
                  <span className="text-[var(--gh-text-muted)]">Current Status:</span>{' '}
                  <span className={currentPassed ? 'text-[var(--yellow-bright)] font-semibold' : 'text-[var(--gh-text-secondary)] font-semibold'}>
                    {currentPassed ? 'PASSED' : 'FAILED'} ({currentScore}%)
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1.5">
                  Override Decision
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMarkAsPassed(true);
                      setNewScore('100');
                    }}
                    className={`flex items-center justify-center space-x-1.5 rounded-lg border py-2 text-xs font-semibold transition ${
                      markAsPassed
                        ? 'border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold'
                        : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-muted)] hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark as PASSED</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMarkAsPassed(false);
                      setNewScore('50');
                    }}
                    className={`flex items-center justify-center space-x-1.5 rounded-lg border py-2 text-xs font-semibold transition ${
                      !markAsPassed
                        ? 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-white font-bold'
                        : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-muted)] hover:text-white'
                    }`}
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Mark as FAILED</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                  Adjusted Score Percentage (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-mono text-white focus:border-[var(--yellow-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                  Administrative Audit Reason (Required)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Solution uses alternative valid locking mechanism that timed out under synthetic test runner; code manually reviewed and verified."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2.5 text-xs text-white placeholder-[var(--gh-text-muted)] focus:border-[var(--yellow-primary)] focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] p-2.5 text-xs text-[var(--amber-badge-text)] flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[var(--yellow-bright)]" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 border-t border-[var(--gh-border)] pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-1.5 text-xs font-medium text-[var(--gh-text-secondary)] hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-1.5 rounded-lg bg-[var(--yellow-primary)] px-4 py-1.5 text-xs font-bold text-black hover:bg-[var(--yellow-bright)] transition disabled:opacity-50 shadow-[var(--yellow-glow)]"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Apply Override</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
