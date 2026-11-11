'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AtSign, Check, Edit2, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

interface UsernameEditorProps {
  initialUsername: string;
  userId: string;
}

export function UsernameEditor({ initialUsername, userId }: UsernameEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!initialUsername || initialUsername === 'candidate');
  const [username, setUsername] = useState(initialUsername || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Handle successfully updated to @${data.username}`);
        setIsEditing(false);
        router.refresh();
      } else {
        setError(data.error || 'Failed to update username.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error saving username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--gh-text-dim)] font-mono text-xs">
                @
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="choose-unique-username"
                className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] pl-7 pr-3 py-1.5 text-xs font-mono text-[var(--gh-text)] focus:border-[var(--yellow-bright)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="flex items-center space-x-1.5 rounded-xl bg-[var(--yellow-button-bg)] px-3 py-1.5 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition active:scale-95 disabled:opacity-50 shadow-[var(--yellow-glow)]"
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              <span>Claim Handle</span>
            </button>

            {initialUsername && (
              <button
                type="button"
                onClick={() => {
                  setUsername(initialUsername);
                  setIsEditing(false);
                  setError(null);
                }}
                className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-1.5 text-xs text-[var(--gh-text-muted)] hover:text-[var(--gh-text)]"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-1 text-[11px] font-mono text-[var(--gh-text-muted)]">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
              <span>Unique developer handle (3-30 chars: a-z, 0-9, dashes, underscores)</span>
            </div>
            <div className="text-[10px] text-[var(--gh-text-dim)]">
              Sharable link preview: <span className="text-[var(--yellow-bright)]">https://www.repohamster.com/@{username || 'your-handle'}</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] p-2 text-xs text-[var(--amber-badge-text)] flex items-center space-x-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-[var(--yellow-bright)] shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-1 text-xs font-mono text-[var(--amber-badge-text)] font-bold">
            <AtSign className="h-3.5 w-3.5" />
            <span>{username}</span>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-2.5 py-1 text-[11px] font-mono text-[var(--gh-text-muted)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)]/50 transition active:scale-95"
          >
            <Edit2 className="h-3 w-3" />
            <span>Change Handle</span>
          </button>

          {success && (
            <span className="text-[11px] font-mono text-[var(--yellow-bright)] flex items-center space-x-1 animate-in fade-in">
              <Check className="h-3 w-3" />
              <span>{success}</span>
            </span>
          )}
        </div>
      )}

      {/* Permanent Identity */}
      <div className="text-[10px] font-mono text-[var(--gh-text-dim)] flex items-center space-x-1">
        <span>System ID:</span>
        <code className="text-[var(--gh-text-muted)] select-all">{userId}</code>
        <span className="text-[var(--gh-text-dim)]">• Permanent Identity</span>
      </div>
    </div>
  );
}
