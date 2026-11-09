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
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-mono text-xs">
                @
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="choose-unique-username"
                className="w-full rounded-xl border border-card-border bg-[#0a0d14] pl-7 pr-3 py-1.5 text-xs font-mono text-white focus:border-brand-lime focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="flex items-center space-x-1.5 rounded-xl bg-brand-lime px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-brand-lime-light transition active:scale-95 disabled:opacity-50"
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
                className="rounded-xl border border-card-border bg-card px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-lime" />
            <span>Unique developer handle (3-30 chars: a-z, 0-9, dashes, underscores)</span>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-800/50 bg-rose-950/40 p-2 text-xs text-rose-300 flex items-center space-x-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-brand-lime/40 bg-lime-950/30 px-3 py-1 text-xs font-mono text-brand-lime font-bold">
            <AtSign className="h-3.5 w-3.5" />
            <span>{username}</span>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 rounded-lg border border-card-border bg-[#0a0d14] px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white transition active:scale-95"
          >
            <Edit2 className="h-3 w-3" />
            <span>Change Handle</span>
          </button>

          {success && (
            <span className="text-[11px] font-mono text-brand-lime flex items-center space-x-1 animate-in fade-in">
              <Check className="h-3 w-3" />
              <span>{success}</span>
            </span>
          )}
        </div>
      )}

      {/* Identity notice clarifying that immutable UUID is used for backend logic */}
      <div className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
        <span>System ID:</span>
        <code className="text-slate-400 select-all">{userId}</code>
        <span className="text-slate-600">• Permanent Identity</span>
      </div>
    </div>
  );
}
