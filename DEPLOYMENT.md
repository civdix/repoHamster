# DebugLab: Production Deployment & GitHub Configuration Guide

This guide details how to deploy DebugLab to production (Vercel, Railway, Fly.io, or AWS) and configure your GitHub App and 5 challenge repositories.

---

## 1. PostgreSQL Database Configuration

### Option A: Supabase or Neon (Recommended Serverless PostgreSQL)
1. Create a PostgreSQL project on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. Copy the Connection Pooling URL (Transaction mode):
   ```bash
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
3. Push the production PostgreSQL schema:
   ```bash
   npx prisma db push --schema=prisma/schema.prisma
   npm run db:seed
   ```

### Option B: Local / Self-Hosted Docker PostgreSQL
1. Start the included `docker-compose.yml`:
   ```bash
   docker compose up -d
   ```
2. Your connection URL is:
   ```bash
   DATABASE_URL="postgresql://debuglab:debuglab_password@localhost:5432/debuglab_db?schema=public"
   ```

---

## 2. GitHub OAuth App Setup (Candidate Login)

1. Go to your GitHub account: **Settings** > **Developer Settings** > **OAuth Apps** > **New OAuth App**.
2. Set:
   - **Application name**: `DebugLab Platform`
   - **Homepage URL**: `https://your-debuglab-domain.com` (or `http://localhost:3000` for development)
   - **Authorization callback URL**: `https://your-debuglab-domain.com/api/auth/callback/github`
3. Click **Register Application**, then generate a **Client Secret**.
4. Set the following in your environment:
   ```bash
   GITHUB_ID="<client_id>"
   GITHUB_SECRET="<client_secret>"
   ```

---

## 3. GitHub Webhook Configuration (Automated PR Evaluation)

To automatically trigger the test runner whenever a candidate submits a PR:

1. In each of your 5 challenge repositories (or on your GitHub Organization level):
   - Go to **Settings** > **Webhooks** > **Add webhook**.
2. Configure:
   - **Payload URL**: `https://your-debuglab-domain.com/api/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Enter a secure random string (e.g. `openssl rand -hex 24`).
   - **Which events would you like to trigger this webhook?**:
     - Select **Let me select individual events**.
     - Check **Pull requests** (`opened`, `synchronize`, `reopened`).
3. Set this secret in your environment:
   ```bash
   GITHUB_WEBHOOK_SECRET="<your_chosen_secret>"
   ```

---

## 4. Connecting Your 5 Predefined Repositories

In the Admin Console (`/admin/assignments`), you can either use the pre-seeded defaults or connect your own private/public repositories:

1. **Repository 1: Next.js Concurrency Bug**
   - Repo URL: `https://github.com/<your-org>/ecommerce-concurrency-ratelimit`
   - Language: `TypeScript` | Difficulty: `INTERMEDIATE`
2. **Repository 2: FastAPI Auth Expiry Bug**
   - Repo URL: `https://github.com/<your-org>/fastapi-jwt-auth-revocation`
   - Language: `Python` | Difficulty: `INTERMEDIATE`
3. **Repository 3: Event Queue Deadlock**
   - Repo URL: `https://github.com/<your-org>/event-queue-deadlock-leak`
   - Language: `TypeScript` | Difficulty: `ADVANCED`
4. **Repository 4: Go Telemetry Goroutine Leak**
   - Repo URL: `https://github.com/<your-org>/go-metrics-goroutine-leak`
   - Language: `Go` | Difficulty: `ADVANCED`
5. **Repository 5: Financial Decimal Precision**
   - Repo URL: `https://github.com/<your-org>/financial-ledger-precision-loss`
   - Language: `Python` | Difficulty: `BEGINNER`

---

## 5. GitHub Codespaces 1-Click Launch

Each challenge includes a `.devcontainer/devcontainer.json` file in its repository. When candidates click **Open in GitHub Codespaces**, GitHub launches:
```
https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=<owner>/<repo>
```
Candidates are immediately dropped into a full VS Code web IDE with all dependencies, language servers, and terminals ready to go.

---

## 6. Controlled AI Assistant Configuration

DebugLab provides a built-in Socratic AI provider that operates out-of-the-box. To connect external LLMs:

```bash
# OpenAI GPT-4o-mini
OPENAI_API_KEY="sk-..."

# Or Google Gemini
GEMINI_API_KEY="..."

# Admin-Configurable Quotas
DEFAULT_AI_DAILY_REQUEST_LIMIT=15
DEFAULT_AI_TOKEN_LIMIT=10000
DEFAULT_AI_MAX_OUTPUT_TOKENS=600
```

---

## 7. Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configure your environment variables in the Vercel Project Settings:
- `DATABASE_URL`
- `NEXTAUTH_URL` (`https://your-app.vercel.app`)
- `NEXTAUTH_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GITHUB_WEBHOOK_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `OPENAI_API_KEY` (optional)
