'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Github, Shield, Lock, Sparkles, Loader2, AlertCircle, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    <div className="relative w-full max-w-md rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-8 shadow-2xl backdrop-blur-xl text-[var(--gh-text)]">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gh-bg)] border border-[var(--yellow-primary)]/50 shadow-[var(--yellow-glow)] mb-4 p-1">
          <HamsterMascot variant="normal" size={52} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center space-x-1.5 font-sans">
          <span>Repo</span>
          <span className="text-[var(--yellow-bright)]">Hamster</span>
          <span className="text-[10px] rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 text-[var(--gh-text-muted)] font-mono">
            Auth
          </span>
        </h1>
        <p className="mt-2 text-xs text-[var(--gh-text-muted)] font-sans">
          Sign in to access debugging assignments, live Codespaces workspaces, and automated test evaluations.
        </p>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="mb-5 rounded-xl border border-[var(--status-error-border)] bg-[var(--status-error-bg)] p-3.5 text-xs text-rose-300 flex items-start space-x-2.5 animate-in fade-in duration-150">
          <AlertCircle className="h-4 w-4 text-[var(--status-error)] shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-rose-200">Sign-in Notice</p>
            <p className="text-[11px] leading-relaxed text-rose-300/90 font-mono">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Primary Action: GitHub OAuth */}
      <div className="space-y-4">
        <button
          onClick={handleGitHubSignIn}
          disabled={loading !== null}
          className="flex w-full items-center justify-center space-x-3 rounded-xl bg-white px-4 py-3.5 text-xs font-bold text-slate-950 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--yellow-bright)] disabled:opacity-60 shadow-md active:scale-[0.98]"
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
            className="flex items-center justify-between rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 text-left transition hover:border-[var(--yellow-primary)]/50 group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center text-[var(--yellow-bright)] shrink-0">
                <Eye className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-[var(--yellow-bright)] transition">
                  Have a Project Review Passcode?
                </p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">
                  Read-only preview of challenges &amp; admin console
                </p>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--gh-text-dim)] group-hover:text-[var(--yellow-bright)] transition shrink-0" />
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-8 border-t border-[var(--gh-border-subtle)] pt-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--gh-text-muted)]">
          <span className="flex items-center">
            <Lock className="mr-1 h-3 w-3 text-[var(--yellow-bright)]" /> Isolated Sandboxes
          </span>
          <span className="flex items-center">
            <CheckCircle2 className="mr-1 h-3 w-3 text-[var(--yellow-bright)]" /> Controlled AI Limits
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-dev-grid">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(ellipse_at_center,var(--yellow-glow),transparent_70%)] pointer-events-none" />

      <Suspense
        fallback={
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-8 text-center text-[var(--gh-text-muted)] flex items-center justify-center space-x-2 font-mono">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--yellow-bright)]" />
            <span>Loading RepoHamster...</span>
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
