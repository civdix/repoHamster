import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      include: {
        assignments: {
          include: {
            assignment: true,
            submissions: {
              include: {
                evaluation: {
                  include: { testResults: true },
                },
                pullRequest: true,
              },
              orderBy: { submittedAt: 'desc' },
            },
          },
        },
        aiUsages: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
        pullRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    // Compute stats
    const totalAssignments = user.assignments.length;
    const completedAssignments = user.assignments.filter((a) => a.status === 'COMPLETED');
    const inProgressAssignments = user.assignments.filter((a) => a.status === 'IN_PROGRESS');

    const allSubmissions = user.assignments.flatMap((a) => a.submissions);
    const passedSubmissions = allSubmissions.filter((s) => s.evaluation?.isPassed);
    const passRate =
      allSubmissions.length > 0
        ? Math.round((passedSubmissions.length / allSubmissions.length) * 100)
        : 0;

    const usedAiRequests = user.aiUsages.length;
    const usedAiTokens = user.aiUsages.reduce((sum, u) => sum + u.totalTokens, 0);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username || user.githubUsername || user.email.split('@')[0],
        githubUsername: user.githubUsername,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        totalAssignments,
        completedCount: completedAssignments.length,
        inProgressCount: inProgressAssignments.length,
        totalSubmissions: allSubmissions.length,
        passedSubmissions: passedSubmissions.length,
        passRate,
        usedAiRequests,
        usedAiTokens,
      },
      assignments: user.assignments,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 });
  }

  try {
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username string is required' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Validate format (alphanumeric, dashes, underscores, length 3-30)
    if (!/^[a-z0-9_-]{3,30}$/.test(cleanUsername)) {
      return NextResponse.json(
        {
          error:
            'Username must be 3-30 characters long and contain only letters, numbers, hyphens, and underscores.',
        },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 });
    }

    // Check uniqueness across other users
    const existing = await prisma.user.findFirst({
      where: {
        username: cleanUsername,
        NOT: { id: currentUser.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `The username "@${cleanUsername}" is already taken. Please choose another unique handle.` },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: { username: cleanUsername },
    });

    return NextResponse.json({
      success: true,
      username: updated.username,
      message: `Developer handle successfully set to @${updated.username}!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update username' }, { status: 500 });
  }
}
