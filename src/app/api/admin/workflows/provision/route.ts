import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { autoInstallTestWorkflow } from '@/lib/github-workflow-provisioner';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isReviewer(session)) {
    return NextResponse.json(
      { error: 'Read-only mode: Workflow installation is disabled during project review.' },
      { status: 403 }
    );
  }
  if (!isPlatformAdmin(session)) {
    return NextResponse.json(
      { error: 'Unauthorized: Only platform administrator @repohamster can install assessment workflows.' },
      { status: 403 }
    );
  }

  try {
    const { repoUrl, assignmentId, language } = await req.json();

    let targetRepoUrl = repoUrl;
    let targetLanguage = language || 'javascript';

    if ((!targetRepoUrl || !targetLanguage) && assignmentId) {
      const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
      });
      if (assignment) {
        targetRepoUrl = targetRepoUrl || assignment.repoUrl;
        targetLanguage = targetLanguage || assignment.language;
      }
    }

    if (!targetRepoUrl) {
      return NextResponse.json({ error: 'repoUrl or assignmentId required' }, { status: 400 });
    }

    const sessionToken = (session as any)?.accessToken || (session.user as any)?.accessToken;
    const adminToken = process.env.GITHUB_TOKEN || sessionToken;
    const result = await autoInstallTestWorkflow(targetRepoUrl, targetLanguage, adminToken);

    if (assignmentId) {
      await prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          workflowStatus: result.success ? 'ACTIVE' : 'FAILED',
          workflowError: result.success ? null : result.message,
        },
      }).catch((e) => console.warn('[WORKFLOW PROVISION] Could not update assignment:', e));
    } else {
      await prisma.assignment.updateMany({
        where: {
          OR: [
            { repoUrl: targetRepoUrl },
            { repoUrl: { contains: targetRepoUrl.split('github.com/')[1] || targetRepoUrl } },
          ],
        },
        data: {
          workflowStatus: result.success ? 'ACTIVE' : 'FAILED',
          workflowError: result.success ? null : result.message,
        },
      }).catch((e) => console.warn('[WORKFLOW PROVISION] Could not update assignments:', e));
    }

    return NextResponse.json({
      ...result,
      workflowStatus: result.success ? 'ACTIVE' : 'FAILED',
      workflowError: result.success ? null : result.message,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to install assessment workflow' }, { status: 500 });
  }
}
