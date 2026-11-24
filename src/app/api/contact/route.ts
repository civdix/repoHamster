import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canViewAdmin } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, roleOrOrg, useCase, message } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        roleOrOrg: roleOrOrg ? String(roleOrOrg).trim() : null,
        useCase: useCase ? String(useCase).trim() : 'General Inquiry',
        message: message.trim(),
        status: 'NEW',
      },
    });

    console.log(`[CONTACT API] New inquiry received from ${submission.name} (${submission.email}) -> Notification to shivdix.work+repohamster@gmail.com`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      id: submission.id,
    });
  } catch (err: any) {
    console.error('[CONTACT API] Submission error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to submit contact message. Please try again or email directly.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !canViewAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ success: true, submissions });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to load inquiries' }, { status: 500 });
  }
}
