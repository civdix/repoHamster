'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

function ProjectReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const isReviewerSession =
    (session?.user as any)?.role === 'REVIEWER' || (session?.user as any)?.isReviewer === true;

  const urlPasscode = searchParams.get('passcode') || searchParams.get('key') || '';
  const [passcode, setPasscode] = useState(urlPasscode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-authenticate if passcode is passed in URL
  useEffect(() => {
    if (urlPasscode && !session?.user && !loading) {
      handleAuthenticate(urlPasscode);
    }
  }, [urlPasscode, session]);

  const handleAuthenticate = async (codeToSubmit?: string) => {
    const finalCode = (codeToSubmit || passcode).trim();
    if (!finalCode) {
      setErrorMessage('Please enter the project review passcode.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await signIn('credentials', {
        redirect: false,
        passcode: finalCode,
        callbackUrl: '/dashboard',
      });

      if (res?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setLoading(false);
        setErrorMessage('Invalid review passcode. Please check the passcode and try again.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || 'Authentication error. Please try again.');
    }
  };

  // If already authenticated as a reviewer
  if (status === 'authenticated' && isReviewerSession) {
    return (
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--amber-badge-border)] bg-[var(--gh-bg-secondary)]/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--yellow-primary)]/15 border border-[var(--yellow-primary)]/40 shadow-[var(--yellow-glow)] mb-3">
            <HamsterMascot variant="avatar" size={48} />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] text-xs font-mono font-bold mb-2">
            <Eye className="h-3.5 w-3.5" />
            <span>Active Project Review Session</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome, Project Reviewer
          </h1>
          <p className="mt-2 text-xs text-[var(--gh-text-secondary)] leading-relaxed">
            You are authenticated in <strong>Read-Only Mode</strong>. You have unrestricted access to inspect candidate challenges, test execution results, repository catalogue, and the full staff admin console.
          </p>
        </div>

        {/* Quick Review Navigation Links */}
        <div className="space-y-2.5 mb-6">
          <Link
            href="/dashboard"
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] hover:border-[var(--yellow-primary)]/50 hover:bg-[var(--gh-bg)]/80 transition group"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center text-[var(--yellow-bright)]">
                <Layers className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white group-hover:text-[var(--yellow-bright)] transition">Candidate Challenges &amp; Submissions</p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">Explore available debugging assignments &amp; workspace views</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--gh-text-muted)] group-hover:text-[var(--yellow-bright)] transition" />
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] hover:border-[var(--yellow-primary)]/50 hover:bg-[var(--gh-bg)]/80 transition group"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center text-[var(--yellow-bright)]">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white group-hover:text-[var(--yellow-bright)] transition">Staff Administration Console</p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">Inspect candidate evaluation matrix, overrides, &amp; metrics</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--gh-text-muted)] group-hover:text-[var(--yellow-bright)] transition" />
          </Link>

          <Link
            href="/admin/catalogue"
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] hover:border-[var(--yellow-primary)]/50 hover:bg-[var(--gh-bg)]/80 transition group"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] flex items-center justify-center text-[var(--yellow-bright)]">
                <FolderGit2 className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white group-hover:text-[var(--yellow-bright)] transition">Repository Catalogue (10 Repos)</p>
                <p className="text-[10px] text-[var(--gh-text-muted)] font-mono">Review real-world challenges from @repohamster</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--gh-text-muted)] group-hover:text-[var(--yellow-bright)] transition" />
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--gh-border)]">
          <button
            onClick={() => signOut({ callbackUrl: '/project-review' })}
            className="inline-flex items-center space-x-1.5 text-xs text-[var(--gh-text-muted)] hover:text-white font-mono transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>End Review Session</span>
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-[var(--yellow-primary)] text-black rounded-xl text-xs font-bold hover:bg-[var(--yellow-bright)] transition shadow-[var(--yellow-glow)]"
          >
            Enter Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]/95 p-8 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gh-bg)] border border-[var(--yellow-primary)]/40 shadow-[var(--yellow-glow)] mb-4">
          <HamsterMascot variant={loading ? 'workstation' : 'avatar'} size={48} />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] text-[11px] font-mono font-bold mb-2">
          <Eye className="h-3.5 w-3.5" />
          <span>Project Review Passcode Access</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center space-x-1.5">
          <span>Repo</span>
          <span className="text-[var(--yellow-bright)]">Hamster</span>
        </h1>
        <p className="mt-2 text-xs text-[var(--gh-text-secondary)] leading-relaxed font-sans">
          Enter the review passcode to preview the application in read-only mode. You can inspect all assignments, repository catalogues, evaluation matrices, and the admin console.
        </p>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="mb-5 rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/60 p-3.5 text-xs text-[var(--amber-badge-text)] flex items-start space-x-2.5 animate-in fade-in duration-150">
          <AlertCircle className="h-4 w-4 text-[var(--yellow-bright)] shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-white">Access Denied</p>
            <p className="text-[11px] leading-relaxed text-[var(--amber-badge-text)]">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAuthenticate();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="passcode" className="block text-xs font-mono font-medium text-[var(--gh-text-secondary)] mb-1.5">
            Review Passcode
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--gh-text-muted)]">
              <KeyRound className="h-4 w-4" />
            </div>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (e.g. repohamster2026)"
              required
              autoFocus
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] pl-10 pr-4 py-3 text-xs text-white placeholder-[var(--gh-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--yellow-primary)] focus:border-[var(--yellow-primary)] font-mono transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !passcode}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[var(--yellow-primary)] hover:bg-[var(--yellow-bright)] px-4 py-3 text-xs font-bold text-black transition focus:outline-none focus:ring-2 focus:ring-[var(--yellow-primary)] disabled:opacity-50 shadow-[var(--yellow-glow)] active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-black" />
              <span>Verifying Passcode...</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Enter Project Review (Read-Only)</span>
            </>
          )}
        </button>
      </form>

      {/* Permissions Breakdown */}
      <div className="mt-6 border-t border-[var(--gh-border)] pt-4 space-y-2 text-[11px] font-mono text-[var(--gh-text-muted)]">
        <div className="flex items-center space-x-2 text-[var(--yellow-bright)]">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>Full read access to /dashboard, /assignments, &amp; /admin</span>
        </div>
        <div className="flex items-center space-x-2 text-[var(--gh-text-secondary)]">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span>Mutations, PR submissions, &amp; manual overrides disabled</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/auth/signin"
          className="text-[11px] font-mono text-[var(--gh-text-muted)] hover:text-white transition"
        >
          ← Regular Developer / Admin Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ProjectReviewPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-8 text-center text-[var(--gh-text-muted)] flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--yellow-bright)]" />
            <span>Loading Project Review...</span>
          </div>
        }
      >
        <ProjectReviewForm />
      </Suspense>
    </div>
  );
}
