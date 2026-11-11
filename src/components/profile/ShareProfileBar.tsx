'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Share2 } from 'lucide-react';

interface ShareProfileBarProps {
  username: string;
  variant?: 'compact' | 'full';
}

export function ShareProfileBar({ username, variant = 'full' }: ShareProfileBarProps) {
  const [copied, setCopied] = useState(false);

  // Generate shareable URL (default to window origin if available, fallback to production domain)
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
      // Fallback
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
        className="inline-flex items-center space-x-1.5 rounded-lg border border-card-border bg-[#0a0d14] px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-brand-lime/50 hover:text-white transition active:scale-95"
        title="Copy Public Profile Link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-brand-lime" />
            <span className="text-brand-lime font-bold">Copied!</span>
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
    <div className="rounded-xl border border-card-border/80 bg-[#0d111a] p-3 sm:p-4 shadow-inner">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card border border-brand-lime/30 text-brand-lime">
            <Share2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Public Sharable Profile Link
            </p>
            <p className="text-xs font-mono text-brand-lime truncate select-all">
              https://www.repohamster.com/@{username}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
              copied
                ? 'bg-lime-950/80 border border-brand-lime text-brand-lime shadow-glow-lime'
                : 'bg-brand-lime text-slate-950 hover:bg-brand-lime-light shadow-glow-lime'
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

          <a
            href={`/@${username}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 rounded-lg border border-card-border bg-card px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <span>Preview</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <button
            onClick={shareOnTwitter}
            className="rounded-lg border border-card-border bg-card px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:border-sky-500/50 transition"
            title="Share on X / Twitter"
          >
            𝕏 Post
          </button>

          <button
            onClick={shareOnLinkedIn}
            className="rounded-lg border border-card-border bg-card px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:border-blue-500/50 transition"
            title="Share on LinkedIn"
          >
            in Share
          </button>
        </div>
      </div>
    </div>
  );
}
