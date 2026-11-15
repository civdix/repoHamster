import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import {
  Trophy,
  Star,
  Award,
  CheckCircle2,
  ExternalLink,
  Shield,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

// ISR: Cached at Vercel Edge CDN; auto-warmed in background on PR grading events
export const revalidate = 600; // 10 minutes

export const metadata = {
  title: 'Global Developer Leaderboard | RepoHamster',
  description: 'Top software engineers ranked by real-world repository online assessment completions, automated test passes, and Repo Stars.',
};

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  githubUsername?: string | null;
  name?: string | null;
  stars: number;
  solvedCount: number;
  passingRate: number;
  badge: string;
  track: 'AI' | 'Strict' | 'Hybrid';
}

export default async function LeaderboardPage() {
  // Query candidates from database strictly based on actual evaluation submissions
  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      where: {
        role: { not: 'ADMIN' },
        AND: [
          { email: { not: { contains: 'test' } } },
          { email: { not: { contains: 'internal' } } },
          { name: { not: { contains: 'Test' } } },
          { githubUsername: { not: { contains: 'test' } } },
          { githubUsername: { not: { contains: 'bot' } } },
          { username: { not: { in: ['project-reviewer', 'test-runner-bot', 'repohamster-admin', 'test-runner'] } } },
        ],
      },
      include: {
        assignments: {
          include: {
            submissions: {
              include: { evaluation: true },
            },
          },
        },
      },
      take: 50,
    });
  } catch (err) {
    console.error('[LEADERBOARD] Database query failed:', err);
  }

  // Aggregate stats strictly from real database solvers
  const leaderboard: LeaderboardEntry[] = users
    .filter((u) => {
      const uName = (u.name || '').toLowerCase();
      const uHandle = (u.username || u.githubUsername || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      return (
        !uName.includes('test') &&
        !uName.includes('bot') &&
        !uName.includes('runner') &&
        !uHandle.includes('test') &&
        !uHandle.includes('bot') &&
        !uEmail.includes('internal') &&
        !uEmail.includes('test')
      );
    })
    .map((u) => {
      const allSubmissions = (u.assignments || []).flatMap((a: any) => a.submissions || []);
      const passedSubmissions = allSubmissions.filter((s: any) => s.evaluation?.isPassed);
      const completedAssignments = (u.assignments || []).filter(
        (ua: any) => ua.status === 'COMPLETED' || ua.submissions?.some((s: any) => s.evaluation?.isPassed)
      );
      const solved = completedAssignments.length;
      if (solved === 0) return null;

      const evaluatedSubmissions = allSubmissions.filter((s: any) => s.evaluation);
      const passingRate =
        evaluatedSubmissions.length > 0
          ? Math.round((passedSubmissions.length / evaluatedSubmissions.length) * 100)
          : 100;
      const stars = solved * 25 + passedSubmissions.length * 10;

      const username =
        u.username || u.githubUsername || u.name?.toLowerCase().replace(/\s+/g, '_') || `dev_${u.id.slice(0, 5)}`;

      return {
        rank: 0,
        id: u.id,
        username,
        githubUsername: u.githubUsername,
        name: u.name,
        stars,
        solvedCount: solved,
        passingRate,
        badge: solved >= 5 ? 'Distributed Systems Master' : solved >= 3 ? 'Distributed Systems Gold' : 'Verified Candidate',
        track: 'Hybrid' as const,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.stars - a.stars)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const top3 = leaderboard.slice(0, 3);
  const totalStarsAwarded = leaderboard.reduce((acc, e) => acc + e.stars, 0);
  const totalSolvers = leaderboard.length;
  const overallAvgPassRate =
    leaderboard.length > 0
      ? Math.round(leaderboard.reduce((acc, e) => acc + e.passingRate, 0) / leaderboard.length)
      : 0;

  return (
    <div className="min-h-screen bg-[var(--gh-bg)] bg-dev-grid text-[var(--gh-text)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header Eyebrow & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-sm border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3.5 py-1 text-xs font-mono font-bold text-[var(--amber-badge-text)] shadow-none dark:shadow-xs">
            <Trophy className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <span>GLOBAL DEVELOPER LEADERBOARD</span>
            <span className="opacity-40">•</span>
            <span>REAL EVALUATIONS ONLY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans">
            Top Engineers in Real-World Repo OAs
          </h1>
          <p className="text-sm sm:text-base text-[var(--gh-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Ranked by authenticated multi-file repository problem completions, automated hidden test passes, and verified Repo Stars.
          </p>
        </div>

        {/* Dynamic Real Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 text-left">
            <span className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase block">Total Stars Awarded</span>
            <div className="text-2xl font-bold font-mono text-[var(--yellow-bright)] mt-1 flex items-center space-x-1">
              <Star className="h-5 w-5 fill-current" />
              <span>{totalStarsAwarded}</span>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 text-left">
            <span className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase block">Ranked Developers</span>
            <div className="text-2xl font-bold font-mono text-[var(--gh-text)] mt-1">{totalSolvers}</div>
          </div>
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 text-left">
            <span className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase block">Avg. Pass Rate</span>
            <div className="text-2xl font-bold font-mono text-[#10B981] mt-1">{overallAvgPassRate}%</div>
          </div>
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 text-left">
            <span className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase block">Verification Status</span>
            <div className="text-2xl font-bold font-mono text-[var(--yellow-bright)] mt-1">Live Sandbox</div>
          </div>
        </div>

        {/* Zero State if no completed solvers yet */}
        {leaderboard.length === 0 ? (
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--yellow-bright)] shadow-none dark:shadow-md">
              <Trophy className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--gh-text)] font-sans">Leaderboard Season 1 Active</h3>
              <p className="text-xs text-[var(--gh-text-secondary)] max-w-md mx-auto leading-relaxed">
                Rankings are strictly computed from verified candidate pull requests and automated hidden test evaluations. No candidate has completed a challenge solve yet. Launch a workspace, solve the bug, and submit a PR to claim Rank #1!
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 rounded-xl bg-[var(--yellow-button-bg)] px-5 py-2.5 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-sm active:scale-95"
            >
              <span>Explore Challenges &amp; Claim Rank #1 &rarr;</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Top Podium Cards (Dynamic based on real candidate count) */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                {top3.map((entry) => (
                  <div
                    key={entry.id}
                    className={`rounded-2xl border p-6 text-center space-y-4 relative flex flex-col justify-between ${
                      entry.rank === 1
                        ? 'border-2 border-[var(--yellow-primary)] bg-[var(--amber-badge-bg)]/40 md:-translate-y-2'
                        : 'border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]'
                    }`}
                  >
                    <div className="space-y-3">
                      <span
                        className={`inline-block rounded-full font-mono text-xs px-3 py-1 font-bold ${
                          entry.rank === 1
                            ? 'bg-[var(--yellow-primary)] text-white shadow-none dark:shadow-xs'
                            : entry.rank === 2
                            ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30'
                            : 'bg-amber-700/20 text-amber-500 border border-amber-700/30'
                        }`}
                      >
                        {entry.rank === 1 ? '👑 Rank #1 • Champion' : entry.rank === 2 ? '🥈 Rank #2' : '🥉 Rank #3'}
                      </span>
                      <div className="h-14 w-14 rounded-full bg-[var(--gh-bg)] border-2 border-[var(--yellow-primary)] flex items-center justify-center mx-auto text-xl font-bold font-mono text-[var(--gh-text)]">
                        {entry.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-sans text-[var(--gh-text)]">
                          <Link href={`/u/${entry.username}`} className="hover:text-[var(--yellow-bright)] hover:underline">
                            @{entry.username}
                          </Link>
                        </h3>
                        {entry.name && <p className="text-xs text-[var(--gh-text-secondary)]">{entry.name}</p>}
                      </div>
                      <span className="text-[11px] font-mono text-[var(--yellow-bright)] block font-semibold">
                        {entry.badge}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[var(--gh-border)] flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--gh-text-muted)]">{entry.solvedCount} Repos Solved</span>
                      <span className="font-bold text-[#F59E0B] flex items-center space-x-1">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{entry.stars} Stars</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Full Table */}
            <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] overflow-hidden shadow-none dark:shadow-sm">
              <div className="p-4 sm:p-5 border-b border-[var(--gh-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[var(--gh-text)] font-sans">
                    Full Rankings
                  </h2>
                  <p className="text-xs text-[var(--gh-text-secondary)]">
                    Updated in real time upon automated Pull Request verification and test runs.
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-[var(--yellow-button-bg)] px-4 py-2 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition self-start sm:self-auto"
                >
                  <span>Solve a Repo to Rank</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[var(--gh-bg)] border-b border-[var(--gh-border)] text-[var(--gh-text-muted)] text-[11px]">
                    <tr>
                      <th className="py-3 px-4 w-16">Rank</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Specialization</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4 text-right">Pass Rate</th>
                      <th className="py-3 px-4 text-right">Repos Solved</th>
                      <th className="py-3 px-4 text-right">Stars</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--gh-border)]">
                    {leaderboard.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-[var(--gh-bg)]/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-[var(--gh-text)]">
                          {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/u/${entry.username}`}
                              className="font-bold text-[var(--gh-text)] hover:text-[var(--yellow-bright)] hover:underline"
                            >
                              @{entry.username}
                            </Link>
                            {entry.githubUsername && (
                              <span className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                                gh/{entry.githubUsername}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--gh-text-secondary)] text-[11px]">
                          {entry.badge}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border border-[var(--amber-badge-border)]">
                            Verified Sandbox
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#10B981] font-bold">
                          {entry.passingRate}%
                        </td>
                        <td className="py-3.5 px-4 text-right text-[var(--gh-text)]">
                          {entry.solvedCount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#F59E0B]">
                          <span className="inline-flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{entry.stars}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
