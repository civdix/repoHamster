'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Code2,
  Shield,
  User,
  LogOut,
  Sparkles,
  Trophy,
  BookOpen,
  Eye,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStaffAdmin = (session?.user as any)?.role === 'ADMIN';
  const isReviewer = (session?.user as any)?.role === 'REVIEWER' || (session?.user as any)?.isReviewer === true;
  const canSeeAdmin = isStaffAdmin || isReviewer;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 h-[72px] w-full max-w-full border-b border-[var(--gh-border)] bg-[var(--gh-bg)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center space-x-2 sm:space-x-8 shrink-0 min-w-0">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--gh-bg-secondary)] border border-[var(--gh-border)] group-hover:border-[var(--yellow-primary)]/60 shadow-none dark:shadow-sm transition p-1 shrink-0">
              <HamsterMascot variant="normal" size={26} />
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold tracking-tight text-[var(--gh-text)] text-base sm:text-lg font-sans whitespace-nowrap">
                  repo<span className="text-[var(--yellow-bright)]">Hamster</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] font-mono text-[var(--gh-text-muted)] -mt-0.5 hidden sm:block whitespace-nowrap">
                Production-Ready Repo OAs
              </p>
            </div>
          </Link>

          {/* Center Links (Editorial Warm Navigation) */}
          <nav className="hidden lg:flex items-center space-x-1 text-[13px] font-medium text-[var(--gh-text-secondary)]">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg-secondary)] whitespace-nowrap ${pathname === '/dashboard' || pathname?.startsWith('/assignments')
                ? 'text-[var(--yellow-bright)] font-semibold bg-[var(--gh-bg-secondary)]'
                : ''
                }`}
            >
              Challenges
            </Link>

            <Link
              href="/leaderboard"
              className={`px-3 py-1.5 rounded-lg transition hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg-secondary)] whitespace-nowrap ${pathname === '/leaderboard' ? 'text-[var(--yellow-bright)] font-semibold bg-[var(--gh-bg-secondary)]' : ''
                }`}
            >
              Leaderboard
            </Link>

            <Link
              href="/guide"
              className={`px-3 py-1.5 rounded-lg transition hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg-secondary)] whitespace-nowrap ${pathname === '/guide' ? 'text-[var(--yellow-bright)] font-semibold bg-[var(--gh-bg-secondary)]' : ''
                }`}
            >
              How It Works
            </Link>

            {canSeeAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition text-[var(--yellow-bright)] hover:bg-[var(--amber-badge-bg)] whitespace-nowrap ${pathname?.startsWith('/admin') ? 'bg-[var(--amber-badge-bg)] font-bold' : ''
                  }`}
              >
                Admin {isReviewer && '(Preview)'}
              </Link>
            )}
          </nav>
        </div>

        {/* Right Actions: Sign In + Primary Pill CTA */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {session?.user ? (
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
              <Link
                href="/profile"
                className="flex items-center space-x-1.5 sm:space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2 sm:px-2.5 py-1.5 text-xs text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/60 transition group shrink-0"
                title="View Profile"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={22}
                    height={22}
                    className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover border border-[var(--gh-border)] shrink-0"
                  />
                ) : (
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[var(--gh-bg)] flex items-center justify-center text-[var(--gh-text)] shrink-0">
                    <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                )}
                <span className="hidden sm:inline font-medium max-w-[90px] truncate whitespace-nowrap">
                  {session.user.name || 'Coder'}
                </span>
              </Link>

              {/* Start Practicing button on sm+ screens */}
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center space-x-1.5 rounded-full bg-[var(--yellow-button-bg)] px-3.5 py-2 text-xs font-semibold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-none dark:shadow-sm active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Start Practicing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                title="Sign out"
                className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-1.5 sm:p-2 text-[var(--gh-text-muted)] hover:text-[var(--yellow-primary)] transition shrink-0"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
              <Link
                href="/auth/signin"
                className="text-xs font-semibold text-[var(--gh-text)] hover:text-[var(--yellow-primary)] transition px-2 py-1.5 rounded-lg border border-transparent hover:border-[var(--gh-border)] whitespace-nowrap shrink-0"
              >
                Sign In
              </Link>

              {/* Responsive CTA: compact on mobile, expanded on sm+; NEVER wraps text */}
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-1 rounded-full bg-[var(--yellow-button-bg)] px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-none dark:shadow-sm active:scale-95 whitespace-nowrap shrink-0"
              >
                {/* <span className="sm:hidden">Practice &rarr;</span> */}
                <span className="hidden sm:inline">Start Practicing &rarr;</span>
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="shrink-0">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-2 text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/60 transition shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] z-50 border-b border-[var(--gh-border)] bg-[var(--gh-bg)]/98 backdrop-blur-xl shadow-none dark:shadow-2xl p-4 sm:p-5 space-y-3.5 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-72px)] overflow-y-auto">
          {/* User Profile Summary in Mobile Drawer when logged in */}
          {session?.user && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]">
              <Link href="/profile" onClick={closeMenu} className="flex items-center space-x-2.5 min-w-0">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover border border-[var(--gh-border)]"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[var(--gh-bg)] flex items-center justify-center text-[var(--gh-text)]">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-bold text-[var(--gh-text)] truncate">{session.user.name || 'Coder'}</p>
                  <p className="text-[10px] text-[var(--gh-text-muted)] font-mono truncate">{session.user.email || 'View Profile'}</p>
                </div>
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: '/auth/signin' });
                }}
                className="flex items-center space-x-1 text-xs text-rose-500 font-semibold px-2 py-1 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Exit</span>
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-sm font-semibold text-[var(--gh-text)]"
            >
              <div className="flex items-center space-x-2.5">
                <Code2 className="h-4 w-4 text-[var(--yellow-bright)]" />
                <span>Repo Challenges</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--gh-text-muted)]" />
            </Link>

            <Link
              href="/leaderboard"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-sm font-semibold text-[var(--gh-text)]"
            >
              <div className="flex items-center space-x-2.5">
                <Trophy className="h-4 w-4 text-[var(--yellow-bright)]" />
                <span>Leaderboard &amp; Stars</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--gh-text-muted)]" />
            </Link>

            <Link
              href="/guide"
              onClick={closeMenu}
              className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-sm font-semibold text-[var(--gh-text)]"
            >
              <div className="flex items-center space-x-2.5">
                <BookOpen className="h-4 w-4 text-[var(--yellow-bright)]" />
                <span>How It Works</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--gh-text-muted)]" />
            </Link>

            {canSeeAdmin && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="flex items-center justify-between p-3 rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-sm font-semibold text-[var(--amber-badge-text)]"
              >
                <div className="flex items-center space-x-2.5">
                  <Shield className="h-4 w-4 text-[var(--yellow-bright)]" />
                  <span>Admin Console</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="pt-2 space-y-2">
            {!session?.user && (
              <Link
                href="/auth/signin"
                onClick={closeMenu}
                className="flex items-center justify-center space-x-2 w-full rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3 text-xs font-bold text-[var(--gh-text)] shadow-none hover:border-[var(--yellow-primary)] transition"
              >
                <span>Sign In to Your Account</span>
              </Link>
            )}
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="flex items-center justify-center space-x-2 w-full rounded-full bg-[var(--yellow-button-bg)] p-3 text-xs font-bold text-[var(--yellow-button-text)] shadow-none dark:shadow-sm"
            >
              <span>Start Practicing Now &rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
