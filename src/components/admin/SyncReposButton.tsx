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
          `Sync completed: ${data.importedCount || 0} new repos imported, ${data.totalScanned || 0} audited from @${data.owner || 'repohamsterowner'}.`
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
        className="flex items-center space-x-2 rounded-xl border border-brand-purple/50 bg-purple-950/30 px-3.5 py-2 text-xs font-semibold text-brand-purple-light hover:bg-purple-900/40 transition active:scale-95 disabled:opacity-50"
      >
        {syncing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-purple" />
        ) : (
          <RefreshCw className="h-3.5 w-3.5 text-brand-purple" />
        )}
        <span>{syncing ? 'Syncing Repositories...' : 'Sync from @repohamsterowner'}</span>
      </button>

      {message && (
        <span
          className={`text-xs font-mono px-2.5 py-1 rounded-lg flex items-center space-x-1 animate-in fade-in ${
            status === 'success'
              ? 'bg-lime-950/60 text-brand-lime border border-lime-800/40'
              : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
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
