import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
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
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border pb-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-brand-purple/50">
            <HamsterMascot variant="avatar" size={30} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
              <span>RepoHamster Administration</span>
              <span className="rounded-full border border-purple-800/40 bg-purple-950/40 px-2.5 py-0.5 text-[10px] font-mono font-medium text-brand-purple-light">
                Staff Only
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage debugging repositories, inspect candidate PR submissions, review test runs, and configure AI quotas.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/api/admin/export?format=csv"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 rounded-xl border border-card-border bg-card px-3 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-brand-lime transition"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-brand-lime" />
            <span>Export CSV</span>
          </a>
          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 rounded-xl border border-card-border bg-card px-3 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Candidate View</span>
          </Link>
        </div>
      </div>

      {/* Admin Subnav */}
      <div className="flex items-center space-x-2 overflow-x-auto border-b border-card-border/60 pb-2">
        <Link
          href="/admin"
          className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-white hover:bg-card border border-card-border bg-card"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-brand-lime" />
          <span>Dashboard Overview</span>
        </Link>
        <Link
          href="/admin/catalogue"
          className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-card transition"
        >
          <FolderGit2 className="h-3.5 w-3.5 text-brand-lime" />
          <span>Repository Catalogue (10)</span>
        </Link>
        <Link
          href="/admin/assignments"
          className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-card transition"
        >
          <Layers className="h-3.5 w-3.5 text-brand-purple" />
          <span>Active Challenges</span>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-card transition"
        >
          <Settings className="h-3.5 w-3.5 text-slate-400" />
          <span>System & AI Settings</span>
        </Link>
      </div>

      {/* Main Content */}
      <div>{children}</div>
    </div>
  );
}
