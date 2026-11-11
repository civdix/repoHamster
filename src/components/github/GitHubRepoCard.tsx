'use client';

import Link from 'next/link';
import { BookMarked, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

interface GitHubRepoCardProps {
  title: string;
  slug: string;
  description: string;
  language: string;
  difficulty?: string;
  isPassed?: boolean;
  status?: string;
  prUrl?: string;
  starsCount?: number;
}

export function GitHubRepoCard({
  title,
  slug,
  description,
  language,
  difficulty = 'INTERMEDIATE',
  isPassed = false,
  status = 'COMPLETED',
  prUrl,
  starsCount = 1,
}: GitHubRepoCardProps) {
  return (
    <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-4 flex flex-col justify-between hover:border-[var(--yellow-primary)]/60 transition group shadow-sm">
      <div className="space-y-2.5">
        {/* Header: Book Icon + Title + Visibility Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <BookMarked className="h-4 w-4 text-[var(--gh-text-muted)] group-hover:text-[var(--yellow-bright)] shrink-0 transition" />
            <Link
              href={`/assignments/${slug}`}
              className="text-sm font-semibold text-[var(--yellow-bright)] hover:underline truncate"
              title={title}
            >
              {title}
            </Link>
          </div>
          <span className="rounded-full border border-[var(--gh-border)] px-2 py-0.5 text-[10px] font-mono text-[var(--gh-text-muted)] shrink-0">
            Public
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--gh-text-muted)] line-clamp-2 leading-relaxed">
          {description || 'Interactive repository coding and testcase challenge on RepoHamster.'}
        </p>
      </div>

      {/* Footer: Language dot + Difficulty + Stars/PR link */}
      <div className="mt-4 pt-3 border-t border-[var(--gh-border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)]">
        <div className="flex items-center space-x-3">
          {/* Yellow Dot + Language */}
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-[var(--yellow-bright)] inline-block shadow-[0_0_5px_var(--yellow-glow)]" />
            <span className="text-[var(--gh-text-secondary)]">{language || 'TypeScript'}</span>
          </div>

          {/* Difficulty Tag (Variables) */}
          <span className="rounded-md bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2 py-0.5 text-[10px] text-[var(--amber-badge-text)] font-semibold uppercase">
            {difficulty}
          </span>
        </div>

        {/* Status / PR link */}
        <div className="flex items-center space-x-2">
          {isPassed ? (
            <span className="flex items-center space-x-1 text-[var(--yellow-bright)] font-semibold text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Solved</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-[var(--gh-text-muted)] text-[11px]">
              <Clock className="h-3.5 w-3.5" />
              <span>In Progress</span>
            </span>
          )}

          {prUrl && (
            <a
              href={prUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--gh-text-muted)] hover:text-[var(--yellow-bright)] transition"
              title="View GitHub Pull Request"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
