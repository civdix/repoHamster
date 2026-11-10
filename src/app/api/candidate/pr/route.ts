import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { createCandidatePullRequest, parseGitHubRepo } from '@/lib/github-candidate';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized: Candidate sign-in required' }, { status: 401 });
  }

  try {
    const { assignmentId, branch, title, body } = await req.json();

    if (!assignmentId) {
      return NextResponse.json({ error: 'assignmentId is required' }, { status: 400 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const candidateUsername = (session.user as any)?.githubUsername || (session.user as any)?.username;
    if (!candidateUsername) {
      return NextResponse.json(
        { error: 'GitHub username not found in user session. Please ensure your account has a GitHub username.' },
        { status: 400 }
      );
    }

    const userToken = (session as any)?.accessToken || (session.user as any)?.accessToken;

    const prResult = await createCandidatePullRequest({
      repoUrl: assignment.repoUrl,
      candidateUsername,
      branch: branch || 'main',
      baseBranch: assignment.baseBranch || 'main',
      title,
      body,
      userToken,
    });

    if (!prResult.success) {
      return NextResponse.json(prResult, { status: 400 });
    }

    // Persist Pull Request in database
    const userEmail = session.user.email?.toLowerCase();
    const candidateUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    const parsed = parseGitHubRepo(assignment.repoUrl);
    const repoFullName = parsed ? `${parsed.owner}/${parsed.repo}` : 'repohamster/assignment';

    if (candidateUser && prResult.prNumber) {
      try {
        await prisma.pullRequest.upsert({
          where: {
            repoFullName_prNumber: {
              repoFullName,
              prNumber: prResult.prNumber,
            },
          },
          update: {
            state: 'OPEN',
            branchName: branch || 'main',
            prUrl: prResult.prUrl || '',
          },
          create: {
            candidateId: candidateUser.id,
            assignmentId: assignment.id,
            prNumber: prResult.prNumber,
            prUrl: prResult.prUrl || '',
            repoFullName,
            branchName: branch || 'main',
            state: 'OPEN',
          },
        });

        // Ensure candidate assignment is in IN_PROGRESS
        await prisma.candidateAssignment.upsert({
          where: {
            candidateId_assignmentId: {
              candidateId: candidateUser.id,
              assignmentId: assignment.id,
            },
          },
          update: {},
          create: {
            candidateId: candidateUser.id,
            assignmentId: assignment.id,
            status: 'IN_PROGRESS',
          },
        });
      } catch (dbErr) {
        console.warn('[CANDIDATE PR API] DB persistence error:', dbErr);
      }
    }

    return NextResponse.json(prResult);
  } catch (err: any) {
    console.error('[CANDIDATE PR API] Error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to create pull request' },
      { status: 500 }
    );
  }
}
