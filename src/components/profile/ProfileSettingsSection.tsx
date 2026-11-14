'use client';

import React, { useState } from 'react';
import {
  Settings,
  Bot,
  Zap,
  ChevronDown,
  ChevronUp,
  Sliders,
  Shield,
  Eye,
  UserCheck,
} from 'lucide-react';
import { UsernameEditor } from './UsernameEditor';
import { ShareProfileBar } from './ShareProfileBar';

interface ProfileSettingsSectionProps {
  displayUsername: string;
  userId: string;
  remainingRequests: number;
  dailyRequestLimit: number;
  remainingTokens: number;
  dailyTokenLimit: number;
}

export function ProfileSettingsSection({
  displayUsername,
  userId,
  remainingRequests,
  dailyRequestLimit,
  remainingTokens,
  dailyTokenLimit,
}: ProfileSettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 sm:p-6 space-y-4 shadow-sm transition-all">
      {/* Top Bar: Handle Info + AI Quotas + Settings Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: User Identity & Settings Button */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center font-mono font-bold text-sm text-[var(--amber-badge-text)] shadow-xs">
            {displayUsername.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-[var(--gh-text)] font-sans">
                @{displayUsername}
              </span>
              <span className="rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2 py-0.2 text-[10px] font-mono font-bold">
                Active
              </span>
            </div>
            <p className="text-[11px] font-mono text-[var(--gh-text-muted)]">
              Developer Profile &amp; Sandbox Quota
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`ml-2 inline-flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono font-semibold transition active:scale-95 ${
              isOpen
                ? 'bg-[var(--yellow-primary)] text-white border-[var(--yellow-primary)]'
                : 'bg-[var(--gh-bg)] border-[var(--gh-border)] text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)]'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Settings</span>
            {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Right: Hamster AI Credit Meters */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2 font-mono text-xs space-y-0.5 shadow-2xs">
            <div className="flex items-center justify-between space-x-3 text-[var(--gh-text-muted)] text-[11px]">
              <span className="flex items-center space-x-1">
                <Bot className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                <span>Daily AI Queries</span>
              </span>
              <span className="text-[var(--yellow-bright)] font-bold">
                {remainingRequests} / {dailyRequestLimit}
              </span>
            </div>
            <div className="w-36 h-1.5 rounded-full bg-[var(--gh-bg-tertiary)] overflow-hidden mt-1">
              <div
                style={{ width: `${Math.min(100, (remainingRequests / dailyRequestLimit) * 100)}%` }}
                className="h-full bg-[var(--yellow-bright)] rounded-full transition-all duration-300"
              />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2 font-mono text-xs space-y-0.5 shadow-2xs">
            <div className="flex items-center justify-between space-x-3 text-[var(--gh-text-muted)] text-[11px]">
              <span className="flex items-center space-x-1">
                <Zap className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                <span>Daily Token Budget</span>
              </span>
              <span className="text-[var(--yellow-bright)] font-bold">
                {remainingTokens.toLocaleString()}
              </span>
            </div>
            <div className="w-36 h-1.5 rounded-full bg-[var(--gh-bg-tertiary)] overflow-hidden mt-1">
              <div
                style={{ width: `${Math.min(100, (remainingTokens / dailyTokenLimit) * 100)}%` }}
                className="h-full bg-[var(--yellow-bright)] rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Dedicated Settings Section */}
      {isOpen && (
        <div className="pt-4 border-t border-[var(--gh-border)] space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-[var(--yellow-bright)]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--gh-text)]">
                Developer Profile Settings
              </h3>
            </div>
            <span className="rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2 py-0.5 text-[10px] font-mono text-[var(--amber-badge-text)] font-bold">
              Configurable
            </span>
          </div>

          {/* Setting 1: Custom Developer Handle */}
          <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[var(--gh-text)]">
              <UserCheck className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Public Developer Handle</span>
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)]">
              Your handle is displayed on the Global Leaderboard, public profile, and repository submission badges.
            </p>
            <div className="pt-1">
              <UsernameEditor initialUsername={displayUsername} userId={userId} />
            </div>
          </div>

          {/* Setting 2: Assessment Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 space-y-1">
              <span className="font-bold text-[var(--gh-text)] flex items-center space-x-1.5">
                <Eye className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Public Portfolio Visibility</span>
              </span>
              <p className="text-[11px] text-[var(--gh-text-secondary)]">
                Anyone with your profile link can view your verified passed tests and Repo Stars.
              </p>
              <span className="text-[10px] text-[#10B981] font-bold block pt-1">
                ✓ Enabled (Publicly Indexed)
              </span>
            </div>

            <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3.5 space-y-1">
              <span className="font-bold text-[var(--gh-text)] flex items-center space-x-1.5">
                <Shield className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                <span>Default Assessment Track</span>
              </span>
              <p className="text-[11px] text-[var(--gh-text-secondary)]">
                Preferred runtime environment for launching repo challenges.
              </p>
              <span className="text-[10px] text-[var(--yellow-bright)] font-bold block pt-1">
                Track A: AI-Assisted (Dual Mode)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Share Profile Link Bar */}
      <div className="pt-2 border-t border-[var(--gh-border-subtle)]">
        <ShareProfileBar username={displayUsername} />
      </div>
    </div>
  );
}
