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
          importStatus: 'IMPORTED',
        }));
        setStatusMessage({ text: `Cloned into local workspace: ${data.localPath}`, type: 'success' });
        loadTree();
        router.refresh();
      } else {
        setStatusMessage({ text: data.error || 'Clone failed.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Clone request failed.', type: 'error' });
    } finally {
      setIsImporting(false);
    }
  };

  const loadTree = async () => {
    setIsLoadingTree(true);
    try {
      const res = await fetch(`/api/catalogue/${repo.id}/files`);
      const data = await res.json();
      if (res.ok && data.success && data.tree) {
        setTreeData(data.tree);
      }
    } catch (err) {
      console.error('Failed to load tree', err);
    } finally {
      setIsLoadingTree(false);
    }
  };

  const handleOpenFile = async (filePath: string) => {
    setSelectedFile(filePath);
    setIsLoadingFile(true);
    setFileContent(null);
    try {
      const res = await fetch(`/api/catalogue/${repo.id}/files?file=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setFileContent(data.content);
      } else {
        setFileContent(`[Error loading file: ${data.error}]`);
      }
    } catch (err: any) {
      setFileContent(`[Network error: ${err.message}]`);
    } finally {
      setIsLoadingFile(false);
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
        setStatusMessage({ text: data.message, type: 'success' });
        router.refresh();
        setTimeout(() => {
          setIsOpen(false);
          router.push('/admin/assignments');
        }, 1200);
      } else {
        setStatusMessage({ text: data.error || 'Conversion failed.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Conversion request failed.', type: 'error' });
    } finally {
      setIsConverting(false);
    }
  };

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderPath]: !prev[folderPath] }));
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
                    ? 'bg-brand-purple/20 text-brand-purple-light font-bold'
                    : 'text-slate-300 hover:bg-card-hover hover:text-white'
                }`}
              >
                {isDir ? (
                  <>
                    {isFolderOpen ? (
                      <ChevronDown className="h-3 w-3 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                    )}
                    <Folder className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  </>
                ) : (
                  <>
                    <span className="w-3" />
                    <File className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </>
                )}
                <span className="truncate">{node.name}</span>
                {node.size !== undefined && (
                  <span className="ml-auto text-[10px] text-slate-600 font-mono">
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
        className="flex items-center space-x-1.5 rounded-lg border border-card-border bg-[#0a0d14] px-2.5 py-1 text-xs font-mono text-slate-300 hover:border-brand-purple hover:text-white transition"
      >
        <FolderTree className="h-3.5 w-3.5 text-brand-purple-light" />
        <span>Inspect & Tree</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[88vh] flex flex-col rounded-2xl border border-card-border bg-[#0d101a] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-card-border px-6 py-4 bg-card/60 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-brand-purple/40">
                  <HamsterMascot variant="detective" size={32} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white tracking-tight">{repo.name}</h2>
                    <span className="rounded-full border border-card-border bg-[#0a0d14] px-2 py-0.5 text-[10px] font-mono text-slate-300">
                      {repo.language}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold ${
                        repo.importStatus === 'READY_FOR_TESTING'
                          ? 'border border-lime-800/50 bg-lime-950/40 text-brand-lime'
                          : repo.importStatus === 'INSPECTED'
                          ? 'border border-blue-800/50 bg-blue-950/40 text-blue-400'
                          : repo.importStatus === 'NEEDS_CONFIGURATION'
                          ? 'border border-amber-800/50 bg-amber-950/40 text-amber-400'
                          : 'border border-rose-800/50 bg-rose-950/40 text-rose-400'
                      }`}
                    >
                      {repo.importStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                    <span>{repo.category}</span>
                    <span>•</span>
                    <a
                      href={repo.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-purple-light hover:underline inline-flex items-center"
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
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-card-hover transition"
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
                    ? 'bg-lime-950/40 border-lime-800/50 text-brand-lime'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                    : 'bg-card border-card-border text-slate-300'
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
            <div className="flex items-center justify-between px-6 border-b border-card-border bg-[#0a0d14] shrink-0">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('INSPECTION')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'INSPECTION'
                      ? 'border-brand-purple text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode2 className="h-3.5 w-3.5 text-brand-purple-light" />
                  <span>Inspection Audit</span>
                </button>

                <button
                  onClick={() => setActiveTab('VALIDATION')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'VALIDATION'
                      ? 'border-brand-lime text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-lime" />
                  <span>Validator Engine</span>
                  {validation && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-lime ml-1" />
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
                      ? 'border-amber-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FolderTree className="h-3.5 w-3.5 text-amber-400" />
                  <span>Local Explorer & Files</span>
                  {repo.localPath && (
                    <span className="rounded bg-slate-800 px-1 text-[9px] text-slate-300 ml-1">Cloned</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('CONVERT')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'CONVERT'
                      ? 'border-brand-purple-light text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5 text-brand-purple" />
                  <span>Convert to Assignment</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <button
                  onClick={handleRunValidation}
                  disabled={isValidating}
                  className="flex items-center space-x-1.5 rounded-lg border border-lime-800/50 bg-lime-950/30 px-3 py-1.5 text-xs font-mono font-medium text-brand-lime hover:bg-lime-900/40 transition disabled:opacity-50"
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
                    className="flex items-center space-x-1.5 rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs font-mono font-medium text-slate-200 hover:text-white hover:border-brand-purple transition disabled:opacity-50"
                  >
                    {isImporting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5 text-brand-purple-light" />
                    )}
                    <span>Clone Locally</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body / Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0a0d14]/70">
              {/* TAB 1: INSPECTION REPORT */}
              {activeTab === 'INSPECTION' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Summary Overview */}
                  <div className="rounded-xl border border-card-border bg-card p-4 space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <FileCode2 className="h-4 w-4 text-brand-lime" />
                      <span>Repository Inspection & Architectural Profile</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{repo.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                      <div className="rounded-lg bg-[#0a0d14] p-2.5 border border-card-border">
                        <span className="text-[10px] text-slate-500 block uppercase">Source Type</span>
                        <span className="font-semibold text-slate-200">{repo.sourceType}</span>
                      </div>
                      <div className="rounded-lg bg-[#0a0d14] p-2.5 border border-card-border">
                        <span className="text-[10px] text-slate-500 block uppercase">License</span>
                        <span className="font-semibold text-slate-200">{repo.license}</span>
                      </div>
                      <div className="rounded-lg bg-[#0a0d14] p-2.5 border border-card-border">
                        <span className="text-[10px] text-slate-500 block uppercase">Commercial Use</span>
                        <span className={repo.isCommercialAllowed ? 'font-semibold text-brand-lime' : 'font-semibold text-amber-400'}>
                          {repo.isCommercialAllowed ? 'ALLOWED (MIT)' : 'RESTRICTED / ADAPT'}
                        </span>
                      </div>
                      <div className="rounded-lg bg-[#0a0d14] p-2.5 border border-card-border">
                        <span className="text-[10px] text-slate-500 block uppercase">Readiness</span>
                        <span className="font-semibold text-brand-purple-light">{repo.evaluationReadiness}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bugs & Defect Profile */}
                  <div className="rounded-xl border border-card-border bg-card p-4 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center space-x-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      <span>Intentionally Introduced Bugs & Defect Scenarios</span>
                    </h4>

                    {inspection.exercises && Array.isArray(inspection.exercises) ? (
                      <div className="space-y-2">
                        {inspection.exercises.map((bug: string, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-lg bg-[#0a0d14] p-2.5 border border-card-border/70 text-xs font-mono text-slate-300 flex items-start space-x-2.5"
                          >
                            <span className="rounded bg-purple-950 text-brand-purple-light px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="leading-relaxed">{bug}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No specific exercise list defined in report.</p>
                    )}
                  </div>

                  {/* Commands & Build Setup */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-card-border bg-card p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Install Command</span>
                      <div className="rounded bg-[#0a0d14] px-2 py-1.5 text-xs font-mono text-brand-lime truncate">
                        {inspection.installCommand || 'npm install'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-card-border bg-card p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Build Command</span>
                      <div className="rounded bg-[#0a0d14] px-2 py-1.5 text-xs font-mono text-brand-lime truncate">
                        {inspection.buildCommand || 'npm run build'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-card-border bg-card p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Test Command</span>
                      <div className="rounded bg-[#0a0d14] px-2 py-1.5 text-xs font-mono text-brand-lime truncate">
                        {inspection.testCommand || 'npm test'}
                      </div>
                    </div>
                  </div>

                  {/* Commercial Risk & Recommendation */}
                  <div className="rounded-xl border border-card-border bg-card p-4 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      Commercial Assessment Suitability & Staff Recommendation
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="rounded-lg bg-amber-950/20 border border-amber-800/40 p-3 text-amber-300/90 leading-relaxed font-mono">
                        <strong className="text-amber-400 block mb-1">Commercial Risk Audit:</strong>
                        {inspection.commercialRisk || 'No specific legal risk flags raised.'}
                      </div>

                      <div className="rounded-lg bg-purple-950/20 border border-purple-800/40 p-3 text-purple-200/90 leading-relaxed font-mono">
                        <strong className="text-brand-purple-light block mb-1">Architect Recommendation:</strong>
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
                      <div className="rounded-xl border border-card-border bg-card p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-card-border pb-3">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="h-5 w-5 text-brand-lime" />
                            <h3 className="text-sm font-bold text-white">Automated Compatibility Results</h3>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            Validated: {new Date(validation.validatedAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0a0d14] border border-card-border text-xs font-mono text-slate-300 leading-relaxed">
                          {validation.summary}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                          <div className="rounded-lg bg-[#0a0d14] p-3 border border-card-border">
                            <span className="text-[10px] text-slate-500 block uppercase">Test Suite Type</span>
                            <span className="font-semibold text-brand-lime">{validation.testSuiteType}</span>
                          </div>
                          <div className="rounded-lg bg-[#0a0d14] p-3 border border-card-border">
                            <span className="text-[10px] text-slate-500 block uppercase">Automated Tests</span>
                            <span className={validation.hasAutomatedTests ? 'font-semibold text-brand-lime' : 'font-semibold text-rose-400'}>
                              {validation.hasAutomatedTests ? 'YES (RUNNER READY)' : 'NO HARNESS'}
                            </span>
                          </div>
                          <div className="rounded-lg bg-[#0a0d14] p-3 border border-card-border">
                            <span className="text-[10px] text-slate-500 block uppercase">Reproducibility</span>
                            <span className="font-semibold text-purple-300">{validation.reproducibilityRating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Runtimes Detected */}
                      <div className="rounded-xl border border-card-border bg-card p-5 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                          Detected Language & Runtime Environments
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {validation.runtimesDetected?.map((rt: any, idx: number) => (
                            <div
                              key={idx}
                              className="rounded-lg bg-[#0a0d14] p-2.5 border border-card-border flex items-center justify-between text-xs font-mono"
                            >
                              <div>
                                <span className="font-bold text-white">{rt.name}</span>
                                <span className="text-[10px] text-slate-400 block">{rt.version}</span>
                              </div>
                              <span className="rounded bg-lime-950/70 border border-lime-800/40 text-brand-lime px-2 py-0.5 text-[10px] font-bold">
                                {rt.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Security & Commercial Flags */}
                      <div className="rounded-xl border border-card-border bg-card p-5 space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                          Security & Dependency Audit Flags
                        </h4>
                        {validation.securityAudit?.flaggedPatterns?.length > 0 ? (
                          <div className="space-y-1.5">
                            {validation.securityAudit.flaggedPatterns.map((pat: string, idx: number) => (
                              <div
                                key={idx}
                                className="rounded-lg bg-amber-950/30 border border-amber-800/40 p-2.5 text-xs font-mono text-amber-300 flex items-start space-x-2"
                              >
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-400" />
                                <span>{pat}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg bg-lime-950/20 border border-lime-800/40 p-3 text-xs font-mono text-brand-lime flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>Zero malicious or unsafe dependencies identified in repository manifests.</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-card-border bg-card p-12 text-center space-y-4">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a0d14] border border-card-border">
                        <ShieldCheck className="h-6 w-6 text-slate-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white">No Validation Run Yet</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Click below to execute the compatibility validator engine across package manifests, language runtimes, test frameworks, and sandbox constraints.
                        </p>
                      </div>
                      <button
                        onClick={handleRunValidation}
                        disabled={isValidating}
                        className="rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime"
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
                      <div className="md:col-span-4 rounded-xl border border-card-border bg-card p-3 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between border-b border-card-border pb-2 mb-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-white flex items-center space-x-1.5">
                            <FolderTree className="h-3.5 w-3.5 text-amber-400" />
                            <span>Workspace Files</span>
                          </span>
                          <button
                            onClick={loadTree}
                            className="text-[10px] font-mono text-slate-400 hover:text-white"
                          >
                            Refresh
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1">
                          {isLoadingTree ? (
                            <div className="p-4 text-center text-xs text-slate-500 font-mono flex items-center justify-center space-x-2">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-purple" />
                              <span>Scanning directory tree...</span>
                            </div>
                          ) : treeData && treeData.length > 0 ? (
                            renderFileTree(treeData)
                          ) : (
                            <div className="p-4 text-center text-xs text-slate-500 font-mono">
                              No files found.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Code & Markdown Preview Pane */}
                      <div className="md:col-span-8 rounded-xl border border-card-border bg-[#05070a] p-3 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between border-b border-card-border pb-2 mb-2 shrink-0">
                          <span className="text-xs font-mono text-slate-400 truncate">
                            {selectedFile ? (
                              <span className="text-brand-lime font-bold">{selectedFile}</span>
                            ) : (
                              'Select a file from the tree to preview'
                            )}
                          </span>
                          {fileContent && (
                            <div className="flex items-center space-x-2">
                              {selectedFile?.toLowerCase().endsWith('.md') || selectedFile?.toLowerCase().endsWith('.markdown') ? (
                                <span className="text-[10px] font-mono bg-purple-950/60 border border-purple-800/40 text-brand-purple-light px-2 py-0.5 rounded-full">
                                  Type: Markdown
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono bg-[#0a0d14] border border-card-border text-slate-400 px-2 py-0.5 rounded-full">
                                  Type: Source Code
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-slate-600">Read-Only</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 overflow-auto">
                          {isLoadingFile ? (
                            <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500 space-x-2">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-purple" />
                              <span>Loading file content...</span>
                            </div>
                          ) : fileContent !== null ? (
                            selectedFile?.toLowerCase().endsWith('.md') || selectedFile?.toLowerCase().endsWith('.markdown') ? (
                              <div className="p-3 bg-[#0a0d14]/70 rounded-xl border border-card-border/50">
                                <MarkdownRenderer content={fileContent} />
                              </div>
                            ) : (
                              <pre className="text-xs font-mono text-slate-300 leading-relaxed p-2 whitespace-pre select-text">
                                <code>{fileContent}</code>
                              </pre>
                            )
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 font-mono text-xs space-y-2">
                              <Terminal className="h-8 w-8 text-slate-700" />
                              <p>Click any source code or test file on the left</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-card-border bg-card p-12 text-center space-y-4">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a0d14] border border-card-border">
                        <Download className="h-6 w-6 text-brand-purple-light" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white">Repository Not Cloned Locally</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Clone this repository into the RepoHamster local developer workspace (<code className="text-brand-purple-light">catalogue-sources/{repo.id}</code>) to preview directory trees, inspect source files, and test runtimes without modifying upstream GitHub.
                        </p>
                      </div>
                      <button
                        onClick={handleImportClone}
                        disabled={isImporting}
                        className="rounded-xl bg-brand-purple px-4 py-2 text-xs font-bold text-white hover:bg-brand-purple-light transition shadow-glow-purple"
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
                    <div className="rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 space-y-2 text-xs font-mono">
                      <div className="flex items-center space-x-2 text-amber-400 font-bold">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Quality Gate: Not Ready For Testing</span>
                      </div>
                      <p className="text-amber-300/80 leading-relaxed">
                        This repository is currently marked as <strong className="text-amber-300">"{repo.importStatus}"</strong>.
                        To protect candidate assessment integrity, only repositories marked <strong className="text-brand-lime">READY_FOR_TESTING</strong> can be activated as candidate challenges.
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Run the compatibility validator or configure an automated test harness first.
                      </p>
                    </div>
                  ) : null}

                  <form onSubmit={handleConvert} className="rounded-xl border border-card-border bg-card p-5 space-y-4">
                    <div className="border-b border-card-border pb-3">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-brand-lime" />
                        <span>Publish Candidate Debugging Challenge</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Creates an active challenge in the candidate assessment dashboard linked to this verified repository.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">Assignment Title</label>
                        <input
                          type="text"
                          required
                          value={convertForm.title}
                          onChange={(e) => setConvertForm({ ...convertForm, title: e.target.value })}
                          className="w-full rounded-lg border border-card-border bg-[#0a0d14] px-3 py-2 text-xs font-semibold text-white focus:border-brand-purple focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">URL Slug</label>
                        <input
                          type="text"
                          required
                          value={convertForm.slug}
                          onChange={(e) => setConvertForm({ ...convertForm, slug: e.target.value })}
                          className="w-full rounded-lg border border-card-border bg-[#0a0d14] px-3 py-2 text-xs font-mono text-brand-lime focus:border-brand-purple focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">Difficulty</label>
                        <select
                          value={convertForm.difficulty}
                          onChange={(e) => setConvertForm({ ...convertForm, difficulty: e.target.value })}
                          className="w-full rounded-lg border border-card-border bg-[#0a0d14] px-3 py-2 text-xs font-mono text-slate-200 focus:border-brand-purple focus:outline-none"
                        >
                          <option value="BEGINNER">BEGINNER</option>
                          <option value="INTERMEDIATE">INTERMEDIATE</option>
                          <option value="ADVANCED">ADVANCED</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">Est. Duration (Minutes)</label>
                        <input
                          type="number"
                          value={convertForm.estimatedTimeMinutes}
                          onChange={(e) => setConvertForm({ ...convertForm, estimatedTimeMinutes: parseInt(e.target.value, 10) || 45 })}
                          className="w-full rounded-lg border border-card-border bg-[#0a0d14] px-3 py-2 text-xs font-mono text-slate-200 focus:border-brand-purple focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">Passing Threshold (%)</label>
                        <input
                          type="number"
                          value={convertForm.passingThresholdPercent}
                          onChange={(e) => setConvertForm({ ...convertForm, passingThresholdPercent: parseFloat(e.target.value) || 100 })}
                          className="w-full rounded-lg border border-card-border bg-[#0a0d14] px-3 py-2 text-xs font-mono text-slate-200 focus:border-brand-purple focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">AI Request Quota</label>
                        <input
                          type="number"
                          value={convertForm.aiRequestLimit}
                          onChange={(e) => setConvertForm({ ...convertForm, aiRequestLimit: parseInt(e.target.value, 10) || 15 })}
                          className="w-full rounded-lg border border-card-border bg-[#0a0d14] px-3 py-2 text-xs font-mono text-slate-200 focus:border-brand-purple focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 uppercase">Markdown Instructions</label>
                      <textarea
                        rows={5}
                        value={convertForm.instructions}
                        onChange={(e) => setConvertForm({ ...convertForm, instructions: e.target.value })}
                        className="w-full rounded-lg border border-card-border bg-[#0a0d14] p-3 text-xs font-mono text-slate-200 focus:border-brand-purple focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl border border-card-border px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isConverting || (repo.importStatus !== 'READY_FOR_TESTING' && repo.importStatus !== 'IMPORTED')}
                        className="flex items-center space-x-1.5 rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition disabled:opacity-50 shadow-glow-lime"
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
