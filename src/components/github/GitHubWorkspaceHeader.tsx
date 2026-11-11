'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookMarked,
  Code2,
  CheckCircle2,
  GitPullRequest,
  Star,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { CodespacesLaunchModal } from '@/components/assignments/CodespacesLaunchModal';
import { SubmitPRModal } from '@/components/assignments/SubmitPRModal';

export type WorkspaceTab = 'code' | 'tests' | 'pull-requests' | 'guardrails';

interface GitHubWorkspaceHeaderProps {
  assignment: {
    id: string;
    slug: string;
    title: string;
    repoUrl: string;
    baseBranch: string;
    language: string;
    framework?: string;
    difficulty: string;
  };
  isCompleted: boolean;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  candidateGithubUsername?: string;
  starsCount?: number;
}

export function GitHubWorkspaceHeader({
  assignment,
  isCompleted,
  activeTab,
  onTabChange,
  candidateGithubUsername,
  starsCount = 28,
}: GitHubWorkspaceHeaderProps) {
  const [starred, setStarred] = useState(false);
  const [stars, setStars] = useState(starsCount);

  const toggleStar = () => {
    if (starred) {
      setStarred(false);
      setStars((s) => s - 1);
    } else {
      setStarred(true);
      setStars((s) => s + 1);
    }
  };

  return (
    <div className="border-b border-[var(--gh-border)] bg-[var(--gh-bg)] pt-4 text-[var(--gh-text)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top Breadcrumb & GitHub Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Breadcrumb: repohamster / slug */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <BookMarked className="h-5 w-5 text-[var(--yellow-bright)] shrink-0" />
            <div className="flex items-baseline space-x-1.5 text-base sm:text-lg min-w-0">
              <span className="text-[var(--gh-text-muted)] font-mono">repohamster</span>
              <span className="text-[var(--gh-text-dim)]">/</span>
              <span className="font-bold text-white truncate font-mono">
                {assignment.slug}
              </span>
            </div>
            <span className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-0.5 text-[11px] font-mono text-[var(--gh-text-muted)] shrink-0">
              Public
            </span>
            {isCompleted ? (
              <span className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[var(--amber-badge-text)] shrink-0 flex items-center">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                PASSED
              </span>
            ) : (
              <span className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--gh-text-muted)] shrink-0 flex items-center">
                <Clock className="mr-1 h-3 w-3 text-[var(--yellow-primary)]" />
                In Progress
              </span>
            )}
          </div>

          {/* GitHub Header Action Buttons (Yellow + Dark Theme) */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            {/* Star Button */}
            <button
              onClick={toggleStar}
              className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                starred
                  ? 'border-[var(--yellow-primary)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] shadow-[var(--yellow-glow)]'
                  : 'border-[var(--gh-border)] bg-[var(--gh-bg-tertiary)] text-[var(--gh-text-muted)] hover:text-white hover:border-[var(--gh-border-subtle)]'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${starred ? 'fill-[var(--yellow-bright)] text-[var(--yellow-bright)]' : 'text-[var(--gh-text-dim)]'}`} />
              <span>{starred ? 'Starred' : 'Star'}</span>
              <span className="border-l border-[var(--gh-border)] pl-1.5 ml-1 text-[var(--gh-text-muted)] font-mono text-[11px]">
                {stars}
              </span>
            </button>

            {/* Submit PR Button Modal */}
            <SubmitPRModal
              assignmentId={assignment.id}
              assignmentSlug={assignment.slug}
              repoUrl={assignment.repoUrl}
              candidateGithubUsername={candidateGithubUsername}
            />

            {/* Primary <> Code Codespaces Button Modal (Golden Yellow) */}
            <CodespacesLaunchModal
              repoUrl={assignment.repoUrl}
              assignmentTitle={assignment.title}
              assignmentId={assignment.id}
              candidateGithubUsername={candidateGithubUsername}
            />
          </div>
        </div>

        {/* GitHub Repository Tabs Strip */}
        <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar pt-2">
          <button
            onClick={() => onTabChange('code')}
            className={`flex items-center space-x-2 py-2.5 px-2 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-[var(--yellow-bright)] text-white font-semibold'
                : 'border-transparent text-[var(--gh-text-muted)] hover:text-slate-200 hover:border-[var(--gh-border)]'
            }`}
          >
            <Code2 className={`h-4 w-4 ${activeTab === 'code' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-dim)]'}`} />
            <span>Code &amp; Problem</span>
          </button>

          <button
            onClick={() => onTabChange('tests')}
            className={`flex items-center space-x-2 py-2.5 px-2 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'tests'
                ? 'border-[var(--yellow-bright)] text-white font-semibold'
                : 'border-transparent text-[var(--gh-text-muted)] hover:text-slate-200 hover:border-[var(--gh-border)]'
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${activeTab === 'tests' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-dim)]'}`} />
            <span>Tests &amp; Evaluation</span>
          </button>

          <button
            onClick={() => onTabChange('pull-requests')}
            className={`flex items-center space-x-2 py-2.5 px-2 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'pull-requests'
                ? 'border-[var(--yellow-bright)] text-white font-semibold'
                : 'border-transparent text-[var(--gh-text-muted)] hover:text-slate-200 hover:border-[var(--gh-border)]'
            }`}
          >
            <GitPullRequest className={`h-4 w-4 ${activeTab === 'pull-requests' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-dim)]'}`} />
            <span>Pull Requests</span>
          </button>

          <button
            onClick={() => onTabChange('guardrails')}
            className={`flex items-center space-x-2 py-2.5 px-2 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'guardrails'
                ? 'border-[var(--yellow-bright)] text-white font-semibold'
                : 'border-transparent text-[var(--gh-text-muted)] hover:text-slate-200 hover:border-[var(--gh-border)]'
            }`}
          >
            <ShieldCheck className={`h-4 w-4 ${activeTab === 'guardrails' ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-dim)]'}`} />
            <span>AI Guardrails</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
