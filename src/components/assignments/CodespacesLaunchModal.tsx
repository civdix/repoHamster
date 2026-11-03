'use client';

import { useState } from 'react';
import { ExternalLink, Terminal, Copy, Check, GitFork, ArrowUpRight, X } from 'lucide-react';

interface CodespacesLaunchModalProps {
  repoUrl: string;
  assignmentTitle: string;
}

export function CodespacesLaunchModal({ repoUrl, assignmentTitle }: CodespacesLaunchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Extract owner and repo from URL: e.g. https://github.com/debuglab-assessments/ecommerce-concurrency-ratelimit
  const parts = repoUrl.replace('https://github.com/', '').split('/');
  const owner = parts[0] || 'debuglab-assessments';
  const repo = parts[1] || 'assignment';

  const codespacesUrl = `https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=${owner}/${repo}`;

  const gitCommands = [
    `git clone ${repoUrl}.git`,
    `cd ${repo}`,
    `git checkout -b fix/solution`,
    `# Fix the bug, run tests locally`,
    `git commit -am "fix: resolve concurrency race condition and rate limit leak"`,
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
        className="flex items-center space-x-2 rounded-xl bg-accent-cyan px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition"
      >
        <Terminal className="h-4 w-4" />
        <span>Open in GitHub Codespaces</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-card-border bg-[#0d1424] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-accent-cyan">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Launch Codespace Environment</h3>
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
              <div className="rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                  Option 1: Recommended One-Click Cloud Environment
                </h4>
                <p className="mt-1 text-xs text-slate-300">
                  GitHub Codespaces provides a pre-configured VS Code container with Node, Python, or Go runtimes, linters, and extensions ready out of the box.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={codespacesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 rounded-lg bg-accent-cyan px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition"
                  >
                    <span>Launch Codespaces Now</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 rounded-lg border border-card-border bg-card px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
                  >
                    <GitFork className="h-3.5 w-3.5" />
                    <span>View Repository on GitHub</span>
                  </a>
                </div>
              </div>

              {/* Option 2: Local CLI */}
              <div className="rounded-xl border border-card-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Option 2: Local Git Workflow
                  </h4>
                  <button
                    onClick={() => handleCopy(gitCommands.join('\n'), 99)}
                    className="flex items-center space-x-1 text-[11px] font-mono text-accent-cyan hover:underline"
                  >
                    {copiedIndex === 99 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedIndex === 99 ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>

                <div className="rounded-lg bg-[#070a12] p-3 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto border border-card-border">
                  {gitCommands.map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <span className={cmd.startsWith('#') ? 'text-slate-500' : 'text-cyan-300'}>{cmd}</span>
                      {!cmd.startsWith('#') && (
                        <button
                          onClick={() => handleCopy(cmd, i)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-white transition"
                        >
                          {copiedIndex === i ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PR Submission Instructions */}
              <div className="rounded-lg border border-card-border bg-[#090d16] p-3 text-xs text-slate-400">
                <span className="font-semibold text-white">How Evaluation Works:</span> Once you push your branch and open a Pull Request to <code className="text-accent-cyan font-mono">main</code>, DebugLab's webhook engine automatically detects the PR commit SHA, runs public and hidden test suites in an isolated sandbox, and records the score on your dashboard.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-card-border bg-card px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
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
