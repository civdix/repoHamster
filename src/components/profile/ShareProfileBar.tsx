'use client';

import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface ShareProfileBarProps {
  username: string;
  variant?: 'compact' | 'full';
}

export function ShareProfileBar({ username, variant = 'full' }: ShareProfileBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return `${window.location.origin}/@${username}`;
    }
    return `https://www.repohamster.com/@${username}`;
  };

  const handleCopy = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`Check out my developer debugging profile and solved challenges on @RepoHamster! 🐹`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleCopy}
        className="inline-flex items-center space-x-1.5 rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-yellow-500/50 hover:text-white transition active:scale-95"
        title="Copy Public Profile Link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-yellow-400 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Share Profile</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#161b22] border border-yellow-500/40 text-yellow-400">
            <Share2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Public Sharable Profile Link
            </p>
            <p className="text-xs font-mono text-yellow-400 truncate select-all">
              https://www.repohamster.com/@{username}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
              copied
                ? 'bg-yellow-950/80 border border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                : 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-[0_0_15px_rgba(234,179,8,0.25)]'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            onClick={shareOnTwitter}
            className="rounded-lg border border-[#30363d] bg-[#161b22] px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:border-yellow-500/50 transition"
            title="Share on X / Twitter"
          >
            𝕏 Post
          </button>

          <button
            onClick={shareOnLinkedIn}
            className="rounded-lg border border-[#30363d] bg-[#161b22] px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:border-yellow-500/50 transition"
            title="Share on LinkedIn"
          >
            in Share
          </button>
        </div>
      </div>
    </div>
  );
}
