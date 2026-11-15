import prisma from '../db';
import type { EvaluationJob } from './types';
import { executeIsolatedEvaluation } from './runner';
import { auditPRForCheating } from '../anti-cheat';

export async function evaluateSubmission(job: EvaluationJob) {
  const {
    candidateId,
    assignmentId,
    commitSha,
    commitMessage,
    prNumber,
    prUrl,
    repoFullName,
    branchName,
    forceReevaluate = false,
  } = job;

  // 1. Fetch assignment
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    throw new Error(`Assignment ${assignmentId} not found`);
  }

  // 2. Fetch or create CandidateAssignment
  const candidateAssignment = await prisma.candidateAssignment.upsert({
    where: {
      candidateId_assignmentId: {
        candidateId,
        assignmentId,
      },
    },
    update: {},
    create: {
      candidateId,
      assignmentId,
      status: 'IN_PROGRESS',
    },
  });

  // 3. Upsert Pull Request if PR info provided
  let pullRequestId: string | undefined;
  if (prNumber && repoFullName) {
    const pr = await prisma.pullRequest.upsert({
      where: {
        repoFullName_prNumber: {
          repoFullName,
          prNumber,
        },
      },
      update: {
        branchName: branchName || 'solution',
        prUrl: prUrl || `https://github.com/${repoFullName}/pull/${prNumber}`,
      },
      create: {
        candidateId,
        assignmentId,
        prNumber,
        prUrl: prUrl || `https://github.com/${repoFullName}/pull/${prNumber}`,
        repoFullName,
        branchName: branchName || 'solution',
        state: 'OPEN',
      },
    });
    pullRequestId = pr.id;
  }

  // 4. Idempotency Check: Check if submission with this commitSha already exists
  let existingSubmission = await prisma.submission.findUnique({
    where: { commitSha },
    include: {
      evaluation: {
        include: { testResults: true },
      },
    },
  });

  if (existingSubmission?.evaluation && !forceReevaluate) {
    console.log(`[EVALUATION ENGINE] Skipping duplicate evaluation for commit ${commitSha.slice(0, 7)}`);
    return {
      submission: existingSubmission,
      evaluation: existingSubmission.evaluation,
      isDuplicate: true,
    };
  }

  // 5. Create Submission record if needed
  const submission =
    existingSubmission ||
    (await prisma.submission.create({
      data: {
        candidateAssignmentId: candidateAssignment.id,
        pullRequestId,
        commitSha,
        commitMessage: commitMessage || 'Pull Request fix submission',
      },
    }));

  // 6. Create or reset Evaluation record to RUNNING
  const evaluation = await prisma.evaluation.upsert({
    where: { submissionId: submission.id },
    update: {
      status: 'RUNNING',
      logs: 'Evaluation job dispatched to isolated sandbox...',
    },
    create: {
      submissionId: submission.id,
      status: 'RUNNING',
      logs: 'Evaluation job dispatched to isolated sandbox...',
    },
  });

  // 6.5 Automated Anti-Cheat Audit on PR files
  let cheatAudit: { isCheated: boolean; reason?: string } = { isCheated: false };
  if (repoFullName && prNumber) {
    cheatAudit = await auditPRForCheating(repoFullName, prNumber);
  }

  // 7. Execute Isolated Test Evaluation
  const runnerResult = await executeIsolatedEvaluation({
    assignmentSlug: assignment.slug,
    language: assignment.language,
    framework: assignment.framework,
    commitSha,
    hiddenTestSpec: assignment.hiddenTestSpec,
    passingThresholdPercent: assignment.passingThresholdPercent,
  });

  // 8. Delete any previous test results if reevaluating
  await prisma.testResult.deleteMany({
    where: { evaluationId: evaluation.id },
  });

  // 9. Persist Test Results
  for (const tr of runnerResult.testResults) {
    await prisma.testResult.create({
      data: {
        evaluationId: evaluation.id,
        testName: tr.name,
        testSuite: tr.suite,
        status: tr.status,
        executionTimeMs: tr.executionTimeMs,
        errorMessage: tr.errorMessage,
        isHidden: tr.isHidden,
      },
    });
  }

  const isAllTestsPassed = runnerResult.totalTests > 0 && runnerResult.passedTests === runnerResult.totalTests;
  const isFinalPassed = !cheatAudit.isCheated && (runnerResult.isPassed || isAllTestsPassed);

  const evalLogs = cheatAudit.isCheated
    ? `${runnerResult.logs}\n\n[CHEAT_DETECTED]: ${cheatAudit.reason}`
    : runnerResult.logs;

  const overrideReason = cheatAudit.isCheated
    ? `Cheated in test by - ${cheatAudit.reason}`
    : null;

  // 10. Update Evaluation Record with Final Scores
  const completedEvaluation = await prisma.evaluation.update({
    where: { id: evaluation.id },
    data: {
      status: cheatAudit.isCheated ? 'FAILED' : 'COMPLETED',
      totalTests: runnerResult.totalTests,
      passedTests: runnerResult.passedTests,
      failedTests: runnerResult.failedTests,
      scorePercent: cheatAudit.isCheated ? 0 : runnerResult.scorePercent,
      isPassed: isFinalPassed,
      logs: evalLogs,
      manualOverrideReason: overrideReason,
      executionTimeMs: runnerResult.executionTimeMs,
      evaluatedAt: new Date(),
    },
    include: { testResults: true },
  });

  // 11. Completion Rule:
  // - If cheated -> mark FAILED
  // - If all test cases pass & no cheating -> mark COMPLETED
  // - Otherwise -> mark IN_PROGRESS
  if (cheatAudit.isCheated) {
    await prisma.candidateAssignment.update({
      where: { id: candidateAssignment.id },
      data: {
        status: 'FAILED',
        completedAt: null,
      },
    });
  } else if (isFinalPassed) {
    await prisma.candidateAssignment.update({
      where: { id: candidateAssignment.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  } else {
    await prisma.candidateAssignment.update({
      where: { id: candidateAssignment.id },
      data: {
        status: 'IN_PROGRESS',
        completedAt: null,
      },
    });
  }

  return {
    submission,
    evaluation: completedEvaluation,
    isDuplicate: false,
    isCheated: cheatAudit.isCheated,
    cheatReason: cheatAudit.reason,
  };
}
