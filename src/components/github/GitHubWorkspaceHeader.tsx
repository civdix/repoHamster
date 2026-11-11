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
    <div className="border-b border-[#30363d] bg-[#0d1117] pt-4 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top Breadcrumb & GitHub Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Breadcrumb: repohamster / slug */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <BookMarked className="h-5 w-5 text-yellow-400 shrink-0" />
            <div className="flex items-baseline space-x-1.5 text-base sm:text-lg min-w-0">
              <span className="text-slate-400 font-mono">repohamster</span>
              <span className="text-slate-500">/</span>
              <span className="font-bold text-white truncate font-mono">
                {assignment.slug}
              </span>
            </div>
            <span className="rounded-full border border-[#30363d] bg-[#161b22] px-2.5 py-0.5 text-[11px] font-mono text-slate-400 shrink-0">
              Public
            </span>
            {isCompleted ? (
              <span className="rounded-full border border-yellow-600/50 bg-yellow-950/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-yellow-400 shrink-0 flex items-center">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                PASSED
              </span>
            ) : (
              <span className="rounded-full border border-[#30363d] bg-[#161b22] px-2.5 py-0.5 text-[10px] font-mono text-slate-400 shrink-0 flex items-center">
                <Clock className="mr-1 h-3 w-3 text-yellow-500" />
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
                  ? 'border-yellow-500/80 bg-yellow-950/60 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.25)]'
                  : 'border-[#30363d] bg-[#21262d] text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${starred ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} />
              <span>{starred ? 'Starred' : 'Star'}</span>
              <span className="border-l border-[#30363d] pl-1.5 ml-1 text-slate-400 font-mono text-[11px]">
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
                ? 'border-yellow-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <Code2 className={`h-4 w-4 ${activeTab === 'code' ? 'text-yellow-400' : 'text-slate-500'}`} />
            <span>Code &amp; Problem</span>
          </button>

          <button
            onClick={() => onTabChange('tests')}
            className={`flex items-center space-x-2 py-2.5 px-2 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'tests'
                ? 'border-yellow-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${activeTab === 'tests' ? 'text-yellow-400' : 'text-slate-500'}`} />
            <span>Tests &amp; Evaluation</span>
          </button>

          <button
            onClick={() => onTabChange('pull-requests')}
            className={`flex items-center space-x-2 py-2.5 px-2 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'pull-requests'
                ? 'border-yellow-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <GitPullRequest className={`h-4 w-4 ${activeTab === 'pull-requests' ? 'text-yellow-400' : 'text-slate-500'}`} />
            <span>Pull Requests</span>
          </button>

          <button
            onClick={() => onTabChange('guardrails')}
            className={`flex items-center space-x-2 py-2.5 px-2 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              activeTab === 'guardrails'
                ? 'border-yellow-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <ShieldCheck className={`h-4 w-4 ${activeTab === 'guardrails' ? 'text-yellow-400' : 'text-slate-500'}`} />
            <span>AI Guardrails</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
