'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit3, X, Loader2, Layers } from 'lucide-react';

interface AssignmentEditorModalProps {
  assignment?: any;
  isNew?: boolean;
}

export function AssignmentEditorModal({ assignment, isNew = false }: AssignmentEditorModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    publicTestInfo: assignment?.publicTestInfo || 'Public tests included in repository.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/assignments', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assignment?.id,
          ...formData,
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

  return (
    <>
      {isNew ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-1.5 rounded-lg bg-accent-cyan px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Repository</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg border border-card-border bg-[#090d16] p-1.5 text-slate-400 hover:text-white transition"
          title="Edit Assignment"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-card-border bg-[#0d1424] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-accent-cyan" />
                <h3 className="font-bold text-white text-base">
                  {isNew ? 'Connect New Debugging Repository' : 'Edit Assignment Configuration'}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-accent-cyan focus:outline-none"
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
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-mono text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/organization/repo-name"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-mono text-white focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Language</label>
                  <input
                    type="text"
                    required
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Framework</label>
                  <input
                    type="text"
                    required
                    value={formData.framework}
                    onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs text-white focus:border-accent-cyan focus:outline-none"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Time (mins)</label>
                  <input
                    type="number"
                    min="10"
                    value={formData.estimatedTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, estimatedTimeMinutes: parseInt(e.target.value, 10) || 45 })}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-mono text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passing Threshold (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.passingThresholdPercent}
                    onChange={(e) => setFormData({ ...formData, passingThresholdPercent: parseFloat(e.target.value) || 100 })}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-mono text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">AI Request Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.aiRequestLimit}
                    onChange={(e) => setFormData({ ...formData, aiRequestLimit: parseInt(e.target.value, 10) || 15 })}
                    className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-mono text-white focus:border-accent-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Brief Problem Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-card p-2 text-xs text-white focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Markdown Instructions
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full rounded-lg border border-card-border bg-card p-2 text-xs font-mono text-white focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-card-border bg-card text-accent-cyan"
                />
                <label htmlFor="isActive" className="text-xs text-slate-300">
                  Active & Available to Candidates
                </label>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-800/50 bg-rose-950/30 p-2.5 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 border-t border-card-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-1.5 rounded-lg bg-accent-cyan px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Save Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
