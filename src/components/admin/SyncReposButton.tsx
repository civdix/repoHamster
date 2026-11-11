'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, CheckCircle2, AlertCircle, Loader2, GitFork } from 'lucide-react';

export function SyncReposButton() {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    setStatus(null);

    try {
      const res = await fetch('/api/cron/sync-repos', {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(
          `Sync completed: ${data.importedCount || 0} new repos imported, ${data.totalScanned || 0} audited from @${data.owner || 'repohamster'}.`
        );
        router.refresh();
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to complete sync.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Network error triggering repository sync.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <button
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3.5 py-2 text-xs font-semibold text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 transition active:scale-95 disabled:opacity-50"
      >
        {syncing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--yellow-bright)]" />
        ) : (
          <RefreshCw className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
        )}
        <span>{syncing ? 'Syncing Repositories...' : 'Sync from @repohamster'}</span>
      </button>

      {message && (
        <span
          className={`text-xs font-mono px-2.5 py-1 rounded-lg flex items-center space-x-1 animate-in fade-in ${
            status === 'success'
              ? 'bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] border border-[var(--amber-badge-border)]'
              : 'bg-[var(--gh-bg)] text-[var(--gh-text)] border border-[var(--gh-border)]'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle2 className="h-3 w-3 shrink-0" />
          ) : (
            <AlertCircle className="h-3 w-3 shrink-0" />
          )}
          <span>{message}</span>
        </span>
      )}
    </div>
  );
}
