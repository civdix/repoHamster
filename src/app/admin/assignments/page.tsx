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
import { AssignmentAdminList } from '@/components/admin/AssignmentAdminList';
import { SyncReposButton } from '@/components/admin/SyncReposButton';
import { getTestCaseSummary } from '@/lib/test-case-utils';

export const dynamic = 'force-dynamic';

export default async function AdminAssignmentsPage() {
  let assignments: any[] = [];
  let catalogRepositories: any[] = [];

  try {
    const [fetchedAssignments, fetchedCatalog] = await Promise.all([
      prisma.assignment.findMany({
        include: {
          candidateAssignments: true,
          pullRequests: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.catalogRepository.findMany({
        select: {
          id: true,
          name: true,
          repoName: true,
          owner: true,
          originalUrl: true,
          language: true,
          framework: true,
          difficulty: true,
          description: true,
          defaultBranch: true,
          importStatus: true,
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    assignments = fetchedAssignments;
    catalogRepositories = fetchedCatalog;
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
          <h2 className="text-base font-bold text-[var(--gh-text)] flex items-center space-x-2">
            <span>Debugging Assessment Repositories</span>
            <span className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--gh-text-secondary)]">
              {assignments.length} Total
            </span>
          </h2>
          <p className="text-xs text-[var(--gh-text-secondary)] mt-0.5">
            Hide challenges, delete obsolete repos, edit instructions & AI token quotas, and audit test case counts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SyncReposButton />
          <AssignmentEditorModal isNew={true} catalogRepositories={catalogRepositories} />
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3.5">
          <span className="text-[11px] font-mono text-[var(--gh-text-muted)] block">Total Challenges</span>
          <span className="text-xl font-bold font-mono text-[var(--gh-text)] mt-1 block">{assignments.length}</span>
          <span className="text-[10px] text-[var(--gh-text-muted)] font-mono">Platform catalogue</span>
        </div>

        <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-3.5">
          <span className="text-[11px] font-mono text-[var(--yellow-bright)] flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] animate-pulse" />
            <span>Active (Visible)</span>
          </span>
          <span className="text-xl font-bold font-mono text-[var(--yellow-bright)] mt-1 block">{activeCount}</span>
          <span className="text-[10px] text-[var(--gh-text-muted)] font-mono">Live to candidates</span>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3.5">
          <span className="text-[11px] font-mono text-[var(--yellow-primary)] flex items-center space-x-1">
            <EyeOff className="h-3 w-3" />
            <span>Hidden (Drafts)</span>
          </span>
          <span className="text-xl font-bold font-mono text-[var(--yellow-primary)] mt-1 block">{hiddenCount}</span>
          <span className="text-[10px] text-[var(--gh-text-muted)] font-mono">Excluded from dashboard</span>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3.5">
          <span className="text-[11px] font-mono text-[var(--gh-text-muted)] block">Total Test Cases</span>
          <span className="text-xl font-bold font-mono text-[var(--gh-text)] mt-1 block">{totalTestsAcrossAll}</span>
          <span className="text-[10px] text-[var(--gh-text-muted)] font-mono">Across all test suites</span>
        </div>
      </div>

      {/* Main List of Assignments */}
      <AssignmentAdminList
        initialAssignments={assignments}
        catalogRepositories={catalogRepositories}
      />
    </div>
  );
}
