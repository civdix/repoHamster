'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Code2, Layers, CheckCircle2, EyeOff, Tag, FolderTree } from 'lucide-react';
import { AssignmentAdminCard } from './AssignmentAdminCard';
import { COMMON_LANGUAGES, parseLanguageHierarchy } from '@/lib/language-utils';

interface AssignmentAdminListProps {
  initialAssignments: any[];
  catalogRepositories?: any[];
}

export function AssignmentAdminList({ initialAssignments, catalogRepositories = [] }: AssignmentAdminListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentLang, setSelectedParentLang] = useState<string>('ALL');
  const [selectedSubType, setSelectedSubType] = useState<string>('ALL');

  // Compute parsed hierarchy for all assignments
  const parsedAssignments = useMemo(() => {
    return initialAssignments.map((a) => {
      const hierarchy = parseLanguageHierarchy(a.language, a.framework);
      return {
        ...a,
        _hierarchy: hierarchy,
      };
    });
  }, [initialAssignments]);

  // Compute counts for Parent Languages
  const parentCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: parsedAssignments.length };
    parsedAssignments.forEach((a) => {
      const parent = a._hierarchy.parent || 'Other';
      counts[parent] = (counts[parent] || 0) + 1;
    });
    return counts;
  }, [parsedAssignments]);

  const distinctParents = useMemo(() => {
    return Object.keys(parentCounts).filter((k) => k !== 'ALL');
  }, [parentCounts]);

  // Compute Sub-Repo Types available under the currently selected parent language
  const availableSubTypes = useMemo(() => {
    if (selectedParentLang === 'ALL') return [];

    const parentMeta = COMMON_LANGUAGES.find(
      (l) => l.name.toLowerCase() === selectedParentLang.toLowerCase()
    );

    // Collect standard defined subTypes
    const result: Array<{ id: string; name: string; count: number }> = [];
    const seen = new Set<string>();

    // 1. SubTypes present in actual assignments
    parsedAssignments
      .filter((a) => a._hierarchy.parent.toLowerCase() === selectedParentLang.toLowerCase())
      .forEach((a) => {
        const subId = a._hierarchy.subType;
        if (!seen.has(subId)) {
          seen.add(subId);
          const count = parsedAssignments.filter(
            (item) => item._hierarchy.subType.toLowerCase() === subId.toLowerCase()
          ).length;
          result.push({ id: subId, name: a._hierarchy.subTypeName || subId, count });
        }
      });

    // 2. Also offer common subTypes from taxonomy even if 0 count
    if (parentMeta) {
      parentMeta.subTypes.forEach((st) => {
        if (!seen.has(st.id)) {
          seen.add(st.id);
          const count = parsedAssignments.filter(
            (item) => item._hierarchy.subType.toLowerCase() === st.id.toLowerCase()
          ).length;
          result.push({ id: st.id, name: st.name, count });
        }
      });
    }

    return result;
  }, [selectedParentLang, parsedAssignments]);

  // Filter assignments based on Parent, SubType, and Search
  const filteredAssignments = useMemo(() => {
    return parsedAssignments.filter((assignment) => {
      // 1. Parent language filter
      if (selectedParentLang !== 'ALL') {
        if (assignment._hierarchy.parent.toLowerCase() !== selectedParentLang.toLowerCase()) {
          return false;
        }
      }

      // 2. Sub-repo type filter
      if (selectedSubType !== 'ALL') {
        const matchesExactSub =
          assignment._hierarchy.subType.toLowerCase() === selectedSubType.toLowerCase();
        const matchesLanguageField =
          (assignment.language || '').toLowerCase() === selectedSubType.toLowerCase();
        const matchesFramework =
          (assignment.framework || '').toLowerCase() === selectedSubType.toLowerCase();
        if (!matchesExactSub && !matchesLanguageField && !matchesFramework) {
          return false;
        }
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (assignment.title || '').toLowerCase().includes(query);
        const matchesSlug = (assignment.slug || '').toLowerCase().includes(query);
        const matchesLang = (assignment.language || '').toLowerCase().includes(query);
        const matchesParent = assignment._hierarchy.parent.toLowerCase().includes(query);
        const matchesSub = assignment._hierarchy.subType.toLowerCase().includes(query);
        const matchesFramework = (assignment.framework || '').toLowerCase().includes(query);
        const matchesRepo = (assignment.repoUrl || '').toLowerCase().includes(query);
        return (
          matchesTitle ||
          matchesSlug ||
          matchesLang ||
          matchesParent ||
          matchesSub ||
          matchesFramework ||
          matchesRepo
        );
      }

      return true;
    });
  }, [parsedAssignments, searchQuery, selectedParentLang, selectedSubType]);

  return (
    <div className="space-y-4">
      {/* Search and Language Filter Controls */}
      <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3 space-y-3">
        {/* Tier 1: Parent Language Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono text-[var(--gh-text-muted)] mr-1 shrink-0 flex items-center space-x-1">
              <FolderTree className="h-3 w-3" />
              <span>Language:</span>
            </span>

            <button
              onClick={() => {
                setSelectedParentLang('ALL');
                setSelectedSubType('ALL');
              }}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition shrink-0 ${
                selectedParentLang === 'ALL'
                  ? 'bg-[var(--yellow-primary)] text-black font-bold shadow-[var(--yellow-glow)]'
                  : 'border border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
              }`}
            >
              <span>All Languages</span>
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                {parentCounts['ALL'] || 0}
              </span>
            </button>

            {distinctParents.map((parent) => {
              const isSelected = selectedParentLang.toLowerCase() === parent.toLowerCase();
              const count = parentCounts[parent] || 0;

              return (
                <button
                  key={parent}
                  onClick={() => {
                    setSelectedParentLang(parent);
                    setSelectedSubType('ALL');
                  }}
                  className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition shrink-0 border ${
                    isSelected
                      ? 'border-[var(--yellow-primary)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold ring-1 ring-[var(--yellow-primary)]'
                      : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)]" />
                  <span>{parent}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected ? 'bg-[var(--yellow-primary)]/20' : 'bg-[var(--gh-bg-secondary)] text-[var(--gh-text-muted)]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--gh-text-muted)]" />
            <input
              type="text"
              placeholder="Search by repo, sub-type, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] pl-9 pr-4 py-1.5 text-xs font-mono text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:border-[var(--yellow-primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Tier 2: Sub-Repo Types Filter Chips */}
        {selectedParentLang !== 'ALL' && availableSubTypes.length > 0 && (
          <div className="pt-2 border-t border-[var(--gh-border)]/60 flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none animate-in fade-in duration-150">
            <span className="text-[10px] font-mono text-[var(--gh-text-muted)] mr-1 shrink-0 flex items-center space-x-1">
              <Tag className="h-3 w-3 text-[var(--yellow-bright)]" />
              <span>Sub-Repo Types under {selectedParentLang}:</span>
            </span>

            <button
              onClick={() => setSelectedSubType('ALL')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition shrink-0 border ${
                selectedSubType === 'ALL'
                  ? 'border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold'
                  : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
              }`}
            >
              All {selectedParentLang} ({parentCounts[selectedParentLang] || 0})
            </button>

            {availableSubTypes.map((st) => {
              const isSelected = selectedSubType.toLowerCase() === st.id.toLowerCase();
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedSubType(st.id)}
                  className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-[11px] font-mono transition shrink-0 border ${
                    isSelected
                      ? 'border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold ring-1 ring-[var(--yellow-primary)]'
                      : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                  }`}
                >
                  <span>{st.id}</span>
                  <span
                    className={`text-[9px] rounded-full px-1 ${
                      isSelected ? 'bg-[var(--yellow-primary)]/20 text-[var(--yellow-bright)]' : 'bg-[var(--gh-bg-secondary)] text-[var(--gh-text-muted)]'
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Status Feedback */}
      {(selectedParentLang !== 'ALL' || selectedSubType !== 'ALL' || searchQuery.trim()) && (
        <div className="flex items-center justify-between text-xs font-mono text-[var(--gh-text-secondary)] px-1">
          <span>
            Showing {filteredAssignments.length} of {initialAssignments.length} challenges
            {selectedParentLang !== 'ALL' && (
              <> under <strong className="text-[var(--gh-text)]">{selectedParentLang}</strong></>
            )}
            {selectedSubType !== 'ALL' && (
              <> (sub-repo type: <strong className="text-[var(--yellow-bright)]">{selectedSubType}</strong>)</>
            )}
            {searchQuery.trim() && <> matching &ldquo;{searchQuery}&rdquo;</>}
          </span>
          <button
            onClick={() => {
              setSelectedParentLang('ALL');
              setSelectedSubType('ALL');
              setSearchQuery('');
            }}
            className="text-[var(--yellow-bright)] hover:underline text-[11px]"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--gh-border)] p-12 text-center space-y-2">
            <Filter className="mx-auto h-8 w-8 text-[var(--gh-text-muted)]" />
            <p className="text-sm font-semibold text-[var(--gh-text)]">No repository challenges found</p>
            <p className="text-xs text-[var(--gh-text-muted)]">
              {selectedSubType !== 'ALL'
                ? `No challenges found for sub-repo type "${selectedSubType}".`
                : selectedParentLang !== 'ALL'
                ? `No challenges found for parent language "${selectedParentLang}".`
                : 'No challenges match your search.'}
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment: any) => (
            <AssignmentAdminCard
              key={assignment.id}
              assignment={assignment}
              catalogRepositories={catalogRepositories}
            />
          ))
        )}
      </div>
    </div>
  );
}
