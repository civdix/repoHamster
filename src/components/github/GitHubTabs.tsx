'use client';

import { BookOpen, BookMarked, GitPullRequest, Award } from 'lucide-react';

export type GitHubTabType = 'overview' | 'challenges' | 'pull-requests' | 'achievements';

interface GitHubTabsProps {
  activeTab: GitHubTabType;
  onTabChange: (tab: GitHubTabType) => void;
  counts?: {
    challenges?: number;
    pullRequests?: number;
    achievements?: number;
  };
}

export function GitHubTabs({ activeTab, onTabChange, counts }: GitHubTabsProps) {
  const tabs: Array<{ id: GitHubTabType; label: string; icon: any; count?: number }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BookOpen,
    },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: BookMarked,
      count: counts?.challenges ?? 0,
    },
    {
      id: 'pull-requests',
      label: 'Pull Requests',
      icon: GitPullRequest,
      count: counts?.pullRequests ?? 0,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      count: counts?.achievements ?? 4,
    },
  ];

  return (
    <div className="border-b border-[#30363d] bg-[#0d1117] px-2 sm:px-4 mb-6">
      <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-3 px-3 border-b-2 text-xs sm:text-sm font-medium transition whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'border-yellow-400 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-yellow-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                    isActive
                      ? 'bg-yellow-950/80 text-yellow-300 border border-yellow-700/60 font-bold'
                      : 'bg-[#21262d] text-slate-400 border border-[#30363d]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
