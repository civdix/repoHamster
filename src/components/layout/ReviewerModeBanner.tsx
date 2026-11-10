'use client';

import { useSession, signOut } from 'next-auth/react';
import { Eye, Lock, LogOut } from 'lucide-react';

export function ReviewerModeBanner() {
  const { data: session } = useSession();

  const isReviewer =
    (session?.user as any)?.role === 'REVIEWER' || (session?.user as any)?.isReviewer === true;

  if (!isReviewer) return null;

  return (
    <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2 text-xs font-mono text-amber-200 backdrop-blur sticky top-16 z-30 shadow-md">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <Eye className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="leading-snug">
            <strong className="text-white">Project Review Mode (Read-Only):</strong> You have inspection access to explore all challenges, catalogues, metrics, and staff consoles. Actions &amp; modifications are restricted.
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-end sm:self-auto">
          <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-300 font-bold uppercase flex items-center space-x-1">
            <Lock className="h-3 w-3" />
            <span>Read-Only</span>
          </span>

          <button
            onClick={() => signOut({ callbackUrl: '/project-review' })}
            className="text-amber-300 hover:text-white underline text-[11px] flex items-center space-x-1 transition"
            title="End review session and return to passcode screen"
          >
            <LogOut className="h-3 w-3" />
            <span>Exit Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}
