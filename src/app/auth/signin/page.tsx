'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Github, Shield, Terminal, ArrowRight, CheckCircle2, Lock, Sparkles, Loader2 } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [loading, setLoading] = useState<string | null>(null);

  const handleGitHubSignIn = async () => {
    setLoading('github');
    await signIn('github', { callbackUrl });
  };

  const handleQuickSignIn = async (email: string, role: 'ADMIN' | 'CANDIDATE') => {
    setLoading(role.toLowerCase());
    const res = await signIn('credentials', {
      redirect: false,
      email,
      role,
    });
    if (res?.ok) {
      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setLoading(null);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-card-border bg-card/95 p-8 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-brand-lime/40 shadow-glow-lime mb-4">
          <HamsterMascot variant="avatar" size={48} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center space-x-1.5">
          <span>Repo</span>
          <span className="text-brand-lime">Hamster</span>
          <span className="text-xs rounded-full border border-card-border bg-[#0a0d14] px-2 py-0.5 text-slate-400 font-mono">
            Auth
          </span>
        </h1>
        <p className="mt-2 text-xs text-slate-400 font-sans">
          Sign in with GitHub to access your debugging assignments, Codespaces workspaces, and test evaluations.
        </p>
      </div>

      {/* Primary Action: GitHub OAuth */}
      <div className="space-y-4">
        <button
          onClick={handleGitHubSignIn}
          disabled={loading !== null}
          className="flex w-full items-center justify-center space-x-3 rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-lime disabled:opacity-50 shadow-md"
        >
          <Github className="h-4 w-4" />
          <span>{loading === 'github' ? 'Redirecting to GitHub...' : 'Continue with GitHub'}</span>
        </button>

        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t border-card-border" />
          <span className="absolute bg-card px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            or quick demo access
          </span>
        </div>

        {/* Quick Demo Access Buttons */}
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={() => handleQuickSignIn('alex.chen@example.com', 'CANDIDATE')}
            disabled={loading !== null}
            className="flex items-center justify-between rounded-xl border border-card-border bg-[#0a0d14] p-3 text-left transition hover:border-brand-lime/50 hover:bg-card-hover focus:outline-none"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Candidate Workspace</p>
                <p className="text-[11px] text-slate-400 font-mono">Sign in as Alex Chen (Candidate)</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500" />
          </button>

          <button
            onClick={() => handleQuickSignIn('admin@debuglab.internal', 'ADMIN')}
            disabled={loading !== null}
            className="flex items-center justify-between rounded-xl border border-card-border bg-[#0a0d14] p-3 text-left transition hover:border-purple-600/50 hover:bg-card-hover focus:outline-none"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-brand-purple">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Platform Administrator</p>
                <p className="text-[11px] text-slate-400 font-mono">Full admin & override console</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-8 border-t border-card-border pt-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center">
            <Lock className="mr-1 h-3 w-3 text-brand-lime" /> Isolated Sandboxes
          </span>
          <span className="flex items-center">
            <Sparkles className="mr-1 h-3 w-3 text-brand-purple" /> Controlled AI Limits
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="rounded-2xl border border-card-border bg-card p-8 text-center text-slate-400 flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-brand-lime" />
            <span>Loading RepoHamster...</span>
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
