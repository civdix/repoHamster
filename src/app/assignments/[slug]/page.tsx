import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getTestCaseSummary } from '@/lib/test-case-utils';
import { GitHubWorkspaceView } from '@/components/github/GitHubWorkspaceView';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default async function AssignmentDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/assignments/${params.slug}`);
  }

  const userEmail = session.user.email?.toLowerCase();

  // Find assignment by slug
  const assignment = await prisma.assignment.findUnique({
    where: { slug: params.slug },
  });

  if (!assignment) {
    notFound();
  }

  // Find or provision candidate assignment tracking
  let candidate = null;
  let candidateAssignment = null;
  let remainingRequests = 15;
  let remainingTokens = 10000;

  if (userEmail) {
    try {
      candidate = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          aiUsages: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      });

      if (candidate) {
        candidateAssignment = await prisma.candidateAssignment.upsert({
          where: {
            candidateId_assignmentId: {
              candidateId: candidate.id,
              assignmentId: assignment.id,
            },
          },
          update: {},
          create: {
            candidateId: candidate.id,
            assignmentId: assignment.id,
            status: 'IN_PROGRESS',
          },
          include: {
            submissions: {
              include: {
                evaluation: {
                  include: {
                    testResults: true,
                  },
                },
                pullRequest: true,
              },
              orderBy: { submittedAt: 'desc' },
            },
          },
        });

        const usedRequests = candidate.aiUsages?.length || 0;
        const usedTokens = candidate.aiUsages?.reduce((sum, u) => sum + u.totalTokens, 0) || 0;
        remainingRequests = Math.max(0, assignment.aiRequestLimit - usedRequests);
        remainingTokens = Math.max(0, assignment.aiTokenLimit - usedTokens);
      }
    } catch (err) {
      console.error('[ASSIGNMENT DETAIL] Query error:', err);
    }
  }

  const latestSubmission = candidateAssignment?.submissions?.[0];
  const latestEvaluation = latestSubmission?.evaluation;

  const publicTestResults = latestEvaluation?.testResults?.filter((t) => t.testSuite === 'PUBLIC') || [];
  const hiddenTestResults = latestEvaluation?.testResults?.filter((t) => t.testSuite === 'HIDDEN') || [];

  const hiddenPassCount = hiddenTestResults.filter((t) => t.status === 'PASSED').length;
  const hiddenTotalCount = hiddenTestResults.length;

  const testSummary = getTestCaseSummary(assignment);
  const candidateGithubUsername =
    (session?.user as any)?.githubUsername || (session?.user as any)?.username;

  return (
    <GitHubWorkspaceView
      assignment={assignment}
      candidateAssignment={candidateAssignment}
      latestSubmission={latestSubmission}
      latestEvaluation={latestEvaluation}
      publicTestResults={publicTestResults}
      hiddenPassCount={hiddenPassCount}
      hiddenTotalCount={hiddenTotalCount}
      testSummary={testSummary}
      remainingRequests={remainingRequests}
      remainingTokens={remainingTokens}
      candidateGithubUsername={candidateGithubUsername}
    />
  );
}
