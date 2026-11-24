import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { canViewAdmin } from '@/lib/permissions';
import {
  Mail,
  Search,
  Building2,
  Calendar,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Inbox,
  Send,
  User,
  Filter,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export const dynamic = 'force-dynamic';

interface MessagesPageProps {
  searchParams?: {
    q?: string;
    useCase?: string;
  };
}

export default async function AdminMessagesPage({ searchParams }: MessagesPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canViewAdmin(session)) {
    redirect('/auth/signin?callbackUrl=/admin/messages');
  }

  const query = (searchParams?.q || '').trim();
  const selectedUseCase = searchParams?.useCase || 'ALL';

  const whereClause: any = {};

  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { roleOrOrg: { contains: query, mode: 'insensitive' } },
      { message: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (selectedUseCase !== 'ALL') {
    whereClause.useCase = selectedUseCase;
  }

  let submissions: any[] = [];
  let totalCount = 0;
  let recentCount = 0;

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [items, total, recent] = await Promise.all([
      prisma.contactSubmission.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    submissions = items;
    totalCount = total;
    recentCount = recent;
  } catch (error) {
    console.error('[ADMIN MESSAGES] Query error:', error);
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--gh-text)] flex items-center space-x-2">
            <Mail className="h-5 w-5 text-[var(--yellow-bright)]" />
            <span>Inbound Inquiries & Enterprise Leads</span>
            <span className="rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-xs font-mono font-medium text-[var(--amber-badge-text)]">
              {totalCount} Total
            </span>
          </h2>
          <p className="text-xs text-[var(--gh-text-secondary)] mt-1">
            Inquiries submitted through the homepage contact form and /contact page. Saved permanently in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/contact"
            target="_blank"
            className="flex items-center space-x-1.5 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-2 text-xs font-semibold text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:border-[var(--gh-border-active)] transition"
          >
            <span>Open Contact Form</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--gh-text-secondary)]">
            <span>Total Inquiries</span>
            <Inbox className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--gh-text)] font-mono">{totalCount}</div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-mono">Synced to Database</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--gh-text-secondary)]">
            <span>Recent (Last 7 Days)</span>
            <Calendar className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--yellow-bright)] font-mono">{recentCount}</div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-mono">New leads & queries</div>
        </div>

        <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--gh-text-secondary)]">
            <span>Notification Target</span>
            <Send className="h-4 w-4 text-[var(--yellow-bright)]" />
          </div>
          <div className="mt-2 text-xs font-mono font-bold text-[var(--gh-text)] truncate" title="shivdix.work+repohamster@gmail.com">
            shivdix.work+repohamster@gmail.com
          </div>
          <div className="mt-1 text-[11px] text-[var(--gh-text-muted)] font-mono">Direct Admin Inbox</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-3">
        <form method="GET" action="/admin/messages" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gh-text-muted)]" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by name, email, organization, or message keywords..."
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] pl-9 pr-3 py-2 text-xs text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              name="useCase"
              defaultValue={selectedUseCase}
              className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs text-[var(--gh-text)] focus:outline-none focus:border-[var(--yellow-primary)] transition"
            >
              <option value="ALL">All Use Cases</option>
              <option value="Hiring Team Assessment">Hiring Team</option>
              <option value="University / Campus Prep">University / Campus</option>
              <option value="Individual Big Tech Prep">Individual Prep</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-[var(--yellow-button-bg)] px-4 py-2 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition"
            >
              Filter
            </button>

            {(query || selectedUseCase !== 'ALL') && (
              <Link
                href="/admin/messages"
                className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-2 text-xs font-medium text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] transition"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Messages List */}
      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gh-bg)] border border-[var(--gh-border)]">
            <HamsterMascot variant="normal" size={36} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--gh-text)]">No inquiries found</h3>
            <p className="text-xs text-[var(--gh-text-secondary)] max-w-sm mx-auto">
              {query || selectedUseCase !== 'ALL'
                ? 'No inquiries match your current search or use-case filter.'
                : 'Submissions from the contact form will appear here in real-time and are saved in the PostgreSQL database.'}
            </p>
          </div>
          <div>
            <Link
              href="/contact"
              target="_blank"
              className="inline-flex items-center space-x-1.5 rounded-full bg-[var(--yellow-button-bg)] px-4 py-2 text-xs font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition"
            >
              <span>Test Submit an Inquiry</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((item) => {
            const dateStr = new Date(item.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            });
            const replyMailto = `mailto:${item.email}?subject=Re:%20repoHamster%20inquiry&body=Hi%20${encodeURIComponent(
              item.name
            )},%0A%0AThank%20you%20for%20reaching%20out%20to%20repoHamster!%0A%0A`;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 hover:border-[var(--gh-border-active)] transition space-y-3"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--gh-border)]/50 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gh-bg)] border border-[var(--gh-border)] text-[var(--yellow-bright)] font-bold text-xs uppercase">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[var(--gh-text)]">{item.name}</span>
                        {item.roleOrOrg && (
                          <span className="inline-flex items-center space-x-1 text-xs text-[var(--gh-text-secondary)] font-mono">
                            <Building2 className="h-3 w-3 text-[var(--gh-text-muted)]" />
                            <span>{item.roleOrOrg}</span>
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${item.email}`}
                        className="text-xs font-mono text-[var(--yellow-primary)] hover:underline"
                      >
                        {item.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    {item.useCase && (
                      <span className="inline-flex items-center rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2.5 py-0.5 text-[11px] font-mono font-medium text-[var(--amber-badge-text)]">
                        {item.useCase}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-[var(--gh-text-muted)] flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{dateStr}</span>
                    </span>
                    <a
                      href={replyMailto}
                      className="inline-flex items-center space-x-1 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-1 text-xs font-medium text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:border-[var(--yellow-primary)] transition"
                      title="Reply directly via email"
                    >
                      <Send className="h-3 w-3 text-[var(--yellow-bright)]" />
                      <span>Reply</span>
                    </a>
                  </div>
                </div>

                {/* Message body */}
                <div className="rounded-xl border border-[var(--gh-border)]/60 bg-[var(--gh-bg)] p-3.5 text-xs text-[var(--gh-text)] leading-relaxed whitespace-pre-wrap font-sans">
                  {item.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
