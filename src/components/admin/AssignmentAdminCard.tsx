'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCode2,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AssignmentEditorModal } from './AssignmentEditorModal';
import { getTestCaseSummary } from '@/lib/test-case-utils';

interface AssignmentAdminCardProps {
  assignment: any;
}

export function AssignmentAdminCard({ assignment }: AssignmentAdminCardProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const testSummary = getTestCaseSummary(assignment);
  const completedCount = (assignment.candidateAssignments || []).filter(
    (ca: any) => ca.status === 'COMPLETED'
  ).length;
  const totalAttempts = (assignment.candidateAssignments || []).length;

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assignment.id,
          isActive: !assignment.isActive,
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/assignments?id=${assignment.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to delete assignment:', err);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className={`rounded-xl border p-5 space-y-4 transition ${
        assignment.isActive
          ? 'border-card-border bg-card'
          : 'border-amber-900/30 bg-[#0d0f17] opacity-85'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-card-border bg-[#0a0d14] px-2.5 py-0.5 text-[10px] font-mono text-slate-300">
              {assignment.language} • {assignment.framework}
            </span>
            <span className="rounded-full border border-amber-800/40 bg-amber-950/40 px-2.5 py-0.5 text-[10px] font-mono text-amber-400 font-semibold">
              {assignment.difficulty}
            </span>

            {/* Visibility Status Badge */}
            {assignment.isActive ? (
              <span className="inline-flex items-center rounded-full border border-lime-800/40 bg-lime-950/40 px-2.5 py-0.5 text-[10px] font-mono font-medium text-brand-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-lime mr-1.5 animate-pulse" />
                ACTIVE (VISIBLE TO CANDIDATES)
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-amber-800/50 bg-amber-950/40 px-2.5 py-0.5 text-[10px] font-mono font-medium text-amber-400">
                <EyeOff className="h-3 w-3 mr-1" />
                HIDDEN (CANDIDATES CANNOT SEE)
              </span>
            )}
          </div>

          <h3 className="font-bold text-white text-base flex items-center space-x-2">
            <span>{assignment.title}</span>
            <span className="text-xs font-mono font-normal text-slate-500">
              ({assignment.slug})
            </span>
          </h3>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            {assignment.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Hide / Unhide Toggle Button */}
          <button
            onClick={handleToggleActive}
            disabled={isToggling}
            title={assignment.isActive ? 'Hide challenge from candidates' : 'Make challenge active'}
            className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
              assignment.isActive
                ? 'border-card-border bg-[#0a0d14] text-slate-300 hover:text-amber-400 hover:border-amber-800/50'
                : 'border-lime-800/50 bg-lime-950/30 text-brand-lime hover:bg-lime-950/50'
            }`}
          >
            {isToggling ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : assignment.isActive ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Unhide</span>
              </>
            )}
          </button>

          {/* Edit Information Modal Button */}
          <AssignmentEditorModal assignment={assignment} />

          {/* GitHub Repo External Link */}
          <a
            href={assignment.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-card-border bg-[#0a0d14] p-2 text-slate-400 hover:text-white transition active:scale-95"
            title="Open GitHub Repository"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Delete Challenge Button */}
          {confirmDelete ? (
            <div className="flex items-center space-x-1 animate-in fade-in duration-150">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-1 rounded-xl bg-rose-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition active:scale-95"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span>Confirm Delete</span>}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-card-border bg-[#0a0d14] px-2 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-xl border border-card-border bg-[#0a0d14] p-2 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition active:scale-95"
              title="Remove Challenge"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Specs & Configuration Grid - Including Total Testcases Block */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 rounded-xl border border-card-border bg-[#0a0d14] p-3 text-xs font-mono">
        {/* Block 1: Total Test Cases Count Block */}
        <div className="sm:col-span-1 rounded-lg border border-card-border/80 bg-card/60 p-2.5">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Total Testcases Present
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span
              className={`text-sm font-bold ${
                testSummary.hasTestCases ? 'text-brand-lime font-mono' : 'text-amber-400/90'
              }`}
            >
              {testSummary.total}
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              {testSummary.hasTestCases ? 'tests configured' : 'unspecified'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate" title={testSummary.displayText}>
            {testSummary.hasTestCases
              ? `${testSummary.publicCount} Public + ${testSummary.hiddenCount} Hidden`
              : '0 (Unspecified / 0 tests provided)'}
          </p>
        </div>

        {/* Block 2: Repository Target */}
        <div className="rounded-lg border border-card-border/80 bg-card/60 p-2.5">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Repository Target
          </span>
          <a
            href={assignment.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-brand-lime hover:underline truncate block mt-1 font-semibold"
            title={assignment.repoUrl}
          >
            {assignment.repoUrl.replace('https://github.com/', '')}
          </a>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Branch: {assignment.baseBranch || 'main'}
          </span>
        </div>

        {/* Block 3: AI Quota */}
        <div className="rounded-lg border border-card-border/80 bg-card/60 p-2.5">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            AI Quota / Candidate
          </span>
          <div className="mt-1 text-purple-300 font-semibold truncate">
            {assignment.aiRequestLimit} req / {assignment.aiTokenLimit.toLocaleString()} tok
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            ~{assignment.estimatedTimeMinutes} min duration
          </span>
        </div>

        {/* Block 4: Passing Threshold */}
        <div className="rounded-lg border border-card-border/80 bg-card/60 p-2.5">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Passing Threshold
          </span>
          <div className="mt-1 text-brand-lime font-bold text-sm">
            {assignment.passingThresholdPercent}%
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Isolated Hidden Runner
          </span>
        </div>

        {/* Block 5: Completion Rate */}
        <div className="rounded-lg border border-card-border/80 bg-card/60 p-2.5 col-span-2 sm:col-span-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Candidate Submissions
          </span>
          <div className="mt-1 text-white font-semibold">
            {completedCount} / {totalAttempts} passed
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {totalAttempts > 0 ? Math.round((completedCount / totalAttempts) * 100) : 0}% success rate
          </span>
        </div>
      </div>
    </div>
  );
}
