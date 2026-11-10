import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { autoInstallAIGuardrails } from '@/lib/github-guardrails';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isReviewer(session)) {
    return NextResponse.json(
      { error: 'Read-only mode: Converting catalogue repositories is disabled during project review.' },
      { status: 403 }
    );
  }
  if (!isPlatformAdmin(session)) {
    return NextResponse.json(
      { error: 'Unauthorized: Only platform administrator @repohamster can convert catalogue repositories.' },
      { status: 403 }
    );
  }

  const catalogId = params.id;
  const catalogRepo = await prisma.catalogRepository.findUnique({
    where: { id: catalogId },
  });

  if (!catalogRepo) {
    return NextResponse.json({ error: 'Catalog repository not found' }, { status: 404 });
  }

  // Requirement: Only repositories marked READY_FOR_TESTING should be eligible for candidate assignments
  if (catalogRepo.importStatus !== 'READY_FOR_TESTING' && catalogRepo.importStatus !== 'IMPORTED') {
    return NextResponse.json(
      {
        error: `Repository status is "${catalogRepo.importStatus}". Only repositories marked READY_FOR_TESTING can be converted to candidate assignments.`,
      },
      { status: 400 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const title = body.title || catalogRepo.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const slug = body.slug || catalogRepo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const difficulty = body.difficulty || catalogRepo.difficulty || 'INTERMEDIATE';
  const language = body.language || catalogRepo.language;
  const framework = body.framework || catalogRepo.framework;
  const estimatedTimeMinutes = parseInt(body.estimatedTimeMinutes, 10) || 45;
  const passingThresholdPercent = parseFloat(body.passingThresholdPercent) || 100.0;
  const aiRequestLimit = parseInt(body.aiRequestLimit, 10) || 15;
  const aiTokenLimit = parseInt(body.aiTokenLimit, 10) || 10000;

  const instructions =
    body.instructions ||
    `### Debugging Challenge: ${title}

#### Overview
This assignment is derived from the verified open-source repository \`${catalogRepo.originalUrl}\`.
Your objective is to identify intentionally introduced defects, fix the root cause, and pass all public and hidden test suites.

#### Getting Started
1. Click **Open in GitHub Codespaces** to launch your cloud developer environment.
2. Review the public tests provided in the repository.
3. Fix the bug in the source files.
4. Open a Pull Request or click **Submit PR** to execute automated multi-stage evaluation.

#### Rules
- Do not modify existing test assertion files.
- All hidden security & edge case tests must pass for completion.`;

  const publicTestInfo =
    body.publicTestInfo || `Standard public test suite: "${catalogRepo.testAvailability}" verified.`;

  const hiddenTestSpec =
    body.hiddenTestSpec ||
    JSON.stringify({
      runnerCommand: catalogRepo.language.toLowerCase().includes('python') ? 'pytest tests/test_hidden.py' : 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Core Edge Case & Invariant Assertion',
          description: 'Verifies state integrity under boundary conditions',
          points: 50,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Concurrency & Regression Verification',
          description: 'Validates that bug fix does not introduce regressions',
          points: 50,
        },
      ],
    });

  try {
    const assignment = await prisma.assignment.upsert({
      where: { slug },
      update: {
        title,
        description: body.description || catalogRepo.description,
        repoUrl: catalogRepo.originalUrl,
        language,
        framework,
        difficulty: difficulty as any,
        estimatedTimeMinutes,
        instructions,
        publicTestInfo,
        hiddenTestSpec: typeof hiddenTestSpec === 'string' ? hiddenTestSpec : JSON.stringify(hiddenTestSpec),
        passingThresholdPercent,
        aiRequestLimit,
        aiTokenLimit,
        catalogRepositoryId: catalogRepo.id,
        isActive: true,
      },
      create: {
        slug,
        title,
        description: body.description || catalogRepo.description,
        repoUrl: catalogRepo.originalUrl,
        language,
        framework,
        difficulty: difficulty as any,
        estimatedTimeMinutes,
        instructions,
        publicTestInfo,
        hiddenTestSpec: typeof hiddenTestSpec === 'string' ? hiddenTestSpec : JSON.stringify(hiddenTestSpec),
        passingThresholdPercent,
        aiRequestLimit,
        aiTokenLimit,
        catalogRepositoryId: catalogRepo.id,
        isActive: true,
      },
    });

    // Auto-install AI guardrails and Copilot restrictions to the upstream challenge repository
    autoInstallAIGuardrails(catalogRepo.originalUrl).catch((err) =>
      console.warn('[CATALOGUE CONVERT] Non-fatal error installing AI guardrails:', err)
    );

    return NextResponse.json({
      success: true,
      assignment,
      message: `Repository "${catalogRepo.name}" successfully converted to active assignment "${assignment.title}".`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to convert repository to assignment' }, { status: 500 });
  }
}
