import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { evaluateSubmission } from '@/lib/evaluation/engine';

function verifySignature(payload: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }
  const [algo, signature] = signatureHeader.split('=');
  if (algo !== 'sha256' || !signature) {
    return false;
  }
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(digest, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const deliveryId = req.headers.get('x-github-delivery') || `local-dev-${Date.now()}`;
  const eventType = req.headers.get('x-github-event') || 'unknown';
  const signature = req.headers.get('x-hub-signature-256');

  const rawBody = await req.text();
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || '';

  // Signature verification
  const isDevMode = process.env.NODE_ENV === 'development';
  if (!isDevMode && webhookSecret) {
    const isValid = verifySignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn(`[WEBHOOK] Invalid HMAC signature for delivery ${deliveryId}`);
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
    }
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Record raw webhook event for auditability
  try {
    await prisma.webhookEvent.create({
      data: {
        deliveryId,
        eventType,
        payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
        status: 'PROCESSED',
      },
    });
  } catch (e) {
    console.warn('[WEBHOOK] Could not persist raw event:', e);
  }

  // Handle pull_request events
  if (eventType === 'pull_request') {
    const action = payload.action;
    // We care about opened, synchronize (new commits pushed), and reopened
    if (!['opened', 'synchronize', 'reopened'].includes(action)) {
      return NextResponse.json({ message: `Ignored action ${action}` }, { status: 200 });
    }

    const pr = payload.pull_request;
    const repoFullName = payload.repository?.full_name;
    const repoHtmlUrl = payload.repository?.html_url;
    const commitSha = pr?.head?.sha;
    const prNumber = pr?.number;
    const prUrl = pr?.html_url;
    const branchName = pr?.head?.ref || 'solution';
    const githubUsername = pr?.user?.login;

    if (!commitSha || !repoFullName || !githubUsername) {
      return NextResponse.json(
        { error: 'Missing required PR metadata: commitSha, repoFullName, or githubUsername' },
        { status: 400 }
      );
    }

    // Match repo to active Assignment
    const assignment = await prisma.assignment.findFirst({
      where: {
        OR: [
          { repoUrl: { contains: repoFullName } },
          { repoUrl: { equals: repoHtmlUrl } },
        ],
        isActive: true,
      },
    });

    if (!assignment) {
      console.warn(`[WEBHOOK] No active assignment matches repo ${repoFullName}`);
      return NextResponse.json(
        { message: `Repository ${repoFullName} is not a registered RepoHamster challenge` },
        { status: 200 }
      );
    }

    // Match or create candidate User
    let candidate = await prisma.user.findFirst({
      where: {
        OR: [
          { githubUsername },
          { email: `${githubUsername}@users.noreply.github.com` },
        ],
      },
    });

    if (!candidate) {
      // Auto-provision candidate record
      candidate = await prisma.user.create({
        data: {
          email: `${githubUsername}@users.noreply.github.com`,
          name: githubUsername,
          githubUsername,
          role: 'CANDIDATE',
          avatarUrl: pr.user?.avatar_url || 'https://avatars.githubusercontent.com/u/9919?v=4',
        },
      });
    }

    // Trigger Evaluation Engine
    const evalResult = await evaluateSubmission({
      candidateId: candidate.id,
      assignmentId: assignment.id,
      commitSha,
      commitMessage: pr.title || 'Pull request fix submission',
      prNumber,
      prUrl,
      repoFullName,
      branchName,
      forceReevaluate: action === 'synchronize',
    });

    return NextResponse.json({
      success: true,
      deliveryId,
      evaluationId: evalResult.evaluation.id,
      isPassed: evalResult.evaluation.isPassed,
      scorePercent: evalResult.evaluation.scorePercent,
    });
  }

  // Ping or other events
  return NextResponse.json({ message: `Event ${eventType} received` });
}
