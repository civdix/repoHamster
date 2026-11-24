'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail, ExternalLink, AlertTriangle } from 'lucide-react';

interface ContactFormProps {
  defaultUseCase?: string;
  compact?: boolean;
}

export function ContactForm({ defaultUseCase = 'Hiring Assessment', compact = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleOrOrg: '',
    useCase: defaultUseCase,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetEmail = 'shivdix.work+repohamster@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(data?.error || 'Failed to submit form. Please email us directly.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error submitting inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(
    `[RepoHamster Inquiry] ${formData.useCase || 'General'} - ${formData.name || 'Candidate/Lead'}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\nRole/Org: ${formData.roleOrOrg}\nUse Case: ${formData.useCase}\n\nMessage:\n${formData.message}`
  )}`;

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-[var(--emerald-border,#10b981)]/40 bg-[var(--emerald-bg,#064e3b)]/10 p-6 sm:p-8 text-left space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center space-x-3 text-emerald-500 font-bold">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <h3 className="text-base sm:text-lg font-sans text-[var(--gh-text)]">
            Message Sent Successfully!
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed">
          Your inquiry has been permanently saved to the RepoHamster database and forwarded to{' '}
          <strong className="text-[var(--yellow-bright)] font-mono">{targetEmail}</strong>.
          We typically respond within 24 hours.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                name: '',
                email: '',
                roleOrOrg: '',
                useCase: defaultUseCase,
                message: '',
              });
            }}
            className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-4 py-2 text-xs font-semibold text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] transition"
          >
            Send Another Message
          </button>
          <a
            href={mailtoUrl}
            className="flex items-center space-x-1.5 rounded-xl bg-[var(--yellow-button-bg)] px-4 py-2 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Open in Email App</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left font-sans">
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-500 font-mono flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p>{errorMessage}</p>
            <p className="mt-1 text-[11px] text-[var(--gh-text-secondary)]">
              You can also reach out directly via{' '}
              <a href={`mailto:${targetEmail}`} className="text-[var(--yellow-bright)] underline">
                {targetEmail}
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {compact ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
          />
          <input
            type="email"
            required
            placeholder="Work / College Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
          />
        </div>
      ) : (
        <>
          <div>
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Shivam Dixit"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
              Work or University Email
            </label>
            <input
              type="email"
              required
              placeholder="shivam@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          {!compact && (
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
              Role / Organization
            </label>
          )}
          <input
            type="text"
            placeholder="Role / Organization"
            value={formData.roleOrOrg}
            onChange={(e) => setFormData({ ...formData, roleOrOrg: e.target.value })}
            className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
          />
        </div>

        <div>
          {!compact && (
            <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
              Use Case
            </label>
          )}
          <select
            value={formData.useCase}
            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
            className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
          >
            <option value="Hiring Assessment">Hiring Team OA</option>
            <option value="University Campus">University / Campus Placement</option>
            <option value="Individual Prep">Individual Big Tech Prep</option>
            <option value="General Inquiry">General Inquiry / Partnership</option>
          </select>
        </div>
      </div>

      <div>
        {!compact && (
          <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
            Message
          </label>
        )}
        <textarea
          rows={compact ? 3 : 4}
          required
          placeholder="How can repoHamster help your team or campus? Tell us about your repository assessment requirements..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[var(--yellow-button-bg)] py-3 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-sm active:scale-95 flex items-center justify-center space-x-1.5 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
