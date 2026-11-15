import { MetadataRoute } from 'next';
import prisma from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXTAUTH_URL || 'https://repohamster.com').replace(/\/$/, '');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/traffic-lab`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  let assignmentRoutes: MetadataRoute.Sitemap = [];
  try {
    const assignments = await prisma.assignment.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    assignmentRoutes = assignments.map((a) => ({
      url: `${baseUrl}/assignments/${a.slug}`,
      lastModified: a.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch (err) {
    console.warn('[SITEMAP] Could not fetch assignments for sitemap:', err);
  }

  let userRoutes: MetadataRoute.Sitemap = [];
  try {
    const users = await prisma.user.findMany({
      where: {
        username: { not: null },
      },
      select: { username: true, updatedAt: true },
      take: 200,
    });

    userRoutes = users.map((u) => ({
      url: `${baseUrl}/u/${encodeURIComponent(u.username!)}`,
      lastModified: u.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.warn('[SITEMAP] Could not fetch public users for sitemap:', err);
  }

  return [...staticRoutes, ...assignmentRoutes, ...userRoutes];
}
