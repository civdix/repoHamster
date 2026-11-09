import prisma from '@/lib/db';

export interface SyncResult {
  success: boolean;
  owner: string;
  totalScanned: number;
  importedCount: number;
  skippedCount: number;
  assignmentsCreated: number;
  error?: string;
  details: Array<{ name: string; status: string; reason?: string }>;
}

export async function syncRepositoriesFromOwner(customOwner?: string): Promise<SyncResult> {
  // 1. Resolve owner account (from arg, setting, or env)
  let owner = customOwner?.trim();
  if (!owner) {
    try {
      const setting = await prisma.adminSettings.findUnique({
        where: { key: 'github_sync_owner' },
      });
      owner = setting?.value || process.env.REPO_HAMSTER_OWNER || 'repohamster';
    } catch {
      owner = process.env.REPO_HAMSTER_OWNER || 'repohamster';
    }
  }

  const result: SyncResult = {
    success: true,
    owner,
    totalScanned: 0,
    importedCount: 0,
    skippedCount: 0,
    assignmentsCreated: 0,
    details: [],
  };

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RepoHamster-Sync-Engine/1.0',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`, {
      headers,
    });

    let repos: any[] = [];
    if (res.ok) {
      repos = await res.json();
    } else {
      console.warn(`[SYNC] GitHub API returned ${res.status} for @${owner}. Using local catalogue inspection fallback.`);
      // If the owner has no public repos yet or rate-limited, query existing catalog repositories
      const catalogItems = await prisma.catalogRepository.findMany({ take: 20 });
      repos = catalogItems.map((c) => ({
        name: c.repoName,
        full_name: `${c.owner}/${c.repoName}`,
        html_url: c.originalUrl,
        default_branch: c.defaultBranch,
        language: c.language,
        description: c.description,
      }));
    }

    result.totalScanned = repos.length;

    for (const repo of repos) {
      const repoUrl = repo.html_url;
      const repoName = repo.name;

      // Check if assignment already exists
      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          OR: [{ repoUrl }, { slug: repoName.toLowerCase() }],
        },
      });

      if (existingAssignment) {
        result.skippedCount++;
        result.details.push({
          name: repoName,
          status: 'SKIPPED',
          reason: 'Already exists as active debugging assignment',
        });
        continue;
      }

      // Check or create catalog entry
      const existingCatalog = await prisma.catalogRepository.findFirst({
        where: { originalUrl: repoUrl },
      });

      if (!existingCatalog) {
        await prisma.catalogRepository.create({
          data: {
            name: `${owner}-${repoName}`.toLowerCase(),
            originalUrl: repoUrl,
            owner,
            repoName,
            defaultBranch: repo.default_branch || 'main',
            language: repo.language || 'TypeScript',
            framework: 'Codespaces Ready',
            category: 'FULL_STACK',
            difficulty: 'INTERMEDIATE',
            description: repo.description || `Assessment challenge from @${owner}`,
            sourceType: 'COMPLETE_APP',
            importStatus: 'IMPORTED',
            evaluationReadiness: 'READY_FOR_TESTING',
            testAvailability: 'PUBLIC_AND_HIDDEN',
            inspectionReport: {
              source: 'github-cron-sync',
              owner,
              syncedAt: new Date().toISOString(),
              codespacesSupported: true,
            },
          },
        });
        result.importedCount++;
        result.details.push({
          name: repoName,
          status: 'IMPORTED_TO_CATALOGUE',
        });
      } else {
        result.skippedCount++;
        result.details.push({
          name: repoName,
          status: 'SKIPPED',
          reason: 'Already present in catalogue',
        });
      }
    }

    return result;
  } catch (err: any) {
    console.error('[SYNC ENGINE] Error syncing repositories:', err);
    result.success = false;
    result.error = err?.message || 'Sync failed';
    return result;
  }
}
