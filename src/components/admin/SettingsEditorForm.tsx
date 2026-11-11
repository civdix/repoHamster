'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Sliders, Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

interface SettingsEditorFormProps {
  initialSettings: Record<string, { value: string; description: string }>;
}

export function SettingsEditorForm({ initialSettings }: SettingsEditorFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState({
    ai_daily_request_limit: initialSettings.ai_daily_request_limit?.value || '15',
    ai_token_limit: initialSettings.ai_token_limit?.value || '10000',
    ai_max_output_tokens: initialSettings.ai_max_output_tokens?.value || '600',
    passing_threshold_percent: initialSettings.passing_threshold_percent?.value || '100',
    github_app_slug: initialSettings.github_app_slug?.value || 'repohamster-bot',
    execution_timeout_sec: initialSettings.execution_timeout_sec?.value || '30',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Settings successfully updated!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update settings.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error updating settings.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Controls */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-[var(--gh-border)] pb-3">
          <Sparkles className="h-4 w-4 text-[var(--yellow-bright)]" />
          <h3 className="font-bold text-white text-sm">RepoHamster AI Credit & Quota Controls</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div>
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
              Daily AI Request Limit
            </label>
            <input
              type="number"
              min="1"
              value={settings.ai_daily_request_limit}
              onChange={(e) => setSettings({ ...settings, ai_daily_request_limit: e.target.value })}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-white focus:border-[var(--yellow-primary)] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-sans">Max queries per candidate / 24hr window</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
              Daily Token Budget
            </label>
            <input
              type="number"
              min="1000"
              step="500"
              value={settings.ai_token_limit}
              onChange={(e) => setSettings({ ...settings, ai_token_limit: e.target.value })}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-white focus:border-[var(--yellow-primary)] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-sans">Prompt & completion token budget</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
              Max Tokens per Reply
            </label>
            <input
              type="number"
              min="100"
              value={settings.ai_max_output_tokens}
              onChange={(e) => setSettings({ ...settings, ai_max_output_tokens: e.target.value })}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-white focus:border-[var(--yellow-primary)] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-sans">Limits response length to ensure hints</p>
          </div>
        </div>
      </div>

      {/* Runner & Grading Parameters */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-[var(--gh-border)] pb-3">
          <Sliders className="h-4 w-4 text-[var(--yellow-bright)]" />
          <h3 className="font-bold text-white text-sm">Evaluation Engine & Grading Thresholds</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div>
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
              Default Passing Threshold (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.passing_threshold_percent}
              onChange={(e) => setSettings({ ...settings, passing_threshold_percent: e.target.value })}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-white focus:border-[var(--yellow-primary)] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-sans">Required test pass % to mark COMPLETED</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
              Runner Timeout (Seconds)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.execution_timeout_sec}
              onChange={(e) => setSettings({ ...settings, execution_timeout_sec: e.target.value })}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-white focus:border-[var(--yellow-primary)] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-sans">Hard timeout killing infinite loops</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1">
              GitHub App Identifier
            </label>
            <input
              type="text"
              value={settings.github_app_slug}
              onChange={(e) => setSettings({ ...settings, github_app_slug: e.target.value })}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-white focus:border-[var(--yellow-primary)] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-sans">Bot handle referenced on GitHub</p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl border p-3 text-xs flex items-center space-x-2 ${
            message.type === 'success'
              ? 'border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)]'
              : 'border-[var(--gh-border)] bg-[var(--gh-bg)] text-white'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--yellow-bright)]" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-[var(--yellow-primary)]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center space-x-2 rounded-xl bg-[var(--yellow-primary)] px-5 py-2.5 text-xs font-bold text-black hover:bg-[var(--yellow-bright)] transition disabled:opacity-50 shadow-[var(--yellow-glow)]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span>Save System Settings</span>
        </button>
      </div>
    </form>
  );
}
