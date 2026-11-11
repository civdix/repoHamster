'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Code2, Shield, User, LogOut, CheckCircle2, BookOpen, Eye } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isStaffAdmin = (session?.user as any)?.role === 'ADMIN';
  const isReviewer = (session?.user as any)?.role === 'REVIEWER' || (session?.user as any)?.isReviewer === true;
  const canSeeAdmin = isStaffAdmin || isReviewer;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--gh-border)] bg-[var(--gh-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] group-hover:border-[var(--yellow-primary)]/60 group-hover:shadow-[var(--yellow-glow-lg)] transition p-1">
              <HamsterMascot variant="normal" size={32} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold tracking-tight text-[var(--gh-text)] text-lg font-sans">
                  Repo<span className="text-[var(--yellow-bright)]">Hamster</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-[var(--gh-text-muted)] -mt-0.5 hidden sm:block">
                Break Bugs. Ship Fixes.
              </p>
            </div>
          </Link>

          {/* Navigation Links (Yellow + Dark) */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                pathname === '/dashboard' || pathname?.startsWith('/assignments')
                  ? 'bg-[var(--gh-bg-secondary)] text-[var(--yellow-bright)] border border-[var(--gh-border)]'
                  : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg-secondary)]/60'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Challenges</span>
            </Link>

            <Link
              href="/guide"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                pathname === '/guide'
                  ? 'bg-[var(--gh-bg-secondary)] text-[var(--yellow-bright)] border border-[var(--gh-border)]'
                  : 'text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg-secondary)]/60'
              }`}
            >
              <BookOpen className="h-4 w-4 text-[var(--yellow-bright)]" />
              <span>How to Use</span>
            </Link>

            {canSeeAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  pathname?.startsWith('/admin')
                    ? 'bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border border-[var(--amber-badge-border)]'
                    : 'text-[var(--gh-text-muted)] hover:text-[var(--yellow-bright)] hover:bg-[var(--gh-bg-secondary)]/40'
                }`}
              >
                {isReviewer ? (
                  <Eye className="h-4 w-4 text-[var(--yellow-bright)]" />
                ) : (
                  <Shield className="h-4 w-4 text-[var(--yellow-bright)]" />
                )}
                <span>Admin Console {isReviewer && '(Preview)'}</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center space-x-3">
          {session?.user ? (
            <div className="flex items-center space-x-3">
              {isStaffAdmin ? (
                <span className="hidden sm:inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-medium text-[var(--amber-badge-text)]">
                  <Shield className="mr-1 h-3 w-3 text-[var(--yellow-bright)]" />
                  Staff Admin
                </span>
              ) : isReviewer ? (
                <span className="hidden sm:inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-medium text-[var(--amber-badge-text)]">
                  <Eye className="mr-1 h-3 w-3 text-[var(--yellow-bright)]" />
                  Reviewer (Read-Only)
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-medium text-[var(--yellow-bright)]">
                  <CheckCircle2 className="mr-1 h-3 w-3 text-[var(--yellow-bright)]" />
                  Candidate
                </span>
              )}

              <Link
                href="/profile"
                className="flex items-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-1.5 text-xs text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/60 hover:text-[var(--yellow-bright)] transition active:scale-95 group"
                title="View Coding Profile"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-6 w-6 rounded-full ring-1 ring-[var(--gh-border)]"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-[var(--gh-bg)] flex items-center justify-center text-[var(--gh-text)] group-hover:text-[var(--yellow-bright)]">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="font-semibold text-[var(--gh-text)] truncate max-w-[120px]">{session.user.name || 'Developer'}</p>
                  <p className="text-[10px] text-[var(--yellow-bright)] font-mono">
                    @{((session.user as any).username || (session.user as any).githubUsername || 'coder')}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                title="Sign out"
                className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2 text-[var(--gh-text-muted)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/60 transition active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/signin"
                className="rounded-xl bg-[var(--yellow-button-bg)] px-4 py-2 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-[var(--yellow-glow-lg)] active:scale-95"
              >
                Start Debugging
              </Link>
            </div>
          )}

          {/* Theme Switcher Toggle (Default White / Dark) */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
