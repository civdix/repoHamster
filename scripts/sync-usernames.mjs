import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users. Checking usernames...`);

  for (const u of users) {
    if (!u.username) {
      const base = (u.githubUsername || u.name || u.email.split('@')[0])
        .replace(/[^a-zA-Z0-9_-]/g, '')
        .toLowerCase() || 'coder';

      let candidate = base;
      let count = 1;
      while (await prisma.user.findFirst({ where: { username: candidate, NOT: { id: u.id } } })) {
        candidate = `${base}${count}`;
        count++;
      }

      await prisma.user.update({
        where: { id: u.id },
        data: { username: candidate },
      });
      console.log(`Updated user ${u.email} -> @${candidate}`);
    } else {
      console.log(`User ${u.email} already has username @${u.username}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
