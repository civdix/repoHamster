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
  let repositories: any[] = [];
  try {
    repositories = await prisma.catalogRepository.findMany({
      include: {
        assignments: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (err) {
    console.error('[ADMIN CATALOGUE] Query error:', err);
  }

  const readyCount = repositories.filter((r: any) => r.importStatus === 'READY_FOR_TESTING').length;
  const mitCount = repositories.filter((r: any) => r.isCommercialAllowed).length;
  const clonedCount = repositories.filter((r: any) => !!r.localPath).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FolderGit2 className="h-4 w-4 text-[var(--yellow-bright)]" />
            <span>Public Repository Catalogue</span>
          </h2>
          <p className="text-xs text-[var(--gh-text-secondary)] mt-0.5">
            10 inspected open-source debugging repositories serving as initial candidate evaluation sources before official organization deployment.
          </p>
        </div>
      </div>

      {/* Info Callout */}
      <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-4 text-xs font-mono text-[var(--amber-badge-text)] flex items-start space-x-3">
        <Info className="h-4 w-4 text-[var(--yellow-bright)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">Temporary Development & Assessment Integration Phase</p>
          <p className="text-[var(--gh-text-secondary)] leading-relaxed text-[11px]">
            Repositories below were inspected across codebases, defects, test harnesses, and commercial licenses. Repositories marked{' '}
            <span className="text-[var(--yellow-bright)] font-bold">READY_FOR_TESTING</span> can be cloned into isolated local workspaces and published as active candidate assessment challenges.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-1">
          <div className="flex items-center justify-between text-[var(--gh-text-muted)]">
            <span className="text-[11px] font-mono uppercase">Catalogue Repos</span>
            <FolderGit2 className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{repositories.length}</div>
          <div className="text-[10px] text-[var(--gh-text-muted)] font-mono">10 Multi-Stack Sources</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-1">
          <div className="flex items-center justify-between text-[var(--gh-text-muted)]">
            <span className="text-[11px] font-mono uppercase">Ready for Testing</span>
            <CheckCircle2 className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--yellow-bright)]">{readyCount}</div>
          <div className="text-[10px] text-[var(--gh-text-muted)] font-mono">Verified Automated Harness</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-1">
          <div className="flex items-center justify-between text-[var(--gh-text-muted)]">
            <span className="text-[11px] font-mono uppercase">Commercial MIT</span>
            <Scale className="h-4 w-4 text-[var(--yellow-primary)]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--yellow-primary)]">{mitCount}</div>
          <div className="text-[10px] text-[var(--gh-text-muted)] font-mono">{repositories.length - mitCount} Need Adaptation</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-1">
          <div className="flex items-center justify-between text-[var(--gh-text-muted)]">
            <span className="text-[11px] font-mono uppercase">Cloned Locally</span>
            <Sparkles className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{clonedCount}</div>
          <div className="text-[10px] text-[var(--gh-text-muted)] font-mono">In catalogue-sources/</div>
        </div>
      </div>

      {/* Main Repositories List with Client Search & Filters */}
      <CatalogueRepositoryList initialRepositories={repositories} />
    </div>
  );
}
