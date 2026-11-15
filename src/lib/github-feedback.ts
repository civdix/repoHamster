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
  isCheated?: boolean;
  cheatReason?: string | null;
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
    isCheated,
    cheatReason,
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
    let descriptionText = '';
    if (isCheated) {
      descriptionText = `RepoHamster: Cheated in test by - ${cheatReason || 'Integrity violation'}`;
    } else if (isPassed) {
      descriptionText = `RepoHamster: Completed (Passed ${passedTests}/${totalTests} tests green)`;
    } else {
      descriptionText = `RepoHamster: ${passedTests}/${totalTests} tests passed`;
    }

    const statusPayload = {
      state: isPassed && !isCheated ? 'success' : 'failure',
      target_url: `${baseUrl.replace(/\/$/, '')}/dashboard`,
      description: descriptionText.slice(0, 140),
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
      const statusLine = isCheated
        ? `🚨 **Cheated in test by - ${cheatReason || 'Academic integrity violation'}**`
        : isPassed
        ? `✅ **COMPLETED (Passed ${passedTests}/${totalTests})**`
        : `⚠️ **${passedTests}/${totalTests} Passed**`;

      const commentBody = [
        '### 🐹 RepoHamster Automated Evaluation Report',
        '',
        `Candidate: **@${candidateUsername || 'developer'}**`,
        `Commit SHA: \`${commitSha.slice(0, 7)}\``,
        '',
        '| Metric | Result |',
        '| :--- | :--- |',
        `| **Status** | ${statusLine} |`,
        `| **Tests Passed** | **${passedTests} / ${totalTests}** |`,
        `| **Score** | **${scorePercent}%** |`,
        '',
        isCheated
          ? `🛑 **INTEGRITY VIOLATION**: Cheated in test by - ${cheatReason || 'Integrity rules violated'}. This submission has been flagged.`
          : isPassed
          ? `🎉 **Congratulations!** All ${passedTests}/${totalTests} test cases passed and no cheating was detected. Your candidate profile and verified badge have been automatically updated.`
          : `⚠️ **Review Needed:** ${passedTests}/${totalTests} test cases passed. Push new commits to your branch to resolve remaining failures.`,
        '',
        `👉 [View Candidate Dashboard & Verified Scorecard](${baseUrl.replace(/\/$/, '')}/dashboard)`,
        '',
        '---',
        '> 🔒 **Important Notice**: Do not merge this Pull Request into `main`. The challenge repository stays active for continuous evaluation.',
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
