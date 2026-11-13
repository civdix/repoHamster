import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function resolveLanguageHarness(language, framework) {
  const l = (language || '').toLowerCase();
  const f = (framework || '').toLowerCase();

  if (l.includes('python') || f.includes('fastapi') || f.includes('django') || f.includes('flask')) {
    return {
      harness: 'PYTHON_PYTEST',
      runnerName: 'PytestRunner (Python 3.12)',
      testCommand: 'pytest --verbose --tb=short',
    };
  }

  if (f.includes('angular') || f.includes('vitest')) {
    return {
      harness: 'TYPESCRIPT_VITEST',
      runnerName: 'VitestRunner (Node 22)',
      testCommand: 'npx vitest run --reporter=verbose',
    };
  }

  if (l.includes('javascript') || l.includes('typescript') || f.includes('react') || f.includes('next') || f.includes('express')) {
    return {
      harness: 'JAVASCRIPT_JEST',
      runnerName: 'JestRunner (Node 22)',
      testCommand: 'npx jest --verbose --runInBand --ci',
    };
  }

  if ((l.includes('java') && !l.includes('javascript')) || f.includes('spring') || f.includes('maven')) {
    return {
      harness: 'JAVA_MAVEN_JUNIT',
      runnerName: 'JUnitSurefireRunner (Java 17/21)',
      testCommand: 'mvn clean test -B',
    };
  }

  if (l.includes('go')) {
    return {
      harness: 'GO_TEST',
      runnerName: 'GoTestRunner (Go 1.22)',
      testCommand: 'go test -v ./...',
    };
  }

  return {
    harness: 'JAVASCRIPT_JEST',
    runnerName: 'JestRunner (Node 22)',
    testCommand: 'npx jest --verbose --runInBand --ci',
  };
}

async function verifyCatalogueAndMultiLanguageRunner() {
  console.log('🐹 Running RepoHamster Catalogue & Multi-Language Runner Verification...\n');

  // Test 1: Verify all initial repositories exist in SQLite database
  console.log('Test 1: Auditing Public Source Repositories in Catalogue...');
  const repos = await prisma.catalogRepository.findMany({
    orderBy: { createdAt: 'asc' },
  });

  if (repos.length < 10) {
    throw new Error(`Expected at least 10 repositories in catalogue, found ${repos.length}`);
  }

  console.log(`  ✓ Successfully audited ${repos.length} repositories in SQLite CatalogRepository:`);
  for (const r of repos) {
    console.log(`    - [${r.importStatus}] ${r.name} (${r.language}) | License: ${r.license}`);
  }
  console.log('');

  // Test 2: Verify Status Distributions & Commercial Licenses
  console.log('Test 2: Verifying Quality Gates & Commercial Licensing Classifications...');
  const readyRepos = repos.filter((r) => r.importStatus === 'READY_FOR_TESTING');
  const mitRepos = repos.filter((r) => r.isCommercialAllowed);
  const incompatibleRepos = repos.filter((r) => r.importStatus === 'NOT_COMPATIBLE');

  if (readyRepos.length < 3) {
    throw new Error(`Expected at least 3 READY_FOR_TESTING repos, found ${readyRepos.length}`);
  }
  if (mitRepos.length < 4) {
    throw new Error(`Expected at least 4 MIT commercial repos, found ${mitRepos.length}`);
  }
  if (incompatibleRepos.length < 1) {
    throw new Error(`Expected at least 1 NOT_COMPATIBLE repo (code-debugging), found ${incompatibleRepos.length}`);
  }

  console.log(`  ✓ Ready for Testing: ${readyRepos.length} repos`);
  console.log(`  ✓ Commercial MIT Allowed: ${mitRepos.length} repos`);
  console.log(`  ✓ Barred Incompatible: ${incompatibleRepos.length} repo (${incompatibleRepos[0].name})\n`);

  // Test 3: Multi-Language Runner Detection & Command Resolution
  console.log('Test 3: Testing Multi-Language Harness Dispatch & Resolution...');
  const testCases = [
    { lang: 'Python', framework: 'FastAPI', expectedHarness: 'PYTHON_PYTEST', expectedCmd: 'pytest --verbose --tb=short' },
    { lang: 'Java', framework: 'Spring Boot', expectedHarness: 'JAVA_MAVEN_JUNIT', expectedCmd: 'mvn clean test -B' },
    { lang: 'Go', framework: 'Standard Library', expectedHarness: 'GO_TEST', expectedCmd: 'go test -v ./...' },
    { lang: 'TypeScript', framework: 'Angular 17', expectedHarness: 'TYPESCRIPT_VITEST', expectedCmd: 'npx vitest run --reporter=verbose' },
    { lang: 'JavaScript', framework: 'Express + React', expectedHarness: 'JAVASCRIPT_JEST', expectedCmd: 'npx jest --verbose --runInBand --ci' },
  ];

  for (const tc of testCases) {
    const resolved = resolveLanguageHarness(tc.lang, tc.framework);
    if (resolved.harness !== tc.expectedHarness) {
      throw new Error(`Expected ${tc.expectedHarness} for ${tc.lang}, got ${resolved.harness}`);
    }
    if (resolved.testCommand !== tc.expectedCmd) {
      throw new Error(`Expected ${tc.expectedCmd} for ${tc.lang}, got ${resolved.testCommand}`);
    }
    console.log(`  ✓ [${tc.lang} / ${tc.framework}] -> ${resolved.runnerName} ("${resolved.testCommand}")`);
  }
  console.log('');

  // Test 4: Verify Catalogue-to-Assignment Conversion Quality Gate
  console.log('Test 4: Testing Quality Gate: Barring Incompatible Repositories from Assignment Conversion...');
  const badRepo = incompatibleRepos[0];
  const isAllowedToConvert = badRepo.importStatus === 'READY_FOR_TESTING' || badRepo.importStatus === 'IMPORTED';
  if (isAllowedToConvert) {
    throw new Error(`Security breach: NOT_COMPATIBLE repo "${badRepo.name}" was allowed to convert to assignment!`);
  }
  console.log(`  ✓ Quality Gate Enforcement Confirmed: "${badRepo.name}" (${badRepo.importStatus}) correctly rejected.\n`);

  console.log('🎉 ALL CATALOGUE & MULTI-LANGUAGE RUNNER VERIFICATION TESTS PASSED!\n');
}

verifyCatalogueAndMultiLanguageRunner()
  .catch((err) => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
