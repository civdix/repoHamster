'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Terminal, Shield, Code, User, LogOut, CheckCircle2, Cpu } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-[#090d16]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan via-accent-indigo to-purple-600 p-[1px] shadow-lg shadow-cyan-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#090d16] group-hover:bg-[#0f172a] transition">
                <Terminal className="h-4 w-4 text-accent-cyan" />
              </div>
            </div>
            <div>
              <span className="font-semibold tracking-tight text-white text-lg">Debug<span className="text-accent-cyan">Lab</span></span>
              <span className="ml-2 rounded-full border border-card-border bg-card px-2 py-0.5 text-[10px] font-mono text-slate-400">
                v1.0 MVP
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                pathname === '/dashboard' || pathname?.startsWith('/assignments')
                  ? 'bg-card text-white border border-card-border'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Code className="h-4 w-4" />
              <span>Candidate Dashboard</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  pathname?.startsWith('/admin')
                    ? 'bg-purple-950/40 text-purple-300 border border-purple-800/40'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-purple-950/20'
                }`}
              >
                <Shield className="h-4 w-4 text-purple-400" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Action & User Profile */}
        <div className="flex items-center space-x-3">
          {session?.user ? (
            <div className="flex items-center space-x-3">
              {isAdmin ? (
                <span className="hidden sm:inline-flex items-center rounded-full border border-purple-800/50 bg-purple-950/40 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                  <Shield className="mr-1 h-3 w-3" />
                  Admin
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-800/50 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Candidate
                </span>
              )}

              <div className="flex items-center space-x-2 rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs text-slate-300">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-6 w-6 rounded-full ring-1 ring-card-border"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="font-medium text-white truncate max-w-[120px]">{session.user.name || 'Developer'}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{(session.user as any).githubUsername || 'candidate'}</p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                title="Sign out"
                className="rounded-lg border border-card-border bg-card p-2 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/signin"
                className="rounded-lg bg-accent-cyan px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
