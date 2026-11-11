import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import {
  Sparkles,
  Bot,
  Zap,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { UsernameEditor } from '@/components/profile/UsernameEditor';
import { ShareProfileBar } from '@/components/profile/ShareProfileBar';
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

  return (
    <div className="min-h-screen bg-[var(--gh-bg)] text-[var(--gh-text)] py-6 space-y-6">
      {/* 1. Developer Handle & AI Quota Banner (Yellow + Dark Theme) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Username Editor */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--gh-text-muted)]">
                  Developer Profile Settings
                </span>
                <span className="rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2 py-0.5 text-[10px] font-mono text-[var(--amber-badge-text)] font-bold">
                  Live
                </span>
              </div>
              <UsernameEditor initialUsername={displayUsername} userId={user.id} />
            </div>

            {/* Right: Hamster AI Credit Meters (Yellow + Dark) */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
              <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-2.5 font-mono text-xs space-y-0.5">
                <div className="flex items-center justify-between space-x-3 text-[var(--gh-text-muted)] text-[11px]">
                  <span className="flex items-center space-x-1">
                    <Bot className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                    <span>Daily AI Queries</span>
                  </span>
                  <span className="text-[var(--yellow-bright)] font-bold">
                    {remainingRequests} / {dailyRequestLimit}
                  </span>
                </div>
                <div className="w-40 h-1.5 rounded-full bg-[var(--gh-bg-tertiary)] overflow-hidden mt-1">
                  <div
                    style={{ width: `${Math.min(100, (remainingRequests / dailyRequestLimit) * 100)}%` }}
                    className="h-full bg-[var(--yellow-bright)] rounded-full"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-2.5 font-mono text-xs space-y-0.5">
                <div className="flex items-center justify-between space-x-3 text-[var(--gh-text-muted)] text-[11px]">
                  <span className="flex items-center space-x-1">
                    <Zap className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                    <span>Daily Token Budget</span>
                  </span>
                  <span className="text-[var(--yellow-bright)] font-bold">
                    {remainingTokens.toLocaleString()}
                  </span>
                </div>
                <div className="w-40 h-1.5 rounded-full bg-[var(--gh-bg-tertiary)] overflow-hidden mt-1">
                  <div
                    style={{ width: `${Math.min(100, (remainingTokens / dailyTokenLimit) * 100)}%` }}
                    className="h-full bg-[var(--yellow-bright)] rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Share Profile Link */}
          <div className="pt-4 border-t border-[var(--gh-border-subtle)]">
            <ShareProfileBar username={displayUsername} />
          </div>
        </div>
      </div>

      {/* 2. Full GitHub Experience: Profile View (Sidebar + Tabs + 52-Week Calendar + Pinned Challenge Cards) */}
      <GitHubProfileView
        user={user}
        assignments={user.assignments}
        pullRequests={user.pullRequests}
        isOwner={true}
      />
    </div>
  );
}
