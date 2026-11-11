'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import {
  ExternalLink,
  Terminal,
  Copy,
  Check,
  GitFork,
  ArrowUpRight,
  X,
  Code2,
  Monitor,
  Zap,
  Loader2,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  Play,
  RotateCw,
  Trash2,
  Clock,
  Layers,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface CodespacesLaunchModalProps {
  repoUrl: string;
  assignmentTitle: string;
  assignmentId?: string;
  candidateGithubUsername?: string;
}

interface ExistingCodespace {
  name: string;
  displayName?: string;
  state: string;
  webUrl: string;
  createdAt: string;
  lastUsedAt?: string;
}

export function CodespacesLaunchModal({
  repoUrl,
  assignmentTitle,
  assignmentId,
  candidateGithubUsername,
}: CodespacesLaunchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [vsCodeLaunched, setVsCodeLaunched] = useState(false);

  // Inspection & Existing Codespace State
  const [isInspecting, setIsInspecting] = useState(false);
  const [existingCodespaces, setExistingCodespaces] = useState<ExistingCodespace[]>([]);
  const [hasCheckedExisting, setHasCheckedExisting] = useState(false);

  // Execution States
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [missingScope, setMissingScope] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    webUrl: string;
    action: string;
  } | null>(null);

  const cleanUrl = repoUrl.replace(/\/$/, '').replace(/\?.*$/, '');
  const match = cleanUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+)\/(.+))?$/);
  const owner = match ? match[1] : 'repohamster';
  const repo = match ? match[2] : 'assignment';
  const branch = match && match[3] ? match[3] : 'main';
  const subFolder = match && match[4] ? match[4] : '';

  const baseRepoUrl = `https://github.com/${owner}/${repo}`;
  const cloneUrl = `${baseRepoUrl}.git`;
  const defaultCodespacesUrl = `https://codespaces.new/${owner}/${repo}?ref=${branch}`;
  const vscodeUrl = `vscode://vscode.git/clone?url=${encodeURIComponent(cloneUrl)}`;

  const gitCommands = [
    `git clone ${cloneUrl}`,
    subFolder ? `cd ${repo}/${subFolder}` : `cd ${repo}`,
    `git checkout -b fix/solution`,
    `# Fix the bug, run tests locally`,
    `git commit -am "fix: resolve bug and satisfy acceptance criteria"`,
    `git push origin fix/solution`,
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Check for existing codespaces when modal opens
  const inspectExistingCodespaces = async () => {
    setIsInspecting(true);
    setGeneralError(null);
    setQuotaError(null);
    setMissingScope(false);

    try {
      const params = new URLSearchParams();
      if (repoUrl) params.set('repoUrl', repoUrl);
      if (assignmentId) params.set('assignmentId', assignmentId);

      const res = await fetch(`/api/candidate/codespace?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setExistingCodespaces(data.codespaces || []);
        if (data.isMissingScope) {
          setMissingScope(true);
        }
      } else {
        if (data.isMissingScope) {
          setMissingScope(true);
        }
      }
    } catch (err: any) {
      console.warn('[CODESPACE INSPECTOR] Inspection error:', err);
    } finally {
      setIsInspecting(false);
      setHasCheckedExisting(true);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    inspectExistingCodespaces();
  };

  /**
   * Execute one of the 3 actions (or fresh creation)
   */
  const handleExecuteCodespaceAction = async (
    action: 'continue' | 'create_keep' | 'create_delete' | 'create',
    targetCodespace?: ExistingCodespace
  ) => {
    setExecutingAction(action);
    setGeneralError(null);
    setQuotaError(null);
    setSuccessInfo(null);

    try {
      // 1. Direct optimization for 'continue' if webUrl is already present
      if (action === 'continue' && targetCodespace?.webUrl) {
        window.open(targetCodespace.webUrl, '_blank');
        setSuccessInfo({
          message: `Opening existing Codespace (${targetCodespace.name})...`,
          webUrl: targetCodespace.webUrl,
          action: 'continue',
        });
        setExecutingAction(null);
        return;
      }

      const res = await fetch('/api/candidate/codespace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
          assignmentId,
          action,
          existingCodespaceName: targetCodespace?.name || existingCodespaces[0]?.name,
          existingCodespaceUrl: targetCodespace?.webUrl || existingCodespaces[0]?.webUrl,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessInfo({
          message: data.message || 'Codespace environment ready!',
          webUrl: data.webUrl,
          action,
        });

        if (data.webUrl) {
          window.open(data.webUrl, '_blank');
        }

        // Refresh list
        inspectExistingCodespaces();
      } else {
        if (data.isQuotaExceeded) {
          setQuotaError(
            data.error ||
              'GitHub Codespaces Free Quota Limit Reached. Your account has exhausted its included monthly free hours (120 core hours) or spending limit.'
          );
        } else if (
          data.isMissingScope ||
          data.error?.toLowerCase().includes('codespace') ||
          data.error?.toLowerCase().includes('permission')
        ) {
          setMissingScope(true);
        } else if (data.isLocked) {
          setGeneralError(data.error || 'A Codespace operation is already in progress. Please wait a moment.');
        } else {
          setGeneralError(data.error || data.message || 'Failed to manage Codespace environment.');
        }
      }
    } catch (err: any) {
      setGeneralError(err?.message || 'Network error executing Codespace operation.');
    } finally {
      setExecutingAction(null);
    }
  };

  const primaryExistingCodespace = existingCodespaces[0];

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center space-x-2 rounded-lg bg-[var(--yellow-button-bg)] hover:bg-[var(--yellow-button-hover)] text-[var(--yellow-button-text)] px-3.5 py-1.5 text-xs font-extrabold transition shadow-[var(--yellow-glow)] active:scale-95"
      >
        <Terminal className="h-3.5 w-3.5 stroke-[2.5]" />
        <span>&lt;&gt; Code</span>
        <ArrowUpRight className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--gh-border)] pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gh-bg-secondary)] border border-[var(--yellow-primary)]/50 p-1">
                  <HamsterMascot variant="normal" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--gh-text)] text-base">Launch Assessment Workspace</h3>
                  <p className="text-xs text-[var(--gh-text-muted)] font-mono">{cleanUrl}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg-tertiary)] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* AI Integrity & Guardrails Notice (Yellow + Dark) */}
            <div className="mt-4 rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] p-3 flex items-start space-x-3 text-xs">
              <ShieldAlert className="h-4 w-4 text-[var(--yellow-bright)] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-[var(--amber-badge-text)]">Assessment AI Integrity Guardrails:</span>
                <p className="text-[var(--amber-badge-text)] text-[11px] leading-relaxed">
                  Inline code autocompletion (Copilot Ghost Text) is disabled in this environment for assessment integrity. You can ask for conceptual debugging help using the <strong className="text-[var(--yellow-bright)]">RepoHamster AI Mentor</strong>. All questions asked to the AI are recorded in your assessment audit log for reviewer evaluation.
                </p>
              </div>
            </div>

            {/* Missing Codespace Permission Callout */}
            {missingScope && (
              <div className="mt-4 rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] p-3.5 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-[var(--amber-badge-text)] font-bold font-mono">
                  <AlertTriangle className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <span>Codespace Permission Required</span>
                </div>
                <p className="text-[var(--amber-badge-text)] text-[11px]">
                  Your GitHub session needs authorization to manage Codespaces. Click below to grant Codespace permissions.
                </p>
                <button
                  onClick={() => signIn('github', { callbackUrl: window.location.href })}
                  className="rounded-lg bg-[var(--yellow-button-bg)] px-3 py-1.5 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition"
                >
                  Authorize GitHub Codespaces Permission
                </button>
              </div>
            )}

            {/* Quota Exceeded High-Visibility Alert */}
            {quotaError && (
              <div className="mt-4 rounded-xl border border-rose-500/60 bg-rose-950/40 p-4 space-y-3 animate-in fade-in">
                <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs uppercase font-mono">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>GitHub Codespaces Free Quota Limit Reached</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  GitHub rejected environment creation because your GitHub account has exhausted its included monthly free quota (120 core hours) or spending limit.
                </p>
                <div className="rounded-lg border border-rose-800/60 bg-rose-950/70 p-3 text-[11px] font-mono text-rose-200 space-y-1.5">
                  <div className="font-bold flex items-center space-x-1.5 text-rose-100">
                    <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
                    <span>Future Solutions &amp; Alternatives (Planned):</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    We are engineering automated local devcontainer orchestration and sponsored cloud runners so candidates never get blocked by GitHub quota exhaustion.
                  </p>
                  <p className="text-brand-lime font-bold text-[11px] pt-1">
                    👉 Immediate Fix: Clone the repository locally using Option 3 below to complete and submit your bugfix without using any Codespaces quota!
                  </p>
                </div>
              </div>
            )}

            {generalError && (
              <div className="mt-4 rounded-lg border border-rose-800/40 bg-rose-950/40 p-3 text-xs text-rose-300 font-mono animate-in fade-in space-y-2">
                <div className="flex items-center space-x-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{generalError}</span>
                </div>
                {generalError.includes('404') && (
                  <div className="text-[11px] text-slate-300 font-sans pt-1">
                    💡 <strong>Why this happens:</strong> GitHub returns 404 when your current session token lacks the <code>codespace</code> permission, or if the repository fork is still propagating on GitHub.
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        onClick={() => signIn('github', { callbackUrl: window.location.href })}
                        className="rounded-lg bg-[var(--yellow-button-bg)] px-3 py-1.5 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition"
                      >
                        Re-Authenticate with GitHub (Authorize Codespaces)
                      </button>
                      <a
                        href={defaultCodespacesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-card-border bg-[var(--gh-bg-darkest)] px-3 py-1.5 text-xs text-slate-300 hover:text-[var(--gh-text)] transition"
                      >
                        Launch Fallback Wizard (codespaces.new)
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {successInfo && (
              <div className="mt-4 rounded-lg border border-brand-lime/40 bg-lime-950/40 p-3 text-xs text-brand-lime font-mono animate-in fade-in flex items-center justify-between">
                <span>✅ {successInfo.message}</span>
                <a
                  href={successInfo.webUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-brand-lime px-2 py-0.5 text-[11px] font-bold text-slate-950 hover:bg-brand-lime-light"
                >
                  Open Codespace
                </a>
              </div>
            )}

            {/* Launch Instructions & Workspace Actions */}
            <div className="mt-5 space-y-4">
              {/* Intelligent Codespaces Section */}
              <div className="rounded-xl border border-purple-600/40 bg-gradient-to-r from-purple-950/40 to-slate-900/60 p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono flex items-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
                    <span>Option 1: Direct Cloud Codespace (Zero Setup)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-lime-400/90 bg-lime-950/60 border border-lime-800/40 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>

                {/* Loading inspection */}
                {isInspecting && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-lime" />
                    <span>Checking existing active Codespaces for {repo}...</span>
                  </div>
                )}

                {/* 3 Choices when existing codespaces exist */}
                {!isInspecting && hasCheckedExisting && existingCodespaces.length > 0 && primaryExistingCodespace && (
                  <div className="space-y-3 pt-1">
                    <div className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200">
                      <div className="flex items-center space-x-2 font-bold mb-1">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        <span>Previous Codespace Detected:</span>
                        <code className="text-white font-mono">{primaryExistingCodespace.name}</code>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Status: <span className="font-mono text-brand-lime">{primaryExistingCodespace.state}</span>
                        {primaryExistingCodespace.lastUsedAt && (
                          <span className="text-slate-400 ml-2">
                            • Last active {new Date(primaryExistingCodespace.lastUsedAt).toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-xs font-semibold text-slate-200">
                      Choose how you want to proceed with this challenge environment:
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Choice 1: Continue to Old Codespace */}
                      <button
                        onClick={() => handleExecuteCodespaceAction('continue', primaryExistingCodespace)}
                        disabled={!!executingAction}
                        className="flex items-center justify-between rounded-xl border border-brand-lime/40 bg-[var(--gh-bg-secondary)] p-3 text-left hover:border-brand-lime hover:bg-[var(--gh-bg-tertiary)] transition group disabled:opacity-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-950 border border-lime-800 text-brand-lime group-hover:scale-105 transition">
                            <Play className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-brand-lime transition">
                              1. Continue to old Codespace for {repo}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Resume your previous environment with all unstaged progress and files intact.
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-brand-lime transition" />
                      </button>

                      {/* Choice 2: Create new codespace and keep the old one */}
                      <button
                        onClick={() => handleExecuteCodespaceAction('create_keep', primaryExistingCodespace)}
                        disabled={!!executingAction}
                        className="flex items-center justify-between rounded-xl border border-card-border bg-[var(--gh-bg-secondary)] p-3 text-left hover:border-purple-500 hover:bg-[var(--gh-bg-tertiary)] transition group disabled:opacity-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-950 border border-purple-800 text-brand-purple-light group-hover:scale-105 transition">
                            {executingAction === 'create_keep' ? (
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                            ) : (
                              <Layers className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-brand-purple-light transition">
                              2. Create new Codespace and keep the old one
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Spin up a fresh isolated cloud workspace while keeping your previous Codespace active.
                            </div>
                          </div>
                        </div>
                        <Zap className="h-4 w-4 text-slate-400 group-hover:text-brand-purple-light transition" />
                      </button>

                      {/* Choice 3: Create new codespace and delete previous codespace */}
                      <button
                        onClick={() => handleExecuteCodespaceAction('create_delete', primaryExistingCodespace)}
                        disabled={!!executingAction}
                        className="flex items-center justify-between rounded-xl border border-card-border bg-[var(--gh-bg-secondary)] p-3 text-left hover:border-rose-500 hover:bg-[var(--gh-bg-tertiary)] transition group disabled:opacity-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-950 border border-rose-800 text-rose-400 group-hover:scale-105 transition">
                            {executingAction === 'create_delete' ? (
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-rose-400 transition">
                              3. Create new Codespace and delete the previous Codespace
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Provisions a fresh clean workspace and safely cleans up old instance to save your free quota.
                            </div>
                          </div>
                        </div>
                        <RotateCw className="h-4 w-4 text-slate-400 group-hover:text-rose-400 transition" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Fresh creation when NO existing codespace exists */}
                {!isInspecting && hasCheckedExisting && existingCodespaces.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Creates a dedicated GitHub Codespace directly for{' '}
                      <code className="text-brand-lime font-mono">{candidateGithubUsername || owner}/{repo}</code> and redirects directly to your active browser IDE.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={() => handleExecuteCodespaceAction('create')}
                        disabled={!!executingAction}
                        className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:brightness-110 transition shadow-glow-purple active:scale-95 disabled:opacity-50"
                      >
                        {executingAction === 'create' ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <Zap className="h-4 w-4 text-brand-lime" />
                        )}
                        <span>
                          {executingAction === 'create'
                            ? 'Creating & Booting Codespace...'
                            : `⚡ Create & Launch Codespace directly`}
                        </span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>

                      <a
                        href={defaultCodespacesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 rounded-xl border border-card-border bg-[var(--gh-bg-secondary)] px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95"
                        title="Fallback: Open codespaces.new creation screen on GitHub"
                      >
                        <Terminal className="h-3.5 w-3.5 text-brand-lime" />
                        <span>Fallback Wizard</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: VS Code Desktop & Direct Upstream */}
              <div className="rounded-xl border border-brand-lime/30 bg-lime-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-lime font-mono flex items-center space-x-1.5">
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Option 2: Local VS Code Desktop</span>
                  </h4>
                </div>
                <p className="text-xs text-slate-300">
                  Open the repository in your local VS Code editor via desktop protocol.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={vscodeUrl}
                    onClick={() => {
                      setVsCodeLaunched(true);
                      setTimeout(() => setVsCodeLaunched(false), 6000);
                    }}
                    className="flex items-center space-x-2 rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime active:scale-95"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Open in VS Code (Desktop)</span>
                  </a>

                  <a
                    href={cleanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 rounded-xl border border-card-border bg-card px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95"
                  >
                    <GitFork className="h-3.5 w-3.5 text-brand-purple" />
                    <span>View Upstream on GitHub</span>
                  </a>
                </div>

                {vsCodeLaunched && (
                  <div className="rounded-lg border border-brand-lime/40 bg-lime-950/40 p-2.5 text-xs text-brand-lime font-mono animate-in fade-in duration-150">
                    Launching VS Code Desktop protocol... If your browser prompted for permission, click &ldquo;Open Visual Studio Code&rdquo;. Alternatively, copy the Git Clone command below.
                  </div>
                )}
              </div>

              {/* Option 3: Local CLI */}
              <div className="rounded-xl border border-card-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Option 3: Terminal / Manual Git Workflow (Zero Quota Used)
                  </h4>
                  <button
                    onClick={() => handleCopy(gitCommands.join('\n'), 99)}
                    className="flex items-center space-x-1 text-[11px] font-mono text-brand-lime hover:underline"
                  >
                    {copiedIndex === 99 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedIndex === 99 ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>

                <div className="rounded-lg bg-[var(--gh-bg-code)] p-3 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto border border-card-border">
                  {gitCommands.map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <span className={cmd.startsWith('#') ? 'text-slate-500' : 'text-brand-lime-light'}>{cmd}</span>
                      {!cmd.startsWith('#') && (
                        <button
                          onClick={() => handleCopy(cmd, i)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-white transition"
                        >
                          {copiedIndex === i ? <Check className="h-3 w-3 text-brand-lime" /> : <Copy className="h-3 w-3" />}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PR Submission Instructions */}
              <div className="rounded-xl border border-card-border bg-[var(--gh-bg-secondary)] p-3 text-xs text-slate-400 font-mono">
                <span className="font-semibold text-white">How Evaluation Works:</span> Open a Pull Request targeting <code className="text-brand-lime font-mono">{branch}</code>. RepoHamster&apos;s webhook automatically runs public and hidden test suites in an isolated sandbox.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-card-border bg-card px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
