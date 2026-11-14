import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { canViewAdmin } from '@/lib/permissions';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const INSTRUCTION_FILENAMES = [
  'INSTRUCTIONS.md',
  'instructions.md',
  'Instructions.md',
  'INSTRUCTION.md',
  'instruction.md',
  '.github/INSTRUCTIONS.md',
  '.github/instructions.md',
  '.github/copilot-instructions.md',
];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canViewAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized: Staff or Reviewer access required' }, { status: 403 });
  }

  const catalogId = params.id;
  const repo = await prisma.catalogRepository.findUnique({
    where: { id: catalogId },
  });

  if (!repo) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
  }

  const defaultTitle = repo.name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const defaultInstructions = `### Debugging Challenge: ${defaultTitle}

#### Overview
This challenge is sourced from the open-source repository \`${repo.originalUrl}\`.

#### Your Task
1. Analyze the project structure and public test suites.
2. Diagnose intentionally introduced defects in the codebase.
3. Implement the bug fix while preserving regression safety.
4. Ensure all public and authoritative hidden test suites pass.

#### Getting Started
- Launch your cloud environment via GitHub Codespaces.
- Run the test suite to inspect failing assertions.
- Submit a Pull Request once all tests pass locally.`;

  // 1. Check local repository clone if available
  if (repo.localPath) {
    for (const filename of INSTRUCTION_FILENAMES) {
      const fullPath = path.join(repo.localPath, filename);
      try {
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8').trim();
          if (content.length > 0) {
            return NextResponse.json({
              success: true,
              present: true,
              instructions: content,
              filename,
              source: 'local_repo',
            });
          }
        }
      } catch (err) {
        console.warn(`[INSTRUCTIONS] Error checking local file ${fullPath}:`, err);
      }
    }
  }

  // 2. If not found locally, attempt to fetch from GitHub raw repository
  const githubMatch = repo.originalUrl?.match(/github\.com\/([^\/]+)\/([^\/\.#]+)/);
  if (githubMatch) {
    const [, owner, repoName] = githubMatch;
    const branches = ['main', 'master', 'HEAD'];

    for (const branch of branches) {
      for (const filename of ['INSTRUCTIONS.md', 'instructions.md', 'Instructions.md']) {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${filename}`;
        try {
          const res = await fetch(rawUrl, {
            headers: {
              'User-Agent': 'RepoHamster-InstructionFetcher',
              ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
            },
            next: { revalidate: 60 },
          });
          if (res.ok) {
            const content = (await res.text()).trim();
            if (content.length > 0 && !content.startsWith('404: Not Found')) {
              return NextResponse.json({
                success: true,
                present: true,
                instructions: content,
                filename,
                source: 'github_remote',
              });
            }
          }
        } catch (fetchErr) {
          // Continue to next branch/filename candidate
        }
      }
    }
  }

  // 3. Fallback to default instructions
  return NextResponse.json({
    success: true,
    present: false,
    instructions: defaultInstructions,
    source: 'default',
  });
}
