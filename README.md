# DebugLab: AI-Assisted Debugging Assessment Platform

DebugLab is a production-minded technical assessment platform where candidates evaluate and resolve real-world software bugs in production-like GitHub repositories. Candidates launch their assigned challenges directly in **GitHub Codespaces**, write solutions, open Pull Requests, and receive automated multi-tiered test evaluations (combining public and hidden test suites) accompanied by controlled, rate-limited AI assistance.

---

## 🚀 Key Highlights & Architecture

- **5 Predefined Real-World Debugging Challenges**:
  1. `ecommerce-concurrency-ratelimit` (TypeScript / Next.js) – Race condition in stock checkout & sliding window rate limiter timestamp leak.
  2. `fastapi-jwt-auth-revocation` (Python / FastAPI) – Timezone naive JWT token expiry parsing & role authorization case-sensitivity escalation.
  3. `event-queue-deadlock-leak` (TypeScript / Node.js) – Batch consumer promise rejection stall & circular retry heap memory exhaustion.
  4. `go-metrics-goroutine-leak` (Go / Gin) – Goroutine leak on context cancellation & concurrent slice append data race.
  5. `financial-ledger-precision-loss` (Python / Data Processing) – Binary float precision loss & banking standard Round-Half-Up arithmetic.
- **GitHub Codespaces Integration**: 1-click cloud developer environment launcher with step-by-step fork & local git instructions.
- **Automated Multi-Stage Evaluation Engine**:
  - Webhook-driven execution on Pull Request commits (`opened`, `synchronize`, `reopened`).
  - Isolated runner sandbox enforcing memory and execution timeouts (default 30s).
  - Secure injection of authoritative hidden security and regression suites (hidden test code and assertions are never leaked to candidate repos).
  - Idempotency guard: duplicate commit SHAs are recognized to prevent redundant runs while allowing new commits to trigger re-evaluations.
- **Controlled Socratic AI Assistance**:
  - Server-side AI proxy preventing frontend API key exposure.
  - Per-candidate daily query limits (default 15/day) and token budget limits (default 10,000 tokens/day).
  - Socratic system prompt that explains architectural concepts, stack traces, and clues **without ever writing the direct solution code**.
  - Built-in intelligent fallback provider for zero-config offline testing.
- **Comprehensive Admin Console**:
  - Live candidate inspector with audit trails of PRs, evaluated commit SHAs, logs, and AI queries.
  - Manual evaluation review & override system with mandatory audit reason logging.
  - Global system settings editor (passing thresholds, timeouts, AI quotas).
  - One-click CSV and JSON assessment results exporter.
- **Dual PostgreSQL & Zero-Setup SQLite Support**:
  - Production ready for PostgreSQL (Supabase, Neon, AWS RDS, Docker).
  - Built-in SQLite zero-setup database for immediate local development.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Server Actions)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Linear / Vercel dark developer theme)
- **Database ORM**: Prisma ORM
- **Authentication**: NextAuth.js (GitHub OAuth + Admin / Demo Credentials)
- **Security**: Webhook HMAC-SHA256 signature verification, sanitized execution environment

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Database Setup & Seeding
DebugLab comes seeded with the 5 predefined debugging assignments, default system settings, admin account, and realistic candidate submission records:

```bash
# Push schema to SQLite (or PostgreSQL if configured)
npx prisma db push --schema=prisma/schema.sqlite.prisma

# Seed 5 challenges, settings, and sample candidates
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Roles & Access

| Role | Email / Identifier | Purpose |
| :--- | :--- | :--- |
| **Admin** | `admin@debuglab.internal` | Access Admin Console (`/admin`), manage challenges, overrides, exports |
| **Candidate** | Sign in with GitHub or select `Alex Chen` | Access Candidate Dashboard (`/dashboard`), Codespaces launcher, AI assistant |

---

## 🧪 Automated Verification Suite

Run the end-to-end automated verification script:
```bash
npm run test:runner
```

Runs 6 automated tests:
1. Verifies 5 assignments are seeded and active.
2. Candidate account tracking and unique email deduplication.
3. Automated test evaluation engine with public and hidden test execution.
4. Idempotency verification preventing duplicate commit SHA executions.
5. Controlled AI assistance daily quota enforcement and token tracking.
6. GitHub Webhook HMAC-SHA256 signature verification.

---

## 📄 License
MIT
