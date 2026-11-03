# RepoHamster — Guide: Adding & Validating New Debugging Repositories

> **Document Status**: Production Complete  
> **Platform**: RepoHamster (*Break Bugs. Ship Fixes.*)  
> **Audience**: Platform Administrators and Curriculum Engineers

---

## 1. Overview

RepoHamster allows administrators to curate, inspect, validate, and convert open-source and proprietary software repositories into active candidate debugging assignments.

The process follows a disciplined four-stage pipeline:
```
+---------------+      +----------------+      +------------------+      +-------------------+
|  1. DISCOVER  | ---> |  2. INSPECT    | ---> |  3. VALIDATE     | ---> |  4. CONVERT       |
|  Add Git URL  |      |  Tree & Defects|      |  Harness & Tests |      |  Active Challenge |
+---------------+      +----------------+      +------------------+      +-------------------+
```

---

## 2. Stage 1: Adding a Repository to the Catalogue

You can add repositories either via the database seed script or via Prisma Studio.

### Required Repository Metadata
Every entry in `CatalogRepository` requires:
- `name`: Kebab-case unique identifier (e.g., `fastapi-session-leak`)
- `originalUrl`: Public or private Git clone URL
- `owner`: GitHub user or organization name
- `repoName`: GitHub repository slug
- `language`: Primary programming language (e.g. `Python`, `TypeScript`, `Java`, `Go`)
- `framework`: Backend/frontend framework (e.g. `FastAPI`, `React`, `Spring Boot`)
- `category`: Domain category (`Full-Stack`, `Backend`, `Frontend`, `Concurrency`, `Algorithms`)
- `difficulty`: `BEGINNER`, `INTERMEDIATE`, or `ADVANCED`
- `license`: SPDX identifier (e.g. `MIT`, `Apache-2.0`, `NO_LICENSE`)
- `isCommercialAllowed`: Boolean indicating whether commercial evaluation usage is legally permitted.
- `sourceType`: `COMPLETE_APP`, `EXERCISE_COLLECTION`, `BENCHMARK`, or `SNIPPET_COLLECTION`

### Adding via Seed Script (`scripts/inspect-repositories.mjs`)
Add the repository definition to the `REPOSITORIES` array in `scripts/inspect-repositories.mjs`:
```javascript
{
  name: 'my-new-debugging-lab',
  originalUrl: 'https://github.com/my-org/debugging-lab',
  owner: 'my-org',
  repoName: 'debugging-lab',
  language: 'TypeScript',
  framework: 'Next.js',
  category: 'Full-Stack',
  difficulty: 'INTERMEDIATE',
  license: 'MIT',
  isCommercialAllowed: true,
  sourceType: 'COMPLETE_APP',
  description: 'Authentication token expiration race condition challenge.',
  exercises: [
    'Race condition on JWT session refresh during concurrent HTTP requests.'
  ],
  installCommand: 'npm install',
  buildCommand: 'npm run build',
  testCommand: 'npm test'
}
```
Run the inspection tool:
```bash
node scripts/inspect-repositories.mjs
```

---

## 3. Stage 2: Inspecting the Repository & Local Workspace Cloning

Administrators can inspect repositories from the **Staff Administration Dashboard** at `/admin/catalogue`:

1. Navigate to **RepoHamster Administration → Repository Catalogue**.
2. Click **Inspect & Tree** on any repository card.
3. In the modal:
   - **Inspection Audit Tab**: Review defect descriptions, build commands, commercial risk analysis, and staff recommendations.
   - **Local Explorer & Files Tab**: Click **Clone to Local Workspace**.
   - RepoHamster executes a shallow clone (`git clone --depth 1`) into `catalogue-sources/<catalogId>`.
   - The interactive directory tree allows you to browse folders and click to view code without leaving the browser.

> [!NOTE]
> Cloning to the local workspace is non-destructive. It never modifies upstream repositories and operates in a sandboxed directory with path-traversal safeguards.

---

## 4. Stage 3: Running Compatibility Validation

Before any repository can be converted into a candidate assessment, it must pass automated compatibility validation:

1. Click **Run Validation** in the repository details modal, or send a `POST` request to `/api/catalogue/[id]/validate`.
2. The validator engine evaluates:
   - **Runtime Compatibility**: Detects presence and version matching for Node.js (v18+), Python (3.10+), Java (JDK 17+), or Go (1.20+).
   - **Automated Test Harness**: Confirms Jest, Vitest, Pytest, JUnit, or Go test runners exist.
   - **Security Manifest Audit**: Scans dependencies for malicious scripts, unauthorized remote downloads, or dangerous hooks.
   - **Reproducibility Rating**: Evaluates whether build and test commands execute deterministically without manual environment interventions.
3. Repositories meeting standards are automatically upgraded to **`READY_FOR_TESTING`**.

---

## 5. Stage 4: Converting to an Active Candidate Challenge

Only repositories with status **`READY_FOR_TESTING`** can be converted into candidate assessment challenges.

1. In the repository details modal, select the **Convert to Assignment** tab.
2. Verify and configure:
   - **Challenge Title**: Display name shown to candidates (e.g. *FastAPI Concurrency & Session Leak*).
   - **URL Slug**: Unique URL slug for the assessment workspace (e.g. `fastapi-session-leak`).
   - **Difficulty**: `BEGINNER`, `INTERMEDIATE`, or `ADVANCED`.
   - **Estimated Duration**: Recommended solving duration in minutes (e.g. 45).
   - **Passing Threshold Percent**: Default is 100% (requires all mandatory tests to pass).
   - **AI Usage Quota**: Daily query request limit (default: 15) and token limit (default: 10,000).
   - **Instructions (Markdown)**: Clear problem statement, expected functionality, and rules.
3. Click **Publish Active Challenge**.
4. The challenge immediately appears on the Candidate Dashboard (`/dashboard`) with full Codespaces launch and evaluation runner support.

---

## 6. Authoring Hidden Test Specifications

Hidden tests ensure assessment integrity by running assertions against boundary conditions and edge cases outside the candidate's view.

### JSON Spec Format (`hiddenTestSpec`)
```json
{
  "runnerCommand": "pytest tests/hidden/test_authoritative.py",
  "testCases": [
    {
      "id": "HIDDEN-TC-01",
      "name": "Verify Atomic State Invariant Under 50 Concurrent Requests",
      "description": "Asserts no duplicate ledger entries are recorded under rapid asynchronous transactions.",
      "points": 50
    },
    {
      "id": "HIDDEN-TC-02",
      "name": "Verify Timezone Offset and Leap Year Epoch Calculation",
      "description": "Validates boundary date handling across UTC-12 and UTC+14 timezone boundaries.",
      "points": 50
    }
  ]
}
```

When candidates trigger an evaluation run, RepoHamster's isolated sandbox executes both public and hidden test cases, recording granular per-test results in the database and calculating the final composite score.
