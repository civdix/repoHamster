import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syncRepositoriesFromOwner } from '@/lib/github-sync';
import { isPlatformAdmin } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest, session: any) {
  // Check Bearer secret (for Vercel Cron or GitHub Action)
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }

  // Check admin session strictly for sole admin @repohamster
  return isPlatformAdmin(session);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!isAuthorized(req, session)) {
    return NextResponse.json({ error: 'Unauthorized: Admin session or CRON_SECRET required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const owner = searchParams.get('owner') || undefined;

  const result = await syncRepositoriesFromOwner(owner);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!isAuthorized(req, session)) {
    return NextResponse.json({ error: 'Unauthorized: Admin session or CRON_SECRET required' }, { status: 401 });
  }

  let owner: string | undefined = undefined;
  try {
    const body = await req.json();
    owner = body?.owner;
  } catch {
    // Body optional
  }

  const result = await syncRepositoriesFromOwner(owner);
  return NextResponse.json(result);
}
