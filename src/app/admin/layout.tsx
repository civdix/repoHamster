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
} from 'lucide-react';

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
          <div className="h-9 w-9 rounded-lg bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
              <span>DebugLab Administration</span>
              <span className="rounded-full border border-purple-800/40 bg-purple-950/40 px-2.5 py-0.5 text-[10px] font-mono font-medium text-purple-300">
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
            className="flex items-center space-x-1.5 rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-accent-emerald" />
            <span>Export CSV</span>
          </a>
          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
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
          className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-900 border border-card-border bg-card"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-accent-cyan" />
          <span>Dashboard Overview</span>
        </Link>
        <Link
          href="/admin/assignments"
          className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition"
        >
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span>Manage Repositories ({5})</span>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition"
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
