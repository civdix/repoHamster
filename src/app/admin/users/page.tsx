import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { canViewAdmin } from '@/lib/permissions';
import {
  Users,
  Search,
  Shield,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  GitPullRequest,
  Sparkles,
  Layers,
  SlidersHorizontal,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface UsersPageProps {
  searchParams?: {
    page?: string;
    limit?: string;
    role?: string;
    q?: string;
  };
}

const ALLOWED_LIMITS = [10, 50, 500] as const;
type PageLimit = (typeof ALLOWED_LIMITS)[number];

export default async function AdminUsersDirectoryPage({ searchParams }: UsersPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !canViewAdmin(session)) {
    redirect('/auth/signin?callbackUrl=/admin/users');
  }

  // Parse and validate pagination & filters
  const rawPage = parseInt(searchParams?.page || '1', 10);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const rawLimit = parseInt(searchParams?.limit || '10', 10);
  const limit: PageLimit = ALLOWED_LIMITS.includes(rawLimit as PageLimit) ? (rawLimit as PageLimit) : 10;

  const role = searchParams?.role?.toUpperCase() || 'ALL';
  const query = (searchParams?.q || '').trim();

  // Construct where query
  const whereClause: any = {};
  if (role !== 'ALL') {
    whereClause.role = role;
  }
  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { email: { contains: query } },
      { username: { contains: query } },
      { githubUsername: { contains: query } },
    ];
  }

  const skip = (page - 1) * limit;

  let totalUsers = 0;
  let totalCandidates = 0;
  let totalAdmins = 0;
  let users: any[] = [];
  let dbError: string | null = null;

  try {
    const [tUsers, tCandidates, tAdmins, userList] = await Promise.all([
      prisma.user.count({ where: whereClause }),
      prisma.user.count({ where: { role: 'CANDIDATE' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.findMany({
        where: whereClause,
        include: {
          assignments: {
            include: {
              assignment: true,
              submissions: {
                include: { evaluation: true },
              },
            },
          },
          aiUsages: {
            select: { id: true, totalTokens: true },
          },
          pullRequests: {
            select: { id: true, state: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    totalUsers = tUsers;
    totalCandidates = tCandidates;
    totalAdmins = tAdmins;
    users = userList;
  } catch (err: any) {
    console.error('[ADMIN USERS] Query failed:', err);
    dbError = err?.message || 'Database query error';
  }

  const totalPages = Math.max(1, Math.ceil(totalUsers / limit));
  const currentPage = Math.min(page, totalPages);
  const startItem = totalUsers === 0 ? 0 : skip + 1;
  const endItem = Math.min(skip + limit, totalUsers);

  // Helper to construct query strings for pagination and filters
  const getPageUrl = (targetPage: number, targetLimit = limit, targetRole = role, targetQuery = query) => {
    const params = new URLSearchParams();
    if (targetPage > 1) params.set('page', String(targetPage));
    if (targetLimit !== 10) params.set('limit', String(targetLimit));
    if (targetRole !== 'ALL') params.set('role', targetRole);
    if (targetQuery) params.set('q', targetQuery);
    const qs = params.toString();
    return `/admin/users${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Stats Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--gh-text)] flex items-center space-x-2">
            <Users className="h-5 w-5 text-[var(--yellow-bright)]" />
            <span>User &amp; Candidate Directory</span>
          </h2>
          <p className="text-xs text-[var(--gh-text-secondary)] mt-0.5">
            Audit registered engineers, inspect challenge completion rates, and manage role access.
          </p>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] px-3 py-1.5 text-[var(--gh-text-secondary)]">
            Total: <strong className="text-[var(--gh-text)]">{totalCandidates + totalAdmins}</strong>
          </span>
          <span className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-1.5 text-[var(--amber-badge-text)] font-semibold">
            Candidates: <strong>{totalCandidates}</strong>
          </span>
          <span className="rounded-xl border border-[var(--yellow-primary)]/50 bg-[var(--gh-bg)] px-3 py-1.5 text-[var(--yellow-bright)] font-semibold">
            Admins: <strong>{totalAdmins}</strong>
          </span>
        </div>
      </div>

      {dbError && (
        <div className="rounded-xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-4 text-xs font-mono text-[var(--amber-badge-text)]">
          <strong>Database Notice:</strong> {dbError}
        </div>
      )}

      {/* Controls: Search, Role Filter, and Page Size (10, 50, 500) */}
      <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <form method="GET" action="/admin/users" className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--gh-text-muted)]" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by name, handle, email..."
              className="w-full rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] pl-10 pr-4 py-2 text-xs font-mono text-[var(--gh-text)] placeholder-[var(--gh-text-muted)] focus:border-[var(--yellow-primary)] focus:outline-none"
            />
            {limit !== 10 && <input type="hidden" name="limit" value={limit} />}
            {role !== 'ALL' && <input type="hidden" name="role" value={role} />}
          </form>

          {/* Controls Right: Role Filter & Page Size Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter Tabs */}
            <div className="flex items-center space-x-1 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-1 text-xs font-mono">
              {(['ALL', 'CANDIDATE', 'ADMIN'] as const).map((r) => {
                const isActive = role === r;
                return (
                  <Link
                    key={r}
                    href={getPageUrl(1, limit, r, query)}
                    className={`rounded-lg px-2.5 py-1 text-xs transition ${
                      isActive
                        ? 'bg-[var(--yellow-primary)] text-black font-bold shadow-[var(--yellow-glow)]'
                        : 'text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                    }`}
                  >
                    {r === 'ALL' ? 'All Roles' : r === 'CANDIDATE' ? 'Candidates' : 'Admins'}
                  </Link>
                );
              })}
            </div>

            {/* Page Size Selector (10, 50, 500) */}
            <div className="flex items-center space-x-1.5 font-mono text-xs">
              <span className="text-[var(--gh-text-muted)] flex items-center space-x-1">
                <SlidersHorizontal className="h-3 w-3" />
                <span className="hidden sm:inline">Per page:</span>
              </span>
              <div className="flex items-center space-x-1 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] p-1">
                {ALLOWED_LIMITS.map((pageSize) => {
                  const isSelected = limit === pageSize;
                  return (
                    <Link
                      key={pageSize}
                      href={getPageUrl(1, pageSize, role, query)}
                      className={`rounded-lg px-2.5 py-1 font-bold text-xs transition ${
                        isSelected
                          ? 'bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--yellow-bright)]'
                          : 'text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)]'
                      }`}
                    >
                      {pageSize}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Active Results Summary */}
        <div className="flex items-center justify-between text-xs font-mono text-[var(--gh-text-muted)] pt-1 border-t border-[var(--gh-border)]/60">
          <div>
            Showing <strong className="text-[var(--gh-text)]">{startItem}–{endItem}</strong> of{' '}
            <strong className="text-[var(--yellow-bright)]">{totalUsers}</strong> matching users
            {query && <span> for &ldquo;{query}&rdquo;</span>}
          </div>
          <div className="hidden sm:block">
            Page <strong className="text-[var(--gh-text)]">{currentPage}</strong> of{' '}
            <strong className="text-[var(--gh-text)]">{totalPages}</strong>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] overflow-hidden shadow-none dark:shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[var(--gh-border)] bg-[var(--gh-bg)] text-[11px] text-[var(--gh-text-muted)] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Developer / User</th>
                <th className="px-4 py-3.5">Email Address</th>
                <th className="px-4 py-3.5">Platform Role</th>
                <th className="px-4 py-3.5 text-center">Solves / Assigned</th>
                <th className="px-4 py-3.5 text-center">PR Activity</th>
                <th className="px-4 py-3.5 text-center">AI Queries</th>
                <th className="px-4 py-3.5">Joined Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gh-border)]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[var(--gh-text-muted)]">
                    <Users className="mx-auto h-8 w-8 text-[var(--gh-text-muted)]/50 mb-2" />
                    <p className="font-semibold text-sm text-[var(--gh-text)]">No users found</p>
                    <p className="text-xs">Try adjusting your search query, role filter, or pagination limit.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const completed = (user.assignments || []).filter((a: any) => a.status === 'COMPLETED').length;
                  const totalAssigned = (user.assignments || []).length;
                  const prsCount = (user.pullRequests || []).length;
                  const aiCount = (user.aiUsages || []).length;
                  const totalTokens = (user.aiUsages || []).reduce((sum: number, u: any) => sum + (u.totalTokens || 0), 0);
                  const displayHandle = user.username || user.githubUsername || user.email.split('@')[0];

                  return (
                    <tr key={user.id} className="hover:bg-[var(--gh-bg)]/60 transition-colors">
                      {/* User Avatar & Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={user.avatarUrl || 'https://avatars.githubusercontent.com/u/9919?v=4'}
                            alt={user.name || displayHandle}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full ring-1 ring-[var(--gh-border)] object-cover bg-[var(--gh-bg)] shrink-0"
                          />
                          <div className="space-y-0.5">
                            <p className="font-bold font-sans text-xs text-[var(--gh-text)] leading-tight">
                              {user.name || 'Unnamed Developer'}
                            </p>
                            <div className="flex items-center space-x-1.5">
                              <Link
                                href={`/u/${displayHandle}`}
                                className="text-[11px] font-mono text-[var(--yellow-bright)] hover:underline inline-flex items-center space-x-1"
                                title="Open Public Profile"
                              >
                                <span>@{displayHandle}</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 text-[var(--gh-text-secondary)] font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        {user.role === 'ADMIN' ? (
                          <span className="inline-flex items-center space-x-1 rounded-full border border-[var(--yellow-primary)]/60 bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--amber-badge-text)] shadow-none dark:shadow-xs">
                            <Shield className="h-3 w-3 text-[var(--yellow-bright)]" />
                            <span>Platform Admin</span>
                          </span>
                        ) : completed > 0 ? (
                          <span className="inline-flex items-center space-x-1 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--amber-badge-text)]">
                            <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                            <span>Verified Candidate</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--gh-text-muted)]">
                            <Clock className="h-3 w-3 text-[var(--yellow-bright)]" />
                            <span>Onboarding</span>
                          </span>
                        )}
                      </td>

                      {/* Solves */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center rounded-full border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-0.5 font-bold text-[11px] text-[var(--gh-text)]">
                          <strong className="text-[var(--yellow-bright)] mr-1">{completed}</strong> / {totalAssigned}
                        </span>
                      </td>

                      {/* Pull Requests */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center space-x-1 text-[var(--gh-text-secondary)]">
                          <GitPullRequest className="h-3 w-3 text-[var(--gh-text-muted)]" />
                          <span>{prsCount}</span>
                        </span>
                      </td>

                      {/* AI Queries */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center space-x-1 text-[var(--gh-text-secondary)]">
                          <Sparkles className="h-3 w-3 text-[var(--yellow-bright)]" />
                          <span>{aiCount}</span>
                          <span className="text-[10px] text-[var(--gh-text-muted)]">({totalTokens.toLocaleString()} tok)</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-3.5 text-[11px] text-[var(--gh-text-muted)]">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/candidates/${user.id}`}
                            className="inline-flex items-center space-x-1 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--gh-text)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/50 transition active:scale-95"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Navigation Footer */}
        {totalPages > 1 && (
          <div className="border-t border-[var(--gh-border)] bg-[var(--gh-bg)] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div className="text-[var(--gh-text-muted)]">
              Showing page <strong className="text-[var(--gh-text)]">{currentPage}</strong> of{' '}
              <strong className="text-[var(--gh-text)]">{totalPages}</strong> ({totalUsers} total users)
            </div>

            {/* Pagination Controls Buttons */}
            <div className="flex items-center space-x-1.5">
              {/* First Page */}
              <Link
                href={getPageUrl(1, limit, role, query)}
                aria-disabled={currentPage <= 1}
                className={`rounded-lg border border-[var(--gh-border)] p-1.5 transition ${
                  currentPage <= 1
                    ? 'pointer-events-none opacity-40 text-[var(--gh-text-muted)]'
                    : 'bg-[var(--gh-bg-secondary)] text-[var(--gh-text)] hover:border-[var(--yellow-primary)]'
                }`}
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Link>

              {/* Previous Page */}
              <Link
                href={getPageUrl(currentPage - 1, limit, role, query)}
                aria-disabled={currentPage <= 1}
                className={`flex items-center space-x-1 rounded-lg border border-[var(--gh-border)] px-2.5 py-1.5 transition ${
                  currentPage <= 1
                    ? 'pointer-events-none opacity-40 text-[var(--gh-text-muted)]'
                    : 'bg-[var(--gh-bg-secondary)] text-[var(--gh-text)] hover:border-[var(--yellow-primary)]'
                }`}
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Prev</span>
              </Link>

              {/* Dynamic Page Number Buttons */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show first, last, and within 2 pages of current
                    return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                  })
                  .map((p, index, array) => {
                    const prev = array[index - 1];
                    const isEllipsis = prev && p - prev > 1;
                    const isSelected = p === currentPage;

                    return (
                      <React.Fragment key={p}>
                        {isEllipsis && (
                          <span className="px-1 text-[var(--gh-text-muted)] select-none">...</span>
                        )}
                        <Link
                          href={getPageUrl(p, limit, role, query)}
                          className={`rounded-lg px-2.5 py-1 font-bold transition ${
                            isSelected
                              ? 'bg-[var(--yellow-primary)] text-black shadow-[var(--yellow-glow)]'
                              : 'border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text)] hover:border-[var(--yellow-primary)]'
                          }`}
                        >
                          {p}
                        </Link>
                      </React.Fragment>
                    );
                  })}
              </div>

              {/* Next Page */}
              <Link
                href={getPageUrl(currentPage + 1, limit, role, query)}
                aria-disabled={currentPage >= totalPages}
                className={`flex items-center space-x-1 rounded-lg border border-[var(--gh-border)] px-2.5 py-1.5 transition ${
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-40 text-[var(--gh-text-muted)]'
                    : 'bg-[var(--gh-bg-secondary)] text-[var(--gh-text)] hover:border-[var(--yellow-primary)]'
                }`}
                title="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Link>

              {/* Last Page */}
              <Link
                href={getPageUrl(totalPages, limit, role, query)}
                aria-disabled={currentPage >= totalPages}
                className={`rounded-lg border border-[var(--gh-border)] p-1.5 transition ${
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-40 text-[var(--gh-text-muted)]'
                    : 'bg-[var(--gh-bg-secondary)] text-[var(--gh-text)] hover:border-[var(--yellow-primary)]'
                }`}
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
