import Link from 'next/link';
import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { Mail, Building2, GraduationCap } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata = {
  title: 'Contact & Enterprise Hiring Solutions | RepoHamster',
  description:
    'Partner with RepoHamster for engineering hiring, university technical assessments, and authentic repository-based candidate evaluations.',
};

export default function ContactPage() {
  const contactEmail = 'shivdix.work+repohamster@gmail.com';

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
                      href={`mailto:${contactEmail}`}
                      className="font-bold text-[var(--yellow-primary)] hover:underline"
                    >
                      {contactEmail}
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

            {/* Right Column: Clean Interactive Form */}
            <div className="lg:col-span-6">
              <ContactForm defaultUseCase="Hiring Assessment" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
