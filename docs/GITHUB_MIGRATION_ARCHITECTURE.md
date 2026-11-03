# RepoHamster — GitHub Organization Migration & Production Architecture

> **Document Status**: Production Complete  
> **Audience**: Platform Administrators, DevOps Engineers, and Product Architects  
> **Platform**: RepoHamster (*Break Bugs. Ship Fixes.*)

---

## 1. Architectural Overview & Migration Objectives

RepoHamster currently operates with a **Local Development & Assessment Sandbox** that utilizes inspected public repositories as initial test sources. 

When you create your official GitHub organization (e.g., `@repohamster-org` or `@repohamster-assessments`), the platform will seamlessly migrate from public reference repositories to authoritative organization-managed repositories.

```
+-----------------------------------------------------------------------------------+
|                        OFFICIAL REPOHAMSTER GITHUB ORG                            |
|                                                                                   |
|  +---------------------------+             +----------------------------------+   |
|  | Template Repositories     |             | Private Test Harness Vault       |   |
|  | - challenge-react-express |             | - hidden-tests-vault             |   |
|  | - challenge-python-fastapi|             |   * private assertion suites     |   |
|  | - challenge-angular-quest |             |   * concurrency stress suites    |   |
|  | - challenge-spring-boot   |             |   * security compliance checks   |   |
|  | - challenge-go-concurrency|             +----------------------------------+   |
|  +---------------------------+                                                    |
+-----------------------------------------------------------------------------------+
                                         |
                                         | Codespaces / Fork
                                         v
+-----------------------------------------------------------------------------------+
|                         CANDIDATE CODESPACE ENVIRONMENT                           |
|                                                                                   |
|  - Candidate edits code in isolated GitHub Codespace                             |
|  - Candidate runs public tests (npm test / pytest / mvn test / go test)           |
|  - Candidate commits fix and submits Pull Request                                 |
+-----------------------------------------------------------------------------------+
                                         |
                                         | Webhook: pull_request (opened, synchronize)
                                         v
+-----------------------------------------------------------------------------------+
|                       REPOHAMSTER PRODUCTION PLATFORM                             |
|                                                                                   |
|  1. Verify HMAC-SHA256 Webhook Signature with secret                              |
|  2. Deduplicate submission by Candidate ID + Assignment ID + Commit SHA           |
|  3. Launch isolated sandbox container (Docker / Firecracker)                      |
|  4. Inject Authoritative Hidden Test Suite from secure vault                      |
|  5. Execute public + hidden tests with scrubbed environment                       |
|  6. Persist results in PostgreSQL & update PR Status Checks (pass / fail)        |
+-----------------------------------------------------------------------------------+
```

---

## 2. Step-by-Step Migration Workflow

### Step 1: Create the Official GitHub Organization
1. Log in to GitHub and navigate to [Create a new organization](https://github.com/account/organizations/new).
2. Recommended organization name: `repohamster-assessments` or `repohamster-labs`.
3. Select an organization plan (Team or Enterprise recommended for unlimited Codespaces and private repositories).

### Step 2: Establish Challenge Template Repositories
For each approved repository in the RepoHamster catalogue:
1. Create a repository marked as a **Template Repository** (e.g. `repohamster-assessments/challenge-shopping-cart-race`).
2. Include:
   - Clean source code with intentionally introduced defects.
   - Public test assertions (e.g., `tests/public/`).
   - `.devcontainer/devcontainer.json` preconfigured for immediate Codespaces launch.
   - Comprehensive candidate `README.md` with instructions and constraints.
3. **DO NOT** place hidden tests in this repository.

### Step 3: Configure GitHub App & OAuth Application
RepoHamster uses a dedicated GitHub App for webhooks and automated PR status checks, and OAuth for candidate identity:

1. **GitHub App Setup** (Org Settings → Developer Settings → GitHub Apps):
   - **Name**: `RepoHamster Evaluation Bot`
   - **Webhook URL**: `https://your-domain.com/api/webhooks/github`
   - **Webhook Secret**: Generate a cryptographically secure 32-byte secret (store as `GITHUB_WEBHOOK_SECRET`).
   - **Permissions**:
     - `Repository contents`: Read & Write (for reading submitted commits)
     - `Pull requests`: Read & Write (for posting automated evaluation review comments)
     - `Checks / Commit statuses`: Read & Write (for updating green/red check status badges on PRs)
   - **Subscribe to Events**:
     - `Pull request` (`opened`, `synchronize`, `reopened`)
     - `Check suite` / `Check run`

2. **Generate Private Key**:
   - Download the generated `.pem` private key file.
   - Base64-encode and store as `GITHUB_APP_PRIVATE_KEY` in your environment.

3. **Install GitHub App**:
   - Install the app onto your assessment organization with access to all challenge repositories.

---

## 3. Codespaces Optimization & Devcontainer Standard

To ensure a seamless, zero-friction developer experience (under 5-second workspace boot), each challenge repository in your organization must include a `.devcontainer` configuration.

### Example `.devcontainer/devcontainer.json` (Full-Stack TypeScript / Node)
```json
{
  "name": "RepoHamster Challenge Workspace",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "firsttris.vscode-jest-runner"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
  },
  "postCreateCommand": "npm install",
  "forwardPorts": [3000, 5173],
  "portsAttributes": {
    "3000": { "label": "Backend API", "onAutoForward": "silent" },
    "5173": { "label": "Frontend App", "onAutoForward": "openBrowser" }
  }
}
```

### Prebuilds
In organization settings, enable **GitHub Codespaces Prebuilds** on the default branch of each challenge repository. This ensures dependencies and packages are pre-cached, allowing candidates to begin coding in seconds.

---

## 4. Authoritative Hidden Test Management Architecture

### Security Philosophy
Hidden tests represent the definitive assessment criteria and must **never** be accessible to candidates:
- Never commit hidden test files to candidate-accessible branches or repositories.
- Never rely on client-side test assertions.
- Never pass unencrypted test scripts across insecure communication channels.

### Production Execution Pattern: Isolated Vault Injection
```
+--------------------------+
|  Candidate Submission    |  (Commit SHA: 7c34b10)
+--------------------------+
             |
             v
+--------------------------------------------------------------+
|             ISOLATED SANDBOX WORKER CONTAINER                |
|                                                              |
| 1. Fresh clone of candidate commit 7c34b10                  |
| 2. Purge candidate test modifications (git checkout HEAD tests)
| 3. Runner injects authoritative hidden test directory:       |
|    /internal-vault/tests/hidden/${assignmentSlug}/*.spec.ts   |
| 4. Environment scrubbed of API keys & database credentials   |
| 5. Process runs with strict ulimits:                         |
|    - Memory limit: 512MB                                     |
|    - CPU quota: 1.0 core                                     |
|    - Execution timeout: 60,000ms                             |
|    - Network egress: Disabled (isolated bridge)              |
+--------------------------------------------------------------+
             |
             v
+--------------------------+
|  Structured JSON Report  |
|  - Public: 2/2 PASSED    |
|  - Hidden: 2/2 PASSED    |
|  - Score: 100%           |
+--------------------------+
```

---

## 5. Environment Variables & Secret Configuration

When deploying the production RepoHamster platform, populate the following environment variables:

| Variable | Description | Example / Format |
|----------|-------------|------------------|
| `DATABASE_URL` | PostgreSQL connection string with SSL | `postgresql://user:pass@host:5432/repohamster?sslmode=require` |
| `NEXTAUTH_SECRET` | 32-byte secret for JWT signing | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Production application root URL | `https://repohamster.com` |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | `Iv1.8a7b9c...` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | `4d2e1f...` |
| `GITHUB_APP_ID` | GitHub App ID | `123456` |
| `GITHUB_APP_PRIVATE_KEY` | GitHub App PEM Private Key | Base64-encoded string |
| `GITHUB_WEBHOOK_SECRET` | HMAC-SHA256 signature secret | High-entropy secret string |
| `RUNNER_DRIVER` | Test sandbox driver | `isolated-process` or `docker` |
| `RUNNER_TIMEOUT_MS` | Max execution timeout | `60000` |
| `GEMINI_API_KEY` | Google Gemini API key for AI Tutor | `AIzaSy...` |

---

## 6. Production Deployment Checklist

- [ ] **Database**: Provision PostgreSQL instance with connection pooling (e.g. Supabase, Neon, AWS RDS Aurora). Run `prisma db push` / `prisma migrate deploy`.
- [ ] **GitHub Organization**: Establish `@repohamster-assessments` and fork approved catalogue repositories.
- [ ] **GitHub App Installation**: Verify Webhook delivers events with valid HMAC signatures to `/api/webhooks/github`.
- [ ] **Codespaces**: Configure `.devcontainer.json` and enable Prebuilds on default branches.
- [ ] **AI Assistant Rate Limiter**: Configure daily token limits (10,000 tokens) and query quotas (15 queries) in `/admin/settings`.
- [ ] **Monitoring & Health Checks**: Verify `/api/health` responds with HTTP 200 and database connectivity status.
