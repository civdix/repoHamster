import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role?: string | null;
      username?: string | null;
      githubUsername?: string | null;
      accessToken?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: any;
    username?: string | null;
    githubUsername?: string | null;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string | null;
    username?: string | null;
    githubUsername?: string | null;
    accessToken?: string;
  }
}
