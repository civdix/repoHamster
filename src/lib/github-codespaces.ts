export interface CodespaceItem {
  name: string;
  displayName?: string;
  state: string; // 'Available' | 'Starting' | 'Provisioning' | 'Shutdown' | 'Rebuilding' | etc.
  webUrl: string;
  createdAt: string;
  lastUsedAt?: string;
  idleTimeoutMinutes?: number;
  repository?: {
    name: string;
    fullName: string;
  };
}

export class CodespaceQuotaError extends Error {
  public isQuotaError = true;
  public details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = 'CodespaceQuotaError';
    this.details = details;
  }
}

export class CodespacePermissionError extends Error {
  public isPermissionError = true;

  constructor(message: string) {
    super(message);
    this.name = 'CodespacePermissionError';
  }
}

/**
 * Normalizes and extracts GitHub OAuth token.
 */
function getEffectiveToken(userToken?: string): string | null {
  const token = userToken || process.env.GITHUB_TOKEN;
  if (!token) return null;
  return token.trim().replace(/^['"]|['"]$/g, '');
}

/**
 * Checks if a GitHub error response indicates a Codespaces free quota or spending limit exhaustion.
 */
export function isQuotaExceededResponse(status: number, errorText: string): boolean {
  if (status !== 403 && status !== 422 && status !== 400) {
    return false;
  }

  const lower = errorText.toLowerCase();
  return (
    lower.includes('quota') ||
    lower.includes('spending limit') ||
    lower.includes('billable') ||
    lower.includes('included monthly') ||
    lower.includes('exceeded') ||
    lower.includes('100% of your included') ||
    lower.includes('spending_limit') ||
    lower.includes('billing')
  );
}

/**
 * Fetch existing codespaces for the given candidate and repository.
 */
export async function listRepositoryCodespaces(
  owner: string,
  repo: string,
  userToken?: string
): Promise<{ success: boolean; codespaces: CodespaceItem[]; error?: string; isMissingScope?: boolean }> {
  const token = getEffectiveToken(userToken);
  if (!token) {
    return { success: false, codespaces: [], error: 'No GitHub authentication token available.' };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'RepoHamster-Codespaces-Manager',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/codespaces`, {
      method: 'GET',
      headers,
    });

    if (res.status === 403 || res.status === 401) {
      const scopes = res.headers.get('x-oauth-scopes') || '';
      const acceptedScopes = res.headers.get('x-accepted-oauth-scopes') || '';
      if (!scopes.includes('codespace')) {
        return {
          success: false,
          codespaces: [],
          isMissingScope: true,
          error: `Missing 'codespace' OAuth scope on GitHub token. Required scopes: ${acceptedScopes || 'codespace'}.`,
        };
      }
    }

    if (!res.ok) {
      // Fallback: Check user's overall codespaces and filter for this repository
      const userCodespacesRes = await fetch(`https://api.github.com/user/codespaces`, {
        method: 'GET',
        headers,
      });

      if (userCodespacesRes.ok) {
        const data = await userCodespacesRes.json();
        const items = (data.codespaces || []).filter(
          (cs: any) =>
            cs.repository?.full_name?.toLowerCase() === `${owner}/${repo}`.toLowerCase() ||
            cs.repository?.name?.toLowerCase() === repo.toLowerCase()
        );

        return {
          success: true,
          codespaces: items.map((cs: any) => ({
            name: cs.name,
            displayName: cs.display_name || cs.name,
            state: cs.state,
            webUrl: cs.web_url,
            createdAt: cs.created_at,
            lastUsedAt: cs.last_used_at,
            idleTimeoutMinutes: cs.idle_timeout_minutes,
            repository: {
              name: cs.repository?.name,
              fullName: cs.repository?.full_name,
            },
          })),
        };
      }

      const errText = await res.text();
      return { success: false, codespaces: [], error: errText };
    }

    const data = await res.json();
    const codespaces: CodespaceItem[] = (data.codespaces || []).map((cs: any) => ({
      name: cs.name,
      displayName: cs.display_name || cs.name,
      state: cs.state,
      webUrl: cs.web_url,
      createdAt: cs.created_at,
      lastUsedAt: cs.last_used_at,
      idleTimeoutMinutes: cs.idle_timeout_minutes,
      repository: {
        name: cs.repository?.name,
        fullName: cs.repository?.full_name,
      },
    }));

    return { success: true, codespaces };
  } catch (err: any) {
    return { success: false, codespaces: [], error: err?.message || 'Failed to list Codespaces' };
  }
}

/**
 * Creates a new codespace for a given repository directly via GitHub API.
 */
export async function createCodespaceDirectly(
  owner: string,
  repo: string,
  userToken?: string,
  ref = 'main'
): Promise<{ success: boolean; codespace?: CodespaceItem; error?: string; isQuotaExceeded?: boolean; isMissingScope?: boolean }> {
  const token = getEffectiveToken(userToken);
  if (!token) {
    return { success: false, error: 'No GitHub token available.' };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'RepoHamster-Codespaces-Manager',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/codespaces`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref,
      }),
    });

    const status = res.status;
    const responseText = await res.text();

    if (status === 201 || status === 202) {
      const data = JSON.parse(responseText);
      const codespace: CodespaceItem = {
        name: data.name,
        displayName: data.display_name || data.name,
        state: data.state || 'Starting',
        webUrl: data.web_url || `https://github.com/codespaces/${data.name}`,
        createdAt: data.created_at || new Date().toISOString(),
        lastUsedAt: data.last_used_at,
        repository: {
          name: data.repository?.name || repo,
          fullName: data.repository?.full_name || `${owner}/${repo}`,
        },
      };

      return { success: true, codespace };
    }

    // Check for Free Quota / Spending Limit reached
    if (isQuotaExceededResponse(status, responseText)) {
      return {
        success: false,
        isQuotaExceeded: true,
        error: `GitHub Codespaces Free Quota Limit Reached: Your GitHub account has exhausted its free included monthly core hours (120 core hours) or spending limit.`,
      };
    }

    if (status === 403 && !res.headers.get('x-oauth-scopes')?.includes('codespace')) {
      return {
        success: false,
        isMissingScope: true,
        error: `Missing 'codespace' permission on GitHub session. Please re-authenticate to authorize Codespace management.`,
      };
    }

    return {
      success: false,
      error: `GitHub error (${status}): ${responseText}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error while attempting to create Codespace.',
    };
  }
}

/**
 * Deletes a codespace by name for the authenticated user.
 */
export async function deleteCodespaceByName(
  codespaceName: string,
  userToken?: string
): Promise<{ success: boolean; error?: string }> {
  const token = getEffectiveToken(userToken);
  if (!token) {
    return { success: false, error: 'No GitHub token available.' };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'RepoHamster-Codespaces-Manager',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const res = await fetch(`https://api.github.com/user/codespaces/${codespaceName}`, {
      method: 'DELETE',
      headers,
    });

    if (res.status === 202 || res.status === 204 || res.status === 200) {
      return { success: true };
    }

    const errText = await res.text();
    return { success: false, error: `Failed to delete codespace: ${errText}` };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error while deleting Codespace' };
  }
}
