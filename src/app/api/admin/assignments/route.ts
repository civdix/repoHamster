import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
  }

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
  } = body;

  if (!slug || !title || !repoUrl) {
    return NextResponse.json({ error: 'Missing required assignment fields' }, { status: 400 });
  }

  try {
    const hiddenSpec = JSON.stringify({
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
    });

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
        aiRequestLimit: parseInt(aiRequestLimit, 10) || 15,
        aiTokenLimit: parseInt(aiTokenLimit, 10) || 10000,
        isActive: isActive !== false,
        instructions: instructions || 'Problem instructions',
        publicTestInfo: publicTestInfo || 'Public tests',
        hiddenTestSpec: hiddenSpec,
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create assignment' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: 'Assignment id required' }, { status: 400 });
  }

  try {
    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        repoUrl: data.repoUrl,
        language: data.language,
        framework: data.framework,
        difficulty: data.difficulty,
        estimatedTimeMinutes: parseInt(data.estimatedTimeMinutes, 10),
        passingThresholdPercent: parseFloat(data.passingThresholdPercent),
        aiRequestLimit: parseInt(data.aiRequestLimit, 10),
        aiTokenLimit: parseInt(data.aiTokenLimit, 10),
        isActive: Boolean(data.isActive),
        instructions: data.instructions,
        publicTestInfo: data.publicTestInfo,
      },
    });

    return NextResponse.json({ success: true, assignment: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update assignment' }, { status: 500 });
  }
}
