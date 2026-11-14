import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// If DATABASE_URL is defined in environment, PrismaClient picks it up automatically.
// Fallback is only provided if DATABASE_URL is not yet set (e.g. during build or static evaluation).
const defaultDatabaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/repohamster?schema=public';

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: defaultDatabaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Self-healing migration for PostgreSQL to guarantee schema columns exist
let selfHealPromise: Promise<void> | null = null;
export async function ensureDatabaseColumns(): Promise<void> {
  if (selfHealPromise) return selfHealPromise;
  selfHealPromise = (async () => {
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "Assignment" ADD COLUMN IF NOT EXISTS "webhookStatus" TEXT DEFAULT 'PENDING';
        ALTER TABLE "Assignment" ADD COLUMN IF NOT EXISTS "webhookError" TEXT;
        ALTER TABLE "Assignment" ADD COLUMN IF NOT EXISTS "guardrailsStatus" TEXT DEFAULT 'PENDING';
        ALTER TABLE "Assignment" ADD COLUMN IF NOT EXISTS "guardrailsError" TEXT;
      `);
    } catch (e: any) {
      console.warn('[DB SELF-HEAL] Non-fatal schema column ensure notice:', e?.message || e);
    }
  })();
  return selfHealPromise;
}

export default prisma;

