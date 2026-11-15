import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { autoCreateRepositoryWebhook } from '@/lib/github-webhook-provisioner';
import { autoInstallAIGuardrails } from '@/lib/github-guardrails';
import { autoInstallTestWorkflow } from '@/lib/github-workflow-provisioner';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';
import { softWarmPages } from '@/lib/cache-warmer';

export const dynamic = 'force-dynamic';

function checkAdminAuth(session: any) {
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }
  if (isReviewer(session)) {
    return NextResponse.json(
      { error: 'Read-only mode: Creating, modifying, or deleting challenges is disabled during project review.' },
      { status: 403 }
    );
  }
  if (!isPlatformAdmin(session)) {
    return NextResponse.json(
      { error: 'Unauthorized: Only platform administrator @repohamster has permission to perform this action.' },
      { status: 403 }
    );
  }
  return null;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authErr = checkAdminAuth(session);
  if (authErr) return authErr;

  const body = await req.json();
  const {
    slug,
    title,
    description,
    repoUrl,
    language,
    framework,
    difficulty,
    estimatedTimeMinutes,
    passingThresholdPercent,
    aiRequestLimit,
    aiTokenLimit,
    isActive,
    instructions,
    publicTestInfo,
    hiddenTestSpec,
  } = body;

  if (!slug || !title || !repoUrl) {
    return NextResponse.json({ error: 'Missing required assignment fields (slug, title, repoUrl)' }, { status: 400 });
  }

  try {
    let finalHiddenSpec = hiddenTestSpec;
    if (!finalHiddenSpec) {
      finalHiddenSpec = {
        runnerCommand: 'npm run test:hidden',
        testCases: [
          {
            id: 'HIDDEN-TC-01',
            name: 'Core Regression & Boundary Invariance Suite',
            description: 'Automated hidden edge-case verification',
            points: 50,
          },
          {
            id: 'HIDDEN-TC-02',
            name: 'Concurrency Stress & Memory Sanitizer Check',
            description: 'Parallel load execution verification',
            points: 50,
          },
        ],
      };
    } else if (typeof finalHiddenSpec === 'string') {
      try {
        finalHiddenSpec = JSON.parse(finalHiddenSpec);
      } catch {
        // Keep string or fallback
      }
    }

    const assignment = await prisma.assignment.create({
      data: {
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        description: description?.trim() || '',
        repoUrl: repoUrl.trim(),
        language: language?.trim() || 'TypeScript',
        framework: framework?.trim() || 'Node.js',
        difficulty: difficulty || 'INTERMEDIATE',
        estimatedTimeMinutes: parseInt(estimatedTimeMinutes, 10) || 45,
        passingThresholdPercent: parseFloat(passingThresholdPercent) || 100,
        aiRequestLimit: aiRequestLimit !== undefined && !Number.isNaN(parseInt(aiRequestLimit, 10)) ? parseInt(aiRequestLimit, 10) : 15,
        aiTokenLimit: parseInt(aiTokenLimit, 10) || 10000,
        isActive: isActive !== false,
        instructions: instructions || 'Problem instructions',
        publicTestInfo: publicTestInfo || 'Public tests included in repository.',
        hiddenTestSpec: finalHiddenSpec,
      },
    });

    // Auto-provision Webhook, AI Guardrails, and Test Workflow automatically in the background
    (async () => {
      try {
        const [whRes, grRes, wfRes] = await Promise.allSettled([
          autoCreateRepositoryWebhook(assignment.repoUrl),
          autoInstallAIGuardrails(assignment.repoUrl),
          autoInstallTestWorkflow(assignment.repoUrl, assignment.language),
        ]);

        const webhookOk = whRes.status === 'fulfilled' && whRes.value.success;
        const webhookError = whRes.status === 'fulfilled' ? (whRes.value.success ? null : whRes.value.message) : String(whRes.reason);

        const guardrailsOk = grRes.status === 'fulfilled' && grRes.value.success;
        const guardrailsError = grRes.status === 'fulfilled' ? (grRes.value.success ? null : grRes.value.message) : String(grRes.reason);

        const workflowOk = wfRes.status === 'fulfilled' && wfRes.value.success;
        const workflowError = wfRes.status === 'fulfilled' ? (wfRes.value.success ? null : wfRes.value.message) : String(wfRes.reason);

        await prisma.assignment.update({
          where: { id: assignment.id },
          data: {
            webhookStatus: webhookOk ? 'ACTIVE' : 'FAILED',
            webhookError,
            guardrailsStatus: guardrailsOk ? 'ACTIVE' : 'FAILED',
            guardrailsError,
            workflowStatus: workflowOk ? 'ACTIVE' : 'FAILED',
            workflowError,
          },
        });
      } catch (err: any) {
        console.warn('[ASSIGNMENT CREATE AUTO-PROVISION] Error:', err?.message);
      }
    })();

    // Soft-warm Edge CDN cache with new challenge
    softWarmPages(['/', '/leaderboard', `/assignments/${assignment.slug}`]).catch(() => {});

    return NextResponse.json({ success: true, assignment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create assignment' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authErr = checkAdminAuth(session);
  if (authErr) return authErr;

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: 'Assignment id required' }, { status: 400 });
  }

  try {
    let finalHiddenSpec = data.hiddenTestSpec;
    if (finalHiddenSpec && typeof finalHiddenSpec === 'string') {
      try {
        finalHiddenSpec = JSON.parse(finalHiddenSpec);
      } catch {
        // keep as is
      }
    }

    const updateData: any = {
      title: data.title,
      slug: data.slug?.toLowerCase().trim(),
      description: data.description,
      repoUrl: data.repoUrl,
      language: data.language,
      framework: data.framework,
      difficulty: data.difficulty,
      estimatedTimeMinutes: parseInt(data.estimatedTimeMinutes, 10) || 45,
      passingThresholdPercent: parseFloat(data.passingThresholdPercent) || 100,
      aiRequestLimit: data.aiRequestLimit !== undefined && !Number.isNaN(parseInt(data.aiRequestLimit, 10)) ? parseInt(data.aiRequestLimit, 10) : 15,
      aiTokenLimit: parseInt(data.aiTokenLimit, 10) || 10000,
      isActive: Boolean(data.isActive),
      instructions: data.instructions,
      publicTestInfo: data.publicTestInfo,
    };

    if (finalHiddenSpec !== undefined) {
      updateData.hiddenTestSpec = finalHiddenSpec;
    }

    const updated = await prisma.assignment.update({
      where: { id },
      data: updateData,
    });

    softWarmPages(['/', '/leaderboard', `/assignments/${updated.slug}`]).catch(() => {});

    return NextResponse.json({ success: true, assignment: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update assignment' }, { status: 500 });
  }
}

// Quick toggle: Hide or Unhide challenge
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authErr = checkAdminAuth(session);
  if (authErr) return authErr;

  try {
    const { id, isActive } = await req.json();

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Missing id or isActive boolean' }, { status: 400 });
    }

    const updated = await prisma.assignment.update({
      where: { id },
      data: { isActive },
    });

    softWarmPages(['/', '/leaderboard', `/assignments/${updated.slug}`]).catch(() => {});

    return NextResponse.json({
      success: true,
      assignment: updated,
      message: `Challenge ${updated.isActive ? 'unhidden (active)' : 'hidden from candidates'}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to toggle challenge visibility' }, { status: 500 });
  }
}

// Delete / Remove challenge
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authErr = checkAdminAuth(session);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Assignment id query parameter required' }, { status: 400 });
    }

    // Safely delete associated records (PRs, evaluations, submissions, candidate assignments)
    const candidateAssignments = await prisma.candidateAssignment.findMany({
      where: { assignmentId: id },
      include: {
        submissions: {
          include: { evaluation: true },
        },
      },
    });

    for (const ca of candidateAssignments) {
      for (const sub of ca.submissions) {
        if (sub.evaluation) {
          await prisma.testResult.deleteMany({ where: { evaluationId: sub.evaluation.id } });
          await prisma.evaluation.delete({ where: { id: sub.evaluation.id } });
        }
      }
      await prisma.submission.deleteMany({ where: { candidateAssignmentId: ca.id } });
    }

    await prisma.candidateAssignment.deleteMany({ where: { assignmentId: id } });
    await prisma.pullRequest.deleteMany({ where: { assignmentId: id } });
    await prisma.aIUsage.deleteMany({ where: { assignmentId: id } });

    // Delete assignment itself
    const deleted = await prisma.assignment.delete({
      where: { id },
    });

    softWarmPages(['/', '/leaderboard']).catch(() => {});

    return NextResponse.json({
      success: true,
      deletedId: deleted.id,
      title: deleted.title,
      message: `Challenge "${deleted.title}" successfully deleted.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete assignment' }, { status: 500 });
  }
}
