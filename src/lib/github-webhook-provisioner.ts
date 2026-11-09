export interface WebhookProvisionResult {
  success: boolean;
  message: string;
  hookId?: number;
  targetUrl?: string;
}

export async function autoCreateRepositoryWebhook(repoUrl: string): Promise<WebhookProvisionResult> {
  const token = process.env.GITHUB_TOKEN;
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

  // Resolve platform base domain
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const targetWebhookUrl = `${baseUrl.replace(/\/$/, '')}/api/webhooks/github`;

  // Parse owner and repo from URL
  const cleanUrl = repoUrl.replace(/\/$/, '').replace(/\?.*$/, '');
  const match = cleanUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);

  if (!match) {
    return {
      success: false,
      message: `Invalid GitHub URL format: ${repoUrl}`,
    };
  }

  const owner = match[1];
  const repo = match[2];

  if (!token) {
    return {
      success: false,
      message: 'GITHUB_TOKEN is not set in environment. Add a token with admin:repo_hook scope to auto-create webhooks.',
      targetUrl: targetWebhookUrl,
    };
  }

  try {
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
      'User-Agent': 'RepoHamster-Webhook-Provisioner/1.0',
    };

    // 1. Check existing hooks on the repository
    const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
      headers,
    });

    if (checkRes.ok) {
      const hooks: any[] = await checkRes.json();
      const existing = hooks.find(
        (h) => h.config?.url && (h.config.url === targetWebhookUrl || h.config.url.endsWith('/api/webhooks/github'))
      );

      if (existing) {
        return {
          success: true,
          message: `Webhook already active on @${owner}/${repo} (Hook ID: ${existing.id})`,
          hookId: existing.id,
          targetUrl: targetWebhookUrl,
        };
      }
    } else if (checkRes.status === 404) {
      return {
        success: false,
        message: `Repository ${owner}/${repo} not found or token lacks access permissions.`,
      };
    } else if (checkRes.status === 401) {
      return {
        success: false,
        message: 'Invalid GITHUB_TOKEN authentication. Verify your token permissions.',
      };
    }

    // 2. Create the webhook via GitHub API
    const createRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: ['pull_request'],
        config: {
          url: targetWebhookUrl,
          content_type: 'json',
          secret: webhookSecret || '',
          insecure_ssl: '0',
        },
      }),
    });

    const data = await createRes.json();

    if (createRes.ok && data.id) {
      return {
        success: true,
        message: `Successfully created automated webhook on @${owner}/${repo}!`,
        hookId: data.id,
        targetUrl: targetWebhookUrl,
      };
    } else {
      return {
        success: false,
        message: data.message || `GitHub API returned ${createRes.status} creating webhook.`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error contacting GitHub API.',
    };
  }
}
