import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isReviewer(session)) {
    return NextResponse.json(
      { error: 'Read-only mode: Manual candidate overrides are disabled during project review.' },
      { status: 403 }
    );
  }
  if (!isPlatformAdmin(session)) {
    return NextResponse.json(
      { error: 'Unauthorized: Only platform administrator @repohamster can perform overrides.' },
      { status: 403 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { evaluationId, isPassed, scorePercent, reason } = body;

  if (!evaluationId || !reason) {
    return NextResponse.json({ error: 'evaluationId and audit reason are required' }, { status: 400 });
  }

  const existingEval = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: {
      submission: {
        include: { candidateAssignment: true },
      },
    },
  });

  if (!existingEval) {
    return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 });
  }

  const adminName = session.user.name || 'Admin';
  const adminId = (session.user as any).id;
  const auditLog = `\n[ADMIN_AUDIT] Manual Evaluation Override applied by ${adminName} at ${new Date().toISOString()}\nReason: ${reason}`;

  const updatedEval = await prisma.evaluation.update({
    where: { id: evaluationId },
    data: {
      isPassed: Boolean(isPassed),
      scorePercent: parseFloat(scorePercent) || 100,
      status: 'MANUAL_OVERRIDE',
      manualOverrideById: adminId && !adminId.startsWith('mock') ? adminId : undefined,
      manualOverrideReason: reason,
      logs: (existingEval.logs || '') + auditLog,
    },
  });

  // Update candidate assignment completion state accordingly
  const caId = existingEval.submission?.candidateAssignmentId;
  if (caId) {
    await prisma.candidateAssignment.update({
      where: { id: caId },
      data: {
        status: isPassed ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isPassed ? new Date() : null,
      },
    });
  }

  return NextResponse.json({
    success: true,
    evaluation: updatedEval,
  });
}
