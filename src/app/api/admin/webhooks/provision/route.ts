import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { autoCreateRepositoryWebhook } from '@/lib/github-webhook-provisioner';

export const dynamic = 'force-dynamic';

function isAdmin(session: any) {
  const role = session?.user?.role?.toUpperCase();
  const email = session?.user?.email?.toLowerCase();
  return role === 'ADMIN' || email === 'admin@debuglab.internal' || (email && email.includes('admin'));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
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
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to provision webhook' }, { status: 500 });
  }
}
