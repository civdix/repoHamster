import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './db';

// The sole platform administrator of RepoHamster is strictly '@repohamster'
function isRepoHamsterAdmin(username?: string | null): boolean {
  if (!username) return false;
  return username.replace(/^@/, '').toLowerCase().trim() === 'repohamster';
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
              params: {
                scope: 'read:user user:email public_repo codespace',
              },
            },
            profile(profile) {
              const ghLogin = profile.login || '';
              const isAdmin = isRepoHamsterAdmin(ghLogin);
              return {
                id: String(profile.id),
                name: profile.name || ghLogin,
                email: profile.email || `${ghLogin}@github.users.noreply`,
                image: profile.avatar_url,
                githubUsername: ghLogin,
                role: isAdmin ? 'ADMIN' : 'CANDIDATE',
              };
            },
          }),
        ]
      : []),
    // Credentials provider exclusively for password-protected /project-review access
    CredentialsProvider({
      id: 'credentials',
      name: 'Project Review Access',
      credentials: {
        passcode: { label: 'Review Passcode', type: 'password' },
      },
      async authorize(credentials) {
        const enteredPasscode = credentials?.passcode?.trim();
        const configuredPasscode = (process.env.PROJECT_REVIEW_PASSCODE || 'repohamster2026').trim();

        if (!enteredPasscode || enteredPasscode !== configuredPasscode) {
          throw new Error('Invalid review passcode. Access denied.');
        }

        // Auto-provision guest reviewer user in DB so relations and profile queries resolve seamlessly
        try {
          await prisma.user.upsert({
            where: { email: 'reviewer@repohamster.internal' },
            update: {
              name: 'Project Reviewer (Guest)',
              username: 'project-reviewer',
              githubUsername: 'project-reviewer',
            },
            create: {
              email: 'reviewer@repohamster.internal',
              name: 'Project Reviewer (Guest)',
              username: 'project-reviewer',
              githubUsername: 'project-reviewer',
              role: 'CANDIDATE',
              avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
            },
          });
        } catch (dbErr) {
          console.warn('[AUTH] Could not upsert reviewer guest record in DB (offline fallback active):', dbErr);
        }

        // Return a dedicated Read-Only Project Reviewer guest session
        return {
          id: 'project-reviewer-guest',
          name: 'Project Reviewer (Guest)',
          email: 'reviewer@repohamster.internal',
          image: 'https://avatars.githubusercontent.com/u/9919?v=4',
          role: 'REVIEWER',
          username: 'project-reviewer',
          githubUsername: 'project-reviewer',
          isReviewer: true,
        } as any;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github' && user.email) {
        try {
          const ghProfile = profile as any;
          const ghUsername = ghProfile?.login || user.name || 'gh-candidate';
          const isAdmin = isRepoHamsterAdmin(ghUsername);
          const ghId = String(account.providerAccountId);

          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name ?? undefined,
              avatarUrl: user.image ?? undefined,
              githubId: ghId,
              githubUsername: ghUsername,
              role: isAdmin ? 'ADMIN' : 'CANDIDATE',
            },
            create: {
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
              githubId: ghId,
              githubUsername: ghUsername,
              role: isAdmin ? 'ADMIN' : 'CANDIDATE',
            },
          });
        } catch (err) {
          console.error('[AUTH] Failed to upsert GitHub candidate:', err);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        const isReviewerSession = (user as any).role === 'REVIEWER' || (user as any).isReviewer === true;
        const ghUsername = ((user as any).githubUsername || (user as any).username || '').replace(/^@/, '').toLowerCase().trim();
        const isAdmin = isRepoHamsterAdmin(ghUsername);

        token.isReviewer = isReviewerSession;
        token.role = isReviewerSession ? 'REVIEWER' : (isAdmin ? 'ADMIN' : 'CANDIDATE');
        token.username = (user as any).username || (user as any).githubUsername || (user.email ? user.email.split('@')[0] : 'candidate');
        token.githubUsername = (user as any).githubUsername || (user.email ? user.email.split('@')[0] : 'candidate');
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).isReviewer = Boolean(token.isReviewer);
        (session.user as any).username = token.username as string;
        (session.user as any).githubUsername = token.githubUsername as string;
        (session.user as any).accessToken = token.accessToken as string;
      }
      (session as any).accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'debuglab-development-super-secret-key-at-least-32-chars-long',
};
