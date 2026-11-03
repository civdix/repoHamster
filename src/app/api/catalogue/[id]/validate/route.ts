import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { validateRepositoryCompatibility } from '@/lib/catalogue/validator';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
  }

  try {
    const result = await validateRepositoryCompatibility(params.id);
    return NextResponse.json({ success: true, validation: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Validation failed' }, { status: 500 });
  }
}
