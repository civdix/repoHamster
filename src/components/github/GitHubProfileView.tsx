'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookMarked,
  GitPullRequest,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Award,
  Zap,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { GitHubTabs, GitHubTabType } from './GitHubTabs';
import { GitHubContributionCalendar } from './GitHubContributionCalendar';
import { GitHubRepoCard } from './GitHubRepoCard';
import { GitHubProfileSidebar } from './GitHubProfileSidebar';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface AssignmentData {
  id: string;
  status: string;
  startedAt: string | Date;
  completedAt?: string | Date | null;
  assignment: {
    id: string;
    slug: string;
    title: string;
    description: string;
    language: string;
    framework?: string;
    difficulty: string;
  };
  submissions: Array<{
    id: string;
    submittedAt: string | Date;
    evaluation?: {
      isPassed: boolean;
      score?: number;
    } | null;
    pullRequest?: {
      prUrl?: string;
      prNumber?: number;
    } | null;
  }>;
}

interface PullRequestData {
  id: string;
  prNumber: number;
  prUrl: string;
  repoFullName: string;
  branchName: string;
  state: string;
  createdAt: string | Date;
}

interface GitHubProfileViewProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    githubUsername: string | null;
    avatarUrl: string | null;
    email?: string | null;
    role: string;
    createdAt: string | Date;
  };
  assignments: AssignmentData[];
  pullRequests: PullRequestData[];
  isOwner?: boolean;
}

export function GitHubProfileView({
  user,
  assignments,
  pullRequests,
  isOwner = false,
}: GitHubProfileViewProps) {
  const [activeTab, setActiveTab] = useState<GitHubTabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const completedAssignments = assignments.filter((a) => a.status === 'COMPLETED');
  const inProgressAssignments = assignments.filter((a) => a.status === 'IN_PROGRESS');
  const allSubmissions = assignments.flatMap((a) => a.submissions);
  const passedSubmissions = allSubmissions.filter((s) => s.evaluation?.isPassed);
  const passRate =
    allSubmissions.length > 0 ? Math.round((passedSubmissions.length / allSubmissions.length) * 100) : 0;

  const stacksSolved = Array.from(
    new Set(
      completedAssignments
        .map((ca) => ca.assignment.language)
        .filter((l): l is string => Boolean(l))
    )
  );

  // Generate activities for calendar from submissions and completed assignments
  const calendarActivities = [
    ...allSubmissions.map((s) => ({ date: s.submittedAt, count: 1 })),
    ...pullRequests.map((pr) => ({ date: pr.createdAt, count: 1 })),
  ];

  // Filtered challenges for Challenges tab
  const filteredChallenges = assignments.filter((ca) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ca.assignment.title.toLowerCase().includes(q) ||
      ca.assignment.language.toLowerCase().includes(q) ||
      ca.assignment.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* GitHub 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: GitHub Profile Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20">
          <GitHubProfileSidebar
            user={user}
            isOwner={isOwner}
            stacksSolved={stacksSolved}
            stats={{
              solvedCount: completedAssignments.length,
              passRate,
              submissionsCount: allSubmissions.length,
            }}
          />
        </div>

        {/* Right Column: GitHub Navigation Tabs + Content */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <GitHubTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={{
              challenges: assignments.length,
              pullRequests: pullRequests.length,
              achievements: 4,
            }}
          />

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Pinned Challenges Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <BookMarked className="h-4 w-4 text-yellow-400" />
                  <span>Pinned Coding Challenges</span>
                </h2>
                <span className="text-[11px] font-mono text-slate-500">
                  Verified Engineering Solves
                </span>
              </div>

              {/* Pinned Challenges Grid */}
              {assignments.length === 0 ? (
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-8 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#161b22] border border-[#30363d]">
                    <HamsterMascot variant="normal" size={40} />
                  </div>
                  <h3 className="text-sm font-bold text-white">No Pinned Challenges Yet</h3>
                  <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
                    Candidate is currently gearing up to break and fix their first repository bug.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center rounded-xl bg-yellow-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(234,179,8,0.25)]"
                  >
                    Explore Challenges
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.slice(0, 6).map((ca) => {
                    const latestSub = ca.submissions[0];
                    return (
                      <GitHubRepoCard
                        key={ca.id}
                        title={ca.assignment.title}
                        slug={ca.assignment.slug}
                        description={ca.assignment.description}
                        language={ca.assignment.language}
                        difficulty={ca.assignment.difficulty}
                        isPassed={latestSub?.evaluation?.isPassed}
                        status={ca.status}
                        prUrl={latestSub?.pullRequest?.prUrl}
                      />
                    );
                  })}
                </div>
              )}

              {/* 52-Week Contribution Calendar (Yellow + Dark only) */}
              <GitHubContributionCalendar
                activities={calendarActivities}
                username={user.username || 'coder'}
              />

              {/* Contribution Activity Timeline */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Contribution Activity
                </h3>

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] divide-y divide-[#21262d] overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#422006] text-yellow-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">
                          Solved {completedAssignments.length} repository challenge{completedAssignments.length === 1 ? '' : 's'}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          Automated harness evaluation pass rate: <span className="text-yellow-400 font-bold">{passRate}%</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-yellow-400 font-bold">
                      {passedSubmissions.length} tests passed
                    </span>
                  </div>

                  {pullRequests.length > 0 && (
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#422006] text-yellow-400">
                          <GitPullRequest className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            Opened {pullRequests.length} pull request{pullRequests.length === 1 ? '' : 's'} across repositories
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">
                            Codespaces &amp; automated evaluation runner integration
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        Latest: #{pullRequests[0].prNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHALLENGES */}
          {activeTab === 'challenges' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a challenge by title, language, or concept..."
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-yellow-400 focus:outline-none font-mono"
                />
              </div>

              {filteredChallenges.length === 0 ? (
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-8 text-center text-slate-400 font-mono text-xs">
                  No challenges match your search query.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredChallenges.map((ca) => {
                    const latestSub = ca.submissions[0];
                    return (
                      <GitHubRepoCard
                        key={ca.id}
                        title={ca.assignment.title}
                        slug={ca.assignment.slug}
                        description={ca.assignment.description}
                        language={ca.assignment.language}
                        difficulty={ca.assignment.difficulty}
                        isPassed={latestSub?.evaluation?.isPassed}
                        status={ca.status}
                        prUrl={latestSub?.pullRequest?.prUrl}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PULL REQUESTS */}
          {activeTab === 'pull-requests' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {pullRequests.length === 0 ? (
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-8 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#161b22] border border-[#30363d]">
                    <GitPullRequest className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">No Pull Requests Recorded</h3>
                  <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
                    Submit code fixes through Codespaces or the PR modal to trigger automated test evaluations.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] divide-y divide-[#21262d] overflow-hidden">
                  {pullRequests.map((pr) => (
                    <div key={pr.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#161b22]/40 transition">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#422006] text-yellow-400">
                          <GitPullRequest className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-white">
                              PR #{pr.prNumber}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase font-semibold ${
                                pr.state === 'MERGED'
                                  ? 'bg-yellow-950/60 text-yellow-300 border border-yellow-700/60'
                                  : 'bg-[#21262d] text-slate-300 border border-[#30363d]'
                              }`}
                            >
                              {pr.state}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono truncate">
                            branch: {pr.branchName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 shrink-0 text-xs font-mono text-slate-400">
                        <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
                        {pr.prUrl && (
                          <a
                            href={pr.prUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-yellow-400 hover:underline flex items-center space-x-1"
                          >
                            <span>View PR</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#422006] text-yellow-400 border border-[#713f12]">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Bug Hunter</h4>
                      <p className="text-xs text-yellow-400 font-mono">Tier II Unlocked</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Awarded for resolving complex concurrency race conditions and logic bugs verified by hidden test suites.
                  </p>
                </div>

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#422006] text-yellow-400 border border-[#713f12]">
                      <Flame className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Pull Shark</h4>
                      <p className="text-xs text-yellow-400 font-mono">{pullRequests.length} Submissions</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Shipped production pull requests with atomic commits, passing GitHub Actions CI workflows.
                  </p>
                </div>

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#422006] text-yellow-400 border border-[#713f12]">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Harness Master</h4>
                      <p className="text-xs text-yellow-400 font-mono">{passRate}% Pass Rate</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Maintained high automated test accuracy against adversarial edge cases and performance timeouts.
                  </p>
                </div>

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#422006] text-yellow-400 border border-[#713f12]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Socratic Integrity</h4>
                      <p className="text-xs text-yellow-400 font-mono">AI Guardrails Adherent</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Solved challenges through first-principles debugging without full codebase AI token burning.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
