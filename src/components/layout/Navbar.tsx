'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Code2, Shield, User, LogOut, CheckCircle2, BookOpen, Eye } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isStaffAdmin = (session?.user as any)?.role === 'ADMIN';
  const isReviewer = (session?.user as any)?.role === 'REVIEWER' || (session?.user as any)?.isReviewer === true;
  const canSeeAdmin = isStaffAdmin || isReviewer;

  return (
    <header className="sticky top-0 z-40 border-b border-[#30363d] bg-[#0d1117]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#161b22] border border-[#30363d] group-hover:border-yellow-400/60 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition p-1">
              <HamsterMascot variant="normal" size={32} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold tracking-tight text-white text-lg font-sans">
                  Repo<span className="text-yellow-400">Hamster</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-slate-400 -mt-0.5 hidden sm:block">
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
                  ? 'bg-[#161b22] text-yellow-400 border border-[#30363d]'
                  : 'text-slate-400 hover:text-white hover:bg-[#161b22]/60'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Challenges</span>
            </Link>

            <Link
              href="/guide"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                pathname === '/guide'
                  ? 'bg-[#161b22] text-yellow-400 border border-[#30363d]'
                  : 'text-slate-400 hover:text-white hover:bg-[#161b22]/60'
              }`}
            >
              <BookOpen className="h-4 w-4 text-yellow-400" />
              <span>How to Use</span>
            </Link>

            {canSeeAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  pathname?.startsWith('/admin')
                    ? 'bg-yellow-950/60 text-yellow-300 border border-yellow-700/60'
                    : 'text-slate-400 hover:text-yellow-400 hover:bg-[#161b22]/40'
                }`}
              >
                {isReviewer ? (
                  <Eye className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Shield className="h-4 w-4 text-yellow-400" />
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
                <span className="hidden sm:inline-flex items-center rounded-full border border-yellow-600/60 bg-yellow-950/60 px-2.5 py-0.5 text-xs font-mono font-medium text-yellow-300">
                  <Shield className="mr-1 h-3 w-3 text-yellow-400" />
                  Staff Admin
                </span>
              ) : isReviewer ? (
                <span className="hidden sm:inline-flex items-center rounded-full border border-yellow-600/50 bg-yellow-950/40 px-2.5 py-0.5 text-xs font-mono font-medium text-yellow-300">
                  <Eye className="mr-1 h-3 w-3 text-yellow-400" />
                  Reviewer (Read-Only)
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center rounded-full border border-yellow-600/50 bg-yellow-950/30 px-2.5 py-0.5 text-xs font-mono font-medium text-yellow-400">
                  <CheckCircle2 className="mr-1 h-3 w-3 text-yellow-400" />
                  Candidate
                </span>
              )}

              <Link
                href="/profile"
                className="flex items-center space-x-2 rounded-xl border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs text-slate-300 hover:border-yellow-500/60 hover:text-white transition active:scale-95 group"
                title="View Coding Profile"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-6 w-6 rounded-full ring-1 ring-[#30363d]"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-[#0d1117] flex items-center justify-center text-slate-300 group-hover:text-yellow-400">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="font-semibold text-white truncate max-w-[120px]">{session.user.name || 'Developer'}</p>
                  <p className="text-[10px] text-yellow-400 font-mono">
                    @{((session.user as any).username || (session.user as any).githubUsername || 'coder')}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                title="Sign out"
                className="rounded-xl border border-[#30363d] bg-[#161b22] p-2 text-slate-400 hover:text-yellow-400 hover:border-yellow-600/50 transition active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/signin"
                className="rounded-xl bg-yellow-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(234,179,8,0.25)] active:scale-95"
              >
                Start Debugging
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
