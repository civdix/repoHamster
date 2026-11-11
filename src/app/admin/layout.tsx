import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { isPlatformAdmin, isReviewer, canViewAdmin } from '@/lib/permissions';
import {
  LayoutDashboard,
  Users,
  Layers,
  Sparkles,
  Settings,
  Shield,
  FileSpreadsheet,
  ArrowLeft,
  FolderGit2,
  Eye,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canViewAdmin(session)) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  const isStaffAdmin = isPlatformAdmin(session);
  const isReviewerSession = isReviewer(session);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--gh-border)] pb-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gh-bg-secondary)] border border-[var(--yellow-primary)]/40 shadow-[var(--yellow-glow)]">
            <HamsterMascot variant="avatar" size={30} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--gh-text)] flex items-center space-x-2">
              <span>RepoHamster Administration</span>
              <span className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono font-medium text-[var(--amber-badge-text)]">
                {isReviewerSession ? 'Project Review (Read-Only)' : 'Staff Only (@repohamster)'}
              </span>
            </h1>
            <p className="text-xs text-[var(--gh-text-secondary)]">
              Manage debugging repositories, inspect candidate PR submissions, review test runs, and configure AI quotas.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/api/admin/export?format=csv"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-1.5 text-xs font-mono font-medium text-[var(--gh-text-secondary)] hover:text-[var(--yellow-bright)] hover:border-[var(--gh-border-active)] transition"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <span>Export CSV</span>
          </a>
          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-1.5 text-xs font-mono font-medium text-[var(--gh-text-secondary)] hover:text-white hover:border-[var(--gh-border-active)] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Candidate View</span>
          </Link>
        </div>
      </div>

      {/* Admin Subnav */}
      <div className="flex items-center space-x-2 overflow-x-auto border-b border-[var(--gh-border)]/60 pb-2">
        <Link
          href="/admin"
          className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-white border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] hover:border-[var(--gh-border-active)] transition"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
          <span>Dashboard Overview</span>
        </Link>
        <Link
          href="/admin/catalogue"
          className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-[var(--gh-text-secondary)] hover:text-white hover:bg-[var(--gh-bg-secondary)] border border-transparent hover:border-[var(--gh-border)] transition"
        >
          <FolderGit2 className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
          <span>Repository Catalogue (10)</span>
        </Link>
        <Link
          href="/admin/assignments"
          className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-[var(--gh-text-secondary)] hover:text-white hover:bg-[var(--gh-bg-secondary)] border border-transparent hover:border-[var(--gh-border)] transition"
        >
          <Layers className="h-3.5 w-3.5 text-[var(--yellow-primary)]" />
          <span>Active Challenges</span>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-[var(--gh-text-secondary)] hover:text-white hover:bg-[var(--gh-bg-secondary)] border border-transparent hover:border-[var(--gh-border)] transition"
        >
          <Settings className="h-3.5 w-3.5 text-[var(--gh-text-muted)]" />
          <span>System & AI Settings</span>
        </Link>
      </div>

      {/* Main Content */}
      {isReviewerSession && (
        <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-4 flex items-center justify-between text-xs font-mono text-[var(--amber-badge-text)]">
          <div className="flex items-center space-x-2.5">
            <Eye className="h-4 w-4 text-[var(--yellow-bright)] shrink-0" />
            <span>
              You are inspecting the staff administration console in <strong>Read-Only Review Mode</strong>. Modifying challenges, saving settings, and applying score overrides are disabled.
            </span>
          </div>
          <span className="rounded-full bg-[var(--yellow-primary)]/20 px-2.5 py-0.5 text-[10px] text-[var(--yellow-bright)] font-bold uppercase shrink-0">
            Inspection Mode
          </span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
