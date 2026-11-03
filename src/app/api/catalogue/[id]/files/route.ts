import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getProjectTree, readCatalogueFile } from '@/lib/catalogue/workspace';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
  }

  const catalogId = params.id;
  const repo = await prisma.catalogRepository.findUnique({
    where: { id: catalogId },
  });

  if (!repo) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('file');

  // If local repository exists
  if (repo.localPath) {
    try {
      if (filePath) {
        const content = await readCatalogueFile(repo.localPath, filePath);
        return NextResponse.json({ success: true, filePath, content });
      } else {
        const tree = await getProjectTree(repo.localPath);
        return NextResponse.json({ success: true, tree });
      }
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // If not cloned locally yet, return GitHub API tree / readme from inspectionReport
  let report: any = {};
  try {
    report = typeof repo.inspectionReport === 'string' ? JSON.parse(repo.inspectionReport) : repo.inspectionReport;
  } catch {}

  return NextResponse.json({
    success: true,
    isLocal: false,
    message: 'Repository not cloned locally yet. Click "Import / Clone Locally" to inspect full local tree.',
    inspectionData: report,
  });
}
