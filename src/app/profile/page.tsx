import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { isPlatformAdmin, isReviewer } from '@/lib/permissions';
import {
  Sparkles,
  Bot,
  Zap,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { ProfileSettingsSection } from '@/components/profile/ProfileSettingsSection';
import { GitHubProfileView } from '@/components/github/GitHubProfileView';

export const dynamic = 'force-dynamic';

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin?callbackUrl=/profile');
  }

  const userEmail = session.user.email.toLowerCase();

  // Fetch candidate record and all associated coding activity
  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        assignments: {
          include: {
            assignment: true,
            submissions: {
              include: {
                evaluation: {
                  include: { testResults: true },
                },
                pullRequest: true,
              },
              orderBy: { submittedAt: 'desc' },
            },
          },
          orderBy: { startedAt: 'desc' },
        },
        aiUsages: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
        pullRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  } catch (err) {
    console.error('[PROFILE] Error querying user profile:', err);
  }

  if (!user) {
    redirect('/auth/signin');
  }

  // System settings for AI
  let systemSettings: Record<string, string> = {
    ai_daily_request_limit: '15',
    ai_token_limit: '10000',
  };
  try {
    const settings = await prisma.adminSettings.findMany();
    for (const s of settings) {
      systemSettings[s.key] = s.value;
    }
  } catch {}

  const dailyRequestLimit = parseInt(systemSettings.ai_daily_request_limit || '15', 10);
  const dailyTokenLimit = parseInt(systemSettings.ai_token_limit || '10000', 10);

  const usedRequests = user.aiUsages.length;
  const usedTokens = user.aiUsages.reduce((sum, u) => sum + u.totalTokens, 0);

  const remainingRequests = Math.max(0, dailyRequestLimit - usedRequests);
  const remainingTokens = Math.max(0, dailyTokenLimit - usedTokens);

  const displayUsername = user.username || user.githubUsername || user.email.split('@')[0];

  const isAdminUser = isPlatformAdmin(session) || user.role === 'ADMIN';
  const isReviewerUser = isReviewer(session) || (user as any).role === 'REVIEWER';

  // Ensure DB role reflects admin status if authenticated as platform admin
  if (isAdminUser && user.role !== 'ADMIN') {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
      user.role = 'ADMIN';
    } catch {}
  }

  const profileUser = {
    ...user,
    role: isAdminUser ? 'ADMIN' : isReviewerUser ? 'REVIEWER' : user.role,
  };

  return (
    <div className="min-h-screen bg-[var(--gh-bg)] text-[var(--gh-text)] py-6 space-y-6">
      {/* 1. Developer Handle & AI Quota Banner with Dedicated Settings Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProfileSettingsSection
          displayUsername={displayUsername}
          userId={user.id}
          remainingRequests={remainingRequests}
          dailyRequestLimit={dailyRequestLimit}
          remainingTokens={remainingTokens}
          dailyTokenLimit={dailyTokenLimit}
        />
      </div>

      {/* 2. Full GitHub Experience: Profile View (Sidebar + Tabs + 52-Week Calendar + Pinned Challenge Cards) */}
      <GitHubProfileView
        user={profileUser}
        assignments={user.assignments}
        pullRequests={user.pullRequests}
        isOwner={true}
      />
    </div>
  );
}
