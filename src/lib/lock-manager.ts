import prisma from '@/lib/db';

export class LockAcquisitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LockAcquisitionError';
  }
}

interface LockPayload {
  ownerId: string;
  expiresAt: number; // millisecond timestamp
  createdAt: number;
}

// In-memory fast layer to serialize concurrent calls within the same process
const inMemoryLocks = new Map<string, { ownerId: string; expiresAt: number }>();

/**
 * Acquire a distributed lock for a specific resource key.
 * Uses Prisma AdminSettings unique key with automatic TTL expiration.
 */
export async function acquireLock(
  lockKey: string,
  ownerId: string,
  ttlMs = 45000
): Promise<boolean> {
  const now = Date.now();
  const dbKey = `lock:${lockKey}`;

  // 1. Process-level fast check
  const mem = inMemoryLocks.get(lockKey);
  if (mem && mem.expiresAt > now && mem.ownerId !== ownerId) {
    return false;
  }

  // 2. Distributed Database check via AdminSettings (unique key)
  try {
    const existing = await prisma.adminSettings.findUnique({
      where: { key: dbKey },
    });

    if (existing) {
      try {
        const payload: LockPayload = JSON.parse(existing.value);
        if (payload.expiresAt > now && payload.ownerId !== ownerId) {
          // Lock is actively held by someone else
          return false;
        }
      } catch {
        // Corrupt or invalid JSON, allow overwrite
      }
    }

    const payload: LockPayload = {
      ownerId,
      expiresAt: now + ttlMs,
      createdAt: now,
    };

    await prisma.adminSettings.upsert({
      where: { key: dbKey },
      update: {
        value: JSON.stringify(payload),
        description: `Operational lock for ${lockKey}`,
      },
      create: {
        key: dbKey,
        value: JSON.stringify(payload),
        description: `Operational lock for ${lockKey}`,
      },
    });

    inMemoryLocks.set(lockKey, { ownerId, expiresAt: now + ttlMs });
    return true;
  } catch (err) {
    console.warn(`[LOCK] Database lock acquisition failed for ${lockKey}, using memory lock fallback:`, err);
    if (inMemoryLocks.has(lockKey) && inMemoryLocks.get(lockKey)!.expiresAt > now) {
      return false;
    }
    inMemoryLocks.set(lockKey, { ownerId, expiresAt: now + ttlMs });
    return true;
  }
}

/**
 * Release an acquired distributed lock.
 */
export async function releaseLock(lockKey: string, ownerId: string): Promise<void> {
  const dbKey = `lock:${lockKey}`;
  inMemoryLocks.delete(lockKey);

  try {
    const existing = await prisma.adminSettings.findUnique({
      where: { key: dbKey },
    });

    if (existing) {
      try {
        const payload: LockPayload = JSON.parse(existing.value);
        if (payload.ownerId === ownerId) {
          await prisma.adminSettings.delete({
            where: { key: dbKey },
          });
        }
      } catch {
        await prisma.adminSettings.delete({
          where: { key: dbKey },
        });
      }
    }
  } catch (err) {
    console.warn(`[LOCK] Failed to cleanly release lock for ${lockKey}:`, err);
  }
}

/**
 * Executes an asynchronous task inside an exclusive distributed lock.
 * Guarantees release in a finally block and protects against double-clicks,
 * race conditions, and simultaneous Codespace creation/deletion.
 */
export async function withLock<T>(
  lockKey: string,
  ownerId: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const acquired = await acquireLock(lockKey, ownerId, ttlMs);
  if (!acquired) {
    throw new LockAcquisitionError(
      `An environment operation for this repository is already in progress. Please wait a moment.`
    );
  }

  try {
    return await fn();
  } finally {
    await releaseLock(lockKey, ownerId);
  }
}
