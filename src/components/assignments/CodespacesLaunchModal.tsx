'use client';

import { useState } from 'react';
import { ExternalLink, Terminal, Copy, Check, GitFork, ArrowUpRight, X } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface CodespacesLaunchModalProps {
  repoUrl: string;
  assignmentTitle: string;
}

export function CodespacesLaunchModal({ repoUrl, assignmentTitle }: CodespacesLaunchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const parts = repoUrl.replace('https://github.com/', '').split('/');
  const owner = parts[0] || 'debuglab-assessments';
  const repo = parts[1] || 'assignment';

  const codespacesUrl = `https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=${owner}/${repo}`;

  const gitCommands = [
    `git clone ${repoUrl}.git`,
    `cd ${repo}`,
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 rounded-xl bg-brand-lime px-5 py-2.5 text-xs font-bold text-slate-950 shadow-glow-lime hover:bg-brand-lime-light transition"
      >
        <Terminal className="h-4 w-4" />
        <span>Open in GitHub Codespaces</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-card-border bg-[#0d101a] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-brand-lime/50 shadow-glow-lime">
                  <HamsterMascot variant="avatar" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Launch Codespaces Environment</h3>
                  <p className="text-xs text-slate-400 font-mono">{repoUrl}</p>
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
              <div className="rounded-xl border border-brand-lime/30 bg-lime-950/20 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-lime font-mono">
                  Option 1: Recommended 1-Click Cloud Workspace
                </h4>
                <p className="mt-1 text-xs text-slate-300">
                  GitHub Codespaces opens a pre-configured VS Code container in your browser with language runtimes, linters, and testing suites pre-installed.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={codespacesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime"
                  >
                    <span>Launch Codespaces Now</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 rounded-xl border border-card-border bg-card px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
                  >
                    <GitFork className="h-3.5 w-3.5 text-brand-purple" />
                    <span>View Repository on GitHub</span>
                  </a>
                </div>
              </div>

              {/* Option 2: Local CLI */}
              <div className="rounded-xl border border-card-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Option 2: Local Git Clone Workflow
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
                <span className="font-semibold text-white">How Evaluation Works:</span> Open a Pull Request targeting <code className="text-brand-lime font-mono">main</code>. RepoHamster&apos;s webhook automatically runs public and hidden test suites in an isolated sandbox.
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
