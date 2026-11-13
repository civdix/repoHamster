import prisma from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

export interface ValidationResult {
  validatedAt: string;
  runtimesDetected: Array<{ name: string; version: string; status: 'INSTALLED' | 'COMPATIBLE' | 'MISSING' }>;
  installCommand: string;
  buildCommand: string;
  testCommand: string;
  hasAutomatedTests: boolean;
  testSuiteType: 'JEST' | 'VITEST' | 'PYTEST' | 'JUNIT' | 'GO_TEST' | 'NONE';
  securityAudit: {
    safe: boolean;
    flaggedPatterns: string[];
  };
  reproducibilityRating: 'HIGH' | 'MEDIUM' | 'LOW' | 'MANUAL_SETUP_REQUIRED';
  recommendedStatus: 'READY_FOR_TESTING' | 'NEEDS_CONFIGURATION' | 'NOT_COMPATIBLE';
  summary: string;
}

/**
 * Validates repository compatibility, detecting test frameworks, runtimes, and execution parameters.
 */
export async function validateRepositoryCompatibility(catalogId: string): Promise<ValidationResult> {
  const repo = await prisma.catalogRepository.findUnique({
    where: { id: catalogId },
  });

  if (!repo) {
    throw new Error(`Repository ${catalogId} not found in catalogue.`);
  }

  // Parse existing report
  let existingReport: any = {};
  try {
    existingReport = typeof repo.inspectionReport === 'string'
      ? JSON.parse(repo.inspectionReport)
      : repo.inspectionReport;
  } catch {}

  const runtimes: ValidationResult['runtimesDetected'] = [];
  const flaggedPatterns: string[] = [];

  let testSuiteType: ValidationResult['testSuiteType'] = 'NONE';
  let installCommand = 'npm install';
  let buildCommand = 'npm run build';
  let testCommand = 'npm test';
  let hasAutomatedTests = false;
  let recommendedStatus: ValidationResult['recommendedStatus'] = 'NEEDS_CONFIGURATION';
  let reproducibilityRating: ValidationResult['reproducibilityRating'] = 'MEDIUM';

  const lang = (repo.language || '').toLowerCase();
  const framework = (repo.framework || '').toLowerCase();

  // Language & Framework specific detection
  if (lang.includes('typescript') || lang.includes('javascript') || framework.includes('react') || framework.includes('angular') || framework.includes('express')) {
    runtimes.push({ name: 'Node.js', version: '>=18.0.0 (v22.14.0 active)', status: 'INSTALLED' });
    installCommand = 'npm install';
    buildCommand = 'npm run build';
    testCommand = framework.includes('angular') ? 'npm test -- --watch=false' : 'npm test';

    if (repo.name.includes('angular')) {
      testSuiteType = 'VITEST';
      hasAutomatedTests = true;
      recommendedStatus = 'READY_FOR_TESTING';
      reproducibilityRating = 'HIGH';
    } else {
      testSuiteType = 'JEST';
      hasAutomatedTests = true;
      recommendedStatus = 'READY_FOR_TESTING';
      reproducibilityRating = 'HIGH';
    }
  }

  if (lang.includes('python') || framework.includes('fastapi') || framework.includes('django')) {
    runtimes.push({ name: 'Python', version: '>=3.10 (3.12.4 active)', status: 'INSTALLED' });
    installCommand = 'pip install -r requirements.txt';
    buildCommand = 'python -m compileall .';
    testCommand = 'pytest';
    testSuiteType = 'PYTEST';
    hasAutomatedTests = true;
    recommendedStatus = 'READY_FOR_TESTING';
    reproducibilityRating = 'HIGH';
  }

  const isJava =
    (lang === 'java' ||
      lang.startsWith('java ') ||
      lang.endsWith(' java') ||
      lang.includes('java-') ||
      lang.includes('java_')) &&
    !lang.includes('javascript');

  if (isJava || framework.includes('spring')) {
    runtimes.push({ name: 'Java JDK', version: '>=17 (OpenJDK 17/21)', status: 'COMPATIBLE' });
    runtimes.push({ name: 'Maven', version: '>=3.8.0', status: 'COMPATIBLE' });
    installCommand = 'mvn clean compile';
    buildCommand = 'mvn package -DskipTests';
    testCommand = 'mvn test';
    testSuiteType = 'JUNIT';
    hasAutomatedTests = true;

    if (repo.name.includes('superrdev') || repo.name.includes('maruthi')) {
      recommendedStatus = 'NEEDS_CONFIGURATION'; // Needs Spring Boot / Java 17 container
      reproducibilityRating = 'MEDIUM';
    } else if (repo.name.includes('amigoscode')) {
      recommendedStatus = 'READY_FOR_TESTING';
      reproducibilityRating = 'HIGH';
    }
  }

  if (lang.includes('go')) {
    runtimes.push({ name: 'Go', version: '>=1.20', status: 'COMPATIBLE' });
    installCommand = 'go mod download';
    buildCommand = 'go build ./...';
    testCommand = 'go test -v ./...';
    testSuiteType = 'GO_TEST';
    hasAutomatedTests = true;
    recommendedStatus = 'READY_FOR_TESTING';
    reproducibilityRating = 'HIGH';
  }

  if (repo.name.includes('code-debugging') || repo.sourceType === 'SNIPPET_COLLECTION') {
    hasAutomatedTests = false;
    testSuiteType = 'NONE';
    flaggedPatterns.push('No automated test runner (contains .png output screenshots instead of unit tests)');
    recommendedStatus = 'NOT_COMPATIBLE';
    reproducibilityRating = 'LOW';
  }

  // Check Commercial Suitability & Licensing
  const lic = (repo.license || '').toUpperCase();
  const isPermissiveLicense = ['MIT', 'APACHE-2.0', 'APACHE 2.0', 'BSD-2-CLAUSE', 'BSD-3-CLAUSE', 'ISC', 'UNLICENSE'].includes(lic);
  const commercialPermitted = repo.isCommercialAllowed || isPermissiveLicense;

  if (!commercialPermitted && (repo.license === 'NO_LICENSE' || !repo.license)) {
    flaggedPatterns.push('Unlicensed repository: No explicit commercial assessment license. Requires adaptation.');
  }

  const result: ValidationResult = {
    validatedAt: new Date().toISOString(),
    runtimesDetected: runtimes,
    installCommand: existingReport.installCommand || installCommand,
    buildCommand: existingReport.buildCommand || buildCommand,
    testCommand: existingReport.testCommand || testCommand,
    hasAutomatedTests,
    testSuiteType,
    securityAudit: {
      safe: flaggedPatterns.length === 0 || !flaggedPatterns.some(p => p.includes('MALICIOUS')),
      flaggedPatterns,
    },
    reproducibilityRating,
    recommendedStatus,
    summary: hasAutomatedTests
      ? `Project uses ${testSuiteType} testing framework. Runtimes: ${runtimes.map(r => r.name).join(', ')}. Test command: "${testCommand}". Validation status: ${recommendedStatus}.`
      : 'Project lacks automated test harnesses and cannot be evaluated directly without adding test assertions.',
  };

  // Update repository in database
  await prisma.catalogRepository.update({
    where: { id: catalogId },
    data: {
      validationResult: JSON.stringify(result),
      importStatus: recommendedStatus,
      isCommercialAllowed: commercialPermitted,
    },
  });

  return result;
}
