# TODO — HamsterTrace VS Code Extension & AI Anti-Cheat Architecture

**Project:** RepoHamster  
**Feature:** Developer Activity Tracking, AI Anti-Cheat Governance & Real-Time Assessment Telemetry  
**Status:** In Roadmap (Architecture Defined)  
**Priority:** High  
**Planned for:** Future Core Milestone  

---

## Executive Summary
HamsterTrace is the dedicated RepoHamster VS Code extension automatically provisioned inside candidate GitHub Codespaces environments. It enforces assessment integrity, locks down unauthorized AI ghost-writing, detects external copy-paste spikes, embeds the Socratic AI Mentor directly into the IDE sidebar, and streams real-time telemetry to the RepoHamster backend.

---

## Phase 0 — Architecture & Preparation
- [x] Define threat vectors (AI autocompletion, configuration tampering, "revert before PR" attacks, external LLM copy-paste).
- [x] Design container-level read-only file permissions (`chmod 444`, `chattr +i`).
- [ ] Finalize telemetry event schema and WebSocket/HTTPS ingestion specification.
- [ ] Define candidate assessment consent and proctoring disclosure banner.
- [ ] Design VS Code extension architecture (Activation events, Configuration Watcher, Activity Engine, Mentor Webview).

---

## Phase 1 — VS Code Extension Foundation
- [ ] Scaffold `repohamster-trace` TypeScript extension using `@vscode/vsce`.
- [ ] Implement zero-touch installation via `.devcontainer/devcontainer.json` `customizations.vscode.extensions`.
- [ ] Implement candidate session handshake (authenticating assignment session token via Codespace environment variable or query param).
- [ ] Add RepoHamster status bar item displaying: `🐹 RepoHamster: Active (Assessment Protected)`.
- [ ] Handle offline buffering with SQLite/IndexedDB event queue and auto-sync on reconnect.

---

## Phase 2 — Real-Time AI Anti-Cheat & Configuration Enforcement
- [ ] **Active Configuration Watchdog (`onDidChangeConfiguration`):**
  - Continuously monitor `editor.inlineSuggest.enabled`, `github.copilot.inlineSuggest.enable`, and `github.copilot.editor.enableCodeActions`.
  - If a candidate attempts to toggle inline code generation to `true` in user or workspace settings, **instantly revert it to `false` within 50ms**.
  - Show warning modal: *"⚠️ RepoHamster Integrity Guard: Inline AI code generation is disabled for this assessment."*
  - Emit high-priority telemetry alert: `UNAUTHORIZED_AI_TOGGLE_ATTEMPT`.
- [ ] **Anti-Tampering File Watcher:**
  - Watch `.vscode/settings.json`, `.devcontainer/devcontainer.json`, and `.github/copilot-instructions.md`.
  - Detect deletion, renaming, or modification attempts in real time.
  - Emit tamper alert: `SETTINGS_TAMPER_DETECTED`.
- [ ] **Prevent "Revert Before PR" Loophole:**
  - Because telemetry is streamed live to RepoHamster as actions occur, candidates cannot bypass detection by restoring `.vscode/settings.json` right before creating their pull request.

---

## Phase 3 — Developer Activity & Paste Burst Telemetry
- [ ] **External AI Paste Detection (Burst / Velocity Analysis):**
  - Hook into `vscode.workspace.onDidChangeTextDocument`.
  - Calculate typing velocity (Words Per Minute / characters per tick).
  - Detect sudden multi-line code insertions (>10 lines inserted in 0ms with uniform indentation).
  - Flag potential external LLM copy-paste events: `LARGE_PASTE_BURST_DETECTED` with diff snapshot and timestamp.
- [ ] **Editor & Debugging Event Tracking:**
  - Track `FILE_OPENED`, `FILE_MODIFIED`, and `FILE_SAVED`.
  - Track terminal executions (`npm test`, `pytest`, `git status`) via `vscode.window.onDidStartTerminalShellExecution`.
  - Track test runs and pass/fail transitions.
  - Track debug sessions (`onDidStartDebugSession`).

---

## Phase 4 — Embedded Hamster AI Mentor Sidebar
- [ ] **Activity Bar Webview (`repohamster-mentor-view`):**
  - Embed the Hamster AI Mentor directly into the VS Code left sidebar.
  - Eliminate the need for candidates to switch browser tabs to consult the AI Mentor.
- [ ] **Direct Socratic Consultation:**
  - Candidate types questions directly into the VS Code sidebar.
  - Extension signs prompt with session token and calls RepoHamster `/api/ai/chat`.
  - Enforce Socratic mentoring rules (no code generation, only debugging methodology and edge-case hints).
  - Enforce daily request limits (15 queries) and token quotas (10,000 tokens).
- [ ] **Immutable Audit Logging:**
  - Every query and AI response is saved in the PostgreSQL `AIUsage` table.
  - Reviewers can view questions in real time on the Admin Dashboard (`/admin/candidates/[id]`).

---

## Phase 5 — Backend Ingestion & Real-Time Processing
- [ ] Create `ActivityEvent` database model in Prisma schema:
  - `id`, `candidateId`, `assignmentId`, `eventType`, `payload` (JSON), `createdAt`.
- [ ] Build `/api/telemetry/events` bulk ingestion endpoint with HMAC signature verification.
- [ ] Build real-time WebSocket connection for live session monitoring on the Admin Dashboard.
- [ ] Implement deduplication and sequence ordering for streamed telemetry packets.

---

## Phase 6 — Reviewer Intelligence Dashboard
- [ ] Live candidate activity timeline at `/admin/candidates/[id]`.
- [ ] Interactive replay of solution development (keystrokes, edits, test failures, and eventual fix).
- [ ] Visual indicators for:
  - Normal coding velocity vs. suspicious paste bursts.
  - AI Mentor questions asked vs. solution code committed.
  - Guardrail tamper alerts (if any occurred).
- [ ] Composite authenticity score (0-100%) factoring in test passage, paste velocity, and AI reliance.

---

## Acceptance Criteria
1. The extension installs automatically via `.devcontainer/devcontainer.json` upon Codespace creation.
2. Inline Copilot suggestions remain strictly disabled; manual override attempts are immediately reverted and flagged.
3. Sudden large external code pastes (>15 lines in 0ms) are recorded with timestamped snapshots.
4. Candidates can ask Socratic debugging questions through the embedded sidebar without leaving VS Code.
5. All queries and interactions are immutably logged to the database and viewable by interviewers on the Admin Dashboard.
6. Restoring configuration files before Git PR does not conceal tampering due to real-time telemetry streaming.
