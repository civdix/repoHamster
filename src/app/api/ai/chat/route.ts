import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { AIFactory } from '@/lib/ai';
import { checkReviewerMutation } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  const reviewerErr = checkReviewerMutation(session);
  if (reviewerErr) return reviewerErr;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { assignmentId, message, history = [] } = body;

  if (!assignmentId || !message) {
    return NextResponse.json({ error: 'assignmentId and message are required' }, { status: 400 });
  }

  const userEmail = session.user.email?.toLowerCase();
  let candidate = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!candidate) {
    // Demo user fallback if running locally
    candidate = await prisma.user.findFirst({
      where: { role: 'CANDIDATE' },
    });
  }

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
  }

  // 1. Quota Check: Calculate usage over rolling 24-hour window
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentUsages = await prisma.aIUsage.findMany({
    where: {
      candidateId: candidate.id,
      createdAt: { gte: twentyFourHoursAgo },
    },
  });

  const dailyRequestLimit = assignment.aiRequestLimit || 15;
  const dailyTokenLimit = assignment.aiTokenLimit || 10000;

  const usedRequests = recentUsages.length;
  const usedTokens = recentUsages.reduce((sum, u) => sum + u.totalTokens, 0);

  if (usedRequests >= dailyRequestLimit) {
    return NextResponse.json(
      {
        error: `Daily AI request limit reached (${usedRequests}/${dailyRequestLimit}). Your quota will reset in 24 hours.`,
        remainingRequests: 0,
        remainingTokens: Math.max(0, dailyTokenLimit - usedTokens),
      },
      { status: 429 }
    );
  }

  if (usedTokens >= dailyTokenLimit) {
    return NextResponse.json(
      {
        error: `Daily AI token budget exhausted (${usedTokens}/${dailyTokenLimit} tokens used). Your quota will reset in 24 hours.`,
        remainingRequests: Math.max(0, dailyRequestLimit - usedRequests),
        remainingTokens: 0,
      },
      { status: 429 }
    );
  }

  // 2. Dispatch query through AIFactory
  const aiResult = await AIFactory.generateSocraticHint({
    assignmentTitle: assignment.title,
    language: assignment.language,
    framework: assignment.framework,
    userMessage: message,
    history: history.map((h: any) => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: String(h.content || ''),
    })),
    maxOutputTokens: 600,
  });

  const promptTokens = aiResult.promptTokens;
  const completionTokens = aiResult.completionTokens;
  const totalTokens = aiResult.totalTokens;
  const assistantReply = aiResult.reply;

  // 3. Persist AI Usage Record
  await prisma.aIUsage.create({
    data: {
      candidateId: candidate.id,
      assignmentId: assignment.id,
      promptTokens,
      completionTokens,
      totalTokens,
      query: message,
      responseSnippet: assistantReply.slice(0, 300),
    },
  });

  const updatedRequestsRemaining = Math.max(0, dailyRequestLimit - (usedRequests + 1));
  const updatedTokensRemaining = Math.max(0, dailyTokenLimit - (usedTokens + totalTokens));

  return NextResponse.json({
    reply: assistantReply,
    tokensUsed: totalTokens,
    provider: aiResult.provider,
    modelName: aiResult.modelName,
    fallbackUsed: aiResult.fallbackUsed ?? false,
    remainingRequests: updatedRequestsRemaining,
    remainingTokens: updatedTokensRemaining,
  });
}
