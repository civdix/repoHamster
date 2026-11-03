import prisma from '../db';
import type { EvaluationJob } from './types';
import { executeIsolatedEvaluation } from './runner';

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

  // 10. Update Evaluation Record with Final Scores
  const completedEvaluation = await prisma.evaluation.update({
    where: { id: evaluation.id },
    data: {
      status: 'COMPLETED',
      totalTests: runnerResult.totalTests,
      passedTests: runnerResult.passedTests,
      failedTests: runnerResult.failedTests,
      scorePercent: runnerResult.scorePercent,
      isPassed: runnerResult.isPassed,
      logs: runnerResult.logs,
      executionTimeMs: runnerResult.executionTimeMs,
      evaluatedAt: new Date(),
    },
    include: { testResults: true },
  });

  // 11. Completion Rule: If passed, mark CandidateAssignment COMPLETED
  if (runnerResult.isPassed) {
    await prisma.candidateAssignment.update({
      where: { id: candidateAssignment.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  return {
    submission,
    evaluation: completedEvaluation,
    isDuplicate: false,
  };
}
