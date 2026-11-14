import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { autoCreateRepositoryWebhook } from '@/lib/github-webhook-provisioner';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isReviewer(session)) {
    return NextResponse.json(
      { error: 'Read-only mode: Webhook provisioning is disabled during project review.' },
      { status: 403 }
    );
  }
  if (!isPlatformAdmin(session)) {
    return NextResponse.json(
      { error: 'Unauthorized: Only platform administrator @repohamster can provision webhooks.' },
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

    const result = await autoCreateRepositoryWebhook(targetRepoUrl);

    // Explicitly update assignment in database
    if (assignmentId) {
      await prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          webhookStatus: result.success ? 'ACTIVE' : 'FAILED',
          webhookError: result.success ? null : result.message,
        },
      }).catch((e) => console.warn('[WEBHOOK PROVISION] Could not update assignment:', e));
    } else {
      await prisma.assignment.updateMany({
        where: {
          OR: [
            { repoUrl: targetRepoUrl },
            { repoUrl: { contains: targetRepoUrl.split('github.com/')[1] || targetRepoUrl } },
          ],
        },
        data: {
          webhookStatus: result.success ? 'ACTIVE' : 'FAILED',
          webhookError: result.success ? null : result.message,
        },
      }).catch((e) => console.warn('[WEBHOOK PROVISION] Could not update assignments:', e));
    }

    return NextResponse.json({
      ...result,
      webhookStatus: result.success ? 'ACTIVE' : 'FAILED',
      webhookError: result.success ? null : result.message,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to provision webhook' }, { status: 500 });
  }
}
