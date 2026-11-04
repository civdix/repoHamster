import { execSync } from 'child_process';

const dbUrl = process.env.DATABASE_URL || '';
const isSqlite = dbUrl.startsWith('file:') || (!dbUrl.startsWith('postgres') && !process.env.VERCEL);
const schema = isSqlite ? 'prisma/schema.sqlite.prisma' : 'prisma/schema.prisma';

console.log(`[PRISMA GENERATE] Target schema: ${schema} (detected: ${isSqlite ? 'SQLite' : 'PostgreSQL'})`);

try {
  execSync(`npx prisma generate --schema=${schema}`, { stdio: 'inherit' });
} catch (err) {
  console.error('[PRISMA GENERATE] Failed:', err);
  process.exit(1);
}
