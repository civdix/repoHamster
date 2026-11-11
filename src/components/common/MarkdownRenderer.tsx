'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div
      className={`prose dark:prose-invert max-w-none text-[var(--gh-text-secondary)] text-xs sm:text-sm leading-relaxed
        prose-headings:text-[var(--gh-text)] prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-lg prose-h1:border-b prose-h1:border-[var(--gh-border)] prose-h1:pb-2 prose-h1:mt-4 prose-h1:mb-3
        prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-h2:text-[var(--yellow-bright)]
        prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-1.5 prose-h3:text-[var(--gh-text)]
        prose-p:my-2 prose-p:leading-relaxed prose-p:text-[var(--gh-text-secondary)]
        prose-ul:my-2 prose-ul:pl-5 prose-ul:list-disc
        prose-ol:my-2 prose-ol:pl-5 prose-ol:list-decimal
        prose-li:my-0.5
        prose-code:text-[var(--yellow-bright)] prose-code:bg-[var(--gh-bg-secondary)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[11px] prose-code:border prose-code:border-[var(--gh-border)]
        prose-pre:bg-[var(--gh-bg-secondary)] prose-pre:border prose-pre:border-[var(--gh-border)] prose-pre:rounded-xl prose-pre:p-3 prose-pre:my-3 prose-pre:overflow-x-auto
        prose-strong:text-[var(--gh-text)] prose-strong:font-bold
        prose-a:text-[var(--yellow-bright)] prose-a:underline hover:opacity-80
        prose-table:border-collapse prose-table:w-full prose-table:my-3
        prose-th:border prose-th:border-[var(--gh-border)] prose-th:bg-[var(--gh-bg-secondary)] prose-th:p-2 prose-th:text-left prose-th:text-[var(--gh-text)]
        prose-td:border prose-td:border-[var(--gh-border)] prose-td:p-2
        prose-blockquote:border-l-4 prose-blockquote:border-[var(--yellow-primary)] prose-blockquote:bg-[var(--amber-badge-bg)]/30 prose-blockquote:px-3 prose-blockquote:py-1 prose-blockquote:rounded-r-lg prose-blockquote:text-[var(--gh-text-secondary)]
        ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
