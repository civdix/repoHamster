import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isReviewer(session)) {
    return NextResponse.json(
      { error: 'Read-only mode: Modifying system settings is disabled during project review.' },
      { status: 403 }
    );
  }
  if (!isPlatformAdmin(session)) {
    return NextResponse.json(
      { error: 'Unauthorized: Only platform administrator @repohamster can update settings.' },
      { status: 403 }
    );
  }

  const body = await req.json();

  try {
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await prisma.adminSettings.upsert({
          where: { key },
          update: { value },
          create: {
            key,
            value,
            description: `Configured via Admin Console`,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 500 });
  }
}
