'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Filter, BookMarked } from 'lucide-react';
import { ChallengeCard } from './ChallengeCard';

interface ChallengeExplorerProps {
  assignments: any[];
  statusMap: Record<string, { status: string; latestEvaluation?: any; candidateAssignmentId?: string }>;
}

export function ChallengeExplorer({ assignments, statusMap }: ChallengeExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');

  // Collect unique languages
  const languages = useMemo(() => {
    const set = new Set<string>();
    assignments.forEach((a) => {
      if (a.language) set.add(a.language);
    });
    return Array.from(set).sort();
  }, [assignments]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = a.title?.toLowerCase().includes(query);
        const matchesDesc = a.description?.toLowerCase().includes(query);
        const matchesLang = a.language?.toLowerCase().includes(query);
        const matchesFramework = a.framework?.toLowerCase().includes(query);
        const matchesSlug = a.slug?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLang && !matchesFramework && !matchesSlug) {
          return false;
        }
      }

      // Difficulty matching
      if (selectedDifficulty !== 'ALL' && a.difficulty?.toUpperCase() !== selectedDifficulty) {
        return false;
      }

      // Language matching
      if (selectedLanguage !== 'ALL' && a.language?.toLowerCase() !== selectedLanguage.toLowerCase()) {
        return false;
      }

      // Status matching
      const tracking = statusMap[a.id];
      const status = tracking?.status || 'NOT_STARTED';
      if (selectedStatus === 'COMPLETED' && status !== 'COMPLETED') return false;
      if (selectedStatus === 'IN_PROGRESS' && status !== 'IN_PROGRESS') return false;
      if (selectedStatus === 'AVAILABLE' && status === 'COMPLETED') return false;

      return true;
    });
  }, [assignments, statusMap, searchQuery, selectedDifficulty, selectedLanguage, selectedStatus]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedDifficulty !== 'ALL' ||
    selectedLanguage !== 'ALL' ||
    selectedStatus !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('ALL');
    setSelectedLanguage('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar & Filter Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gh-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search challenges by title, language (Python, Go, Java), or framework..."
            className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] pl-9 pr-8 py-2 text-xs font-mono text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:border-[var(--yellow-primary)] focus:outline-none transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="text-xs font-mono text-[var(--gh-text-muted)] shrink-0 self-center sm:self-auto">
          Showing <span className="font-bold text-[var(--gh-text)]">{filteredAssignments.length}</span> of {assignments.length} challenges
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
        {/* Status Filters */}
        <button
          type="button"
          onClick={() => setSelectedStatus('ALL')}
          className={`px-2.5 py-1 rounded-lg transition font-semibold text-[11px] ${
            selectedStatus === 'ALL'
              ? 'bg-[var(--yellow-primary)] text-white shadow-2xs'
              : 'bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus('AVAILABLE')}
          className={`px-2.5 py-1 rounded-lg transition font-semibold text-[11px] ${
            selectedStatus === 'AVAILABLE'
              ? 'bg-[var(--yellow-primary)] text-white shadow-2xs'
              : 'bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
          }`}
        >
          Available
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus('IN_PROGRESS')}
          className={`px-2.5 py-1 rounded-lg transition font-semibold text-[11px] ${
            selectedStatus === 'IN_PROGRESS'
              ? 'bg-[var(--yellow-primary)] text-white shadow-2xs'
              : 'bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
          }`}
        >
          In Progress
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus('COMPLETED')}
          className={`px-2.5 py-1 rounded-lg transition font-semibold text-[11px] ${
            selectedStatus === 'COMPLETED'
              ? 'bg-[var(--yellow-primary)] text-white shadow-2xs'
              : 'bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
          }`}
        >
          Passed ✓
        </button>

        <span className="text-[var(--gh-border)] mx-1">|</span>

        {/* Language Filter Dropdown / Chips */}
        {languages.slice(0, 5).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setSelectedLanguage(selectedLanguage === lang ? 'ALL' : lang)}
            className={`px-2.5 py-1 rounded-lg transition font-semibold text-[11px] ${
              selectedLanguage === lang
                ? 'bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--amber-badge-text)] font-bold'
                : 'bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
            }`}
          >
            {lang}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto text-[11px] text-[var(--yellow-bright)] hover:underline flex items-center space-x-1"
          >
            <X className="h-3 w-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Challenges Grid (2-column inside the left major pane) */}
      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => {
            const tracking = statusMap[assignment.id];
            const status = tracking?.status || 'NOT_STARTED';
            const evaluation = tracking?.latestEvaluation;

            return (
              <ChallengeCard
                key={assignment.id}
                assignment={assignment}
                status={status}
                evaluation={evaluation}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-10 text-center space-y-3 font-mono">
          <BookMarked className="h-8 w-8 text-[var(--gh-text-dim)] mx-auto" />
          <h4 className="text-sm font-bold text-[var(--gh-text)]">No matching challenges found</h4>
          <p className="text-xs text-[var(--gh-text-muted)] max-w-sm mx-auto">
            Try adjusting your search terms or clearing your language/status filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-4 py-1.5 text-xs font-semibold text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
