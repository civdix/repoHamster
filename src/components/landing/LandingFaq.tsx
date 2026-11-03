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
      'Every debugging challenge in RepoHamster connects directly to a predefined GitHub repository pre-configured with devcontainers. With a single click on "Open in GitHub Codespaces", GitHub launches a full cloud-hosted VS Code IDE in your browser with language servers, runtimes (Node, Python, Go), and terminal dependencies ready in seconds.',
  },
  {
    question: 'What are hidden test cases and why are they kept separate?',
    answer:
      'While public tests are included in the repository so candidates can verify basic fixes locally, authoritative evaluation uses hidden test suites executed strictly on RepoHamster’s isolated test workers. Hidden tests verify race conditions, memory leaks, timezone spoofing, and boundary edge cases without exposing the test assertions or solutions to prevent hardcoding.',
  },
  {
    question: 'How is AI assistance controlled and prevented from cheating?',
    answer:
      'RepoHamster provides a built-in Socratic AI Assistant configured with strict daily credit limits (e.g., 15 queries and 10,000 tokens per 24 hours). The AI is prompted as a senior mentor: it explains stack traces, architectural patterns, and debugging strategies, but strictly refuses to write the direct fix or generate copy-paste code.',
  },
  {
    question: 'How does RepoHamster evaluate Pull Requests?',
    answer:
      'When a candidate opens a Pull Request or pushes new commits, our GitHub App receives a webhook with HMAC-SHA256 signature verification. The engine extracts the exact commit SHA, spawns an isolated execution sandbox with stripped environment variables and a 30-second timeout, runs public and hidden test suites, and updates the candidate dashboard live.',
  },
  {
    question: 'Can I add custom repositories and debugging challenges as an admin?',
    answer:
      'Yes! Through the Admin Console, administrators can connect any GitHub repository, define public and hidden test specifications, set custom passing thresholds (e.g. 100%), and tune per-challenge AI token allowances without changing application code.',
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-xl border border-card-border bg-card transition hover:border-slate-700 overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-white focus:outline-none"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-brand-lime transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-card-border/60 bg-[#0d101a] p-4 sm:p-5 text-xs text-slate-300 leading-relaxed font-sans">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
