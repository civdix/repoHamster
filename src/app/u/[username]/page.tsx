import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { GitHubProfileView } from '@/components/github/GitHubProfileView';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export const dynamic = 'force-dynamic';

interface PublicProfileProps {
  params: {
    username: string;
  };
}

type UserWithProfileData = Prisma.UserGetPayload<{
  include: {
    assignments: {
      include: {
        assignment: true;
        submissions: {
          include: {
            evaluation: {
              include: { testResults: true };
            };
            pullRequest: true;
          };
        };
      };
    };
    pullRequests: true;
  };
}>;

export async function generateMetadata({ params }: PublicProfileProps): Promise<Metadata> {
  const rawUsername = decodeURIComponent(params.username).replace(/^@/, '').toLowerCase().trim();

  let user = null;
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: rawUsername, mode: 'insensitive' } },
          { githubUsername: { equals: rawUsername, mode: 'insensitive' } },
        ],
      },
      select: { name: true, username: true, githubUsername: true },
    });
  } catch {}

  const displayName = user?.name || user?.username || rawUsername;
  const handle = user?.username || user?.githubUsername || rawUsername;

  return {
    title: `${displayName} (@${handle}) | RepoHamster Developer Profile`,
    description: `View ${displayName}'s verified developer coding challenges, bug fixes, and assessment metrics on RepoHamster.`,
    openGraph: {
      title: `${displayName} (@${handle}) - RepoHamster Profile`,
      description: `Verified candidate profile with solved engineering challenges on RepoHamster.`,
      url: `https://www.repohamster.com/@${handle}`,
    },
  };
}

export default async function PublicProfilePage({ params }: PublicProfileProps) {
  const session = await getServerSession(authOptions);
  const rawUsername = decodeURIComponent(params.username).replace(/^@/, '').toLowerCase().trim();

  let user: UserWithProfileData | null = null;
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: rawUsername, mode: 'insensitive' } },
          { githubUsername: { equals: rawUsername, mode: 'insensitive' } },
        ],
      },
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
        pullRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  } catch (err) {
    console.error('[PUBLIC_PROFILE] Error querying user:', err);
  }

  // 404 NOT FOUND STATE (Yellow + Dark with Asking Mercy Mascot)
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] shadow-[var(--yellow-glow-lg)] mb-6 p-4">
          <HamsterMascot variant="mercy" size={80} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-mono">
          Developer Not Found
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[var(--gh-text-muted)] mb-6 max-w-md mx-auto">
          No developer profile matching <span className="text-[var(--yellow-bright)] font-bold">@{rawUsername}</span> was found on RepoHamster.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-[var(--yellow-button-bg)] px-4 py-2 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-[var(--yellow-glow-lg)]"
          >
            Explore Challenges
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-4 py-2 text-xs font-semibold text-[var(--gh-text)] hover:text-white transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.email?.toLowerCase() === user.email.toLowerCase();

  // If the visitor is the user themselves, show their personal profile view (/profile)
  if (isOwner) {
    redirect('/profile');
  }

  return (
    <div className="min-h-screen bg-[var(--gh-bg)] text-[var(--gh-text)]">
      <GitHubProfileView
        user={user}
        assignments={user.assignments}
        pullRequests={user.pullRequests}
        isOwner={false}
      />
    </div>
  );
}
