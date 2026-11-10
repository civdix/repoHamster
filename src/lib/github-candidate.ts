export interface ForkResult {
  success: boolean;
  message: string;
  alreadyExists?: boolean;
  forkOwner?: string;
  forkRepo?: string;
  forkUrl?: string;
  codespaceUrl?: string;
  error?: string;
}

export interface PRCreateResult {
  success: boolean;
  message: string;
  alreadyExisted?: boolean;
  prNumber?: number;
  prUrl?: string;
  headSha?: string;
  error?: string;
}

function getEffectiveToken(userToken?: string): string | null {
  const token = userToken || process.env.GITHUB_TOKEN;
  if (!token) return null;
  return token.trim().replace(/^['"]|['"]$/g, '');
}

export function parseGitHubRepo(repoUrl: string): { owner: string; repo: string } | null {
  const cleanUrl = repoUrl.replace(/\/$/, '').replace(/\?.*$/, '');
  const match = cleanUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export async function getAuthenticatedGitHubUser(token: string): Promise<{ login: string; id: number } | null> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'RepoHamster-App',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { login: data.login, id: data.id };
  } catch {
    return null;
  }
}

export async function forkChallengeRepository(
  repoUrl: string,
  userToken?: string,
  preferredUsername?: string
): Promise<ForkResult> {
  const token = getEffectiveToken(userToken);
  if (!token) {
    return {
      success: false,
      message: 'No GitHub token available. Please sign in with GitHub or set GITHUB_TOKEN.',
    };
  }

  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) {
    return {
      success: false,
      message: `Invalid GitHub repository URL: ${repoUrl}`,
    };
  }

  const { owner: upstreamOwner, repo: upstreamRepo } = parsed;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RepoHamster-Fork-Manager',
    'Content-Type': 'application/json',
  };

  // Determine the active user's username
  let targetUsername = preferredUsername;
  if (!targetUsername) {
    const ghUser = await getAuthenticatedGitHubUser(token);
    if (ghUser) {
      targetUsername = ghUser.login;
    }
  }

  // 1. Check if the candidate already has a fork under their account
  if (targetUsername) {
    try {
      const existingRes = await fetch(`https://api.github.com/repos/${targetUsername}/${upstreamRepo}`, {
        headers,
      });

      if (existingRes.ok) {
        const existingData = await existingRes.json();
        const codespaceUrl = `https://codespaces.new/${targetUsername}/${upstreamRepo}?ref=main`;
        return {
          success: true,
          message: `Fork already available at ${targetUsername}/${upstreamRepo}!`,
          alreadyExists: true,
          forkOwner: targetUsername,
          forkRepo: upstreamRepo,
          forkUrl: existingData.html_url,
          codespaceUrl,
        };
      }
    } catch (err) {
      console.warn('[FORK] Error checking existing fork:', err);
    }
  }

  // 2. Trigger fork creation via GitHub REST API
  try {
    const forkRes = await fetch(`https://api.github.com/repos/${upstreamOwner}/${upstreamRepo}/forks`, {
      method: 'POST',
      headers,
    });

    if (forkRes.status === 202 || forkRes.status === 200) {
      const forkData = await forkRes.json();
      const forkOwner = forkData.owner?.login || targetUsername || 'candidate';
      const forkRepo = forkData.name || upstreamRepo;
      const forkUrl = forkData.html_url || `https://github.com/${forkOwner}/${forkRepo}`;
      const codespaceUrl = `https://codespaces.new/${forkOwner}/${forkRepo}?ref=main`;

      // Forking on GitHub is asynchronous (202 Accepted). Wait for the repository to be ready.
      if (forkRes.status === 202) {
        let attempts = 0;
        while (attempts < 5) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          attempts++;
          try {
            const checkRes = await fetch(`https://api.github.com/repos/${forkOwner}/${forkRepo}`, {
              headers,
            });
            if (checkRes.ok) {
              break;
            }
          } catch {
            // keep waiting
          }
        }
      }

      return {
        success: true,
        message: `Successfully created fork in ${forkOwner}/${forkRepo}!`,
        alreadyExists: false,
        forkOwner,
        forkRepo,
        forkUrl,
        codespaceUrl,
      };
    }

    const errText = await forkRes.text();
    console.error('[FORK] GitHub fork API error:', forkRes.status, errText);

    // Fallback: If forking is not permitted (e.g. personal token lacking permissions), provide direct upstream Codespaces
    const fallbackCodespaceUrl = `https://codespaces.new/${upstreamOwner}/${upstreamRepo}?ref=main`;
    return {
      success: false,
      message: `Failed to fork repository: ${errText}`,
      codespaceUrl: fallbackCodespaceUrl,
      error: errText,
    };
  } catch (err: any) {
    console.error('[FORK] Unexpected error while forking:', err);
    return {
      success: false,
      message: err.message || 'Network error while attempting to fork repository',
      codespaceUrl: `https://codespaces.new/${upstreamOwner}/${upstreamRepo}?ref=main`,
      error: String(err),
    };
  }
}

export async function createCandidatePullRequest({
  repoUrl,
  candidateUsername,
  branch = 'main',
  baseBranch = 'main',
  title,
  body,
  userToken,
}: {
  repoUrl: string;
  candidateUsername: string;
  branch?: string;
  baseBranch?: string;
  title?: string;
  body?: string;
  userToken?: string;
}): Promise<PRCreateResult> {
  const token = getEffectiveToken(userToken);
  if (!token) {
    return {
      success: false,
      message: 'No GitHub token available. Please sign in with GitHub or configure GITHUB_TOKEN.',
    };
  }

  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) {
    return {
      success: false,
      message: `Invalid GitHub repository URL: ${repoUrl}`,
    };
  }

  const { owner: upstreamOwner, repo: upstreamRepo } = parsed;
  const headSpec = `${candidateUsername}:${branch}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RepoHamster-PR-Manager',
    'Content-Type': 'application/json',
  };

  const payload = {
    title: title || `fix: solution for ${upstreamRepo} by @${candidateUsername}`,
    head: headSpec,
    base: baseBranch,
    body:
      body ||
      `## 🐹 RepoHamster Candidate Assessment Submission\n\n- **Candidate:** @${candidateUsername}\n- **Repository:** ${upstreamOwner}/${upstreamRepo}\n- **Branch:** \`${branch}\`\n\nAutomated submission created via RepoHamster candidate platform.`,
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${upstreamOwner}/${upstreamRepo}/pulls`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const data = await res.json();
      return {
        success: true,
        message: `Pull Request #${data.number} created successfully!`,
        prNumber: data.number,
        prUrl: data.html_url,
        headSha: data.head?.sha,
      };
    }

    const errData = await res.json().catch(() => ({}));

    // If a PR already exists from this head branch, fetch it
    const isAlreadyExists =
      errData.errors &&
      Array.isArray(errData.errors) &&
      errData.errors.some((e: any) => typeof e.message === 'string' && e.message.includes('A pull request already exists'));

    if (isAlreadyExists || res.status === 422) {
      const pullsRes = await fetch(
        `https://api.github.com/repos/${upstreamOwner}/${upstreamRepo}/pulls?head=${encodeURIComponent(headSpec)}&state=open`,
        { headers }
      );

      if (pullsRes.ok) {
        const pulls = await pullsRes.json();
        if (Array.isArray(pulls) && pulls.length > 0) {
          const existingPr = pulls[0];
          return {
            success: true,
            message: `Found existing open Pull Request #${existingPr.number}!`,
            alreadyExisted: true,
            prNumber: existingPr.number,
            prUrl: existingPr.html_url,
            headSha: existingPr.head?.sha,
          };
        }
      }
    }

    const errorMsg = errData.message || (errData.errors ? JSON.stringify(errData.errors) : `HTTP ${res.status}`);
    return {
      success: false,
      message: `Failed to open PR: ${errorMsg}`,
      error: errorMsg,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error creating Pull Request',
      error: String(err),
    };
  }
}
