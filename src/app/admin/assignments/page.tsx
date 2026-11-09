import Link from 'next/link';
import prisma from '@/lib/db';
import {
  Layers,
  Code2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bot,
  Timer,
  Clock,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { AssignmentEditorModal } from '@/components/admin/AssignmentEditorModal';
import { AssignmentAdminCard } from '@/components/admin/AssignmentAdminCard';
import { SyncReposButton } from '@/components/admin/SyncReposButton';
import { getTestCaseSummary } from '@/lib/test-case-utils';

export const dynamic = 'force-dynamic';

export default async function AdminAssignmentsPage() {
  let assignments: any[] = [];
  try {
    assignments = await prisma.assignment.findMany({
      include: {
        candidateAssignments: true,
        pullRequests: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (err) {
    console.error('[ADMIN ASSIGNMENTS] Query error:', err);
  }

  const activeCount = assignments.filter((a) => a.isActive).length;
  const hiddenCount = assignments.filter((a) => !a.isActive).length;

  const totalTestsAcrossAll = assignments.reduce((sum, a) => {
    const s = getTestCaseSummary(a);
    return sum + s.total;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Debugging Assessment Repositories</span>
            <span className="rounded-full border border-card-border bg-[#0a0d14] px-2.5 py-0.5 text-xs font-mono text-slate-300">
              {assignments.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hide challenges, delete obsolete repos, edit instructions & AI token quotas, and audit test case counts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SyncReposButton />
          <AssignmentEditorModal isNew={true} />
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-card-border bg-card p-3.5">
          <span className="text-[11px] font-mono text-slate-400 block">Total Challenges</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">{assignments.length}</span>
          <span className="text-[10px] text-slate-500 font-mono">Platform catalogue</span>
        </div>

        <div className="rounded-xl border border-lime-800/40 bg-lime-950/20 p-3.5">
          <span className="text-[11px] font-mono text-lime-400 flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-brand-lime animate-pulse" />
            <span>Active (Visible)</span>
          </span>
          <span className="text-xl font-bold font-mono text-brand-lime mt-1 block">{activeCount}</span>
          <span className="text-[10px] text-slate-400 font-mono">Live to candidates</span>
        </div>

        <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-3.5">
          <span className="text-[11px] font-mono text-amber-400 flex items-center space-x-1">
            <EyeOff className="h-3 w-3" />
            <span>Hidden (Drafts)</span>
          </span>
          <span className="text-xl font-bold font-mono text-amber-300 mt-1 block">{hiddenCount}</span>
          <span className="text-[10px] text-slate-400 font-mono">Excluded from dashboard</span>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-3.5">
          <span className="text-[11px] font-mono text-slate-400 block">Total Test Cases</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">{totalTestsAcrossAll}</span>
          <span className="text-[10px] text-slate-500 font-mono">Across all test suites</span>
        </div>
      </div>

      {/* Challenge Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {assignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-card-border p-12 text-center text-slate-400">
            No debugging assignments found. Click &ldquo;Add New Repository Challenge&rdquo; or run a repository sync.
          </div>
        ) : (
          assignments.map((assignment: any) => (
            <AssignmentAdminCard key={assignment.id} assignment={assignment} />
          ))
        )}
      </div>
    </div>
  );
}
