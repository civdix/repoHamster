import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PREDEFINED_ASSIGNMENTS = [
  {
    slug: 'ecommerce-concurrency-ratelimit',
    title: 'E-Commerce Checkout Concurrency & Rate Limiter Leak',
    description:
      'Debug a critical race condition in the stock reservation pipeline and resolve a sliding-window rate limiter memory leak allowing double-spends under high concurrency.',
    repoUrl: 'https://github.com/debuglab-assessments/ecommerce-concurrency-ratelimit',
    baseBranch: 'main',
    difficulty: 'INTERMEDIATE',
    language: 'TypeScript',
    framework: 'Next.js & Node.js',
    estimatedTimeMinutes: 35,
    instructions: `### Problem Description

In our high-throughput e-commerce checkout microservice, the Black Friday stress test revealed two severe production bugs:

1. **Inventory Double-Allocation (Race Condition)**:
   When multiple checkout requests for the same SKU arrive within milliseconds, concurrent requests bypass the quantity check because read and write operations are not transactional or atomic. Multiple orders are confirmed even when stock has reached zero.

2. **Sliding-Window Rate Limiter Leak**:
   The sliding-window rate limiter implemented in \`src/lib/rate-limiter.ts\` keeps timestamps in memory without pruning evicted timestamps outside the current window (\`Date.now() - windowMs\`). Furthermore, the key expiration lookup contains an off-by-one window index calculation that fails under burst traffic.

### Expected Behavior
- Stock reservation must guarantee that concurrent checkouts for remaining stock $N$ fail gracefully with HTTP 409 \`INSUFFICIENT_STOCK\` once stock hits 0.
- The sliding-window rate limiter must strictly throttle candidates exceeding 10 req/minute, properly discard expired bucket timestamps, and prevent memory growth.

### Target Files to Investigate
- \`src/services/inventoryService.ts\`
- \`src/lib/rate-limiter.ts\`
- \`src/pages/api/checkout.ts\`

### Testing
- Run public tests: \`npm test\`
- All public and hidden test cases must pass for completion.`,
    publicTestInfo:
      '2 Public Tests: Single checkout reservation verification and sequential rate limiter quota verification.',
    hiddenTestSpec: JSON.stringify({
      runnerCommand: 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Concurrent 50-Request Race Condition Stress Test',
          description: 'Simulates 50 simultaneous parallel checkouts against an inventory of 5 units.',
          points: 30,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Sliding Window Boundary Timestamp Pruning Verification',
          description: 'Verifies memory cleanup of expired timestamps across window boundaries.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Sub-Millisecond Burst Jitter Throttling',
          description: 'Ensures strict rate limiting under jittered concurrent bursts without dropping legal requests.',
          points: 35,
        },
      ],
    }),
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'fastapi-jwt-auth-revocation',
    title: 'FastAPI JWT Auth Session Invalidation & Role Escalation',
    description:
      'Fix a security vulnerability where revoked JWT tokens remain valid due to timezone-naive timestamp parsing, and patch a privilege escalation flaw in role middleware.',
    repoUrl: 'https://github.com/debuglab-assessments/fastapi-jwt-auth-revocation',
    baseBranch: 'main',
    difficulty: 'INTERMEDIATE',
    language: 'Python',
    framework: 'FastAPI & Pytest',
    estimatedTimeMinutes: 40,
    instructions: `### Problem Description

A security audit on the FastAPI authentication gateway surfaced two critical CVEs:

1. **Timezone Naive Token Expiration**:
   In \`app/security/jwt.py\`, token expiration verification compares \`datetime.now()\` with UTC timestamps from the payload without explicit tzinfo. When tested across server clusters running in different timezones or with Daylight Savings, expired tokens are accepted for up to 5 hours.

2. **Role Sanitization & Case Sensitivity Bypass**:
   In \`app/middleware/auth.py\`, the \`require_role("admin")\` helper performs an unnormalized membership check. Users with role payload \`"Admin"\` or \`" ADMIN "\` bypass strict role checks or get elevated permissions due to faulty string matching logic.

3. **Logout Token Blacklist Race Condition**:
   Tokens revoked on \`/api/auth/logout\` are written to an in-memory TTL set, but the lookup logic fails if the token string contains trailing whitespace or bearer prefixes.

### Expected Behavior
- Tokens must be compared using UTC timezone-aware datetimes (\`datetime.now(timezone.utc)\`).
- Role authorization must be case-insensitive, trimmed, and strictly validated against the allowed enum.
- Revoked tokens must return HTTP 401 \`TOKEN_REVOKED\` immediately.

### Target Files to Investigate
- \`app/security/jwt.py\`
- \`app/middleware/auth.py\`
- \`app/routers/auth.py\`

### Testing
- Run public tests: \`pytest tests/test_public.py\`
- Ensure all hidden security regression suites pass.`,
    publicTestInfo:
      '2 Public Tests: Valid login token generation and basic expired token rejection.',
    hiddenTestSpec: JSON.stringify({
      runnerCommand: 'pytest tests/test_hidden.py',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Timezone Offset Spoofing (+14:00 UTC) Expiration Check',
          description: 'Validates strict UTC comparison rejecting manipulated timezone offsets.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Role Case-Tampering & Whitespace Injection Test',
          description: 'Tests privilege escalation attempts with mixed casing and URL encoded spaces.',
          points: 30,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Token Revocation Blacklist Invalidation Test',
          description: 'Confirms that revoked tokens are immediately rejected even if exp is in the future.',
          points: 35,
        },
      ],
    }),
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'event-queue-deadlock-leak',
    title: 'Distributed Event Queue Batch Deadlock & Worker Lockup',
    description:
      'Diagnose and resolve an asynchronous event worker lockup caused by unhandled promise rejections and circular retry counters in a Node.js batch consumer.',
    repoUrl: 'https://github.com/debuglab-assessments/event-queue-deadlock-leak',
    baseBranch: 'main',
    difficulty: 'ADVANCED',
    language: 'TypeScript',
    framework: 'Node.js & Jest',
    estimatedTimeMinutes: 45,
    instructions: `### Problem Description

The ingestion worker cluster processing analytics events experiences intermittent worker stalls during poison pill messages:

1. **Unhandled Rejection Batch Stall**:
   In \`src/worker/batchConsumer.ts\`, the consumer processes messages in batches of 20 using \`Promise.all\`. If a single event in the batch throws an unexpected schema validation error, the entire batch rejects, leaving the remaining 19 messages unacknowledged and the worker paused waiting for a lock release that never arrives.

2. **Circular Retry Counter Overflow**:
   When retrying failed events, the retry counter is not preserved across deserialization, causing events to retry infinitely until the Node.js heap overflows (\`JavaScript heap out of memory\`).

### Expected Behavior
- Worker must use resilient batch settlement (\`Promise.allSettled\` or robust per-item try/catch) so one bad message does not halt processing of healthy messages.
- Failed messages exceeding 3 retries must be routed to the Dead Letter Queue (DLQ).
- Worker lock must always be released in a \`finally\` block with an explicit lease timeout.

### Target Files to Investigate
- \`src/worker/batchConsumer.ts\`
- \`src/queue/deadLetterQueue.ts\`
- \`src/locks/distributedLock.ts\`

### Testing
- Run public tests: \`npm test\`
- Hidden tests will assert throughput under poison pill injections.`,
    publicTestInfo:
      '2 Public Tests: Batch consumption of 5 clean events and basic DLQ routing.',
    hiddenTestSpec: JSON.stringify({
      runnerCommand: 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Poison Pill Batch Resiliency Test',
          description: 'Injects 3 corrupt messages into a batch of 50 and asserts 47 clean messages process without delay.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Retry Counter Heap Memory Leak Assertion',
          description: 'Runs 1,000 poison pills and asserts memory remains stable below 60MB.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Worker Lease Timeout Recovery',
          description: 'Ensures stalled worker lock is auto-recovered after lease expiration.',
          points: 30,
        },
      ],
    }),
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'go-metrics-goroutine-leak',
    title: 'Metrics Aggregator Goroutine Leak & Slice Data Race',
    description:
      'Fix a concurrency bug in a Go telemetry service where cancelled contexts leak goroutines and unbuffered slice writes cause data races under high load.',
    repoUrl: 'https://github.com/debuglab-assessments/go-metrics-goroutine-leak',
    baseBranch: 'main',
    difficulty: 'ADVANCED',
    language: 'Go',
    framework: 'Go & Gin',
    estimatedTimeMinutes: 50,
    instructions: `### Problem Description

The Go metrics daemon collects system telemetry from thousands of IoT devices. Under sustained load:

1. **Goroutine Leak on Downstream Timeout**:
   In \`collector/worker_pool.go\`, worker routines dispatch telemetry to a downstream HTTP buffer over an unbuffered channel without listening to \`ctx.Done()\`. When a downstream timeout occurs, the sender blocks forever on the channel send, leaking thousands of goroutines.

2. **Concurrent Slice Append Data Race**:
   In \`buffer/metrics_buffer.go\`, \`AppendMetric()\` appends items to an internal slice \`m.records = append(m.records, item)\` without holding a \`sync.RWMutex\`, causing memory corruption and panics under \`go test -race\`.

### Expected Behavior
- Every channel send in worker routines must select against \`ctx.Done()\` and clean up resources on cancellation.
- All access to \`m.records\` must be properly synchronized with thread-safe read/write locking.
- Zero goroutine leaks after context cancellation.
- Passes \`go test -race ./...\` cleanly.

### Target Files to Investigate
- \`collector/worker_pool.go\`
- \`buffer/metrics_buffer.go\`

### Testing
- Run public tests: \`go test -v ./...\`
- Hidden evaluation runs with \`-race\` flag and runtime goroutine profiler checks.`,
    publicTestInfo:
      '2 Public Tests: Single metric collection and buffer flush.',
    hiddenTestSpec: JSON.stringify({
      runnerCommand: 'go test -race -v ./tests/hidden/...',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Goroutine Count Leak Assertion (500 Cancelled Contexts)',
          description: 'Validates runtime.NumGoroutine() drops back to baseline after context cancellation.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Concurrent High-Throughput Slice Append Race Verification',
          description: 'Spawns 100 concurrent producers with -race detector enabled.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Channel Buffer Drain Under Slow Consumer',
          description: 'Tests buffer behavior when downstream collector artificially delays responses.',
          points: 25,
        },
      ],
    }),
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'financial-ledger-precision-loss',
    title: 'Financial Ledger Binary Float Precision Loss & Rounding Discrepancy',
    description:
      'Resolve an off-by-one cent discrepancy in a double-entry ledger calculation caused by binary floating-point representation and improper rounding algorithms.',
    repoUrl: 'https://github.com/debuglab-assessments/financial-ledger-precision-loss',
    baseBranch: 'main',
    difficulty: 'BEGINNER',
    language: 'Python',
    framework: 'Python & Decimal',
    estimatedTimeMinutes: 30,
    instructions: `### Problem Description

The financial reconciliation service audits debit and credit balances across international transactions. End-of-month reconciliation reports indicate persistent 1-cent discrepancies across customer accounts:

1. **Binary Floating Point Drift**:
   In \`ledger/calculator.py\`, amounts are cast to Python standard \`float\` for arithmetic operations. For example, \`0.1 + 0.2 != 0.3\` accumulates significant error across thousands of ledger rows.

2. **Inconsistent Banker's Rounding vs Half-Up**:
   The currency exchange calculator in \`ledger/fx.py\` uses Python's default \`round()\` (Round Half to Even) instead of the compliant \`ROUND_HALF_UP\` required by local banking standards, causing uneven balance distributions in multi-currency settlements.

### Expected Behavior
- All monetary amounts must be stored, computed, and compared using \`decimal.Decimal\` with exact \`ROUND_HALF_UP\` precision.
- Every double-entry transaction must satisfy: \`sum(debits) == sum(credits)\` to 4 decimal places.
- Serialization to JSON must format amounts as exact strings (e.g. \`"1450.25"\`) rather than imprecise floats.

### Target Files to Investigate
- \`ledger/calculator.py\`
- \`ledger/fx.py\`
- \`ledger/models.py\`

### Testing
- Run public tests: \`pytest tests/test_public.py\`
- Hidden tests will execute 10,000 multi-currency transactions with precision validation.`,
    publicTestInfo:
      '2 Public Tests: Balanced standard transaction and basic currency conversion.',
    hiddenTestSpec: JSON.stringify({
      runnerCommand: 'pytest tests/test_hidden.py',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: '10,000 Micro-Transaction Float Precision Drift Test',
          description: 'Asserts absolute debit/credit equality down to 0.0001 precision across 10,000 iterations.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Multi-Currency Triangulation Round-Half-Up Compliance',
          description: 'Tests currency conversion rounding across USD, EUR, and JPY against reference exchange tables.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'String Serialization Exact Precision Assertion',
          description: 'Ensures JSON output retains exact fractional string representations without scientific notation.',
          points: 30,
        },
      ],
    }),
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },
];

async function main() {
  console.log('🌱 Starting DebugLab database seeding...');

  // 1. Seed System Settings
  const defaultSettings = [
    { key: 'ai_daily_request_limit', value: '15', description: 'Daily max AI queries per candidate' },
    { key: 'ai_token_limit', value: '10000', description: 'Daily max token budget per candidate' },
    { key: 'ai_max_output_tokens', value: '600', description: 'Maximum tokens generated per AI response' },
    { key: 'passing_threshold_percent', value: '100', description: 'Required test pass percentage for completion' },
    { key: 'github_app_slug', value: 'debuglab-bot', description: 'Registered GitHub App identifier' },
    { key: 'execution_timeout_sec', value: '30', description: 'Sandbox runner execution timeout in seconds' },
  ];

  for (const setting of defaultSettings) {
    await prisma.adminSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    });
  }
  console.log(`✅ Seeded ${defaultSettings.length} system settings.`);

  // 2. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@debuglab.internal' },
    update: {
      role: 'ADMIN',
      name: 'DebugLab Lead Architect',
      githubUsername: 'debuglab-admin',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
    },
    create: {
      email: 'admin@debuglab.internal',
      name: 'DebugLab Lead Architect',
      role: 'ADMIN',
      githubUsername: 'debuglab-admin',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
    },
  });
  console.log(`✅ Seeded Admin User: ${admin.email}`);

  // 3. Seed Predefined Assignments
  const createdAssignments = [];
  for (const item of PREDEFINED_ASSIGNMENTS) {
    const assignment = await prisma.assignment.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        repoUrl: item.repoUrl,
        baseBranch: item.baseBranch,
        difficulty: item.difficulty,
        language: item.language,
        framework: item.framework,
        estimatedTimeMinutes: item.estimatedTimeMinutes,
        instructions: item.instructions,
        publicTestInfo: item.publicTestInfo,
        hiddenTestSpec: item.hiddenTestSpec,
        passingThresholdPercent: item.passingThresholdPercent,
        aiRequestLimit: item.aiRequestLimit,
        aiTokenLimit: item.aiTokenLimit,
      },
      create: {
        slug: item.slug,
        title: item.title,
        description: item.description,
        repoUrl: item.repoUrl,
        baseBranch: item.baseBranch,
        difficulty: item.difficulty,
        language: item.language,
        framework: item.framework,
        estimatedTimeMinutes: item.estimatedTimeMinutes,
        instructions: item.instructions,
        publicTestInfo: item.publicTestInfo,
        hiddenTestSpec: item.hiddenTestSpec,
        passingThresholdPercent: item.passingThresholdPercent,
        aiRequestLimit: item.aiRequestLimit,
        aiTokenLimit: item.aiTokenLimit,
      },
    });
    createdAssignments.push(assignment);
  }
  console.log(`✅ Seeded ${createdAssignments.length} debugging assignments.`);

  // 4. Seed Demo Candidates & Realistic Submissions for Rich Dashboard Testing
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

  for (const c of candidateUsers) {
    const candidate = await prisma.user.upsert({
      where: { email: c.email },
      update: {
        name: c.name,
        githubUsername: c.githubUsername,
        avatarUrl: c.avatarUrl,
        role: 'CANDIDATE',
      },
      create: {
        email: c.email,
        name: c.name,
        githubUsername: c.githubUsername,
        avatarUrl: c.avatarUrl,
        role: 'CANDIDATE',
      },
    });

    // Assign candidate to first assignment (Completed)
    if (createdAssignments[0]) {
      const a1 = createdAssignments[0];
      const ca1 = await prisma.candidateAssignment.upsert({
        where: {
          candidateId_assignmentId: {
            candidateId: candidate.id,
            assignmentId: a1.id,
          },
        },
        update: {
          status: 'COMPLETED',
          completedAt: new Date(Date.now() - 3600000 * 2),
        },
        create: {
          candidateId: candidate.id,
          assignmentId: a1.id,
          status: 'COMPLETED',
          completedAt: new Date(Date.now() - 3600000 * 2),
        },
      });

      // Seed Pull Request
      const pr1 = await prisma.pullRequest.upsert({
        where: {
          repoFullName_prNumber: {
            repoFullName: 'debuglab-assessments/ecommerce-concurrency-ratelimit',
            prNumber: 42,
          },
        },
        update: {},
        create: {
          candidateId: candidate.id,
          assignmentId: a1.id,
          prNumber: 42,
          prUrl: 'https://github.com/debuglab-assessments/ecommerce-concurrency-ratelimit/pull/42',
          repoFullName: 'debuglab-assessments/ecommerce-concurrency-ratelimit',
          branchName: 'fix/mutex-stock-reservation',
          state: 'OPEN',
        },
      });

      // Seed Submission & Evaluation
      const commitSha1 = 'e7f8b2c45d6190a3c4b123456789abcdef012345';
      const sub1 = await prisma.submission.upsert({
        where: { commitSha: commitSha1 },
        update: {},
        create: {
          candidateAssignmentId: ca1.id,
          pullRequestId: pr1.id,
          commitSha: commitSha1,
          commitMessage: 'fix(inventory): add atomic lock and sliding window bucket pruning',
          submittedAt: new Date(Date.now() - 3600000 * 2),
        },
      });

      const eval1 = await prisma.evaluation.upsert({
        where: { submissionId: sub1.id },
        update: {},
        create: {
          submissionId: sub1.id,
          status: 'COMPLETED',
          totalTests: 5,
          passedTests: 5,
          failedTests: 0,
          scorePercent: 100.0,
          isPassed: true,
          executionTimeMs: 4210,
          evaluatedAt: new Date(Date.now() - 3600000 * 2),
          logs: `[DEBUG_LAB_RUNNER] Checking out commit ${commitSha1.slice(0, 7)}
[DEBUG_LAB_RUNNER] Running Public Tests (2/2 Passed)
  ✓ test_checkout_reservation_ok (142ms)
  ✓ test_sliding_rate_limiter_window (320ms)
[DEBUG_LAB_RUNNER] Injecting Hidden Security & Concurrency Test Suite...
[DEBUG_LAB_RUNNER] Running Hidden Tests (3/3 Passed)
  ✓ HIDDEN-TC-01: Concurrent 50-Request Race Condition Stress Test (1850ms)
  ✓ HIDDEN-TC-02: Sliding Window Boundary Timestamp Pruning Verification (940ms)
  ✓ HIDDEN-TC-03: Sub-Millisecond Burst Jitter Throttling (958ms)
[DEBUG_LAB_RUNNER] Final Score: 100% (Passed). All mandatory criteria satisfied.`,
        },
      });

      // Seed Test Results for this evaluation
      const sampleTests = [
        { name: 'test_checkout_reservation_ok', suite: 'PUBLIC', status: 'PASSED', time: 142, hidden: false },
        { name: 'test_sliding_rate_limiter_window', suite: 'PUBLIC', status: 'PASSED', time: 320, hidden: false },
        { name: 'HIDDEN-TC-01: 50-Request Race Stress', suite: 'HIDDEN', status: 'PASSED', time: 1850, hidden: true },
        { name: 'HIDDEN-TC-02: Window Timestamp Pruning', suite: 'HIDDEN', status: 'PASSED', time: 940, hidden: true },
        { name: 'HIDDEN-TC-03: Burst Jitter Throttling', suite: 'HIDDEN', status: 'PASSED', time: 958, hidden: true },
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

      // Seed sample AI usage for candidate
      await prisma.aIUsage.create({
        data: {
          candidateId: candidate.id,
          assignmentId: a1.id,
          promptTokens: 210,
          completionTokens: 145,
          totalTokens: 355,
          query: 'How does the sliding window rate limiter timestamp eviction work under concurrent requests?',
          responseSnippet:
            'Consider how timestamps older than (now - windowMs) are stored in your Redis or in-memory array. If you only prune on read, check if your concurrency lock covers the array mutation.',
        },
      });
    }

    // Assign candidate to second assignment (In Progress)
    if (createdAssignments[1]) {
      const a2 = createdAssignments[1];
      await prisma.candidateAssignment.upsert({
        where: {
          candidateId_assignmentId: {
            candidateId: candidate.id,
            assignmentId: a2.id,
          },
        },
        update: {},
        create: {
          candidateId: candidate.id,
          assignmentId: a2.id,
          status: 'IN_PROGRESS',
          startedAt: new Date(Date.now() - 1800000),
        },
      });
    }
  }

  console.log(`✅ Seeded candidate accounts, submissions, evaluations, and AI logs.`);
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
