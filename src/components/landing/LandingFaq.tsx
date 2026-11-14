'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How does GitHub Codespaces integration work with RepoHamster?',
    answer:
      'Clicking "Open in GitHub Codespaces" launches a complete cloud VS Code IDE in your browser in seconds. Pre-configured devcontainers, runtimes (Node, Python, Go), debuggers, and test suites are ready immediately with zero local setup.',
  },
  {
    question: 'What are hidden test cases and why are they kept separate?',
    answer:
      'Public tests verify basic behavior locally, while authoritative evaluation runs secret test cases in our isolated runner. This prevents hardcoded fixes and tests real concurrency, memory leaks, and boundary edge cases.',
  },
  {
    question: 'How is AI assistance controlled and prevented from cheating?',
    answer:
      'Hamster AI acts as a Socratic mentor with strict daily allowances (15 queries / 24 hours). It guides you through architectural invariants and debugging strategies, but strictly refuses to leak answers or write copy-paste code.',
  },
  {
    question: 'How does RepoHamster evaluate Pull Requests?',
    answer:
      'Every push or PR triggers an HMAC-SHA256 authenticated webhook. Our engine spins up an isolated sandbox, executes public and hidden test suites within a 30s timeout, and updates your dashboard in real time.',
  },
  {
    question: 'Can I add custom repositories and debugging challenges as an admin?',
    answer:
      'Yes. Through the Admin Console, staff administrators can connect any GitHub repository, define public and hidden test specifications, and adjust passing criteria without modifying application code.',
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2.5 max-w-3xl mx-auto">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] transition hover:border-[var(--yellow-primary)]/50 overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between p-3.5 sm:p-4 text-left text-xs sm:text-sm font-semibold text-[var(--gh-text)] focus:outline-none"
            >
              <span className="pr-2">{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[var(--yellow-bright)] transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-[var(--gh-border-subtle)] bg-[var(--gh-bg)] p-3.5 sm:p-4 text-xs text-[var(--gh-text-secondary)] leading-relaxed font-sans">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
