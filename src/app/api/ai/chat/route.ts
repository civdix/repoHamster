import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Intelligent built-in Socratic Fallback Assistant when external LLM keys are unconfigured.
 */
function generateSocraticFallback(assignmentTitle: string, query: string): { reply: string; tokensUsed: number } {
  const q = query.toLowerCase();

  let advice = '';
  if (q.includes('race') || q.includes('concurrency') || q.includes('lock') || q.includes('atomic')) {
    advice = `### Concurrency & Synchronization Hint
When inspecting concurrent requests in ${assignmentTitle}:
1. **Critical Section Inspection**: Check where shared state is read and updated. If there is an asynchronous gap between reading the remaining inventory and persisting the deducted quantity, two requests can interleave.
2. **Atomic Primitives**: Consider using an atomic transaction, mutex lock, or atomic decrement operation rather than separate check-then-act logic.
3. **Reproducing**: Try launching concurrent promises via \`Promise.all()\` with identical payloads to verify your mutex releases properly.`;
  } else if (q.includes('rate') || q.includes('limit') || q.includes('window') || q.includes('memory') || q.includes('leak')) {
    advice = `### Sliding Window & Memory Eviction Hint
When analyzing the rate limiter:
1. **Timestamp Pruning**: Sliding window algorithms require pruning timestamps older than \`now - windowSizeMs\` before evaluating bucket capacity.
2. **Window Offsets**: Verify that your timestamp comparisons use \`<=\` vs \`<\` correctly at window boundaries.
3. **Data Structure Cleanliness**: Ensure that inactive client keys are evicted from memory rather than persisting empty arrays indefinitely.`;
  } else if (q.includes('token') || q.includes('jwt') || q.includes('timezone') || q.includes('utc') || q.includes('expire')) {
    advice = `### JWT & Timezone Validation Hint
When troubleshooting authentication expiration:
1. **Timezone Awareness**: In Python and Node, naive datetimes (without explicit UTC tzinfo) can lead to subtle comparison bugs against UTC epoch timestamps.
2. **Epoch vs ISO**: Compare \`datetime.now(timezone.utc).timestamp()\` directly with the token's \`exp\` claim.
3. **Blacklist Lookups**: Verify whether tokens in the revocation blacklist are normalized (trimmed of Bearer prefixes and whitespace).`;
  } else if (q.includes('deadlock') || q.includes('stall') || q.includes('promise') || q.includes('reject')) {
    advice = `### Asynchronous Deadlock & Worker Resiliency Hint
When debugging queue consumer stalls:
1. **Promise Settlement**: Using \`Promise.all()\` causes the entire batch to reject upon the first error, leaving subsequent items unacknowledged. Consider using per-item try/catch or \`Promise.allSettled()\`.
2. **Lock Release in Finally**: Ensure your distributed lock or worker lease is unconditionally released in a \`finally\` block, even when an unhandled exception occurs.`;
  } else if (q.includes('precision') || q.includes('float') || q.includes('round') || q.includes('decimal')) {
    advice = `### Floating Point Arithmetic Hint
In financial ledgers:
1. Standard IEEE 754 floating-point types cannot represent fractions like \`0.1\` exactly.
2. Always initialize \`Decimal('0.1')\` from strings rather than from floats.
3. Check the rounding mode: standard \`round()\` uses banker's rounding (even rounding), whereas financial contracts often mandate explicit \`ROUND_HALF_UP\`.`;
  } else {
    advice = `### Architectural Debugging Guidance
For **${assignmentTitle}**:
- Start by checking the failing assertions in the public test suite.
- Trace the lifecycle of inputs from the request handler through the service layer.
- Look for assumptions where asynchronous operations or shared mutable state are accessed without synchronization.
- What specific error message or unexpected return value are you observing in your terminal?`;
  }

  const promptTokens = Math.ceil(query.length / 4);
  const completionTokens = Math.ceil(advice.length / 4);
  return {
    reply: advice,
    tokensUsed: promptTokens + completionTokens,
  };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

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
  const candidate = await prisma.user.findUnique({
    where: { email: userEmail },
  });

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

  let assistantReply = '';
  let promptTokens = Math.ceil(message.length / 4);
  let completionTokens = 120;

  // 2. Try External LLM if configured, else use Socratic fallback
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (openaiApiKey) {
    try {
      const systemPrompt = `You are RepoHamster Socratic AI Assistant, a clever developer hamster who helps engineers squash bugs. You are coaching a candidate debugging the technical assessment challenge: "${assignment.title}" (${assignment.language}, ${assignment.framework}).
CRITICAL RULES:
1. NEVER output direct solution code or write the bug fix for the candidate.
2. Act as a Socratic mentor: explain root causes, suggest debugging techniques (e.g. logs, inspect mutexes, check timezone offsets, inspect memory), and clarify expected behavior.
3. Keep responses concise, structured in Markdown with developer humor, under 300 words.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map((h: any) => ({ role: h.role, content: h.content })),
            { role: 'user', content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        assistantReply = data.choices?.[0]?.message?.content || '';
        promptTokens = data.usage?.prompt_tokens || promptTokens;
        completionTokens = data.usage?.completion_tokens || completionTokens;
      }
    } catch (e) {
      console.warn('[AI PROXY] OpenAI call failed, falling back:', e);
    }
  }

  // If no external key or call failed, use intelligent Socratic fallback
  if (!assistantReply) {
    const fallback = generateSocraticFallback(assignment.title, message);
    assistantReply = fallback.reply;
    completionTokens = fallback.tokensUsed - promptTokens;
  }

  const totalTokens = promptTokens + completionTokens;

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
    remainingRequests: updatedRequestsRemaining,
    remainingTokens: updatedTokensRemaining,
  });
}
