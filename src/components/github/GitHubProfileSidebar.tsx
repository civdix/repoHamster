'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ExternalLink,
  Shield,
  CheckCircle2,
  Award,
  Share2,
  Check,
  Flame,
  Zap,
  Code2,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface GitHubProfileSidebarProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    githubUsername: string | null;
    avatarUrl: string | null;
    email?: string | null;
    role: string;
    createdAt: Date | string;
  };
  isOwner?: boolean;
  stacksSolved?: string[];
  stats?: {
    solvedCount: number;
    passRate: number;
    submissionsCount: number;
  };
}

export function GitHubProfileSidebar({
  user,
  isOwner = false,
  stacksSolved = [],
  stats,
}: GitHubProfileSidebarProps) {
  const [copied, setCopied] = useState(false);
  const displayHandle = user.username || user.githubUsername || 'coder';
  const displayName = user.name || displayHandle;

  const handleCopyLink = async () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/@${displayHandle}`
        : `https://www.repohamster.com/@${displayHandle}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 text-[var(--gh-text)]">
      {/* 1. Avatar & Names */}
      <div className="space-y-4">
        <div className="relative inline-block">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="h-44 w-44 sm:h-56 sm:w-56 rounded-full border-2 border-[var(--yellow-primary)]/70 object-cover shadow-[var(--yellow-glow-lg)] bg-[var(--gh-bg-secondary)]"
            />
          ) : (
            <div className="flex h-44 w-44 sm:h-56 sm:w-56 items-center justify-center rounded-full border-2 border-[var(--yellow-primary)]/70 bg-[var(--gh-bg-secondary)] shadow-[var(--yellow-glow-lg)] p-4">
              <HamsterMascot variant="normal" size={140} />
            </div>
          )}

          {/* Online status indicator */}
          <div
            className="absolute bottom-2 right-4 flex items-center justify-center h-8 w-8 rounded-full bg-[var(--gh-bg)] border border-[var(--gh-border)] shadow-md"
            title="Active on RepoHamster"
          >
            <span className="text-base">🐹</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--gh-text)] font-sans">
            {displayName}
          </h1>
          <p className="text-sm font-mono text-[var(--yellow-bright)] font-semibold">
            @{displayHandle}
          </p>
        </div>

        {/* Bio */}
        <p className="text-xs text-[var(--gh-text-muted)] leading-relaxed">
          Software engineer solving real-world repository bugs &amp; automated test evaluations on RepoHamster.
        </p>

        {/* Role Pill (Driven by CSS Variables) */}
        <div className="pt-1">
          {user.role === 'ADMIN' ? (
            <span className="inline-flex items-center rounded-full border border-[var(--yellow-primary)]/60 bg-[var(--amber-badge-bg)] px-3 py-1 text-xs font-mono font-bold text-[var(--amber-badge-text)] shadow-[var(--yellow-glow-lg)]">
              <Shield className="mr-1.5 h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              Platform Admin
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-1 text-xs font-mono font-medium text-[var(--amber-badge-text)]">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              Verified Candidate
            </span>
          )}
        </div>

        {/* Action Button: Edit Profile (if owner) OR Share Profile */}
        <div className="space-y-2 pt-2">
          {isOwner ? (
            <Link
              href="/profile"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[var(--gh-bg-tertiary)] border border-[var(--gh-border)] px-4 py-2 text-xs font-bold text-[var(--gh-text)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/60 transition active:scale-95 shadow-sm"
            >
              <span>Edit Profile &amp; Handle</span>
            </Link>
          ) : null}

          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 shadow-sm ${
              copied
                ? 'bg-[var(--amber-badge-bg)] border border-[var(--yellow-bright)] text-[var(--amber-badge-text)] shadow-[var(--yellow-glow-lg)]'
                : 'bg-[var(--yellow-primary)] hover:bg-[var(--yellow-bright)] text-[var(--yellow-button-text)] shadow-[var(--yellow-glow-lg)]'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[var(--amber-badge-text)]" />
                <span>Copied Profile Link!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Profile (@{displayHandle})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Meta Info (GitHub style) */}
      <div className="space-y-2 text-xs font-mono text-[var(--gh-text-muted)] border-t border-[var(--gh-border-subtle)] pt-4">
        {user.githubUsername && (
          <div className="flex items-center space-x-2 text-[var(--gh-text-secondary)]">
            <ExternalLink className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
            <a
              href={`https://github.com/${user.githubUsername}`}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--yellow-bright)] hover:underline truncate"
            >
              github.com/{user.githubUsername}
            </a>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Calendar className="h-3.5 w-3.5 text-[var(--gh-text-dim)]" />
          <span>
            Joined {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* 3. GitHub Achievements Box (Variables) */}
      <div className="border-t border-[var(--gh-border-subtle)] pt-4 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--gh-text-muted)] flex items-center space-x-1.5">
          <Award className="h-4 w-4 text-[var(--yellow-bright)]" />
          <span>Achievements</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2.5 flex items-center space-x-2 hover:border-[var(--yellow-primary)]/50 transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[var(--gh-text)] truncate">Bug Hunter</p>
              <p className="text-[9px] font-mono text-[var(--amber-badge-text)] truncate">{stats?.solvedCount || 0} Solved</p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2.5 flex items-center space-x-2 hover:border-[var(--yellow-primary)]/50 transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] shrink-0">
              <Flame className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[var(--gh-text)] truncate">Pull Shark</p>
              <p className="text-[9px] font-mono text-[var(--amber-badge-text)] truncate">{stats?.submissionsCount || 0} PRs</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Mastered Technologies */}
      {stacksSolved.length > 0 && (
        <div className="border-t border-[var(--gh-border-subtle)] pt-4 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--gh-text-muted)] flex items-center space-x-1.5">
            <Code2 className="h-4 w-4 text-[var(--yellow-bright)]" />
            <span>Technologies</span>
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {stacksSolved.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center rounded-md border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2 py-0.5 text-[11px] font-mono text-[var(--amber-badge-text)]"
              >
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)]" />
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
