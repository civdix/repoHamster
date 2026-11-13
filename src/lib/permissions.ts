import { NextResponse } from 'next/server';

/**
 * Normalizes and extracts GitHub username from a session
 */
export function getGithubUsername(session: any): string {
  const user = session?.user;
  const username =
    user?.githubUsername ||
    user?.username ||
    (user?.email && !user?.email.includes('@') ? user.email : user?.email?.split('@')[0]) ||
    '';
  return String(username).replace(/^@/, '').toLowerCase().trim();
}

/**
 * Checks if the authenticated session belongs strictly to the sole platform administrator (@repohamster)
 */
export function isPlatformAdmin(session: any): boolean {
  if (!session?.user) return false;
  if ((session.user as any)?.role === 'ADMIN') return true;
  const ghUsername = getGithubUsername(session);
  const adminOwner = (process.env.REPO_HAMSTER_OWNER || 'repohamster').toLowerCase().replace(/^@/, '');
  return ghUsername === 'repohamster' || ghUsername === adminOwner;
}

/**
 * Checks if the session belongs to a read-only project reviewer (authenticated via /project-review passcode)
 */
export function isReviewer(session: any): boolean {
  if (!session?.user) return false;
  const role = (session.user as any)?.role?.toUpperCase();
  return role === 'REVIEWER' || (session.user as any)?.isReviewer === true;
}

/**
 * Checks if the user is permitted to view the staff administration console
 * Allowed: The sole admin (@repohamster) OR a verified read-only project reviewer
 */
export function canViewAdmin(session: any): boolean {
  return isPlatformAdmin(session) || isReviewer(session);
}

/**
 * Helper to enforce read-only restrictions for reviewers.
 * Returns a 403 NextResponse if the user is a reviewer, or null if allowed.
 */
export function checkReviewerMutation(session: any): NextResponse | null {
  if (isReviewer(session)) {
    return NextResponse.json(
      {
        error: 'Read-only review mode: Action and modifications are disabled during project review.',
        isReviewer: true,
      },
      { status: 403 }
    );
  }
  return null;
}
