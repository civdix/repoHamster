'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  ExternalLink,
  ShieldCheck,
  Zap,
  FolderTree,
  Terminal,
  Scale,
  Sparkles,
} from 'lucide-react';
import { CatalogueDetailModal } from './CatalogueDetailModal';
import { getLanguageStyle, parseLanguageHierarchy } from '@/lib/language-utils';

interface CatalogueRepositoryListProps {
  initialRepositories: any[];
}

export function CatalogueRepositoryList({ initialRepositories }: CatalogueRepositoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');

  // Compute distinct language counts
  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialRepositories.length };
    initialRepositories.forEach((repo) => {
      const rawLang = repo.language || 'Unspecified';
      let cat = rawLang;
      const lower = rawLang.toLowerCase();
      if (lower.includes('typescript')) cat = 'TypeScript';
      else if (lower.includes('javascript')) cat = 'JavaScript';
      else if (lower.includes('python')) cat = 'Python';
      else if (lower.includes('java') && !lower.includes('javascript')) cat = 'Java';
      else if (lower.includes('go')) cat = 'Go';
      else if (lower.includes('multi')) cat = 'Multi-Language';

      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [initialRepositories]);

  const distinctLanguages = useMemo(() => {
    return Object.keys(languageCounts).filter((k) => k !== 'ALL');
  }, [languageCounts]);

  const filteredRepositories = useMemo(() => {
    return initialRepositories.filter((repo) => {
      // Status filter
      if (selectedStatus !== 'ALL' && repo.importStatus !== selectedStatus) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== 'ALL') {
        const lowerLang = (repo.language || '').toLowerCase();
        const lowerSelected = selectedLanguage.toLowerCase();
        if (!lowerLang.includes(lowerSelected)) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(query);
        const matchesLang = repo.language.toLowerCase().includes(query);
        const matchesFramework = repo.framework.toLowerCase().includes(query);
        const matchesDesc = repo.description.toLowerCase().includes(query);
        const matchesCategory = repo.category.toLowerCase().includes(query);
        return matchesName || matchesLang || matchesFramework || matchesDesc || matchesCategory;
      }

      return true;
    });
  }, [initialRepositories, searchQuery, selectedStatus, selectedLanguage]);

  const counts = useMemo(() => {
    return {
      all: initialRepositories.length,
      ready: initialRepositories.filter((r) => r.importStatus === 'READY_FOR_TESTING').length,
      inspected: initialRepositories.filter((r) => r.importStatus === 'INSPECTED').length,
      needsConfig: initialRepositories.filter((r) => r.importStatus === 'NEEDS_CONFIGURATION').length,
      notCompatible: initialRepositories.filter((r) => r.importStatus === 'NOT_COMPATIBLE').length,
    };
  }, [initialRepositories]);

  return (
    <div className="space-y-6">
      {/* Controls: Search and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition shrink-0 ${
              selectedStatus === 'ALL'
                ? 'bg-[var(--yellow-primary)] text-black font-bold shadow-[var(--yellow-glow)]'
                : 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
            }`}
          >
            All Repositories ({counts.all})
          </button>

          <button
            onClick={() => setSelectedStatus('READY_FOR_TESTING')}
            className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition shrink-0 ${
              selectedStatus === 'READY_FOR_TESTING'
                ? 'bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--amber-badge-text)] font-bold'
                : 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--yellow-bright)]'
            }`}
          >
            Ready for Testing ({counts.ready})
          </button>

          <button
            onClick={() => setSelectedStatus('INSPECTED')}
            className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition shrink-0 ${
              selectedStatus === 'INSPECTED'
                ? 'bg-[var(--gh-bg)] border border-[var(--yellow-primary)] text-[var(--yellow-bright)] font-bold'
                : 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
            }`}
          >
            Inspected ({counts.inspected})
          </button>

          <button
            onClick={() => setSelectedStatus('NEEDS_CONFIGURATION')}
            className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition shrink-0 ${
              selectedStatus === 'NEEDS_CONFIGURATION'
                ? 'bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--amber-badge-text)] font-bold'
                : 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
            }`}
          >
            Needs Config ({counts.needsConfig})
          </button>

          <button
            onClick={() => setSelectedStatus('NOT_COMPATIBLE')}
            className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition shrink-0 ${
              selectedStatus === 'NOT_COMPATIBLE'
                ? 'bg-[var(--gh-bg)] border border-[var(--gh-border-active)] text-[var(--gh-text-muted)] font-bold'
                : 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]'
            }`}
          >
            Not Compatible ({counts.notCompatible})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--gh-text-muted)]" />
          <input
            type="text"
            placeholder="Search by name, framework, or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] pl-9 pr-4 py-1.5 text-xs font-mono text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:border-[var(--yellow-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Language Filter Chips (Distinct Selection by Language) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-mono text-[var(--gh-text-muted)] mr-1 shrink-0">Language:</span>
        <button
          onClick={() => setSelectedLanguage('ALL')}
          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition shrink-0 border ${
            selectedLanguage === 'ALL'
              ? 'border-[var(--yellow-primary)] bg-[var(--yellow-primary)] text-black font-bold'
              : 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
          }`}
        >
          <span>All ({languageCounts['ALL'] || 0})</span>
        </button>

        {distinctLanguages.map((lang) => {
          const isSelected = selectedLanguage === lang;
          const count = languageCounts[lang] || 0;

          return (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-mono transition shrink-0 border ${
                isSelected
                  ? 'border-[var(--yellow-primary)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold ring-1 ring-[var(--yellow-primary)]'
                  : 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)]" />
              <span>{lang}</span>
              <span className={`text-[10px] rounded-full px-1 ${isSelected ? 'bg-[var(--yellow-primary)]/20' : 'bg-[var(--gh-bg)] text-[var(--gh-text-muted)]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRepositories.length === 0 ? (
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-12 text-center space-y-2">
            <Filter className="mx-auto h-8 w-8 text-[var(--gh-text-muted)]" />
            <p className="text-sm font-semibold text-[var(--gh-text)]">No repositories match your filter</p>
            <p className="text-xs text-[var(--gh-text-muted)]">Try adjusting your search query, status, or language filter.</p>
          </div>
        ) : (
          filteredRepositories.map((repo) => {
            const isReady = repo.importStatus === 'READY_FOR_TESTING';
            const isCloned = !!repo.localPath;
            const hasAssignment = repo.assignments && repo.assignments.length > 0;
            const hierarchy = parseLanguageHierarchy(repo.language, repo.framework);

            return (
              <div
                key={repo.id}
                className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 hover:border-[var(--gh-border-active)] transition space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 font-mono">
                      {/* Distinct Parent Language & Sub-Repo Type Badge */}
                      <span className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--amber-badge-text)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)]" />
                        <span>{hierarchy.parent}</span>
                        <span className="opacity-40">/</span>
                        <span className="font-bold text-[var(--amber-badge-text)]">{hierarchy.subType}</span>
                      </span>
                      <span className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 text-[11px] text-[var(--gh-text-secondary)]">
                        {repo.framework}
                      </span>
                      <span className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2 py-0.5 text-[10px] text-[var(--amber-badge-text)] uppercase font-semibold">
                        {repo.category}
                      </span>
                      <span className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2 py-0.5 text-[10px] text-[var(--gh-text-muted)]">
                        {repo.difficulty}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          repo.importStatus === 'READY_FOR_TESTING'
                            ? 'border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)]'
                            : repo.importStatus === 'INSPECTED'
                            ? 'border border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text)]'
                            : 'border border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-muted)]'
                        }`}
                      >
                        {repo.importStatus}
                      </span>

                      {/* Commercial License Badge */}
                      <span
                        className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2 py-0.5 text-[10px] flex items-center space-x-1 text-[var(--amber-badge-text)]"
                      >
                        <Scale className="h-3 w-3" />
                        <span>{repo.license}</span>
                      </span>

                      {/* Active Challenge Link */}
                      {hasAssignment && (
                        <Link
                          href={`/assignments/${repo.assignments[0].slug}`}
                          className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] text-[var(--yellow-bright)] font-bold flex items-center space-x-1 hover:underline"
                        >
                          <Zap className="h-3 w-3 text-[var(--yellow-bright)]" />
                          <span>Active Challenge: {repo.assignments[0].slug}</span>
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-[var(--gh-text)] tracking-tight">{repo.name}</h3>
                      <a
                        href={repo.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] transition"
                        title="Open GitHub source"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed max-w-3xl">
                      {repo.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-[var(--gh-text-muted)] pt-1">
                      <span>Source: <strong className="text-[var(--gh-text-secondary)]">{repo.sourceType}</strong></span>
                      <span>•</span>
                      <span>Readiness: <strong className="text-[var(--yellow-bright)]">{repo.evaluationReadiness}</strong></span>
                      <span>•</span>
                      <span>Tests: <strong className="text-[var(--gh-text-secondary)]">{repo.testAvailability}</strong></span>
                      <span>•</span>
                      <span>Workspace: <strong className={isCloned ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-muted)]'}>{isCloned ? 'Cloned Locally' : 'Remote Public'}</strong></span>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--gh-border)]/60">
                    <CatalogueDetailModal repo={repo} />

                    <a
                      href={repo.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-1 text-xs font-mono text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
