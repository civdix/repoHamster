'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Code2, Shield, User, LogOut, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-[#0a0d14]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-card-border group-hover:border-brand-lime/60 group-hover:shadow-glow-lime transition">
              <HamsterMascot variant="avatar" size={32} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold tracking-tight text-white text-lg font-sans">
                  Repo<span className="text-brand-lime">Hamster</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-lime animate-pulse" />
              </div>
              <p className="text-[10px] font-mono text-slate-400 -mt-0.5 hidden sm:block">
                Break Bugs. Ship Fixes.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                pathname === '/dashboard' || pathname?.startsWith('/assignments')
                  ? 'bg-card text-brand-lime border border-card-border'
                  : 'text-slate-400 hover:text-white hover:bg-card/60'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Challenges</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  pathname?.startsWith('/admin')
                    ? 'bg-purple-950/50 text-brand-purple-light border border-purple-800/50'
                    : 'text-slate-400 hover:text-brand-purple-light hover:bg-purple-950/20'
                }`}
              >
                <Shield className="h-4 w-4 text-brand-purple" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center space-x-3">
          {session?.user ? (
            <div className="flex items-center space-x-3">
              {isAdmin ? (
                <span className="hidden sm:inline-flex items-center rounded-full border border-purple-800/50 bg-purple-950/40 px-2.5 py-0.5 text-xs font-mono font-medium text-purple-300">
                  <Shield className="mr-1 h-3 w-3" />
                  Staff Admin
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center rounded-full border border-lime-800/40 bg-lime-950/30 px-2.5 py-0.5 text-xs font-mono font-medium text-brand-lime">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Candidate
                </span>
              )}

              <Link
                href="/profile"
                className="flex items-center space-x-2 rounded-xl border border-card-border bg-card px-3 py-1.5 text-xs text-slate-300 hover:border-brand-lime/60 hover:text-white transition active:scale-95 group"
                title="View Coding Profile"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-6 w-6 rounded-full ring-1 ring-card-border"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-brand-lime/20 group-hover:text-brand-lime">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="font-semibold text-white truncate max-w-[120px]">{session.user.name || 'Developer'}</p>
                  <p className="text-[10px] text-brand-lime font-mono">
                    @{((session.user as any).username || (session.user as any).githubUsername || 'coder')}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                title="Sign out"
                className="rounded-xl border border-card-border bg-card p-2 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/signin"
                className="rounded-xl bg-brand-lime px-4 py-2 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition shadow-glow-lime active:scale-95"
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
