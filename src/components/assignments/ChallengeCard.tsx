'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Timer,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { TechIcon } from '@/components/common/TechIcon';
import { getTestCaseSummary } from '@/lib/test-case-utils';
import { computeAssessmentStatus } from '@/lib/anti-cheat';

interface ChallengeCardProps {
  assignment: any;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | string;
  evaluation?: any;
}

export function ChallengeCard({ assignment, status, evaluation }: ChallengeCardProps) {
  const statusInfo = computeAssessmentStatus({ status, evaluation });
  const isCompleted = statusInfo.outcome === 'COMPLETED';
  const isInProgress = status === 'IN_PROGRESS' || statusInfo.outcome === 'PARTIAL';
  const testSummary = getTestCaseSummary(assignment);

  const hasFramework =
    assignment.framework &&
    assignment.framework.toLowerCase() !== 'standard' &&
    assignment.framework.toLowerCase() !== assignment.language?.toLowerCase();

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-4 sm:p-5 shadow-none transition hover:border-[var(--yellow-primary)]/60 dark:shadow-xs dark:hover:shadow-sm">
      <div className="space-y-3">
        {/* Top Header: Difficulty & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-md bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2 py-0.5 text-[10px] text-[var(--amber-badge-text)] font-mono font-semibold uppercase">
            {assignment.difficulty || 'INTERMEDIATE'}
          </span>

          {/* Status Badge */}
          {statusInfo.isCheated ? (
            <span
              title={`Cheated in test by - ${statusInfo.cheatReason}`}
              className="inline-flex items-center rounded-full border border-red-700 bg-red-950/60 px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-300 max-w-[210px] truncate"
            >
              <ShieldAlert className="mr-1 h-3 w-3 shrink-0 text-red-400" />
              <span className="truncate">Cheated in test by - {statusInfo.cheatReason}</span>
            </span>
          ) : statusInfo.outcome === 'COMPLETED' ? (
            <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[var(--amber-badge-text)]">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Completed (Passed)
            </span>
          ) : statusInfo.outcome === 'PARTIAL' ? (
            <span className="inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--yellow-bright)] font-bold">
              <Clock className="mr-1 h-3 w-3" />
              {statusInfo.passedTests}/{statusInfo.totalTests} Passed
            </span>
          ) : isInProgress ? (
            <span className="inline-flex items-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--yellow-primary)] font-semibold">
              <Clock className="mr-1 h-3 w-3" />
              In Progress
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--gh-text-muted)]">
              Available
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-bold text-[var(--gh-text)] text-sm sm:text-base group-hover:text-[var(--yellow-bright)] transition line-clamp-1 font-sans">
            {assignment.title}
          </h3>
          <p className="mt-1 text-xs text-[var(--gh-text-muted)] line-clamp-2 leading-relaxed">
            {assignment.description}
          </p>
        </div>

        {/* Language & Framework with Real Icons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {/* Language Pill */}
          <div className="inline-flex items-center space-x-1.5 rounded-md border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2 py-1 text-[11px] font-mono font-semibold text-[var(--gh-text)]">
            <TechIcon name={assignment.language} size={14} />
            <span>{assignment.language}</span>
          </div>

          {/* Framework / Subcategory Pill if present */}
          {hasFramework && (
            <div className="inline-flex items-center space-x-1.5 rounded-md border border-[var(--amber-badge-border)]/60 bg-[var(--amber-badge-bg)]/40 px-2 py-1 text-[11px] font-mono text-[var(--amber-badge-text)] font-semibold">
              <TechIcon name={assignment.framework} size={14} />
              <span>{assignment.framework}</span>
            </div>
          )}

          <div className="ml-auto flex items-center space-x-1 text-[11px] font-mono text-[var(--gh-text-muted)]">
            <Timer className="h-3 w-3 text-[var(--gh-text-dim)]" />
            <span>~{assignment.estimatedTimeMinutes || 45}m</span>
          </div>
        </div>

        {/* Testcases Present Block */}
        <div className="rounded-lg border border-[var(--gh-border-subtle)] bg-[var(--gh-bg-secondary)] px-2.5 py-1.5 text-[10px] font-mono flex items-center justify-between">
          <span className="text-[var(--gh-text-muted)]">Testcases Present:</span>
          <span
            className={`truncate font-semibold ${
              testSummary.hasTestCases ? 'text-[var(--yellow-bright)]' : 'text-[var(--yellow-primary)]'
            }`}
            title={testSummary.displayText}
          >
            {testSummary.displayText}
          </span>
        </div>

        {/* Latest Evaluation Score if available */}
        {evaluation && (
          <div className="rounded-lg border border-[var(--gh-border-subtle)] bg-[var(--gh-bg-secondary)] p-2 text-xs font-mono">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--gh-text-muted)]">Latest Run:</span>
              <span
                className={`font-semibold ${
                  evaluation.isPassed ? 'text-[var(--yellow-bright)]' : 'text-[var(--yellow-primary)]'
                }`}
              >
                {evaluation.scorePercent}% ({evaluation.passedTests}/{evaluation.totalTests} tests)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Action Button */}
      <div className="mt-4 border-t border-[var(--gh-border-subtle)] pt-3">
        <Link
          href={`/assignments/${assignment.slug}`}
          className={`flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-2 text-xs font-semibold transition active:scale-95 ${
            isCompleted
              ? 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/50'
              : 'bg-[var(--yellow-button-bg)] text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] shadow-none dark:shadow-[var(--yellow-glow)] font-bold'
          }`}
        >
          <span>
            {isCompleted
              ? 'Review Solution'
              : isInProgress
              ? 'Resume in Codespaces'
              : 'Start Challenge'}
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
