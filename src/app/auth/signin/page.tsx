'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Github, Shield, Lock, Sparkles, Loader2, AlertCircle, Eye, ArrowRight } from 'lucide-react';
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
        setErrorMessage('GitHub OAuth sign-in could not be completed. Check GitHub App configuration or network connectivity.');
      } else if (queryError === 'CredentialsSignin') {
        setErrorMessage('Invalid authentication credentials.');
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
          className="flex w-full items-center justify-center space-x-3 rounded-xl bg-white px-4 py-3.5 text-xs font-bold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-lime disabled:opacity-60 shadow-md active:scale-[0.98]"
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

        {/* Project Review Link */}
        <div className="pt-2">
          <Link
            href="/project-review"
            className="flex items-center justify-between rounded-xl border border-card-border bg-[#0a0d14] p-3 text-left transition hover:border-amber-500/50 hover:bg-card-hover group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Eye className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition">
                  Have a Project Review Passcode?
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Read-only preview of challenges &amp; admin console
                </p>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400 transition shrink-0" />
          </Link>
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
