'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FolderGit2, Layers, Settings, Mail } from 'lucide-react';

interface AdminSubnavProps {
  catalogueCount?: number;
  usersCount?: number;
  messagesCount?: number;
}

export function AdminSubnav({ catalogueCount, usersCount, messagesCount }: AdminSubnavProps) {
  const pathname = usePathname();

  const isOverview = pathname === '/admin';
  const isUsers = pathname.startsWith('/admin/users') || pathname.startsWith('/admin/candidates');
  const isCatalogue = pathname.startsWith('/admin/catalogue');
  const isAssignments = pathname.startsWith('/admin/assignments');
  const isMessages = pathname.startsWith('/admin/messages');
  const isSettings = pathname.startsWith('/admin/settings');

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      isActive: isOverview,
    },
    {
      href: '/admin/messages',
      label: messagesCount !== undefined ? `Inquiries (${messagesCount})` : 'Inquiries & Leads',
      icon: Mail,
      isActive: isMessages,
    },
    {
      href: '/admin/users',
      label: usersCount !== undefined ? `Users (${usersCount})` : 'Users Directory',
      icon: Users,
      isActive: isUsers,
    },
    {
      href: '/admin/catalogue',
      label: catalogueCount !== undefined ? `Repository Catalogue (${catalogueCount})` : 'Repository Catalogue',
      icon: FolderGit2,
      isActive: isCatalogue,
    },
    {
      href: '/admin/assignments',
      label: 'Active Challenges',
      icon: Layers,
      isActive: isAssignments,
    },
    {
      href: '/admin/settings',
      label: 'System & AI Settings',
      icon: Settings,
      isActive: isSettings,
    },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto border-b border-[var(--gh-border)]/60 pb-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.isActive;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
              active
                ? 'border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] font-bold shadow-none dark:shadow-xs'
                : 'border border-transparent text-[var(--gh-text-secondary)] hover:text-[var(--gh-text)] hover:bg-[var(--gh-bg-secondary)] hover:border-[var(--gh-border)]'
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${active ? 'text-[var(--yellow-bright)]' : 'text-[var(--gh-text-muted)]'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
