'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Github, Shield, ArrowRight, CheckCircle2, Lock, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const queryError = searchParams.get('error');

  const [loading, setLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (queryError) {
      if (queryError === 'OAuthSignin' || queryError === 'OAuthCallback') {
        setErrorMessage('GitHub OAuth sign-in could not be completed. Check GitHub App credentials or use Quick Demo Access below.');
      } else if (queryError === 'CredentialsSignin') {
        setErrorMessage('Sign-in failed. Please verify credentials or database connectivity.');
      } else {
        setErrorMessage(`Authentication notice: ${queryError}`);
      }
    }
  }, [queryError]);

  const handleGitHubSignIn = async () => {
    try {
      setErrorMessage(null);
      setLoading('github');
      await signIn('github', { callbackUrl });
    } catch (err: any) {
      setLoading(null);
      setErrorMessage(err?.message || 'Failed to initiate GitHub sign-in.');
    }
  };

  const handleQuickSignIn = async (email: string, role: 'ADMIN' | 'CANDIDATE') => {
    try {
      setErrorMessage(null);
      const roleKey = role.toLowerCase();
      setLoading(roleKey);

      const targetUrl = callbackUrl && callbackUrl !== '/auth/signin' ? callbackUrl : (role === 'ADMIN' ? '/admin' : '/dashboard');

      const res = await signIn('credentials', {
        redirect: false,
        email,
        role,
        callbackUrl: targetUrl,
      });

      if (res?.ok) {
        window.location.href = targetUrl;
      } else {
        setLoading(null);
        setErrorMessage(res?.error || 'Authentication failed. Please verify database connection or try again.');
      }
    } catch (err: any) {
      setLoading(null);
      setErrorMessage(err?.message || 'An unexpected error occurred during sign in.');
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-card-border bg-card/95 p-8 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-brand-lime/40 shadow-glow-lime mb-4">
          <HamsterMascot variant={loading ? 'workstation' : 'avatar'} size={48} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center space-x-1.5">
          <span>Repo</span>
          <span className="text-brand-lime">Hamster</span>
          <span className="text-xs rounded-full border border-card-border bg-[#0a0d14] px-2 py-0.5 text-slate-400 font-mono">
            Auth
          </span>
        </h1>
        <p className="mt-2 text-xs text-slate-400 font-sans">
          Sign in to access debugging assignments, live Codespaces workspaces, and automated test evaluations.
        </p>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="mb-5 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex items-start space-x-2.5 animate-in fade-in duration-150">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-rose-200">Sign-in Notice</p>
            <p className="text-[11px] leading-relaxed text-rose-300/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Primary Action: GitHub OAuth */}
      <div className="space-y-4">
        <button
          onClick={handleGitHubSignIn}
          disabled={loading !== null}
          className="flex w-full items-center justify-center space-x-3 rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-lime disabled:opacity-60 shadow-md active:scale-[0.98]"
        >
          {loading === 'github' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              <span>Redirecting to GitHub...</span>
            </>
          ) : (
            <>
              <Github className="h-4 w-4" />
              <span>Continue with GitHub</span>
            </>
          )}
        </button>

        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t border-card-border" />
          <span className="absolute bg-card px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
            or 1-click instant demo access
          </span>
        </div>

        {/* Quick Demo Access Buttons */}
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={() => handleQuickSignIn('alex.chen@example.com', 'CANDIDATE')}
            disabled={loading !== null}
            className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition active:scale-[0.98] focus:outline-none ${
              loading === 'candidate'
                ? 'border-brand-lime bg-lime-950/40 shadow-glow-lime'
                : 'border-card-border bg-[#0a0d14] hover:border-brand-lime/50 hover:bg-card-hover'
            } ${loading && loading !== 'candidate' ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-lime-950/60 border border-lime-800/40 flex items-center justify-center text-brand-lime shrink-0">
                {loading === 'candidate' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-lime" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {loading === 'candidate' ? 'Authenticating Candidate...' : 'Candidate Workspace'}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {loading === 'candidate' ? 'Loading candidate dashboard...' : 'Sign in as Alex Chen (Candidate)'}
                </p>
              </div>
            </div>
            {loading === 'candidate' ? (
              <Loader2 className="h-4 w-4 text-brand-lime animate-spin shrink-0" />
            ) : (
              <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
            )}
          </button>

          <button
            onClick={() => handleQuickSignIn('admin@debuglab.internal', 'ADMIN')}
            disabled={loading !== null}
            className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition active:scale-[0.98] focus:outline-none ${
              loading === 'admin'
                ? 'border-purple-500 bg-purple-950/40 shadow-glow-purple'
                : 'border-card-border bg-[#0a0d14] hover:border-purple-600/50 hover:bg-card-hover'
            } ${loading && loading !== 'admin' ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-brand-purple shrink-0">
                {loading === 'admin' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-brand-purple" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {loading === 'admin' ? 'Authenticating Administrator...' : 'Platform Administrator'}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {loading === 'admin' ? 'Entering Staff Administration console...' : 'Full admin, catalogue & override console'}
                </p>
              </div>
            </div>
            {loading === 'admin' ? (
              <Loader2 className="h-4 w-4 text-brand-purple animate-spin shrink-0" />
            ) : (
              <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
            )}
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
