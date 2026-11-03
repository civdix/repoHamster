import prisma from '@/lib/db';
import {
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import { CatalogueRepositoryList } from '@/components/admin/CatalogueRepositoryList';

export const dynamic = 'force-dynamic';

export default async function AdminCataloguePage() {
  const repositories = await prisma.catalogRepository.findMany({
    include: {
      assignments: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const readyCount = repositories.filter((r) => r.importStatus === 'READY_FOR_TESTING').length;
  const mitCount = repositories.filter((r) => r.isCommercialAllowed).length;
  const clonedCount = repositories.filter((r) => !!r.localPath).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FolderGit2 className="h-4 w-4 text-brand-lime" />
            <span>Public Repository Catalogue</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            10 inspected open-source debugging repositories serving as initial candidate evaluation sources before official organization deployment.
          </p>
        </div>
      </div>

      {/* Info Callout */}
      <div className="rounded-xl border border-brand-purple/40 bg-purple-950/20 p-4 text-xs font-mono text-purple-200/90 flex items-start space-x-3">
        <Info className="h-4 w-4 text-brand-purple-light shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">Temporary Development & Assessment Integration Phase</p>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Repositories below were inspected across codebases, defects, test harnesses, and commercial licenses. Repositories marked{' '}
            <span className="text-brand-lime font-bold">READY_FOR_TESTING</span> can be cloned into isolated local workspaces and published as active candidate assessment challenges.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Catalogue Repos</span>
            <FolderGit2 className="h-4 w-4 text-brand-purple" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{repositories.length}</div>
          <div className="text-[10px] text-slate-500 font-mono">10 Multi-Stack Sources</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Ready for Testing</span>
            <CheckCircle2 className="h-4 w-4 text-brand-lime" />
          </div>
          <div className="text-2xl font-bold font-mono text-brand-lime">{readyCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">Verified Automated Harness</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Commercial MIT</span>
            <Scale className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{mitCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">{repositories.length - mitCount} Need Adaptation</div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase">Cloned Locally</span>
            <Sparkles className="h-4 w-4 text-brand-purple-light" />
          </div>
          <div className="text-2xl font-bold font-mono text-brand-purple-light">{clonedCount}</div>
          <div className="text-[10px] text-slate-500 font-mono">In catalogue-sources/</div>
        </div>
      </div>

      {/* Main Repositories List with Client Search & Filters */}
      <CatalogueRepositoryList initialRepositories={repositories} />
    </div>
  );
}
