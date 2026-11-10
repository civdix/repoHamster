import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { parseGitHubRepo, forkChallengeRepository } from '@/lib/github-candidate';
import { autoInstallAIGuardrails } from '@/lib/github-guardrails';
import {
  listRepositoryCodespaces,
  createCodespaceDirectly,
  deleteCodespaceByName,
  CodespaceItem,
} from '@/lib/github-codespaces';
import { withLock, LockAcquisitionError } from '@/lib/lock-manager';

export const dynamic = 'force-dynamic';

/**
 * GET /api/candidate/codespace?repoUrl=...&assignmentId=...
 * Inspects whether any existing Codespaces already exist for this candidate and assignment repository.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized: Candidate sign-in required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const repoUrl = searchParams.get('repoUrl');
  const assignmentId = searchParams.get('assignmentId');

  let targetRepoUrl: string | null | undefined = repoUrl;
  if (!targetRepoUrl && assignmentId) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
    targetRepoUrl = assignment?.repoUrl;
  }

  if (!targetRepoUrl) {
    return NextResponse.json({ error: 'repoUrl or assignmentId is required' }, { status: 400 });
  }

  const parsed = parseGitHubRepo(targetRepoUrl);
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 });
  }

  const candidateUsername =
    (session.user as any)?.githubUsername || (session.user as any)?.username || session.user.name;
  const userToken = (session as any)?.accessToken || (session.user as any)?.accessToken;

  // Check codespaces under candidate's fork or target repo
  const repoOwner = candidateUsername || parsed.owner;
  const repoName = parsed.repo;

  try {
    const result = await listRepositoryCodespaces(repoOwner, repoName, userToken);

    return NextResponse.json({
      success: true,
      repoOwner,
      repoName,
      candidateUsername,
      hasExisting: result.codespaces.length > 0,
      codespaces: result.codespaces,
      isMissingScope: result.isMissingScope ?? false,
      error: result.error,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to inspect Codespaces' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/candidate/codespace
 * Body: {
 *   repoUrl: string;
 *   assignmentId?: string;
 *   action: 'continue' | 'create' | 'create_keep' | 'create_delete';
 *   existingCodespaceName?: string;
 *   existingCodespaceUrl?: string;
 * }
 * Executes candidate's choice in a structured locking manner.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized: Candidate sign-in required' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    repoUrl,
    assignmentId,
    action = 'create',
    existingCodespaceName,
    existingCodespaceUrl,
  } = body;

  let targetRepoUrl: string | null | undefined = repoUrl;
  if (!targetRepoUrl && assignmentId) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
    targetRepoUrl = assignment?.repoUrl;
  }

  if (!targetRepoUrl) {
    return NextResponse.json({ error: 'repoUrl or assignmentId is required' }, { status: 400 });
  }

  const parsed = parseGitHubRepo(targetRepoUrl);
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 });
  }

  const candidateUsername =
    (session.user as any)?.githubUsername || (session.user as any)?.username || session.user.name;
  const userToken = (session as any)?.accessToken || (session.user as any)?.accessToken;

  // 1. Fast handling for 'continue' option (no lock needed, no destructive change)
  if (action === 'continue') {
    if (existingCodespaceUrl) {
      return NextResponse.json({
        success: true,
        action: 'continue',
        webUrl: existingCodespaceUrl,
        message: 'Resuming existing codespace',
      });
    }

    // Lookup existing codespace webUrl
    const list = await listRepositoryCodespaces(candidateUsername || parsed.owner, parsed.repo, userToken);
    const targetCs = list.codespaces[0];
    if (targetCs) {
      return NextResponse.json({
        success: true,
        action: 'continue',
        webUrl: targetCs.webUrl,
        codespace: targetCs,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Previous codespace not found to continue. You can create a new codespace.',
    }, { status: 404 });
  }

  // 2. Critical operations ('create', 'create_keep', 'create_delete') require exclusive structured locking
  const lockKey = `codespace:${candidateUsername || 'user'}:${parsed.repo}`;
  const ownerId = (session.user as any)?.id || candidateUsername || 'candidate-session';

  try {
    const executionResult = await withLock(lockKey, ownerId, 60000, async () => {
      // Step A: Ensure fork exists for the candidate
      const forkResult = await forkChallengeRepository(targetRepoUrl, userToken, candidateUsername);
      const forkOwner = forkResult.forkOwner || candidateUsername || parsed.owner;
      const forkRepo = forkResult.forkRepo || parsed.repo;

      // Ensure anti-cheat AI guardrails and Copilot restrictions are installed in the fork
      if (forkResult.forkUrl) {
        autoInstallAIGuardrails(forkResult.forkUrl, userToken).catch((err) =>
          console.warn('[CODESPACE] Non-fatal error applying guardrails to fork:', err)
        );
      }

      // Step B: Create the new codespace first (Safe pattern)
      let createRes = await createCodespaceDirectly(forkOwner, forkRepo, userToken);

      // If creation on personal fork returned 404 (e.g. fork still propagating on GitHub), fallback to upstream repo
      if (!createRes.success && !createRes.isQuotaExceeded && !createRes.isMissingScope && forkOwner !== parsed.owner) {
        console.warn(`[CODESPACE] Failed on fork ${forkOwner}/${forkRepo}, trying upstream ${parsed.owner}/${parsed.repo}`);
        const upstreamRes = await createCodespaceDirectly(parsed.owner, parsed.repo, userToken);
        if (upstreamRes.success) {
          createRes = upstreamRes;
        }
      }

      if (!createRes.success) {
        if (createRes.isQuotaExceeded) {
          return {
            status: 422,
            data: {
              success: false,
              isQuotaExceeded: true,
              error: createRes.error,
              message: createRes.error,
            },
          };
        }

        if (createRes.isMissingScope) {
          return {
            status: 403,
            data: {
              success: false,
              isMissingScope: true,
              error: createRes.error,
              message: createRes.error,
            },
          };
        }

        return {
          status: 500,
          data: {
            success: false,
            error: createRes.error || 'Failed to create Codespace via GitHub API',
          },
        };
      }

      const newCodespace = createRes.codespace!;

      // Step C: For 'create_delete' action, only delete old codespace AFTER new one is successfully provisioned
      let oldDeleted = false;
      if (action === 'create_delete' && existingCodespaceName) {
        try {
          const deleteRes = await deleteCodespaceByName(existingCodespaceName, userToken);
          oldDeleted = deleteRes.success;
        } catch (delErr) {
          console.warn('[CODESPACE] Non-fatal error cleaning up previous codespace:', delErr);
        }
      }

      return {
        status: 200,
        data: {
          success: true,
          action,
          webUrl: newCodespace.webUrl,
          codespace: newCodespace,
          oldDeleted,
          message:
            action === 'create_delete'
              ? `Created new codespace and deleted previous codespace ${existingCodespaceName}.`
              : `Created new codespace successfully.`,
        },
      };
    });

    return NextResponse.json(executionResult.data, { status: executionResult.status });
  } catch (err: any) {
    if (err instanceof LockAcquisitionError) {
      return NextResponse.json(
        {
          success: false,
          isLocked: true,
          error: err.message,
        },
        { status: 409 }
      );
    }

    console.error('[CODESPACE API] Unexpected error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Internal server error while executing Codespace operation',
      },
      { status: 500 }
    );
  }
}
