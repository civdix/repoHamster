import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const STILL_FORM_ASSIGNMENT = {
  slug: 'still-form',
  title: 'Still & Form: Commerce API & React Storefront',
  description:
    'A realistic home-goods storefront built with React 19 and Express 5. Track down cart deduction race conditions, tax calculation discrepancies, and checkout flow bugs with Vitest.',
  repoUrl: 'https://github.com/repohamster/Still-Form',
  baseBranch: 'main',
  difficulty: 'INTERMEDIATE',
  language: 'JavaScript & React',
  framework: 'React 19 & Express 5 (Vitest)',
  estimatedTimeMinutes: 45,
  instructions: `### Still & Form: Find It. Fix It. Prove It.

**Still & Form** is a small-batch home goods storefront and full-stack debugging challenge. Explore its deliberately imperfect commerce API, use the documented product, cart, and order contracts to investigate behavior, and prove fixes with automated tests.

### Technology Stack
- **Frontend**: React 19, Vite 6, React Router 7, Axios
- **Backend**: Node.js 20+ and Express 5
- **Data**: Seeded in-memory store (no external database required)
- **Testing**: Vitest, React Testing Library, jsdom, Supertest

### Problem Areas to Investigate
1. **Cart Item Deductions & Quantity Validation**:
   Adding and removing items from the in-memory cart can cause incorrect item count tracking and negative quantities when rapid updates occur.
2. **Pricing, Discounts & Sales Tax Rules**:
   Verify subtotal calculation, promotional discount threshold logic, and state tax rules against the documented contract in \`README.md\`.
3. **Order Placement & Checkout Orchestration**:
   Ensure order submission properly transfers items from the active cart to the confirmed orders collection and resets cart state cleanly.

### Getting Started Locally / in Codespaces
1. Install dependencies:
   \`\`\`bash
   npm install
   cp .env.example .env
   \`\`\`
2. Start the development servers:
   \`\`\`bash
   npm run dev
   \`\`\`
   - API listens on \`http://localhost:3001\`
   - React client listens on \`http://localhost:5173\`

### Running the Test Suite
- Run all tests:
  \`\`\`bash
  npm test
  \`\`\`
- Run backend tests only:
  \`\`\`bash
  npm run test:backend
  \`\`\`
- Run frontend tests only:
  \`\`\`bash
  npm run test:frontend
  \`\`\`
- Run business logic & pricing tests:
  \`\`\`bash
  npm run test:business
  \`\`\`

A fully resolved challenge will pass all tests with exit code 0.`,
  publicTestInfo: '4 Public Test Suites: Express REST API, React Storefront components, format utility, and business pricing/tax tests.',
  hiddenTestSpec: JSON.stringify({
    runnerCommand: 'npm test',
    testCases: [
      {
        id: 'HIDDEN-TC-01',
        name: 'Atomic Cart Item Modification and Quantity Boundary',
        description: 'Verifies cart quantity cannot drop below 1 or exceed stock limits during parallel updates.',
        points: 35,
      },
      {
        id: 'HIDDEN-TC-02',
        name: 'Tax Calculation & Promotional Discount Invariant',
        description: 'Validates sales tax boundary and coupon threshold calculation against contract.',
        points: 35,
      },
      {
        id: 'HIDDEN-TC-03',
        name: 'Order Checkout Idempotency & State Transition',
        description: 'Simulates parallel checkout requests with identical cart tokens to ensure single order creation.',
        points: 30,
      },
    ],
  }),
  passingThresholdPercent: 100,
  aiRequestLimit: 15,
  aiTokenLimit: 10000,
};

export const CURRENT_ASSIGNMENTS = [STILL_FORM_ASSIGNMENT];

async function seed() {
  console.log('🔄 Resetting RepoHamster database and seeding Still-Form only...');

  // 1. Purge all existing evaluation runs, test results, submissions, PRs, and assignments
  await prisma.testResult.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.pullRequest.deleteMany({});
  await prisma.candidateAssignment.deleteMany({});
  await prisma.aIUsage.deleteMany({});
  await prisma.assignment.deleteMany({});
  console.log('🧹 Purged all previous assignments and submissions.');

  // 2. Ensure System Settings
  const settings = [
    { key: 'ai_daily_request_limit', value: '15', description: 'Maximum AI Socratic hints per candidate per day' },
    { key: 'ai_token_limit', value: '10000', description: 'Daily AI token budget per candidate' },
    { key: 'platform_mode', value: 'SANDBOX', description: 'Execution mode: SANDBOX, HYBRID, or GITHUB_STRICT' },
    { key: 'socratic_strictness', value: 'HIGH', description: 'AI guidance mode: HIGH (never provides full answers)' },
    { key: 'github_sync_owner', value: 'repohamster', description: 'GitHub owner account for challenge sync' },
  ];

  for (const s of settings) {
    await prisma.adminSettings.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }
  console.log(`✅ Seeded system settings.`);

  // 3. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@debuglab.internal' },
    update: {
      role: 'ADMIN',
      name: 'RepoHamster Lead Architect',
      username: 'repohamster-admin',
      githubUsername: 'repohamster-admin',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
    },
    create: {
      email: 'admin@debuglab.internal',
      name: 'RepoHamster Lead Architect',
      role: 'ADMIN',
      username: 'repohamster-admin',
      githubUsername: 'repohamster-admin',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
    },
  });
  console.log(`✅ Seeded Admin User: ${admin.email}`);

  // 4. Seed ONLY Still-Form Challenge
  const stillForm = await prisma.assignment.create({
    data: {
      slug: STILL_FORM_ASSIGNMENT.slug,
      title: STILL_FORM_ASSIGNMENT.title,
      description: STILL_FORM_ASSIGNMENT.description,
      repoUrl: STILL_FORM_ASSIGNMENT.repoUrl,
      baseBranch: STILL_FORM_ASSIGNMENT.baseBranch,
      difficulty: STILL_FORM_ASSIGNMENT.difficulty,
      language: STILL_FORM_ASSIGNMENT.language,
      framework: STILL_FORM_ASSIGNMENT.framework,
      estimatedTimeMinutes: STILL_FORM_ASSIGNMENT.estimatedTimeMinutes,
      instructions: STILL_FORM_ASSIGNMENT.instructions,
      publicTestInfo: STILL_FORM_ASSIGNMENT.publicTestInfo,
      hiddenTestSpec: JSON.parse(STILL_FORM_ASSIGNMENT.hiddenTestSpec),
      passingThresholdPercent: STILL_FORM_ASSIGNMENT.passingThresholdPercent,
      aiRequestLimit: STILL_FORM_ASSIGNMENT.aiRequestLimit,
      aiTokenLimit: STILL_FORM_ASSIGNMENT.aiTokenLimit,
      isActive: true,
    },
  });
  console.log(`✅ Seeded 1 Active Challenge: ${stillForm.title} (${stillForm.repoUrl})`);

  // 5. Seed Demo Candidates
  const candidateUsers = [
    {
      email: 'alex.chen@example.com',
      name: 'Alex Chen',
      githubUsername: 'alexchen-dev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    },
    {
      email: 'sarah.connor@example.com',
      name: 'Sarah Connor',
      githubUsername: 'sarahc-codes',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    },
    {
      email: 'marcus.vance@example.com',
      name: 'Marcus Vance',
      githubUsername: 'marcus-sys',
      avatarUrl: 'https://avatars.githubusercontent.com/u/2048050?v=4',
    },
  ];

  for (let i = 0; i < candidateUsers.length; i++) {
    const c = candidateUsers[i];
    const candidate = await prisma.user.upsert({
      where: { email: c.email },
      update: {
        name: c.name,
        username: c.githubUsername,
        githubUsername: c.githubUsername,
        avatarUrl: c.avatarUrl,
        role: 'CANDIDATE',
      },
      create: {
        email: c.email,
        name: c.name,
        username: c.githubUsername,
        githubUsername: c.githubUsername,
        avatarUrl: c.avatarUrl,
        role: 'CANDIDATE',
      },
    });

    // Assign Alex Chen to Still-Form as Completed demo for verification
    if (i === 0) {
      const ca1 = await prisma.candidateAssignment.create({
        data: {
          candidateId: candidate.id,
          assignmentId: stillForm.id,
          status: 'COMPLETED',
          completedAt: new Date(Date.now() - 3600000 * 2),
        },
      });

      const pr1 = await prisma.pullRequest.create({
        data: {
          candidateId: candidate.id,
          assignmentId: stillForm.id,
          prNumber: 1,
          prUrl: `${stillForm.repoUrl}/pull/1`,
          repoFullName: 'repohamster/Still-Form',
          branchName: 'fix/cart-deduction-tax-idempotency',
          state: 'OPEN',
        },
      });

      const commitSha1 = 'f7e8d9c0b1a2345678901234567890abcdef1234';
      const sub1 = await prisma.submission.create({
        data: {
          candidateAssignmentId: ca1.id,
          pullRequestId: pr1.id,
          commitSha: commitSha1,
          commitMessage: 'fix(commerce): resolve cart stock decrement and sales tax rounding',
          submittedAt: new Date(Date.now() - 3600000 * 2),
        },
      });

      const eval1 = await prisma.evaluation.create({
        data: {
          submissionId: sub1.id,
          status: 'COMPLETED',
          totalTests: 7,
          passedTests: 7,
          failedTests: 0,
          scorePercent: 100.0,
          isPassed: true,
          executionTimeMs: 2950,
          evaluatedAt: new Date(Date.now() - 3600000 * 2),
          logs: `[REPOHAMSTER_SANDBOX] Target Repo: repohamster/Still-Form
[REPOHAMSTER_SANDBOX] Executing: vitest run --reporter=verbose
 ✓ client/src/tests/format.test.js (2 tests passed)
 ✓ client/src/tests/storefront.test.jsx (2 tests passed)
 ✓ server/tests/api.test.js (4 tests passed)
 ✓ server/tests/business.test.js (3 tests passed)
[REPOHAMSTER_SANDBOX] Authoritative Hidden Assertions:
 ✓ HIDDEN-TC-01: Atomic Cart Item Modification (840ms)
 ✓ HIDDEN-TC-02: Tax Calculation & Promotional Invariance (620ms)
 ✓ HIDDEN-TC-03: Order Checkout Idempotency (710ms)
[REPOHAMSTER_SANDBOX] Final Score: 100% (Passed). All acceptance criteria verified.`,
        },
      });

      const sampleTests = [
        { name: 'formatCurrency handles cents correctly', suite: 'PUBLIC', status: 'PASSED', time: 110, hidden: false },
        { name: 'storefront renders product catalog', suite: 'PUBLIC', status: 'PASSED', time: 340, hidden: false },
        { name: 'GET /api/products returns catalog array', suite: 'PUBLIC', status: 'PASSED', time: 180, hidden: false },
        { name: 'POST /api/cart updates quantity atomically', suite: 'PUBLIC', status: 'PASSED', time: 250, hidden: false },
        { name: 'HIDDEN-TC-01: Atomic Cart Item Modification', suite: 'HIDDEN', status: 'PASSED', time: 840, hidden: true },
        { name: 'HIDDEN-TC-02: Tax Calculation & Promotional Invariance', suite: 'HIDDEN', status: 'PASSED', time: 620, hidden: true },
        { name: 'HIDDEN-TC-03: Order Checkout Idempotency', suite: 'HIDDEN', status: 'PASSED', time: 710, hidden: true },
      ];

      for (const t of sampleTests) {
        await prisma.testResult.create({
          data: {
            evaluationId: eval1.id,
            testName: t.name,
            testSuite: t.suite,
            status: t.status,
            executionTimeMs: t.time,
            isHidden: t.hidden,
          },
        });
      }
    }
  }

  console.log(`✅ Seeded candidate accounts, submissions, evaluations, and test results for Still-Form.`);
  console.log('🎉 RepoHamster Seeding completed with Still-Form as the ONLY challenge repo!');
}

seed()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
