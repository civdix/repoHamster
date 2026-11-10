# Future Work — Codespaces Quota Solutions & Compute Alternatives

**Project:** RepoHamster  
**Feature:** Codespaces Quota Exhaustion Handling & Alternative Execution Engines  
**Status:** Planned / Future Work  
**Priority:** High  

---

## 1. Problem Statement
GitHub offers candidates a free tier of 120 core hours per month for Codespaces. When a candidate exhausts this quota or sets their spending limit to $0, GitHub returns HTTP `403 Forbidden` / `422 Unprocessable Entity` with errors such as:
> *"Codespaces cannot be created because the user has exceeded their spending limit or free quota."*

Currently, RepoHamster detects this condition explicitly and surfaces a dedicated alert explaining that the free quota has been exhausted. To allow candidates to continue working seamlessly without being blocked, several alternative solutions are planned.

---

## 2. Planned Alternative Solutions

### Solution 1: Automated Local Devcontainer Launcher (Zero Cloud Cost)
* **Concept:** Provide a 1-click command or desktop shell integration that clones the repository and launches VS Code with the Devcontainer extension automatically.
* **Command:**
  ```bash
  npx @devcontainers/cli open https://github.com/{candidate}/{repo}
  ```
* **Pros:** Runs entirely on the candidate's local machine; uses 0 cloud hours; preserves identical containerized environment.

### Solution 2: Organization-Sponsored Codespaces Pool
* **Concept:** Instead of creating the Codespace under the candidate's personal account, the organization / hiring company pays for the compute by enabling Organization-Sponsored Codespaces.
* **Mechanism:**
  - RepoHamster provisions an ephemeral branch in an organization-owned repository.
  - The Codespace is created under the organization's billing account via GitHub REST API with parameter `"billable_owner": "repohamster-assessments"`.
* **Pros:** Candidate never incurs cost or burns personal quota.

### Solution 3: Cloud IDE Multi-Provider Fallback (Gitpod / DevPod / Coder)
* **Concept:** When GitHub Codespaces returns `isQuotaExceeded: true`, offer 1-click redirection to alternative cloud development environments:
  - **Gitpod:** `https://gitpod.io/#https://github.com/{candidate}/{repo}` (Free monthly tier)
  - **DevPod:** Open source, client-side container runner supporting AWS, GCP, Azure, or local Docker.
* **Pros:** High availability; candidate remains in the browser without local setup.

### Solution 4: In-Browser WebAssembly WebContainers (StackBlitz Engine)
* **Concept:** For Node.js / TypeScript challenges, boot a full Node runtime inside the candidate's browser tab using WebAssembly WebContainers.
* **Pros:** Zero cloud infrastructure cost; instant boot time (under 3 seconds); works completely offline.

---

## 3. AI Governance, Copilot Restrictions & Review Audit

### AI Integrity Architecture
* **Inline Ghost-Writing Disabled:**
  - Candidates cannot use GitHub Copilot to autocomplete whole functions or generate solution code directly.
  - Enforced via repository configurations in `.vscode/settings.json`, `.devcontainer/devcontainer.json`, and `.github/copilot-instructions.md`:
    - `editor.inlineSuggest.enabled: false`
    - `github.copilot.inlineSuggest.enable: false`
    - `github.copilot.editor.enableCodeActions: false`
    - `github.copilot.advanced.inlineSuggestCount: 0`
* **Socratic Help Allowed:**
  - Candidates are encouraged to ask conceptual questions, request explanations of error messages, or seek debugging guidance.
* **Full Audit Logging:**
  - All questions asked to the AI Mentor are recorded in the `AIUsage` database table (`query`, `responseSnippet`, `tokens`).
  - Reviewers and hiring managers can audit the full inquiry transcript at `/admin/candidates/[id]` to assess candidate problem-solving abilities and verify authenticity.
