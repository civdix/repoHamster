'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit3, X, Loader2, Layers, Trash2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { getTestCaseSummary } from '@/lib/test-case-utils';

interface AssignmentEditorModalProps {
  assignment?: any;
  isNew?: boolean;
}

export function AssignmentEditorModal({ assignment, isNew = false }: AssignmentEditorModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialHiddenSpecStr = assignment?.hiddenTestSpec
    ? typeof assignment.hiddenTestSpec === 'string'
      ? assignment.hiddenTestSpec
      : JSON.stringify(assignment.hiddenTestSpec, null, 2)
    : JSON.stringify(
        {
          runnerCommand: 'npm run test:hidden',
          testCases: [
            {
              id: 'HIDDEN-TC-01',
              name: 'Core Edge-Case Invariance',
              description: 'Validates boundary and exception safety',
              points: 50,
            },
            {
              id: 'HIDDEN-TC-02',
              name: 'High Concurrency Invariant Check',
              description: 'Validates race-free execution under parallel load',
              points: 50,
            },
          ],
        },
        null,
        2
      );

  const [formData, setFormData] = useState({
    slug: assignment?.slug || '',
    title: assignment?.title || '',
    description: assignment?.description || '',
    repoUrl: assignment?.repoUrl || '',
    language: assignment?.language || 'TypeScript',
    framework: assignment?.framework || 'Next.js',
    difficulty: assignment?.difficulty || 'INTERMEDIATE',
    estimatedTimeMinutes: assignment?.estimatedTimeMinutes || 45,
    passingThresholdPercent: assignment?.passingThresholdPercent || 100,
    aiRequestLimit: assignment?.aiRequestLimit || 15,
    aiTokenLimit: assignment?.aiTokenLimit || 10000,
    isActive: assignment ? assignment.isActive : true,
    instructions: assignment?.instructions || '### Problem Description\n\nDetail the bug and instructions here.',
    publicTestInfo: assignment?.publicTestInfo || '2 Public Tests: Basic unit test and validation check.',
    hiddenTestSpecStr: initialHiddenSpecStr,
  });

  const testSummary = getTestCaseSummary({
    publicTestInfo: formData.publicTestInfo,
    hiddenTestSpec: formData.hiddenTestSpecStr,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let parsedHiddenSpec: any = null;
    try {
      parsedHiddenSpec = JSON.parse(formData.hiddenTestSpecStr);
    } catch {
      setError('Hidden Test Spec must be valid JSON.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/assignments', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assignment?.id,
          ...formData,
          hiddenTestSpec: parsedHiddenSpec,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(data.error || 'Failed to save assignment.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error saving assignment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!assignment?.id || !confirm(`Are you sure you want to delete "${formData.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/assignments?id=${assignment.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete assignment.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error deleting assignment.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {isNew ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-brand-lime px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Repository Challenge</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-card-border bg-[#0a0d14] p-2 text-slate-400 hover:text-white transition active:scale-95"
          title="Edit Assignment Information"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-card-border bg-[#0d101a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-brand-lime/40">
                  <Layers className="h-4 w-4 text-brand-lime" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {isNew ? 'Connect New Debugging Repository Challenge' : 'Edit Challenge Platform Information'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {formData.slug ? `@${formData.slug}` : 'New assessment configuration'}
                  </p>
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
              {/* Test Case Count Banner (Real-time calculation) */}
              <div className="rounded-xl border border-card-border bg-[#0a0d14] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                    Total Testcases Present
                  </span>
                  <div className="text-xs font-mono font-bold text-brand-lime flex items-center space-x-1.5 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{testSummary.displayText}</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  {testSummary.hasTestCases ? (
                    <span className="text-brand-lime bg-lime-950/40 border border-lime-800/40 px-2 py-0.5 rounded-full">
                      Harness Configured
                    </span>
                  ) : (
                    <span className="text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full">
                      Unspecified / 0 tests
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Challenge Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs font-mono text-white focus:border-brand-lime focus:outline-none"
                  />
                </div>
              </div>

              {/* Repo URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  GitHub Repository URL (supports root repos or monorepo `/tree/main/...` paths)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/repohamster/repo-name"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs font-mono text-white focus:border-brand-lime focus:outline-none"
                />
              </div>

              {/* Language, Framework, Difficulty */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Language</label>
                  <input
                    type="text"
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Framework</label>
                  <input
                    type="text"
                    required
                    value={formData.framework}
                    onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
              </div>

              {/* Time, Threshold, AI Limit, AI Token Limit */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Est. Time (mins)</label>
                  <input
                    type="number"
                    min="10"
                    value={formData.estimatedTimeMinutes}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedTimeMinutes: parseInt(e.target.value, 10) || 45 })
                    }
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Threshold (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.passingThresholdPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passingThresholdPercent: parseFloat(e.target.value) || 100,
                      })
                    }
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">AI Req Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.aiRequestLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, aiRequestLimit: parseInt(e.target.value, 10) || 15 })
                    }
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">AI Token Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.aiTokenLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, aiTokenLimit: parseInt(e.target.value, 10) || 10000 })
                    }
                    className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Brief Problem Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-card-border bg-card p-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                />
              </div>

              {/* Full Markdown Instructions */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Markdown Instructions
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full rounded-xl border border-card-border bg-card p-2 text-xs font-mono text-white focus:border-brand-lime focus:outline-none"
                />
              </div>

              {/* Public Test Info */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Public Test Information (visible to candidate in specs)
                </label>
                <input
                  type="text"
                  required
                  value={formData.publicTestInfo}
                  onChange={(e) => setFormData({ ...formData, publicTestInfo: e.target.value })}
                  className="w-full rounded-xl border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-brand-lime focus:outline-none"
                />
              </div>

              {/* Hidden Test Spec JSON */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hidden Test Specification (JSON format with runnerCommand & testCases array)
                </label>
                <textarea
                  rows={4}
                  value={formData.hiddenTestSpecStr}
                  onChange={(e) => setFormData({ ...formData, hiddenTestSpecStr: e.target.value })}
                  className="w-full rounded-xl border border-card-border bg-card p-2 text-xs font-mono text-white focus:border-brand-lime focus:outline-none"
                />
              </div>

              {/* Visibility / Hide Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-card-border bg-[#0a0d14] p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    {formData.isActive ? (
                      <Eye className="h-4 w-4 text-brand-lime" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="text-xs font-bold text-white">
                      {formData.isActive ? 'Active (Visible on Candidate Dashboard)' : 'Hidden (Staff Only)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {formData.isActive
                      ? 'Candidates can view, clone, and launch this challenge.'
                      : 'This challenge is hidden from candidates but remains editable by staff.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold font-mono transition active:scale-95 ${
                    formData.isActive
                      ? 'bg-amber-950/60 border border-amber-800/50 text-amber-300 hover:bg-amber-900/60'
                      : 'bg-lime-950/60 border border-brand-lime/50 text-brand-lime hover:bg-lime-900/60'
                  }`}
                >
                  {formData.isActive ? 'Hide Challenge' : 'Unhide Challenge'}
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-800/50 bg-rose-950/30 p-2.5 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-card-border pt-4">
                <div>
                  {!isNew && assignment?.id && (
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="flex items-center space-x-1.5 rounded-xl border border-rose-900/50 bg-rose-950/30 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-900/40 transition active:scale-95"
                    >
                      {deleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span>Delete Challenge</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-card-border bg-card px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-1.5 rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition disabled:opacity-50 shadow-glow-lime active:scale-95"
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Save Challenge</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
