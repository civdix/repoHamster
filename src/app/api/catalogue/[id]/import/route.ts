import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { cloneCatalogueRepository } from '@/lib/catalogue/workspace';
import { canViewAdmin } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canViewAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized: Staff administrator or reviewer session required.' }, { status: 403 });
  }

  const catalogId = params.id;
  const repo = await prisma.catalogRepository.findUnique({
    where: { id: catalogId },
  });

  if (!repo) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
  }

  try {
    const res = await cloneCatalogueRepository(catalogId, repo.originalUrl);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Clone failed' }, { status: 500 });
  }
}
