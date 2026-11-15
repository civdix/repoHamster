import { revalidatePath } from 'next/cache';

/**
 * Proactively revalidates and soft-fetches key pages so Vercel's Global Edge CDN
 * stays hot and updated automatically on git/webhook/admin events, rather than
 * waiting for an arbitrary user to visit.
 */
export async function softWarmPages(paths: string[] = ['/', '/leaderboard']): Promise<void> {
  try {
    // 1. Tell Next.js to purge/revalidate the edge cache for each path
    for (const p of paths) {
      try {
        revalidatePath(p);
      } catch (e) {
        // Non-fatal if invoked outside a pure request handler
      }
    }

    // 2. Resolve base URL to execute the background soft-fetch
    const rawHost =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const baseUrl = rawHost.startsWith('http') ? rawHost : `https://${rawHost}`;

    // 3. Fire-and-forget background soft-fetch to pre-populate Vercel CDN cache
    (async () => {
      for (const p of paths) {
        try {
          const targetUrl = new URL(p, baseUrl).toString();
          await fetch(targetUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'RepoHamster-Soft-Cache-Warmer/1.0',
              'x-soft-warm': '1',
            },
            // Non-blocking timeout so background task never hangs
            signal: AbortSignal.timeout(6000),
          }).catch(() => {
            // Soft-fetch error is silently ignored
          });
        } catch {
          // Ignore invalid URL resolution in isolated environments
        }
      }
    })();
  } catch (err) {
    console.warn('[CACHE WARMER] Notice during soft-warming:', err);
  }
}
