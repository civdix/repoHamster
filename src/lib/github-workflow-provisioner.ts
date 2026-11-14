import prisma from '@/lib/db';

export interface WorkflowProvisionResult {
  success: boolean;
  message: string;
  workflowPath?: string;
  requiresManualCommit?: boolean;
}

export function generateWorkflowYaml(language: string = 'javascript'): string {
  const lang = (language || 'javascript').toLowerCase().trim();

  if (lang.includes('python') || lang.includes('django') || lang.includes('fastapi') || lang.includes('flask')) {
    return `name: Assessment Test Suite

on:
  pull_request_target:
    types: [opened, synchronize, reopened]

jobs:
  test:
    name: Run Pytest Suite
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout Candidate PR Code
        uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
          allow-unsafe-pr-checkout: true

      # Anti-Cheat: Restore authoritative tests from upstream repository
      - name: Restore Authoritative Tests
        run: |
          git fetch origin main
          git checkout origin/main -- tests/ || git checkout origin/main -- test/ || true

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
          pip install pytest

      - name: Run Test Suite
        run: |
          pytest -v
`;
  }

  if (lang.includes('go') || lang.includes('golang')) {
    return `name: Assessment Test Suite

on:
  pull_request_target:
    types: [opened, synchronize, reopened]

jobs:
  test:
    name: Run Go Test Suite
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout Candidate PR Code
        uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
          allow-unsafe-pr-checkout: true

      # Anti-Cheat: Restore authoritative tests from upstream repository
      - name: Restore Authoritative Tests
        run: |
          git fetch origin main
          git checkout origin/main -- *_test.go || true

      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.22'
          cache: true

      - name: Run Test Suite
        run: |
          go test -v ./...
`;
  }

  // Default: JavaScript / TypeScript
  return `name: Assessment Test Suite

on:
  pull_request_target:
    types: [opened, synchronize, reopened]

jobs:
  test:
    name: Run Test Suite
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout Candidate PR Code
        uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
          allow-unsafe-pr-checkout: true

      # Anti-Cheat: Restore authoritative tests from upstream repository
      - name: Restore Authoritative Tests
        run: |
          git fetch origin main
          git checkout origin/main -- test/ || git checkout origin/main -- tests/ || true

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: |
          npm ci || npm install

      - name: Run Assessment Tests
        run: |
          npm test
`;
}

export async function autoInstallTestWorkflow(
  repoUrl: string,
  language: string = 'javascript',
  customToken?: string
): Promise<WorkflowProvisionResult> {
  const envToken = process.env.GITHUB_TOKEN
    ? process.env.GITHUB_TOKEN.trim().replace(/^['"]|['"]$/g, '')
    : null;
  const passedToken = customToken ? customToken.trim().replace(/^['"]|['"]$/g, '') : null;

  const candidateTokens = Array.from(new Set([envToken, passedToken].filter(Boolean))) as string[];

  if (candidateTokens.length === 0) {
    const res: WorkflowProvisionResult = {
      success: false,
      message: 'GITHUB_TOKEN is missing in environment. Please configure GITHUB_TOKEN in .env',
      requiresManualCommit: true,
    };
    await updateDbWorkflowStatus(repoUrl, 'FAILED', res.message);
    return res;
  }

  // Parse owner and repo
  const cleanUrl = repoUrl.replace(/\/$/, '').replace(/\?.*$/, '');
  const match = cleanUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);

  if (!match) {
    const res = {
      success: false,
      message: `Invalid GitHub URL: ${repoUrl}`,
    };
    await updateDbWorkflowStatus(repoUrl, 'FAILED', res.message);
    return res;
  }

  const owner = match[1];
  const repo = match[2];

  let token = candidateTokens[0];
  let targetBranch = 'main';

  for (const tok of candidateTokens) {
    const testHeaders = {
      Authorization: `Bearer ${tok}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RepoHamster-Workflow-Provisioner/1.0',
    };

    try {
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: testHeaders });
      if (repoRes.ok) {
        const repoData = await repoRes.json();
        targetBranch = repoData.default_branch || 'main';
        token = tok;
        if (repoData.permissions?.push !== false) {
          break;
        }
      }
    } catch (err) {
      console.warn('[WORKFLOW PROVISIONER] Token verification error:', err);
    }
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RepoHamster-Workflow-Provisioner/1.0',
    'Content-Type': 'application/json',
  };

  const workflowPath = '.github/workflows/test.yml';
  const workflowContent = generateWorkflowYaml(language);

  try {
    let existingSha: string | null = null;
    let existingContentBase64: string | null = null;

    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${workflowPath}`, {
      headers,
    });

    if (getRes.ok) {
      const data = await getRes.json();
      existingSha = data.sha;
      existingContentBase64 = (data.content || '').replace(/\s+/g, '');
    }

    const targetBase64 = Buffer.from(workflowContent, 'utf8').toString('base64');

    // If the workflow already exists with matching content, consider it verified & active!
    if (existingContentBase64 && existingContentBase64 === targetBase64) {
      const res: WorkflowProvisionResult = {
        success: true,
        message: 'Assessment workflow (.github/workflows/test.yml) verified and active.',
        workflowPath,
      };
      await updateDbWorkflowStatus(repoUrl, 'ACTIVE', null);
      return res;
    }

    const payload: any = {
      message: 'ci: add automated PR test evaluation workflow',
      content: targetBase64,
      branch: targetBranch,
    };
    if (existingSha) {
      payload.sha = existingSha;
    }

    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${workflowPath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    if (putRes.ok) {
      const res: WorkflowProvisionResult = {
        success: true,
        message: 'Assessment test workflow (.github/workflows/test.yml) created successfully!',
        workflowPath,
      };
      await updateDbWorkflowStatus(repoUrl, 'ACTIVE', null);
      return res;
    }

    const errText = await putRes.text();
    console.warn(`[WORKFLOW PROVISIONER] Failed to commit ${workflowPath}:`, errText);

    let friendlyError = `Failed to commit ${workflowPath} (HTTP ${putRes.status})`;
    if (putRes.status === 404 || putRes.status === 403) {
      friendlyError = `GitHub Token lacks 'workflow' OAuth scope to write to .github/workflows/. Either add 'workflow' permission to GITHUB_TOKEN or commit .github/workflows/test.yml manually.`;
    }

    const res: WorkflowProvisionResult = {
      success: false,
      message: friendlyError,
      requiresManualCommit: true,
    };
    await updateDbWorkflowStatus(repoUrl, 'FAILED', res.message);
    return res;
  } catch (e: any) {
    console.warn(`[WORKFLOW PROVISIONER] Error committing ${workflowPath}:`, e);
    const res: WorkflowProvisionResult = {
      success: false,
      message: e?.message || String(e),
      requiresManualCommit: true,
    };
    await updateDbWorkflowStatus(repoUrl, 'FAILED', res.message);
    return res;
  }
}

async function updateDbWorkflowStatus(repoUrl: string, status: string, errorMsg: string | null) {
  try {
    const clean = repoUrl.replace(/\/$/, '');
    await prisma.assignment.updateMany({
      where: {
        OR: [
          { repoUrl: { equals: clean } },
          { repoUrl: { contains: clean.split('github.com/')[1] || clean } },
        ],
      },
      data: {
        workflowStatus: status,
        workflowError: errorMsg,
      },
    });
  } catch (e) {
    console.warn('[WORKFLOW PROVISION DB SYNC] Non-fatal error updating assignment status:', e);
  }
}
