# RepoHamster — Quick Start & Setup Guide 🐹

> **Tagline**: *Break Bugs. Ship Fixes.*  
> **Platform**: AI-Assisted Developer Debugging Assessment Platform

---

## ⚡ 1. Quick Start (Zero Keys Required — 30-Second Launch)

RepoHamster comes **pre-configured for instant zero-dependency local development**. You **do not need any external API keys or GitHub accounts** to run, test, and explore all features immediately.

### Step 1: Install Dependencies
Open PowerShell or your terminal in the repository root directory (`D:\repohamster`):
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 2. Default Login Accounts (Pre-Configured)

Navigate to **[http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)**. You will see 1-click quick-login buttons:

| Role | Email | Password | What You Can Do |
|---|---|---|---|
| **Admin / Staff** | `admin@debuglab.internal` | `DebugLabAdmin2026!` | Access `/admin`, manage 10 catalogue repositories, validate compatibility, edit AI token quotas, and override scores |
| **Candidate** | `candidate@debuglab.internal` | *(Any password)* | Access `/dashboard`, launch assignments, use AI assistant, and trigger sandbox evaluations |

---

## ⚙️ 3. Environment Variables & Keys Guide

All configuration is controlled via your `.env` file in the project root.

Here is the complete breakdown of every key, whether it is required, and where to obtain it:

```ini
# ==============================================================================
# 1. DATABASE CONFIGURATION
# ==============================================================================
# Default: Zero-setup SQLite file (pre-seeded, already created)
DATABASE_URL="file:./dev.db"

# Production PostgreSQL (Optional - Supabase, Neon, AWS RDS, Docker):
# DATABASE_URL="postgresql://user:password@localhost:5432/repohamster_db?schema=public"

# ==============================================================================
# 2. APPLICATION & AUTHENTICATION SECRETS
# ==============================================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="debuglab_super_secret_jwt_and_session_signing_key_at_least_32_chars"

# Default Admin Credentials for local access:
ADMIN_EMAIL="admin@debuglab.internal"
ADMIN_PASSWORD="DebugLabAdmin2026!"

# ==============================================================================
# 3. GITHUB OAUTH (Optional for Candidate Sign-In via GitHub)
# ==============================================================================
# Leave blank for local demo login via the signin page.
# When ready for live GitHub OAuth, create an app at: https://github.com/settings/applications/new
# Authorization callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_ID=""
GITHUB_SECRET=""

# ==============================================================================
# 4. GITHUB WEBHOOK & APP SECRETS (Optional for Live PR Webhooks)
# ==============================================================================
# Used when candidates open PRs against your official GitHub Organization.
# In local development mode, you can trigger evaluations directly via the UI modal with zero keys.
GITHUB_WEBHOOK_SECRET="debuglab_webhook_hmac_secret_key"
GITHUB_APP_ID=""
GITHUB_APP_PRIVATE_KEY=""

# ==============================================================================
# 5. AI ASSISTANT CONFIGURATION (Factory Architecture)
# ==============================================================================
# Options: 'groq' (recommended ultra-fast LPU), 'gemini', 'openai', or 'mock'
AI_PROVIDER="groq"

# Groq (Ultra-Fast Llama 3.3 70B & Llama 3.1 8B):
# Free API key at: https://console.groq.com/keys
GROQ_API_KEY=""
GROQ_MODEL="llama-3.3-70b-versatile"

# Google Gemini:
# Free API key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-1.5-flash"

# OpenAI:
# Key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"

# AI Daily Quotas & Token Rate Limits:
DEFAULT_AI_DAILY_REQUEST_LIMIT=15
DEFAULT_AI_TOKEN_LIMIT=10000
DEFAULT_AI_MAX_OUTPUT_TOKENS=600

# ==============================================================================
# 6. EVALUATION RUNNER DRIVER
# ==============================================================================
# Options: 'isolated-process' (default sandbox), 'docker', or 'mock'
RUNNER_DRIVER="isolated-process"
```

---

## 🛠️ 4. How to Enable Optional Features

### A. Enabling Groq AI Provider (Ultra-Fast LPU Inference — Recommended)
1. Get a free API key at **[Groq Console](https://console.groq.com/keys)**.
2. In your `.env` file, configure:
   ```ini
   AI_PROVIDER="groq"
   GROQ_API_KEY="gsk_..."
   GROQ_MODEL="llama-3.3-70b-versatile" # or "llama-3.1-8b-instant"
   ```
3. Restart `npm run dev`.
4. Open any challenge and ask the Socratic Hamster AI for debugging tips with sub-second response times!

> [!TIP]
> RepoHamster uses a resilient **Factory Architecture** (`AIFactory`). If your external API key is empty or an external LLM call experiences a network timeout, it automatically falls back to the built-in Socratic Hamster engine so candidates are never blocked.

---

### B. Other AI Providers (Gemini, OpenAI, or Mock)
- **Google Gemini**: Set `AI_PROVIDER="gemini"` and `GEMINI_API_KEY="AIzaSy..."` from [Google AI Studio](https://aistudio.google.com/app/apikey).
- **OpenAI**: Set `AI_PROVIDER="openai"` and `OPENAI_API_KEY="sk-..."` from [OpenAI Platform](https://platform.openai.com/api-keys).
- **Mock (Offline)**: Set `AI_PROVIDER="mock"` for zero-dependency local rule-based hints.

---

### C. Enabling Real GitHub OAuth Sign-In
1. Navigate to **[GitHub Developer Settings → OAuth Apps → New OAuth App](https://github.com/settings/applications/new)**.
2. Fill in:
   - **Application name**: `RepoHamster Local`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Click **Register application**, then click **Generate a new client secret**.
4. Copy the Client ID and Client Secret into your `.env`:
   ```ini
   GITHUB_ID="Iv1.xxxxxxxxxxxx"
   GITHUB_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```
5. Restart `npm run dev`. Candidates will now see the green **Continue with GitHub** button on `/auth/signin`.

---

### C. Switching to PostgreSQL (Optional for Production)
1. Set your PostgreSQL connection string in `.env`:
   ```ini
   DATABASE_URL="postgresql://user:password@localhost:5432/repohamster?schema=public"
   ```
2. Push the schema to your PostgreSQL database:
   ```bash
   npm run db:push
   ```
3. Seed predefined assignments and settings:
   ```bash
   npm run db:seed
   ```

---

## 🧭 5. Navigation & Platform Sitemap

| URL Route | Purpose & Key Features |
|---|---|
| **[`/`](http://localhost:3000)** | **Public Landing Page** — RepoHamster mascot, hero section, interactive challenge showcase, features, and FAQ |
| **[`/auth/signin`](http://localhost:3000/auth/signin)** | **Sign-In Page** — 1-click Quick Login (Admin / Candidate) and GitHub OAuth |
| **[`/dashboard`](http://localhost:3000/dashboard)** | **Candidate Dashboard** — Assigned challenges, completion stats, AI quotas, recent PR submissions |
| **[`/assignments/ecommerce-concurrency-ratelimit`](http://localhost:3000/assignments/ecommerce-concurrency-ratelimit)** | **Challenge Workspace** — Codespaces launch, defect description, AI chat drawer, Submit PR / Trigger Test Evaluation modal |
| **[`/admin`](http://localhost:3000/admin)** | **Admin Dashboard** — Submission review, pass/fail status, test logs, manual score override |
| **[`/admin/catalogue`](http://localhost:3000/admin/catalogue)** | **Repository Catalogue** — 10 public source repos, file explorer tree, compatibility validator, assignment converter |
| **[`/admin/assignments`](http://localhost:3000/admin/assignments)** | **Active Challenges** — Configure active assignments, passing thresholds, time limits, instructions |
| **[`/admin/settings`](http://localhost:3000/admin/settings)** | **System & AI Settings** — Configure daily AI request caps and token limits |

---

## 🧪 6. Verification & Automated Test Commands

To run the automated verification test suite:

```bash
# Run both Evaluation Runner & Repository Catalogue test suites:
npm test

# Run Evaluation Runner & HMAC Webhook verification only:
npm run test:runner

# Run Repository Catalogue & Multi-Language Harness verification only:
npm run test:catalogue

# Verify production compilation and type checks:
npm run build
```

---

## ❓ 7. Troubleshooting & Common Questions

### Q: Port 3000 is already in use
Run the dev server on another port:
```bash
npx next dev -p 3001
```
*(If using GitHub OAuth, remember to update the callback URL to port 3001).*

### Q: How do I re-seed or reset my database?
```bash
npm run db:seed
```

### Q: Do I need Docker installed to test evaluations?
**No.** RepoHamster uses `RUNNER_DRIVER="isolated-process"` by default, which executes tests in a safe, sandboxed local process with sanitized environment variables and timeouts. Docker is completely optional.

---

*Happy Debugging! Break Bugs. Ship Fixes.* 🐹
