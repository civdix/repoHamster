import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { forkChallengeRepository } from '@/lib/github-candidate';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized: Candidate sign-in required' }, { status: 401 });
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
      return NextResponse.json({ error: 'repoUrl or assignmentId is required' }, { status: 400 });
    }

    const candidateUsername = (session.user as any)?.githubUsername || (session.user as any)?.username;
    const userToken = (session as any)?.accessToken || (session.user as any)?.accessToken;

    const result = await forkChallengeRepository(targetRepoUrl, userToken, candidateUsername);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[CANDIDATE FORK API] Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to fork repository' },
      { status: 500 }
    );
  }
}
