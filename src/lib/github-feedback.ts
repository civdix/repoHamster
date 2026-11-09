/**
 * GitHub Feedback Service
 * Automatically posts commit status checks and PR comments when an evaluation finishes.
 */

interface PostFeedbackParams {
  repoFullName: string; // e.g. "repohamster/Still-Form"
  prNumber?: number;
  commitSha: string;
  isPassed: boolean;
  scorePercent: number;
  passedTests: number;
  totalTests: number;
  candidateUsername?: string;
  logs?: string | null;
}

export async function postGitHubEvaluationFeedback(
  params: PostFeedbackParams
): Promise<{ statusPosted: boolean; commentPosted: boolean }> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('[GITHUB FEEDBACK] No GITHUB_TOKEN set. Skipping GitHub status/comment.');
    return { statusPosted: false, commentPosted: false };
  }

  const {
    repoFullName,
    prNumber,
    commitSha,
    isPassed,
    scorePercent,
    passedTests,
    totalTests,
    candidateUsername,
  } = params;

  let statusPosted = false;
  let commentPosted = false;

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
    'User-Agent': 'RepoHamster-Evaluation-Bot/1.0',
    'Content-Type': 'application/json',
  };

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  // 1. Post Commit Status Check (Green checkmark or Red cross on GitHub commit/PR)
  try {
    const statusPayload = {
      state: isPassed ? 'success' : 'failure',
      target_url: `${baseUrl.replace(/\/$/, '')}/dashboard`,
      description: isPassed
        ? `RepoHamster: 100% Passed (${passedTests}/${totalTests} tests green)`
        : `RepoHamster: Score ${scorePercent}% (${passedTests}/${totalTests} tests passed)`,
      context: 'repohamster/evaluation',
    };

    const statusRes = await fetch(
      `https://api.github.com/repos/${repoFullName}/statuses/${commitSha}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(statusPayload),
      }
    );

    statusPosted = statusRes.ok;
    if (!statusRes.ok) {
      console.warn('[GITHUB FEEDBACK] Failed to post commit status:', await statusRes.text());
    } else {
      console.log(`[GITHUB FEEDBACK] Commit status posted for ${commitSha.slice(0, 7)}`);
    }
  } catch (err) {
    console.warn('[GITHUB FEEDBACK] Error posting commit status:', err);
  }

  // 2. Post PR Comment (if PR number exists)
  if (prNumber) {
    try {
      const commentBody = [
        '### 🐹 RepoHamster Automated Evaluation Report',
        '',
        `Candidate: **@${candidateUsername || 'developer'}**`,
        `Commit SHA: \`${commitSha.slice(0, 7)}\``,
        '',
        '| Metric | Result |',
        '| :--- | :--- |',
        `| **Status** | ${isPassed ? '✅ **PASSED (Verified)**' : '❌ **NEEDS REVISION**'} |`,
        `| **Score** | **${scorePercent}%** |`,
        `| **Total Tests Passed** | **${passedTests} / ${totalTests}** |`,
        '',
        isPassed
          ? '🎉 **Congratulations!** Your solution successfully resolved the bugs and passed all public & hidden test suites. Your candidate profile and verified badge have been automatically updated.'
          : '⚠️ **Review Needed:** Some assertions or hidden invariant edge-cases failed. Push new commits to this branch to trigger a fresh evaluation automatically.',
        '',
        `👉 [View Candidate Dashboard & Verified Scorecard](${baseUrl.replace(/\/$/, '')}/dashboard)`,
        '',
        '---',
        '> 🔒 **Important Admin Notice**: Do not merge this Pull Request into `main`. The base challenge repository stays active in its initial state for other candidates.',
      ].join('\n');

      const commentRes = await fetch(
        `https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ body: commentBody }),
        }
      );

      commentPosted = commentRes.ok;
      if (!commentRes.ok) {
        console.warn('[GITHUB FEEDBACK] Failed to post PR comment:', await commentRes.text());
      } else {
        console.log(`[GITHUB FEEDBACK] PR comment posted on PR #${prNumber}`);
      }
    } catch (err) {
      console.warn('[GITHUB FEEDBACK] Error posting PR comment:', err);
    }
  }

  return { statusPosted, commentPosted };
}
