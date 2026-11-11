'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress on pathname or searchParams change
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept all internal link clicks to immediately trigger the loading bar
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Only trigger for standard internal navigation
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('vscode:') &&
        !targetAttr &&
        href !== pathname
      ) {
        // If clicking on same origin or relative path
        if (href.startsWith('/') || href.startsWith(window.location.origin)) {
          setLoading(true);
          setProgress(25);

          const step1 = setTimeout(() => setProgress((p) => Math.max(p, 50)), 100);
          const step2 = setTimeout(() => setProgress((p) => Math.max(p, 80)), 400);

          return () => {
            clearTimeout(step1);
            clearTimeout(step2);
          };
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Top glowing progress bar */}
      <div
        className="h-1 bg-gradient-to-r from-[var(--yellow-primary)] to-[var(--yellow-bright)] transition-all duration-300 ease-out shadow-[var(--yellow-glow)]"
        style={{
          width: `${progress}%`,
          opacity: loading ? 1 : 0,
        }}
      />
      {/* Subtle floating loading pill */}
      {loading && progress < 100 && (
        <div className="absolute top-3 right-4 flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--gh-bg-secondary)]/95 px-3 py-1 shadow-lg backdrop-blur animate-in fade-in duration-150">
          <div className="h-2 w-2 rounded-full bg-[var(--yellow-bright)] animate-ping" />
          <span className="text-[11px] font-mono text-[var(--amber-badge-text)] font-medium">Loading view...</span>
        </div>
      )}
    </div>
  );
}
