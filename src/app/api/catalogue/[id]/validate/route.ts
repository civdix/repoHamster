import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateRepositoryCompatibility } from '@/lib/catalogue/validator';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (isReviewer(session)) {
    return NextResponse.json(
      { error: 'Read-only mode: Validating catalogue repositories is disabled during project review.' },
      { status: 403 }
    );
  }
  if (!isPlatformAdmin(session)) {
    return NextResponse.json(
      { error: 'Unauthorized: Only platform administrator @repohamster can validate repositories.' },
      { status: 403 }
    );
  }

  try {
    const result = await validateRepositoryCompatibility(params.id);
    return NextResponse.json({ success: true, validation: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Validation failed' }, { status: 500 });
  }
}
