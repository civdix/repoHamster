import Link from 'next/link';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { ArrowRight, Mail, Building2, GraduationCap, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Contact & Enterprise Hiring Solutions | RepoHamster',
  description:
    'Partner with RepoHamster for engineering hiring, university technical assessments, and authentic repository-based candidate evaluations.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--gh-bg)] bg-dev-grid text-[var(--gh-text)] py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[24px] border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Direct Headline, Pitch & Contact */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gh-bg)] border border-[var(--gh-border)] p-1 shadow-sm">
                <HamsterMascot variant="normal" size={32} />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--yellow-primary)] font-bold">
                  CAMPUS &amp; ENTERPRISE
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--gh-text)] tracking-tight font-sans mt-1">
                  Bring repoHamster to your team or campus.
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-[var(--gh-text-secondary)] leading-relaxed font-sans">
                Replace artificial whiteboard algorithms with authentic multi-file repository assessments. Test candidates or train students with cloud IDEs, hidden automated test suites, and Socratic anti-cheat AI.
              </p>

              <div className="space-y-2 text-xs font-mono text-[var(--gh-text-secondary)] pt-1">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-[var(--yellow-primary)] shrink-0" />
                  <span>
                    Email:{' '}
                    <a
                      href="mailto:shivam@repohamster.com"
                      className="font-bold text-[var(--yellow-primary)] hover:underline"
                    >
                      shivam@repohamster.com
                    </a>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-[var(--yellow-primary)] shrink-0" />
                  <span>Turnkey Custom Repo Authoring &amp; OA Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-[var(--yellow-primary)] shrink-0" />
                  <span>University Lab &amp; Placement Drives</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Form */}
            <div className="lg:col-span-6">
              <form
                action="mailto:shivam@repohamster.com"
                method="POST"
                encType="text/plain"
                className="space-y-3.5 text-left font-sans"
              >
                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Shivam Dixit"
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
                    Work or University Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="shivam@company.com"
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      name="role"
                      placeholder="Engineering Manager / Professor"
                      className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
                      Use Case
                    </label>
                    <select
                      name="use_case"
                      className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
                    >
                      <option value="Hiring Assessment">Hiring Team OA</option>
                      <option value="University Campus">University / Campus</option>
                      <option value="Individual Prep">Individual Prep</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--gh-text-secondary)] mb-1 font-mono">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about your team size, curriculum, or repository requirements..."
                    className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3.5 py-2.5 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[var(--yellow-button-bg)] py-3 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-sm active:scale-95 flex items-center justify-center space-x-1.5"
                >
                  <span>Send Message</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
