'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileCode2,
  FolderTree,
  ShieldCheck,
  Zap,
  ExternalLink,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Terminal,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileNode[];
}

interface CatalogueDetailModalProps {
  repo: any;
}

export function CatalogueDetailModal({ repo: initialRepo }: CatalogueDetailModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [repo, setRepo] = useState(initialRepo);
  const [activeTab, setActiveTab] = useState<'INSPECTION' | 'VALIDATION' | 'EXPLORER' | 'CONVERT'>('INSPECTION');

  // Loading states
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // File explorer states
  const [treeData, setTreeData] = useState<FileNode[] | null>(null);
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  // Parse inspection and validation reports
  let inspection: any = {};
  try {
    inspection = typeof repo.inspectionReport === 'string' ? JSON.parse(repo.inspectionReport) : repo.inspectionReport || {};
  } catch {}

  let validation: any = null;
  try {
    validation = repo.validationResult ? (typeof repo.validationResult === 'string' ? JSON.parse(repo.validationResult) : repo.validationResult) : null;
  } catch {}

  // Convert form prefill
  const defaultSlug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const defaultTitle = repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  const [convertForm, setConvertForm] = useState({
    title: defaultTitle,
    slug: defaultSlug,
    difficulty: repo.difficulty || 'INTERMEDIATE',
    estimatedTimeMinutes: 45,
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
    instructions: `### Debugging Challenge: ${defaultTitle}\n\n#### Overview\nThis challenge is sourced from the open-source repository \`${repo.originalUrl}\`.\n\n#### Your Task\n1. Analyze the project structure and public test suites.\n2. Diagnose intentionally introduced defects in the codebase.\n3. Implement the bug fix while preserving regression safety.\n4. Ensure all public and authoritative hidden test suites pass.`,
  });

  const handleRunValidation = async () => {
    setIsValidating(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/catalogue/${repo.id}/validate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRepo((prev: any) => ({
          ...prev,
          validationResult: JSON.stringify(data.validation),
          importStatus: data.validation.recommendedStatus,
        }));
        setStatusMessage({ text: 'Compatibility validation finished successfully!', type: 'success' });
        router.refresh();
      } else {
        setStatusMessage({ text: data.error || 'Validation failed.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Validation request failed.', type: 'error' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleImportClone = async () => {
    setIsImporting(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/catalogue/${repo.id}/import`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRepo((prev: any) => ({
          ...prev,
          localPath: data.localPath,
        }));
        setStatusMessage({ text: 'Repository cloned into local workspace successfully!', type: 'success' });
        router.refresh();
      } else {
        setStatusMessage({ text: data.error || 'Clone operation failed.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Clone request failed.', type: 'error' });
    } finally {
      setIsImporting(false);
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConverting(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/catalogue/${repo.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(convertForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ text: 'Created assignment successfully!', type: 'success' });
        router.push(`/admin/assignments`);
      } else {
        setStatusMessage({ text: data.error || 'Conversion failed.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Convert request failed.', type: 'error' });
    } finally {
      setIsConverting(false);
    }
  };

  const loadTree = async () => {
    setIsLoadingTree(true);
    try {
      const res = await fetch(`/api/catalogue/${repo.id}/tree`);
      const data = await res.json();
      if (res.ok && data.tree) {
        setTreeData(data.tree);
        // Expand root by default
        const initFolders: Record<string, boolean> = {};
        data.tree.forEach((node: FileNode) => {
          if (node.type === 'directory') initFolders[node.path] = true;
        });
        setOpenFolders(initFolders);
      }
    } catch (err) {
      console.error('Error loading tree:', err);
    } finally {
      setIsLoadingTree(false);
    }
  };

  const handleOpenFile = async (filePath: string) => {
    setSelectedFile(filePath);
    setIsLoadingFile(true);
    try {
      const res = await fetch(`/api/catalogue/${repo.id}/file?path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (res.ok && data.content !== undefined) {
        setFileContent(data.content);
      } else {
        setFileContent('Error loading file: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      setFileContent('Error loading file: ' + err.message);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return (
      <div className="space-y-0.5">
        {nodes.map((node) => {
          const isDir = node.type === 'directory';
          const isFolderOpen = !!openFolders[node.path];
          const isSelected = selectedFile === node.path;

          return (
            <div key={node.path}>
              <div
                onClick={() => {
                  if (isDir) {
                    toggleFolder(node.path);
                  } else {
                    handleOpenFile(node.path);
                  }
                }}
                style={{ paddingLeft: `${depth * 14 + 8}px` }}
                className={`flex items-center space-x-1.5 py-1 pr-2 rounded text-xs font-mono cursor-pointer transition select-none ${
                  isSelected
                    ? 'bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold'
                    : 'text-[var(--gh-text-secondary)] hover:bg-[var(--gh-bg)] hover:text-[var(--gh-text)]'
                }`}
              >
                {isDir ? (
                  <>
                    {isFolderOpen ? (
                      <ChevronDown className="h-3 w-3 text-[var(--gh-text-muted)] shrink-0" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-[var(--gh-text-muted)] shrink-0" />
                    )}
                    <Folder className="h-3.5 w-3.5 text-[var(--yellow-bright)] shrink-0" />
                  </>
                ) : (
                  <>
                    <span className="w-3" />
                    <File className="h-3.5 w-3.5 text-[var(--gh-text-muted)] shrink-0" />
                  </>
                )}
                <span className="truncate">{node.name}</span>
                {node.size !== undefined && (
                  <span className="ml-auto text-[10px] text-[var(--gh-text-muted)] font-mono">
                    {Math.round(node.size / 1024)}kb
                  </span>
                )}
              </div>

              {isDir && isFolderOpen && node.children && (
                <div>{renderFileTree(node.children, depth + 1)}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          if (repo.localPath && !treeData) {
            loadTree();
          }
        }}
        className="flex items-center space-x-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-1 text-xs font-mono text-[var(--gh-text-secondary)] hover:border-[var(--yellow-primary)] hover:text-[var(--gh-text)] transition"
      >
        <FolderTree className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
        <span>Inspect & Tree</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[88vh] flex flex-col rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] px-6 py-4 bg-[var(--gh-bg)] shrink-0">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gh-bg-secondary)] border border-[var(--yellow-primary)]/40">
                  <HamsterMascot variant="detective" size={32} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-[var(--gh-text)] tracking-tight">{repo.name}</h2>
                    <span className="rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2 py-0.5 text-[10px] font-mono text-[var(--gh-text-secondary)]">
                      {repo.language}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold ${
                        repo.importStatus === 'READY_FOR_TESTING'
                          ? 'border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)]'
                          : 'border border-[var(--gh-border)] bg-[var(--gh-bg)] text-[var(--gh-text-muted)]'
                      }`}
                    >
                      {repo.importStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--gh-text-secondary)] mt-0.5 flex items-center space-x-2">
                    <span>{repo.category}</span>
                    <span>•</span>
                    <a
                      href={repo.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--yellow-bright)] hover:underline inline-flex items-center"
                    >
                      <span>{repo.originalUrl}</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg)] transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notification / Toast Banner */}
            {statusMessage && (
              <div
                className={`px-6 py-2 text-xs font-mono flex items-center justify-between border-b ${
                  statusMessage.type === 'success'
                    ? 'bg-[var(--amber-badge-bg)] border-[var(--amber-badge-border)] text-[var(--yellow-bright)]'
                    : 'bg-[var(--gh-bg)] border-[var(--gh-border)] text-[var(--gh-text)]'
                }`}
              >
                <span>{statusMessage.text}</span>
                <button
                  onClick={() => setStatusMessage(null)}
                  className="text-xs hover:opacity-75"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Modal Tabs Bar */}
            <div className="flex items-center justify-between px-6 border-b border-[var(--gh-border)] bg-[var(--gh-bg)] shrink-0">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('INSPECTION')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'INSPECTION'
                      ? 'border-[var(--yellow-primary)] text-[var(--yellow-bright)] font-bold'
                      : 'border-transparent text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                  <span>Inspection Audit</span>
                </button>

                <button
                  onClick={() => setActiveTab('VALIDATION')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'VALIDATION'
                      ? 'border-[var(--yellow-primary)] text-[var(--yellow-bright)] font-bold'
                      : 'border-transparent text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                  <span>Validator Engine</span>
                  {validation && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] ml-1" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('EXPLORER');
                    if (repo.localPath && !treeData) {
                      loadTree();
                    }
                  }}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'EXPLORER'
                      ? 'border-[var(--yellow-primary)] text-[var(--yellow-bright)] font-bold'
                      : 'border-transparent text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                  }`}
                >
                  <FolderTree className="h-3.5 w-3.5 text-[var(--yellow-primary)]" />
                  <span>Local Explorer & Files</span>
                  {repo.localPath && (
                    <span className="rounded bg-[var(--gh-bg-secondary)] px-1 text-[9px] text-[var(--gh-text-muted)] ml-1">Cloned</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('CONVERT')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'CONVERT'
                      ? 'border-[var(--yellow-primary)] text-[var(--yellow-bright)] font-bold'
                      : 'border-transparent text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                  <span>Convert to Assignment</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <button
                  onClick={handleRunValidation}
                  disabled={isValidating}
                  className="flex items-center space-x-1.5 rounded-lg border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-1.5 text-xs font-mono font-medium text-[var(--yellow-bright)] hover:bg-[var(--yellow-primary)]/20 transition disabled:opacity-50"
                >
                  {isValidating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  <span>Run Validation</span>
                </button>

                {!repo.localPath && (
                  <button
                    onClick={handleImportClone}
                    disabled={isImporting}
                    className="flex items-center space-x-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-1.5 text-xs font-mono font-medium text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)] transition disabled:opacity-50"
                  >
                    {isImporting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                    )}
                    <span>Clone Locally</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body / Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-[var(--gh-bg)]/60">
              {/* TAB 1: INSPECTION REPORT */}
              {activeTab === 'INSPECTION' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Summary Overview */}
                  <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-3">
                    <h3 className="text-sm font-bold text-[var(--gh-text)] flex items-center space-x-2">
                      <FileCode2 className="h-4 w-4 text-[var(--yellow-bright)]" />
                      <span>Repository Inspection & Architectural Profile</span>
                    </h3>
                    <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed">{repo.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                      <div className="rounded-lg bg-[var(--gh-bg)] p-2.5 border border-[var(--gh-border)]">
                        <span className="text-[10px] text-[var(--gh-text-muted)] block uppercase">Source Type</span>
                        <span className="font-semibold text-[var(--gh-text)]">{repo.sourceType}</span>
                      </div>
                      <div className="rounded-lg bg-[var(--gh-bg)] p-2.5 border border-[var(--gh-border)]">
                        <span className="text-[10px] text-[var(--gh-text-muted)] block uppercase">License</span>
                        <span className="font-semibold text-[var(--gh-text)]">{repo.license}</span>
                      </div>
                      <div className="rounded-lg bg-[var(--gh-bg)] p-2.5 border border-[var(--gh-border)]">
                        <span className="text-[10px] text-[var(--gh-text-muted)] block uppercase">Commercial Use</span>
                        <span className="font-semibold text-[var(--yellow-bright)]">
                          {repo.isCommercialAllowed ? 'ALLOWED (MIT)' : 'RESTRICTED / ADAPT'}
                        </span>
                      </div>
                      <div className="rounded-lg bg-[var(--gh-bg)] p-2.5 border border-[var(--gh-border)]">
                        <span className="text-[10px] text-[var(--gh-text-muted)] block uppercase">Readiness</span>
                        <span className="font-semibold text-[var(--yellow-bright)]">{repo.evaluationReadiness}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bugs & Defect Profile */}
                  <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-3">
                    <h4 className="text-xs font-bold text-[var(--gh-text)] uppercase font-mono tracking-wider flex items-center space-x-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-[var(--yellow-primary)]" />
                      <span>Intentionally Introduced Bugs & Defect Scenarios</span>
                    </h4>

                    {inspection.exercises && Array.isArray(inspection.exercises) ? (
                      <div className="space-y-2">
                        {inspection.exercises.map((bug: string, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-lg bg-[var(--gh-bg)] p-2.5 border border-[var(--gh-border)] text-xs font-mono text-[var(--gh-text)] flex items-start space-x-2.5"
                          >
                            <span className="rounded bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="leading-relaxed">{bug}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--gh-text-muted)] italic">No specific exercise list defined in report.</p>
                    )}
                  </div>

                  {/* Commands & Build Setup */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[var(--gh-text-muted)]">Install Command</span>
                      <div className="rounded bg-[var(--gh-bg)] px-2 py-1.5 text-xs font-mono text-[var(--yellow-bright)] truncate">
                        {inspection.installCommand || 'npm install'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[var(--gh-text-muted)]">Build Command</span>
                      <div className="rounded bg-[var(--gh-bg)] px-2 py-1.5 text-xs font-mono text-[var(--yellow-bright)] truncate">
                        {inspection.buildCommand || 'npm run build'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[var(--gh-text-muted)]">Test Command</span>
                      <div className="rounded bg-[var(--gh-bg)] px-2 py-1.5 text-xs font-mono text-[var(--yellow-bright)] truncate">
                        {inspection.testCommand || 'npm test'}
                      </div>
                    </div>
                  </div>

                  {/* Commercial Risk & Recommendation */}
                  <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-3">
                    <h4 className="text-xs font-bold text-[var(--gh-text)] uppercase font-mono tracking-wider">
                      Commercial Assessment Suitability & Staff Recommendation
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="rounded-lg bg-[var(--amber-badge-bg)]/40 border border-[var(--amber-badge-border)] p-3 text-[var(--amber-badge-text)] leading-relaxed font-mono">
                        <strong className="text-[var(--yellow-bright)] block mb-1">Commercial Risk Audit:</strong>
                        {inspection.commercialRisk || 'No specific legal risk flags raised.'}
                      </div>

                      <div className="rounded-lg bg-[var(--gh-bg)] border border-[var(--gh-border)] p-3 text-[var(--gh-text-secondary)] leading-relaxed font-mono">
                        <strong className="text-[var(--gh-text)] block mb-1">Architect Recommendation:</strong>
                        {inspection.recommendation || 'Verified ready for test harness injection.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VALIDATION ENGINE RESULTS */}
              {activeTab === 'VALIDATION' && (
                <div className="space-y-6 max-w-4xl">
                  {validation ? (
                    <>
                      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-3">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="h-5 w-5 text-[var(--yellow-bright)]" />
                            <h3 className="text-sm font-bold text-[var(--gh-text)]">Automated Compatibility Results</h3>
                          </div>
                          <span className="text-[10px] font-mono text-[var(--gh-text-muted)]">
                            Validated: {new Date(validation.validatedAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-[var(--gh-bg)] border border-[var(--gh-border)] text-xs font-mono text-[var(--gh-text-secondary)] leading-relaxed">
                          {validation.summary}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                          <div className="rounded-lg bg-[var(--gh-bg)] p-3 border border-[var(--gh-border)]">
                            <span className="text-[10px] text-[var(--gh-text-muted)] block uppercase">Test Suite Type</span>
                            <span className="font-semibold text-[var(--yellow-bright)]">{validation.testSuiteType}</span>
                          </div>
                          <div className="rounded-lg bg-[var(--gh-bg)] p-3 border border-[var(--gh-border)]">
                            <span className="text-[10px] text-[var(--gh-text-muted)] block uppercase">Automated Tests</span>
                            <span className="font-semibold text-[var(--yellow-bright)]">
                              {validation.hasAutomatedTests ? 'YES (RUNNER READY)' : 'NO HARNESS'}
                            </span>
                          </div>
                          <div className="rounded-lg bg-[var(--gh-bg)] p-3 border border-[var(--gh-border)]">
                            <span className="text-[10px] text-[var(--gh-text-muted)] block uppercase">Reproducibility</span>
                            <span className="font-semibold text-[var(--gh-text)]">{validation.reproducibilityRating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Runtimes Detected */}
                      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-3">
                        <h4 className="text-xs font-bold text-[var(--gh-text)] uppercase font-mono tracking-wider">
                          Detected Language & Runtime Environments
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {validation.runtimesDetected?.map((rt: any, idx: number) => (
                            <div
                              key={idx}
                              className="rounded-lg bg-[var(--gh-bg)] p-2.5 border border-[var(--gh-border)] flex items-center justify-between text-xs font-mono"
                            >
                              <div>
                                <span className="font-bold text-[var(--gh-text)]">{rt.name}</span>
                                <span className="text-[10px] text-[var(--gh-text-muted)] block">{rt.version}</span>
                              </div>
                              <span className="rounded bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--amber-badge-text)] px-2 py-0.5 text-[10px] font-bold">
                                {rt.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Security & Commercial Flags */}
                      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-3">
                        <h4 className="text-xs font-bold text-[var(--gh-text)] uppercase font-mono tracking-wider">
                          Security & Dependency Audit Flags
                        </h4>
                        {validation.securityAudit?.flaggedPatterns?.length > 0 ? (
                          <div className="space-y-1.5">
                            {validation.securityAudit.flaggedPatterns.map((pat: string, idx: number) => (
                              <div
                                key={idx}
                                className="rounded-lg bg-[var(--amber-badge-bg)]/30 border border-[var(--amber-badge-border)] p-2.5 text-xs font-mono text-[var(--amber-badge-text)] flex items-start space-x-2"
                              >
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[var(--yellow-bright)]" />
                                <span>{pat}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg bg-[var(--amber-badge-bg)]/20 border border-[var(--amber-badge-border)] p-3 text-xs font-mono text-[var(--amber-badge-text)] flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--yellow-bright)]" />
                            <span>Zero malicious or unsafe dependencies identified in repository manifests.</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-12 text-center space-y-4">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gh-bg)] border border-[var(--gh-border)]">
                        <ShieldCheck className="h-6 w-6 text-[var(--gh-text-muted)]" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[var(--gh-text)]">No Validation Run Yet</h3>
                        <p className="text-xs text-[var(--gh-text-secondary)] max-w-sm mx-auto">
                          Click below to execute the compatibility validator engine across package manifests, language runtimes, test frameworks, and sandbox constraints.
                        </p>
                      </div>
                      <button
                        onClick={handleRunValidation}
                        disabled={isValidating}
                        className="rounded-xl bg-[var(--yellow-primary)] px-4 py-2 text-xs font-bold text-black hover:bg-[var(--yellow-bright)] transition shadow-[var(--yellow-glow)]"
                      >
                        {isValidating ? 'Validating...' : 'Run Compatibility Validator Now'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: FILE EXPLORER */}
              {activeTab === 'EXPLORER' && (
                <div className="h-full flex flex-col">
                  {repo.localPath ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[58vh]">
                      {/* Left: Tree Pane */}
                      <div className="md:col-span-4 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-2 mb-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-[var(--gh-text)] flex items-center space-x-1.5">
                            <FolderTree className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                            <span>Workspace Files</span>
                          </span>
                          <button
                            onClick={loadTree}
                            className="text-[10px] font-mono text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]"
                          >
                            Refresh
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1">
                          {isLoadingTree ? (
                            <div className="p-4 text-center text-xs text-[var(--gh-text-muted)] font-mono flex items-center justify-center space-x-2">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--yellow-bright)]" />
                              <span>Scanning directory tree...</span>
                            </div>
                          ) : treeData && treeData.length > 0 ? (
                            renderFileTree(treeData)
                          ) : (
                            <div className="p-4 text-center text-xs text-[var(--gh-text-muted)] font-mono">
                              No files found.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Code & Markdown Preview Pane */}
                      <div className="md:col-span-8 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-2 mb-2 shrink-0">
                          <span className="text-xs font-mono text-[var(--gh-text-muted)] truncate">
                            {selectedFile ? (
                              <span className="text-[var(--yellow-bright)] font-bold">{selectedFile}</span>
                            ) : (
                              'Select a file from the tree to preview'
                            )}
                          </span>
                          {fileContent && (
                            <div className="flex items-center space-x-2">
                              {selectedFile?.toLowerCase().endsWith('.md') || selectedFile?.toLowerCase().endsWith('.markdown') ? (
                                <span className="text-[10px] font-mono bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--amber-badge-text)] px-2 py-0.5 rounded-full">
                                  Type: Markdown
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] text-[var(--gh-text-muted)] px-2 py-0.5 rounded-full">
                                  Type: Source Code
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-[var(--gh-text-muted)]">Read-Only</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 overflow-auto">
                          {isLoadingFile ? (
                            <div className="h-full flex items-center justify-center text-xs font-mono text-[var(--gh-text-muted)] space-x-2">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--yellow-bright)]" />
                              <span>Loading file content...</span>
                            </div>
                          ) : fileContent !== null ? (
                            selectedFile?.toLowerCase().endsWith('.md') || selectedFile?.toLowerCase().endsWith('.markdown') ? (
                              <div className="p-3 bg-[var(--gh-bg-secondary)] rounded-xl border border-[var(--gh-border)]/50">
                                <MarkdownRenderer content={fileContent} />
                              </div>
                            ) : (
                              <pre className="text-xs font-mono text-[var(--gh-text)] leading-relaxed p-2 whitespace-pre select-text">
                                <code>{fileContent}</code>
                              </pre>
                            )
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--gh-text-muted)] font-mono text-xs space-y-2">
                              <Terminal className="h-8 w-8 text-[var(--gh-text-muted)]" />
                              <p>Click any source code or test file on the left</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-12 text-center space-y-4">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gh-bg)] border border-[var(--gh-border)]">
                        <Download className="h-6 w-6 text-[var(--yellow-bright)]" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[var(--gh-text)]">Repository Not Cloned Locally</h3>
                        <p className="text-xs text-[var(--gh-text-secondary)] max-w-md mx-auto">
                          Clone this repository into the RepoHamster local developer workspace (<code className="text-[var(--yellow-bright)]">catalogue-sources/{repo.id}</code>) to preview directory trees, inspect source files, and test runtimes without modifying upstream GitHub.
                        </p>
                      </div>
                      <button
                        onClick={handleImportClone}
                        disabled={isImporting}
                        className="rounded-xl bg-[var(--yellow-primary)] px-4 py-2 text-xs font-bold text-black hover:bg-[var(--yellow-bright)] transition shadow-[var(--yellow-glow)]"
                      >
                        {isImporting ? 'Cloning Git Repository...' : 'Clone to Local Workspace'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CONVERT TO ASSIGNMENT */}
              {activeTab === 'CONVERT' && (
                <div className="max-w-2xl mx-auto space-y-4">
                  {repo.importStatus !== 'READY_FOR_TESTING' && repo.importStatus !== 'IMPORTED' ? (
                    <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-4 space-y-2 text-xs font-mono">
                      <div className="flex items-center space-x-2 text-[var(--yellow-bright)] font-bold">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Quality Gate: Not Ready For Testing</span>
                      </div>
                      <p className="text-[var(--amber-badge-text)] leading-relaxed">
                        This repository is currently marked as <strong className="text-[var(--gh-text)]">&quot;{repo.importStatus}&quot;</strong>.
                        To protect candidate assessment integrity, only repositories marked <strong className="text-[var(--yellow-bright)]">READY_FOR_TESTING</strong> can be activated as candidate challenges.
                      </p>
                      <p className="text-[var(--gh-text-muted)] text-[11px]">
                        Run the compatibility validator or configure an automated test harness first.
                      </p>
                    </div>
                  ) : null}

                  <form onSubmit={handleConvert} className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-4">
                    <div className="border-b border-[var(--gh-border)] pb-3">
                      <h3 className="text-sm font-bold text-[var(--gh-text)] flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-[var(--yellow-bright)]" />
                        <span>Publish Candidate Debugging Challenge</span>
                      </h3>
                      <p className="text-xs text-[var(--gh-text-secondary)] mt-0.5">
                        Creates an active challenge in the candidate assessment dashboard linked to this verified repository.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">Assignment Title</label>
                        <input
                          type="text"
                          required
                          value={convertForm.title}
                          onChange={(e) => setConvertForm({ ...convertForm, title: e.target.value })}
                          className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-semibold text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">URL Slug</label>
                        <input
                          type="text"
                          required
                          value={convertForm.slug}
                          onChange={(e) => setConvertForm({ ...convertForm, slug: e.target.value })}
                          className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-mono text-[var(--yellow-bright)] focus:border-[var(--yellow-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">Difficulty</label>
                        <select
                          value={convertForm.difficulty}
                          onChange={(e) => setConvertForm({ ...convertForm, difficulty: e.target.value })}
                          className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                        >
                          <option value="BEGINNER">BEGINNER</option>
                          <option value="INTERMEDIATE">INTERMEDIATE</option>
                          <option value="ADVANCED">ADVANCED</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">Est. Duration (Minutes)</label>
                        <input
                          type="number"
                          value={convertForm.estimatedTimeMinutes}
                          onChange={(e) => setConvertForm({ ...convertForm, estimatedTimeMinutes: parseInt(e.target.value, 10) || 45 })}
                          className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">Passing Threshold (%)</label>
                        <input
                          type="number"
                          value={convertForm.passingThresholdPercent}
                          onChange={(e) => setConvertForm({ ...convertForm, passingThresholdPercent: parseFloat(e.target.value) || 100 })}
                          className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">AI Request Quota</label>
                        <input
                          type="number"
                          value={convertForm.aiRequestLimit}
                          onChange={(e) => setConvertForm({ ...convertForm, aiRequestLimit: parseInt(e.target.value, 10) || 15 })}
                          className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[var(--gh-text-muted)] uppercase">Markdown Instructions</label>
                      <textarea
                        rows={5}
                        value={convertForm.instructions}
                        onChange={(e) => setConvertForm({ ...convertForm, instructions: e.target.value })}
                        className="w-full rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-primary)] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-2 text-xs font-semibold text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isConverting || (repo.importStatus !== 'READY_FOR_TESTING' && repo.importStatus !== 'IMPORTED')}
                        className="flex items-center space-x-1.5 rounded-xl bg-[var(--yellow-primary)] px-4 py-2 text-xs font-bold text-black hover:bg-[var(--yellow-bright)] transition disabled:opacity-50 shadow-[var(--yellow-glow)]"
                      >
                        {isConverting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Zap className="h-3.5 w-3.5" />
                        )}
                        <span>Publish Active Challenge</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
