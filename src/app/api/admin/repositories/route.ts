import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const repositories = await prisma.catalogRepository.findMany({
      select: {
        id: true,
        name: true,
        repoName: true,
        owner: true,
        originalUrl: true,
        language: true,
        framework: true,
        difficulty: true,
        description: true,
        defaultBranch: true,
        importStatus: true,
        evaluationReadiness: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, repositories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch repositories' }, { status: 500 });
  }
}
