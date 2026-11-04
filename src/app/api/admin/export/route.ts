import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'csv';

  const candidates = await prisma.user.findMany({
    where: { role: 'CANDIDATE' },
    include: {
      assignments: {
        include: {
          assignment: true,
          submissions: {
            include: {
              evaluation: true,
              pullRequest: true,
            },
            orderBy: { submittedAt: 'desc' },
            take: 1,
          },
        },
      },
      aiUsages: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const exportRows: any[] = [];

  for (const c of candidates) {
    const totalAiTokens = c.aiUsages.reduce((sum, u) => sum + u.totalTokens, 0);
    const totalAiQueries = c.aiUsages.length;

    if (c.assignments.length === 0) {
      exportRows.push({
        candidateId: c.id,
        name: c.name || '',
        email: c.email,
        githubUsername: c.githubUsername || '',
        challengeTitle: 'N/A',
        status: 'NOT_STARTED',
        scorePercent: '0',
        testsPassed: '0',
        testsTotal: '0',
        commitSha: 'N/A',
        completedAt: 'N/A',
        aiQueries: totalAiQueries,
        aiTokens: totalAiTokens,
      });
    } else {
      for (const ca of c.assignments) {
        const latestSub = ca.submissions[0];
        const latestEval = latestSub?.evaluation;

        exportRows.push({
          candidateId: c.id,
          name: c.name || '',
          email: c.email,
          githubUsername: c.githubUsername || '',
          challengeTitle: ca.assignment.title,
          status: ca.status,
          scorePercent: latestEval ? String(latestEval.scorePercent) : '0',
          testsPassed: latestEval ? String(latestEval.passedTests) : '0',
          testsTotal: latestEval ? String(latestEval.totalTests) : '0',
          commitSha: latestSub ? latestSub.commitSha.slice(0, 7) : 'N/A',
          completedAt: ca.completedAt ? ca.completedAt.toISOString() : 'N/A',
          aiQueries: totalAiQueries,
          aiTokens: totalAiTokens,
        });
      }
    }
  }

  if (format === 'json') {
    return NextResponse.json(exportRows);
  }

  // Format as CSV
  const headers = [
    'Candidate ID',
    'Name',
    'Verified Email',
    'GitHub Username',
    'Challenge',
    'Status',
    'Score %',
    'Tests Passed',
    'Tests Total',
    'Commit SHA',
    'Completed At',
    'AI Queries',
    'AI Tokens Consumed',
  ];

  const csvLines = [headers.join(',')];

  for (const r of exportRows) {
    const line = [
      `"${r.candidateId}"`,
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.githubUsername}"`,
      `"${r.challengeTitle.replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.scorePercent}"`,
      `"${r.testsPassed}"`,
      `"${r.testsTotal}"`,
      `"${r.commitSha}"`,
      `"${r.completedAt}"`,
      `"${r.aiQueries}"`,
      `"${r.aiTokens}"`,
    ];
    csvLines.push(line.join(','));
  }

  const csvContent = csvLines.join('\n');

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="debuglab-assessment-results-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
