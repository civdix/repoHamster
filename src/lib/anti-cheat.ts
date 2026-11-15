/**
 * Anti-Cheat & Assessment Integrity Verification
 *
 * Rules:
 * 1. All test cases passed AND no cheating -> Assessment marked Completed / Passed.
 * 2. Not all test cases passed -> Display [passed_test_cases]/[total_test_cases].
 * 3. Cheating detected -> Mark "Cheated in test by - [reason]".
 */

export interface EvaluationStatusInfo {
  outcome: 'COMPLETED' | 'PARTIAL' | 'CHEATED' | 'NOT_STARTED';
  isCheated: boolean;
  cheatReason: string | null;
  passedTests: number;
  totalTests: number;
  badgeText: string;
  badgeStyle: 'success' | 'warning' | 'danger' | 'neutral';
  headline: string;
  description: string;
}

export function parseCheatingInfo(evaluation?: {
  manualOverrideReason?: string | null;
  logs?: string | null;
} | null): { isCheated: boolean; reason: string | null } {
  if (!evaluation) return { isCheated: false, reason: null };

  // 1. Check manualOverrideReason
  if (evaluation.manualOverrideReason) {
    const raw = evaluation.manualOverrideReason.trim();
    if (/cheat|plagiarism|tamper|bypass/i.test(raw)) {
      const cleaned = raw
        .replace(/^cheated\s*(in\s*test)?\s*(by)?\s*[:-]?\s*/i, '')
        .trim();
      return { isCheated: true, reason: cleaned || raw };
    }
  }

  // 2. Check logs for explicit tag: [CHEAT_DETECTED]: <reason>
  if (evaluation.logs) {
    const match = evaluation.logs.match(/\[CHEAT_DETECTED\]:\s*([^\n\r]+)/i);
    if (match) {
      return { isCheated: true, reason: match[1].trim() };
    }
  }

  return { isCheated: false, reason: null };
}

export function computeAssessmentStatus(params: {
  status?: string;
  evaluation?: {
    isPassed?: boolean;
    passedTests?: number;
    totalTests?: number;
    manualOverrideReason?: string | null;
    logs?: string | null;
  } | null;
}): EvaluationStatusInfo {
  const { status, evaluation } = params;

  if (!evaluation && (!status || status === 'NOT_STARTED')) {
    return {
      outcome: 'NOT_STARTED',
      isCheated: false,
      cheatReason: null,
      passedTests: 0,
      totalTests: 0,
      badgeText: 'Available',
      badgeStyle: 'neutral',
      headline: 'Not Started',
      description: 'Open this challenge in Codespaces or clone locally to begin.',
    };
  }

  const { isCheated, reason: cheatReason } = parseCheatingInfo(evaluation);

  // Case 3: CHEATING DETECTED -> "Cheated in test by - [reason]"
  if (isCheated || (status === 'FAILED' && cheatReason)) {
    const reasonText = cheatReason || 'Academic integrity or test tampering violation';
    return {
      outcome: 'CHEATED',
      isCheated: true,
      cheatReason: reasonText,
      passedTests: evaluation?.passedTests || 0,
      totalTests: evaluation?.totalTests || 0,
      badgeText: `Cheated in test by - ${reasonText}`,
      badgeStyle: 'danger',
      headline: `Cheated in test by - ${reasonText}`,
      description: `Evaluation flagged: Cheated in test by - ${reasonText}`,
    };
  }

  const total = evaluation?.totalTests ?? 0;
  const passed = evaluation?.passedTests ?? 0;
  const allPassed =
    (total > 0 && passed >= total) ||
    (evaluation?.isPassed === true && (total === 0 || passed === total)) ||
    (status === 'COMPLETED' && !isCheated);

  // Case 1: ALL TESTCASES PASSED & NO CHEATING -> Completed / Passed
  if (allPassed) {
    return {
      outcome: 'COMPLETED',
      isCheated: false,
      cheatReason: null,
      passedTests: passed || total,
      totalTests: total || passed,
      badgeText: total > 0 ? `Completed (Passed ${passed}/${total})` : 'Completed (Passed)',
      badgeStyle: 'success',
      headline: 'All Tests Passed! Completed 🎉',
      description: `All ${passed || total}/${total || passed} test cases passed and no cheating was detected.`,
    };
  }

  // Case 2: NOT ALL TESTCASES PASSED -> [passed_test_cases_number]/[total_test_cases]
  return {
    outcome: 'PARTIAL',
    isCheated: false,
    cheatReason: null,
    passedTests: passed,
    totalTests: total,
    badgeText: total > 0 ? `${passed}/${total} Passed` : 'In Progress',
    badgeStyle: 'warning',
    headline: total > 0 ? `${passed}/${total} Passed` : 'In Progress',
    description:
      total > 0
        ? `Not all test cases passed: ${passed}/${total} passed. Fix the remaining test assertions to pass!`
        : 'In Progress: Push code to run repository tests.',
  };
}

/**
 * Automatically inspects PR files for test tampering or AI guardrails removal.
 */
export async function auditPRForCheating(
  repoFullName: string,
  prNumber: number,
  token?: string
): Promise<{ isCheated: boolean; reason?: string }> {
  const effectiveToken = token || process.env.GITHUB_TOKEN;
  if (!effectiveToken || !repoFullName || !prNumber) {
    return { isCheated: false };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repoFullName}/pulls/${prNumber}/files`, {
      headers: {
        Authorization: `Bearer ${effectiveToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'RepoHamster-AntiCheat-Audit/1.0',
      },
    });

    if (!res.ok) {
      return { isCheated: false };
    }

    const files: Array<{ filename: string; status: string; additions: number; deletions: number }> =
      await res.json();

    for (const f of files) {
      const fn = f.filename.toLowerCase();

      // Check 1: Guardrail tampering (e.g. candidate deleting copilot instructions or settings)
      if (
        fn.includes('.vscode/settings.json') ||
        fn.includes('copilot-instructions.md') ||
        fn.includes('.cursorrules') ||
        fn.includes('.windsurfrules') ||
        fn.includes('claude.md')
      ) {
        if (f.status === 'removed' || f.status === 'deleted' || f.deletions > 0) {
          return {
            isCheated: true,
            reason: `AI guardrails bypass: altered or deleted integrity rules in ${f.filename}`,
          };
        }
      }

      // Check 2: Test tampering (candidate deleted or commented out test assertions)
      if (
        (fn.startsWith('tests/') ||
          fn.startsWith('test/') ||
          fn.includes('__tests__/') ||
          fn.endsWith('.test.ts') ||
          fn.endsWith('.test.js') ||
          fn.endsWith('.spec.ts') ||
          fn.endsWith('.spec.js') ||
          fn.endsWith('_test.py') ||
          fn.endsWith('_test.go')) &&
        (f.status === 'removed' || f.deletions > 3)
      ) {
        return {
          isCheated: true,
          reason: `Test tampering detected: modified or deleted test assertions in ${f.filename}`,
        };
      }
    }
  } catch (err) {
    console.warn('[ANTI-CHEAT] Could not audit PR files:', err);
  }

  return { isCheated: false };
}
