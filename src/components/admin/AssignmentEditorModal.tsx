'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit3, X, Loader2, Layers, Trash2, CheckCircle2, Eye, EyeOff, Sparkles, GitBranch, Terminal, FolderTree, Tag } from 'lucide-react';
import { getTestCaseSummary } from '@/lib/test-case-utils';
import { COMMON_LANGUAGES, getLanguageStyle, detectLanguageFromRepo, parseLanguageHierarchy, SubRepoType } from '@/lib/language-utils';

interface AssignmentEditorModalProps {
  assignment?: any;
  isNew?: boolean;
  catalogRepositories?: any[];
}

export function AssignmentEditorModal({ assignment, isNew = false, catalogRepositories = [] }: AssignmentEditorModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<any[]>(catalogRepositories);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [detectedNotice, setDetectedNotice] = useState<string | null>(null);

  // Fetch repositories if not provided as props
  useEffect(() => {
    if (isOpen && repos.length === 0) {
      fetch('/api/admin/repositories')
        .then((res) => res.json())
        .then((data) => {
          if (data.repositories) {
            setRepos(data.repositories);
          }
        })
        .catch((err) => console.error('Failed to load repositories for selector:', err));
    }
  }, [isOpen, repos.length]);

  const initialHiddenSpecStr = assignment?.hiddenTestSpec
    ? typeof assignment.hiddenTestSpec === 'string'
      ? assignment.hiddenTestSpec
      : JSON.stringify(assignment.hiddenTestSpec, null, 2)
    : JSON.stringify(
        {
          runnerCommand: 'npm run test:hidden',
          testCases: [
            {
              id: 'HIDDEN-TC-01',
              name: 'Core Edge-Case Invariance',
              description: 'Validates boundary and exception safety',
              points: 50,
            },
            {
              id: 'HIDDEN-TC-02',
              name: 'High Concurrency Invariant Check',
              description: 'Validates race-free execution under parallel load',
              points: 50,
            },
          ],
        },
        null,
        2
      );

  const [formData, setFormData] = useState({
    slug: assignment?.slug || '',
    title: assignment?.title || '',
    description: assignment?.description || '',
    repoUrl: assignment?.repoUrl || '',
    language: assignment?.language || 'TypeScript',
    framework: assignment?.framework || 'Next.js',
    difficulty: assignment?.difficulty || 'INTERMEDIATE',
    estimatedTimeMinutes: assignment?.estimatedTimeMinutes || 45,
    passingThresholdPercent: assignment?.passingThresholdPercent || 100,
    aiRequestLimit: assignment?.aiRequestLimit || 15,
    aiTokenLimit: assignment?.aiTokenLimit || 10000,
    isActive: assignment ? assignment.isActive : true,
    instructions: assignment?.instructions || '### Problem Description\n\nDetail the bug and instructions here.',
    publicTestInfo: assignment?.publicTestInfo || '2 Public Tests: Basic unit test and validation check.',
    hiddenTestSpecStr: initialHiddenSpecStr,
  });

  const [isCustomSubtype, setIsCustomSubtype] = useState(false);
  const [customSubtypeInput, setCustomSubtypeInput] = useState('');

  const hierarchy = parseLanguageHierarchy(formData.language, formData.framework);
  const parentObj =
    COMMON_LANGUAGES.find((l) => l.name.toLowerCase() === hierarchy.parent.toLowerCase()) ||
    COMMON_LANGUAGES[0];
  const subTypes = parentObj.subTypes || [];

  const handleSelectRepo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const repoId = e.target.value;
    setSelectedRepoId(repoId);
    if (!repoId) return;

    const chosen = repos.find((r) => r.id === repoId);
    if (!chosen) return;

    const detected = detectLanguageFromRepo(chosen.originalUrl || chosen.name, repos);
    const chosenLang = chosen.language || detected.language || 'TypeScript';
    const chosenFramework = chosen.framework || detected.framework || 'Next.js';
    const chosenTitle = chosen.repoName
      ? chosen.repoName.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      : chosen.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    const chosenSlug = (chosen.repoName || chosen.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const defaultTest = detected.defaultTestCommand || 'npm test';

    setFormData((prev) => ({
      ...prev,
      repoUrl: chosen.originalUrl || prev.repoUrl,
      language: detected.subType || chosenLang,
      framework: chosenFramework,
      difficulty: chosen.difficulty || prev.difficulty,
      title: prev.title && !isNew ? prev.title : chosenTitle,
      slug: prev.slug && !isNew ? prev.slug : chosenSlug,
      description:
        prev.description && !isNew
          ? prev.description
          : chosen.description || `Assessment challenge based on ${chosen.name}`,
      publicTestInfo:
        prev.publicTestInfo && !isNew ? prev.publicTestInfo : `Run tests locally: ${defaultTest}`,
    }));

    setDetectedNotice(`⚡ Sub-Repo Type auto-configured: "${detected.subType || chosenLang}" based on repo ${chosen.name}.`);
  };

  const handleRepoUrlChange = (newUrl: string) => {
    const detected = detectLanguageFromRepo(newUrl, repos);
    setFormData((prev) => {
      const updated = { ...prev, repoUrl: newUrl };
      if (detected.source !== 'default') {
        updated.language = detected.subType;
        if (detected.framework) updated.framework = detected.framework;
        setDetectedNotice(`✨ Detected Sub-Repo Type: "${detected.subType}" from repository URL.`);
      }
      return updated;
    });
  };

  const testSummary = getTestCaseSummary({
    publicTestInfo: formData.publicTestInfo,
    hiddenTestSpec: formData.hiddenTestSpecStr,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let parsedHiddenSpec: any = null;
    try {
      parsedHiddenSpec = JSON.parse(formData.hiddenTestSpecStr);
    } catch {
      setError('Hidden Test Spec must be valid JSON.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/assignments', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assignment?.id,
          ...formData,
          hiddenTestSpec: parsedHiddenSpec,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(data.error || 'Failed to save assignment.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error saving assignment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!assignment?.id || !confirm(`Are you sure you want to delete "${formData.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/assignments?id=${assignment.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete assignment.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error deleting assignment.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {isNew ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-1.5 rounded-xl bg-[var(--yellow-primary)] px-3.5 py-2 text-xs font-bold text-black hover:bg-[var(--yellow-bright)] transition shadow-[var(--yellow-glow)] active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Repository Challenge</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] transition active:scale-95"
          title="Edit Assignment Information"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gh-bg)] border border-[var(--yellow-primary)]/40">
                  <Layers className="h-4 w-4 text-[var(--yellow-bright)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--gh-text)] text-base">
                    {isNew ? 'Connect New Debugging Repository Challenge' : 'Edit Challenge Platform Information'}
                  </h3>
                  <p className="text-xs text-[var(--gh-text-muted)] font-mono">
                    {formData.slug ? `@${formData.slug}` : 'New assessment configuration'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Test Case Count Banner (Real-time calculation) */}
              <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-[var(--gh-text-muted)] block">
                    Total Testcases Present
                  </span>
                  <div className="text-xs font-mono font-bold text-[var(--yellow-bright)] flex items-center space-x-1.5 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{testSummary.displayText}</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-[var(--gh-text-muted)]">
                  {testSummary.hasTestCases ? (
                    <span className="text-[var(--amber-badge-text)] bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2 py-0.5 rounded-full font-semibold">
                      Harness Configured
                    </span>
                  ) : (
                    <span className="text-[var(--gh-text-muted)]">Awaiting test suites</span>
                  )}
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                    Challenge Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                    Unique URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Repository Selector from Catalogue */}
              {repos.length > 0 && (
                <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--gh-text)] flex items-center space-x-1.5">
                      <GitBranch className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                      <span>Select Repository from Catalogue</span>
                    </label>
                    <span className="text-[10px] font-mono text-[var(--gh-text-muted)]">
                      {repos.length} available
                    </span>
                  </div>
                  <select
                    value={selectedRepoId}
                    onChange={handleSelectRepo}
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                  >
                    <option value="">-- Choose a repository to auto-detect language & settings --</option>
                    {repos.map((r) => {
                      const rLang = r.language || 'Multi';
                      const rName = r.name || r.repoName;
                      return (
                        <option key={r.id} value={r.id}>
                          [{rLang}] {rName} ({r.framework || 'standard'})
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-[var(--gh-text-muted)]">
                    Select any synced repository to automatically populate the primary language, framework, and test commands based on that repo.
                  </p>
                </div>
              )}

              {detectedNotice && (
                <div className="flex items-center space-x-2 rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-2 text-xs font-mono text-[var(--amber-badge-text)] animate-in fade-in">
                  <Sparkles className="h-4 w-4 shrink-0 text-[var(--yellow-bright)] animate-pulse" />
                  <span>{detectedNotice}</span>
                </div>
              )}

              {/* Repo URL */}
              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                  GitHub Repository URL (supports root repos or monorepo `/tree/main/...` paths)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/repohamster/repo-name"
                  value={formData.repoUrl}
                  onChange={(e) => handleRepoUrlChange(e.target.value)}
                  className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                />
              </div>

              {/* Hierarchical Language & Sub-Repo Type Selection */}
              <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--gh-text)] flex items-center space-x-1.5">
                    <FolderTree className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                    <span>Language & Sub-Repo Type</span>
                  </label>
                  {formData.language && (
                    <span
                      className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[var(--amber-badge-text)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)]" />
                      <span>{hierarchy.parent}</span>
                      <span className="opacity-40">/</span>
                      <span className="font-bold text-[var(--amber-badge-text)]">{formData.language}</span>
                    </span>
                  )}
                </div>

                {/* Step 1: Parent Language Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[var(--gh-text-muted)] block uppercase tracking-wider">
                    1. Parent Language:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_LANGUAGES.map((lang) => {
                      const isParentSelected =
                        hierarchy.parent.toLowerCase() === lang.name.toLowerCase();
                      return (
                        <button
                          key={lang.name}
                          type="button"
                          onClick={() => {
                            const firstSub = lang.subTypes[0];
                            const chosenSub = firstSub ? firstSub.id : `${lang.name}-Standard`;
                            const chosenFw = firstSub ? firstSub.framework : lang.defaultFramework;
                            const chosenTest = firstSub ? firstSub.defaultTestCommand : lang.defaultTestCommand;
                            setFormData({
                              ...formData,
                              language: chosenSub,
                              framework: chosenFw,
                              publicTestInfo: `Run tests locally: ${chosenTest}`,
                            });
                            setIsCustomSubtype(false);
                            setCustomSubtypeInput('');
                            setDetectedNotice(`Parent language switched to ${lang.name}. Sub-repo type set to ${chosenSub}.`);
                          }}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition border ${
                            isParentSelected
                              ? 'border-[var(--yellow-primary)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold ring-1 ring-[var(--yellow-primary)] shadow-sm'
                              : 'border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)]" />
                          <span>{lang.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Sub-Repo Types Under Selected Parent Language */}
                <div className="space-y-1.5 pt-1 border-t border-[var(--gh-border)]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--gh-text-muted)] block uppercase tracking-wider">
                      2. Sub-Repo Types under {hierarchy.parent}:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCustomSubtype(!isCustomSubtype)}
                      className="text-[10px] font-mono text-[var(--yellow-bright)] hover:underline flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{isCustomSubtype ? 'Close custom' : 'Custom sub-type (e.g. Flash)'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {subTypes.map((st) => {
                      const isSubSelected =
                        formData.language.toLowerCase() === st.id.toLowerCase() ||
                        (formData.framework.toLowerCase() === st.framework.toLowerCase() &&
                          hierarchy.parent.toLowerCase() === st.parentLanguage.toLowerCase());

                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              language: st.id,
                              framework: st.framework,
                              publicTestInfo: `Run tests locally: ${st.defaultTestCommand}`,
                            });
                            setIsCustomSubtype(false);
                            setCustomSubtypeInput('');
                            setDetectedNotice(`Sub-repo type distinctly selected: ${st.id} (${st.framework}).`);
                          }}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition border ${
                            isSubSelected
                              ? 'border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold ring-1 ring-[var(--yellow-primary)] shadow-sm'
                              : 'border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                          }`}
                        >
                          <Tag className="h-3 w-3 opacity-60" />
                          <span>{st.id}</span>
                        </button>
                      );
                    })}

                    {/* Pre-canned button for Python-Flash */}
                    {hierarchy.parent === 'Python' && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            language: 'Python-Flash',
                            framework: 'Flash / Flask',
                            publicTestInfo: 'Run tests locally: pytest',
                          });
                          setIsCustomSubtype(false);
                          setDetectedNotice('Sub-repo type selected: Python-Flash.');
                        }}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition border ${
                          formData.language === 'Python-Flash'
                            ? 'border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold ring-1 ring-[var(--yellow-primary)] shadow-sm'
                            : 'border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                        }`}
                      >
                        <Tag className="h-3 w-3 opacity-60" />
                        <span>Python-Flash</span>
                      </button>
                    )}
                  </div>

                  {/* Custom Sub-Type Input Builder */}
                  {isCustomSubtype && (
                    <div className="flex items-center space-x-2 pt-2 animate-in fade-in duration-150">
                      <span className="rounded-lg bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] px-2.5 py-1.5 text-xs font-mono font-bold text-[var(--gh-text)] shrink-0">
                        {hierarchy.parent}-
                      </span>
                      <input
                        type="text"
                        placeholder="Enter sub-repo type name (e.g. Flash, Tornado, Celery, Express)"
                        value={customSubtypeInput}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          setCustomSubtypeInput(val);
                          const combined = val ? `${hierarchy.parent}-${val}` : hierarchy.parent;
                          setFormData({
                            ...formData,
                            language: combined,
                            framework: val || formData.framework,
                          });
                        }}
                        className="flex-1 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-1.5 text-xs font-mono text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:border-[var(--yellow-primary)] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Raw Input Overrides */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--gh-border)]/60">
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--gh-text-muted)] mb-1">
                      Stored Language Identifier
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      placeholder="e.g. Python-Django"
                      className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--gh-text-muted)] mb-1">
                      Framework / Engine
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.framework}
                      onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                      placeholder="e.g. Django REST"
                      className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                />
              </div>

              {/* Numeric Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedTimeMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedTimeMinutes: parseInt(e.target.value, 10) || 45,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={formData.passingThresholdPercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passingThresholdPercent: parseFloat(e.target.value) || 100,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                    AI Request Limit
                  </label>
                  <input
                    type="number"
                    value={formData.aiRequestLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aiRequestLimit: parseInt(e.target.value, 10) || 15,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                  Candidate Problem Instructions (Markdown)
                </label>
                <textarea
                  rows={4}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2 text-xs text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                />
              </div>

              {/* Public Test Information */}
              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                  Public Test Details
                </label>
                <textarea
                  rows={2}
                  value={formData.publicTestInfo}
                  onChange={(e) => setFormData({ ...formData, publicTestInfo: e.target.value })}
                  className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                />
              </div>

              {/* AI Token Limit */}
              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                  AI Token Limit (Total tokens per candidate session)
                </label>
                <input
                  type="number"
                  value={formData.aiTokenLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, aiTokenLimit: parseInt(e.target.value, 10) || 10000 })
                  }
                  className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                />
              </div>

              {/* Hidden Test Suite Spec JSON */}
              <div>
                <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
                  Authoritative Hidden Test Suite Specification (JSON)
                </label>
                <textarea
                  rows={4}
                  value={formData.hiddenTestSpecStr}
                  onChange={(e) => setFormData({ ...formData, hiddenTestSpecStr: e.target.value })}
                  className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                />
              </div>

              {/* Visibility / Hide Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    {formData.isActive ? (
                      <Eye className="h-4 w-4 text-[var(--yellow-bright)]" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-[var(--gh-text-muted)]" />
                    )}
                    <span className="text-xs font-bold text-[var(--gh-text)]">
                      {formData.isActive ? 'Active (Visible on Candidate Dashboard)' : 'Hidden (Staff Only)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--gh-text-muted)]">
                    {formData.isActive
                      ? 'Candidates can view, clone, and launch this challenge.'
                      : 'This challenge is hidden from candidates but remains editable by staff.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold font-mono transition active:scale-95 ${
                    formData.isActive
                      ? 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                      : 'border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)]'
                  }`}
                >
                  {formData.isActive ? 'Hide Challenge' : 'Unhide Challenge'}
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] p-2.5 text-xs text-[var(--amber-badge-text)]">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[var(--gh-border)] pt-4">
                <div>
                  {!isNew && assignment?.id && (
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="flex items-center space-x-1.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-semibold text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] transition active:scale-95"
                    >
                      {deleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span>Delete Challenge</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-2 text-xs font-medium text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] transition active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-1.5 rounded-xl bg-[var(--yellow-primary)] px-4 py-2 text-xs font-bold text-black hover:bg-[var(--yellow-bright)] transition disabled:opacity-50 shadow-[var(--yellow-glow)] active:scale-95"
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Save Challenge</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
