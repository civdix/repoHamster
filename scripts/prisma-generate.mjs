import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

let dbUrl = process.env.DATABASE_URL || '';

if (!dbUrl) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
      if (match) {
        dbUrl = match[1];
      }
    }
  } catch {}
}

const isPostgres =
  dbUrl.startsWith('postgres://') ||
  dbUrl.startsWith('postgresql://') ||
  Boolean(process.env.VERCEL);

const schema = isPostgres ? 'prisma/schema.prisma' : 'prisma/schema.sqlite.prisma';

console.log(`[PRISMA GENERATE] Target schema: ${schema} (detected: ${isPostgres ? 'PostgreSQL' : 'SQLite'})`);

try {
  execSync(`npx prisma generate --schema=${schema}`, { stdio: 'inherit' });
} catch (err) {
  console.error('[PRISMA GENERATE] Failed:', err);
  process.exit(1);
}
