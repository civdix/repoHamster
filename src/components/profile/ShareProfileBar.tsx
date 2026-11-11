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
        className="inline-flex items-center space-x-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-1.5 text-xs font-mono text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 hover:text-[var(--yellow-bright)] transition active:scale-95"
        title="Copy Public Profile Link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <span className="text-[var(--yellow-bright)] font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5 text-[var(--gh-text-muted)]" />
            <span>Share Profile</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--gh-bg-secondary)] border border-[var(--yellow-primary)]/40 text-[var(--yellow-bright)]">
            <Share2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--gh-text-muted)] font-semibold">
              Public Sharable Profile Link
            </p>
            <p className="text-xs font-mono text-[var(--yellow-bright)] truncate select-all">
              https://www.repohamster.com/@{username}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
              copied
                ? 'bg-[var(--amber-badge-bg)] border border-[var(--yellow-bright)] text-[var(--amber-badge-text)] shadow-[var(--yellow-glow)]'
                : 'bg-[var(--yellow-button-bg)] hover:bg-[var(--yellow-button-hover)] text-[var(--yellow-button-text)] shadow-[var(--yellow-glow)]'
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
            className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-1.5 text-xs text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 transition"
            title="Share on X / Twitter"
          >
            𝕏 Post
          </button>

          <button
            onClick={shareOnLinkedIn}
            className="rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-1.5 text-xs text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 transition"
            title="Share on LinkedIn"
          >
            in Share
          </button>
        </div>
      </div>
    </div>
  );
}
