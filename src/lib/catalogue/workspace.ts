import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import prisma from '@/lib/db';

const execAsync = promisify(exec);

const WORKSPACE_BASE = path.join(process.cwd(), 'catalogue-sources');

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileNode[];
}

/**
 * Ensures base directory for catalogue checkouts exists.
 */
async function ensureWorkspaceDir(catalogId: string): Promise<string> {
  const dir = path.join(WORKSPACE_BASE, catalogId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

/**
 * Clones a public repository into local development workspace.
 */
export async function cloneCatalogueRepository(catalogId: string, gitUrl: string): Promise<{ success: boolean; localPath: string; log: string }> {
  const targetDir = await ensureWorkspaceDir(catalogId);

  // Check if already cloned
  try {
    const gitDir = path.join(targetDir, '.git');
    const stat = await fs.stat(gitDir);
    if (stat.isDirectory()) {
      return {
        success: true,
        localPath: targetDir,
        log: `Repository already imported at ${targetDir}. Upstream unmodified.`,
      };
    }
  } catch {
    // Not cloned yet
  }

  // Clone with shallow depth to preserve bandwidth and storage
  const cloneCmd = `git clone --depth 1 ${gitUrl} "${targetDir}"`;
  try {
    const { stdout, stderr } = await execAsync(cloneCmd, { timeout: 60000 });
    const log = (stdout || '') + '\n' + (stderr || '');

    // Update CatalogRepository localPath & status in DB
    await prisma.catalogRepository.update({
      where: { id: catalogId },
      data: {
        localPath: targetDir,
        importStatus: 'IMPORTED',
      },
    });

    return {
      success: true,
      localPath: targetDir,
      log: log.trim() || 'Repository successfully imported.',
    };
  } catch (err: any) {
    throw new Error(`Failed to clone ${gitUrl}: ${err.message}`);
  }
}

/**
 * Reads project tree up to a maximum depth.
 */
export async function getProjectTree(dirPath: string, maxDepth = 3, currentDepth = 0): Promise<FileNode[]> {
  if (currentDepth > maxDepth) return [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    // Filter out .git, node_modules, target, etc.
    const ignored = new Set(['.git', 'node_modules', '.next', 'target', '.idea', '.vscode', 'venv', '__pycache__']);

    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;

      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const children = await getProjectTree(fullPath, maxDepth, currentDepth + 1);
        nodes.push({
          name: entry.name,
          path: fullPath,
          type: 'directory',
          children,
        });
      } else {
        const stat = await fs.stat(fullPath);
        nodes.push({
          name: entry.name,
          path: fullPath,
          type: 'file',
          size: stat.size,
        });
      }
    }

    // Sort directories first, then alphabetical
    return nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });
  } catch (err) {
    return [];
  }
}

/**
 * Safely reads a file from a catalog project, preventing directory traversal.
 */
export async function readCatalogueFile(localPath: string, relativeFilePath: string): Promise<string> {
  const safePath = path.resolve(localPath, relativeFilePath);
  if (!safePath.startsWith(path.resolve(localPath))) {
    throw new Error('Access denied: directory traversal detected.');
  }

  const stat = await fs.stat(safePath);
  if (stat.size > 500 * 1024) {
    // Truncate large files
    const buf = Buffer.alloc(500 * 1024);
    const fh = await fs.open(safePath, 'r');
    await fh.read(buf, 0, buf.length, 0);
    await fh.close();
    return buf.toString('utf-8') + '\n\n...[TRUNCATED: File exceeds 500KB]...';
  }

  return await fs.readFile(safePath, 'utf-8');
}
