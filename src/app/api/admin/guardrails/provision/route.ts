import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { autoInstallAIGuardrails } from '@/lib/github-guardrails';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isReviewer(session)) {
    return NextResponse.json(
      { error: 'Read-only mode: Guardrail installation is disabled during project review.' },
      { status: 403 }
    );
  }
  if (!isPlatformAdmin(session)) {
    return NextResponse.json(
      { error: 'Unauthorized: Only platform administrator @repohamster can install guardrails.' },
      { status: 403 }
    );
  }

  try {
    const { repoUrl, assignmentId } = await req.json();

    let targetRepoUrl = repoUrl;
    if (!targetRepoUrl && assignmentId) {
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
      });
      targetRepoUrl = assignment?.repoUrl;
    }

    if (!targetRepoUrl) {
      return NextResponse.json({ error: 'repoUrl or assignmentId required' }, { status: 400 });
    }

    const sessionToken = (session as any)?.accessToken || (session.user as any)?.accessToken;
    const adminToken = process.env.GITHUB_TOKEN || sessionToken;
    const result = await autoInstallAIGuardrails(targetRepoUrl, adminToken);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to install AI guardrails' }, { status: 500 });
  }
}
