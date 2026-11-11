'use client';

import Link from 'next/link';
import { BookMarked, CheckCircle2, Clock, GitFork, Star, ExternalLink } from 'lucide-react';

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
    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 flex flex-col justify-between hover:border-yellow-500/60 transition group shadow-sm">
      <div className="space-y-2.5">
        {/* Header: Book Icon + Title + Visibility Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <BookMarked className="h-4 w-4 text-slate-400 group-hover:text-yellow-400 shrink-0 transition" />
            <Link
              href={`/assignments/${slug}`}
              className="text-sm font-semibold text-yellow-400 hover:underline truncate"
              title={title}
            >
              {title}
            </Link>
          </div>
          <span className="rounded-full border border-[#30363d] px-2 py-0.5 text-[10px] font-mono text-slate-400 shrink-0">
            Public
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {description || 'Interactive repository coding and testcase challenge on RepoHamster.'}
        </p>
      </div>

      {/* Footer: Language dot + Difficulty + Stars/PR link */}
      <div className="mt-4 pt-3 border-t border-[#21262d] flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-3">
          {/* Yellow Dot + Language */}
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-yellow-400 inline-block shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
            <span className="text-slate-300">{language || 'TypeScript'}</span>
          </div>

          {/* Difficulty Tag (Yellow + Dark) */}
          <span className="rounded-md bg-[#422006] border border-[#713f12] px-2 py-0.5 text-[10px] text-yellow-300 font-semibold uppercase">
            {difficulty}
          </span>
        </div>

        {/* Status / PR link */}
        <div className="flex items-center space-x-2">
          {isPassed ? (
            <span className="flex items-center space-x-1 text-yellow-400 font-semibold text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Solved</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
              <Clock className="h-3.5 w-3.5" />
              <span>In Progress</span>
            </span>
          )}

          {prUrl && (
            <a
              href={prUrl}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-yellow-400 transition"
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
