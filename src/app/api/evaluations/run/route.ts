import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { evaluateSubmission } from '@/lib/evaluation/engine';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { assignmentId, prNumber, commitSha, commitMessage } = body;

  if (!assignmentId) {
    return NextResponse.json({ error: 'assignmentId is required' }, { status: 400 });
  }

  // Find candidate user
  const userEmail = session.user.email?.toLowerCase();
  let candidate = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!candidate) {
    // If running in quick demo mode without pre-existing user row
    candidate = await prisma.user.create({
      data: {
        email: userEmail || 'demo-candidate@debuglab.internal',
        name: session.user.name || 'Demo Candidate',
        role: 'CANDIDATE',
        githubUsername: (session.user as any)?.githubUsername || 'demo-candidate',
      },
    });
  }

  // Find assignment
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
  }

  // Generate SHA if not provided
  const targetSha = commitSha || crypto.randomBytes(20).toString('hex');

  // Extract repo full name from repoUrl (e.g. debuglab-assessments/ecommerce-concurrency-ratelimit)
  const repoParts = assignment.repoUrl.replace('https://github.com/', '').split('/');
  const repoFullName = `${repoParts[0]}/${repoParts[1]}`;

  try {
    const evalResult = await evaluateSubmission({
      candidateId: candidate.id,
      assignmentId: assignment.id,
      commitSha: targetSha,
      commitMessage: commitMessage || 'Manual candidate evaluation trigger',
      prNumber: prNumber || 1,
      repoFullName,
      branchName: 'solution',
      forceReevaluate: true,
    });

    return NextResponse.json({
      success: true,
      evaluation: evalResult.evaluation,
      submission: evalResult.submission,
    });
  } catch (err: any) {
    console.error('[EVALUATION API] Run failed:', err);
    return NextResponse.json({ error: err.message || 'Evaluation runner failed' }, { status: 500 });
  }
}
