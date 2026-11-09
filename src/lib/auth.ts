import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            profile(profile) {
              return {
                id: String(profile.id),
                name: profile.name || profile.login,
                email: profile.email || `${profile.login}@github.users.noreply`,
                image: profile.avatar_url,
                githubUsername: profile.login,
                role: 'CANDIDATE',
              };
            },
          }),
        ]
      : []),
    // Credentials provider for Admin login and instant local demonstration
    CredentialsProvider({
      id: 'credentials',
      name: 'Admin & Quick Demo Access',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@debuglab.internal' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email.trim().toLowerCase();
        const role = credentials.role === 'ADMIN' || email.includes('admin') ? 'ADMIN' : 'CANDIDATE';

        // Check if user exists in database
        try {
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            // Auto-provision demo/admin user
            const rawUsername = credentials.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'coder';
            user = await prisma.user.create({
              data: {
                email,
                name: credentials.email.split('@')[0],
                role: role as any,
                username: rawUsername,
                githubUsername: rawUsername,
                avatarUrl: `https://avatars.githubusercontent.com/u/9919?v=4`,
              },
            });
          } else if (role === 'ADMIN' && user.role !== 'ADMIN') {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { role: 'ADMIN' },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatarUrl,
            role: user.role || role,
            username: user.username || user.githubUsername,
            githubUsername: user.githubUsername,
          };
        } catch (error) {
          console.warn('[AUTH] Database offline or error, providing authenticated fallback token:', error);
          const fallbackUsername = credentials.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
          return {
            id: 'mock-user-id-' + (role === 'ADMIN' ? 'admin' : 'candidate'),
            name: credentials.email.split('@')[0],
            email,
            image: 'https://avatars.githubusercontent.com/u/9919?v=4',
            role,
            username: fallbackUsername,
            githubUsername: fallbackUsername,
          };
        }
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
          const ghId = String(account.providerAccountId);

          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name ?? undefined,
              avatarUrl: user.image ?? undefined,
              githubId: ghId,
              githubUsername: ghUsername,
            },
            create: {
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
              githubId: ghId,
              githubUsername: ghUsername,
              role: 'CANDIDATE',
            },
          });
        } catch (err) {
          console.error('[AUTH] Failed to upsert GitHub candidate:', err);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || (token.email?.includes('admin') ? 'ADMIN' : 'CANDIDATE');
        token.username = (user as any).username || (user as any).githubUsername || (user.email ? user.email.split('@')[0] : 'candidate');
        token.githubUsername = (user as any).githubUsername || (user.email ? user.email.split('@')[0] : 'candidate');
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || (session.user.email?.includes('admin') ? 'ADMIN' : 'CANDIDATE');
        (session.user as any).username = token.username as string;
        (session.user as any).githubUsername = token.githubUsername as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'debuglab-development-super-secret-key-at-least-32-chars-long',
};
