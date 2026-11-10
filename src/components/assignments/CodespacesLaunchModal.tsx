'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface CodespacesLaunchModalProps {
  repoUrl: string;
  assignmentTitle: string;
  assignmentId?: string;
  candidateGithubUsername?: string;
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

  // Auto-fork state
  const [isForking, setIsForking] = useState(false);
  const [forkData, setForkData] = useState<{
    forkOwner?: string;
    forkRepo?: string;
    forkUrl?: string;
    codespaceUrl?: string;
    alreadyExists?: boolean;
    message?: string;
  } | null>(null);
  const [forkError, setForkError] = useState<string | null>(null);

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

  const handleAutoForkAndLaunch = async () => {
    setIsForking(true);
    setForkError(null);

    try {
      const res = await fetch('/api/candidate/fork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, assignmentId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setForkData(data);
        if (data.codespaceUrl) {
          window.open(data.codespaceUrl, '_blank');
        }
      } else {
        setForkError(data.message || 'Could not auto-fork repository.');
        // Fallback: Open upstream Codespaces directly
        if (data.codespaceUrl || defaultCodespacesUrl) {
          window.open(data.codespaceUrl || defaultCodespacesUrl, '_blank');
        }
      }
    } catch (err: any) {
      setForkError(err.message || 'Network error triggering fork.');
      window.open(defaultCodespacesUrl, '_blank');
    } finally {
      setIsForking(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 rounded-xl bg-brand-lime px-5 py-2.5 text-xs font-bold text-slate-950 shadow-glow-lime hover:bg-brand-lime-light transition active:scale-95"
      >
        <Terminal className="h-4 w-4" />
        <span>Launch Codespaces / VS Code</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-card-border bg-[#0d101a] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-brand-lime/50 shadow-glow-lime">
                  <HamsterMascot variant="avatar" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Launch Assessment Workspace</h3>
                  <p className="text-xs text-slate-400 font-mono">{cleanUrl}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Launch Instructions */}
            <div className="mt-5 space-y-4">
              {/* Option 1: 1-Click Auto-Fork & Launch Codespaces (Hero Option) */}
              <div className="rounded-xl border border-purple-600/40 bg-gradient-to-r from-purple-950/40 to-slate-900/60 p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono flex items-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-lime" />
                    <span>Option 1: 1-Click Auto-Fork &amp; Launch Codespaces</span>
                  </h4>
                  <span className="text-[10px] font-mono text-lime-400/90 bg-lime-950/60 border border-lime-800/40 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Automatically forks <code className="text-brand-lime font-mono">{owner}/{repo}</code> into your personal GitHub account and immediately boots an in-browser VS Code cloud environment pre-configured with Socratic AI guardrails.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleAutoForkAndLaunch}
                    disabled={isForking}
                    className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-purple to-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:brightness-110 transition shadow-glow-purple active:scale-95 disabled:opacity-50"
                  >
                    {isForking ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Zap className="h-4 w-4 text-brand-lime" />
                    )}
                    <span>
                      {isForking
                        ? 'Forking & Booting Codespace...'
                        : candidateGithubUsername
                        ? `⚡ Fork to @${candidateGithubUsername} & Launch Codespaces`
                        : '⚡ 1-Click Auto-Fork & Launch Codespaces'}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </button>

                  <a
                    href={defaultCodespacesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 rounded-xl border border-card-border bg-[#0a0d14] px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95"
                    title="Launch Codespaces directly on upstream repo without forking"
                  >
                    <Terminal className="h-3.5 w-3.5 text-brand-lime" />
                    <span>Direct Upstream Codespace</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {forkData && (
                  <div className="rounded-lg border border-brand-lime/40 bg-lime-950/40 p-2.5 text-xs text-brand-lime font-mono animate-in fade-in flex flex-wrap items-center justify-between gap-2">
                    <span>
                      ✅ {forkData.alreadyExists ? 'Using active fork:' : 'Fork ready:'}{' '}
                      <a
                        href={forkData.forkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-bold text-white hover:text-brand-lime"
                      >
                        {forkData.forkOwner}/{forkData.forkRepo}
                      </a>
                    </span>
                    {forkData.codespaceUrl && (
                      <a
                        href={forkData.codespaceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:underline text-[11px] font-bold flex items-center space-x-1 bg-lime-950 px-2 py-0.5 rounded border border-lime-700/50"
                      >
                        <span>Open Codespace</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}

                {forkError && (
                  <div className="rounded-lg border border-amber-800/40 bg-amber-950/40 p-2.5 text-xs text-amber-300 font-mono animate-in fade-in">
                    ℹ️ {forkError} (Opening direct Codespace session...)
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
                    Option 3: Terminal / Manual Git Workflow
                  </h4>
                  <button
                    onClick={() => handleCopy(gitCommands.join('\n'), 99)}
                    className="flex items-center space-x-1 text-[11px] font-mono text-brand-lime hover:underline"
                  >
                    {copiedIndex === 99 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedIndex === 99 ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>

                <div className="rounded-lg bg-[#07090e] p-3 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto border border-card-border">
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
              <div className="rounded-xl border border-card-border bg-[#0a0d14] p-3 text-xs text-slate-400 font-mono">
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
