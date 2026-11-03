TODO — HamsterTrace

Project: RepoHamster
Feature: VS Code Developer Activity Tracking
Status: Not Started
Priority: High
Planned for: Future Development

Phase 0 — Preparation
Finalize HamsterTrace feature requirements.
Review the HamsterTrace technical specification.
Finalize activity collection and privacy policies.
Define candidate consent flow.
Define assessment event schema.
Design the extension architecture.
Phase 1 — VS Code Extension Foundation
Create a new VS Code extension project.
Set up TypeScript.
Create RepoHamster extension branding.
Create HamsterTrace sidebar.
Implement candidate authentication.
Implement assessment session verification.
Implement assignment identification.
Add visible tracking status.
Implement secure backend communication.
Handle expired assessment sessions.
Phase 2 — Developer Activity Tracking
Track file opening events.
Track file modification events.
Track file saving events.
Track supported terminal commands.
Track test execution.
Track test results.
Track debugger session events.
Track Git branch changes.
Track Git commits.
Capture relevant code diffs.
Implement event batching.
Implement offline event queue.
Implement event synchronization.
Add secret and credential redaction.
Phase 3 — AI Governance
Build RepoHamster AI gateway.
Integrate approved AI provider.
Implement Research Mode.
Implement Assisted Coding Mode.
Implement No AI Mode.
Add model allowlist.
Add request limits.
Add token limits.
Add per-assignment AI policies.
Track AI prompts.
Track AI responses.
Track proposed code patches.
Track accepted suggestions.
Track rejected suggestions.
Record patch validation results.
Display AI usage in extension.
Phase 4 — Managed Assessment Environment
Investigate GitHub Codespaces integration.
Create controlled development container configuration.
Implement approved extension allowlist.
Implement network restrictions.
Configure approved AI endpoints.
Restrict environment-level administrative privileges.
Test assessment environment isolation.
Document external AI usage limitations.
Phase 5 — Backend Activity Infrastructure
Create ActivityEvents database table.
Create AssessmentSessions database table.
Create AIInteractions database table.
Create AIUsage database table.
Create DeveloperActions database table.
Create extension authentication endpoints.
Create event ingestion endpoints.
Create AI interaction endpoints.
Create session validation endpoints.
Implement duplicate event protection.
Implement event validation.
Implement access control.
Implement audit logging.
Phase 6 — Admin Dashboard
Add HamsterTrace section to admin dashboard.
Display active assessment sessions.
Display candidate activity timelines.
Display file activity.
Display Git activity.
Display test execution history.
Display AI usage.
Display accepted and rejected AI suggestions.
Add candidate activity filters.
Add assignment-specific analytics.
Add session inspection page.
Phase 7 — Engineering Intelligence Reports
Design Engineering Intelligence Report.
Calculate test performance.
Analyze debugging methodology using recorded evidence.
Analyze test-driven development practices.
Evaluate code quality.
Analyze AI utilization.
Build configurable evaluation rubrics.
Generate evidence-linked assessment summaries.
Add administrator review functionality.
Export reports as PDF.
Allow candidates to view permitted assessment results.
Phase 8 — Security, Privacy & Testing
Review extension permissions.
Test authentication security.
Test event access control.
Test secret redaction.
Test AI quota enforcement.
Test event synchronization failures.
Test duplicate webhook and event handling.
Test managed environment isolation.
Verify consent and retention workflows.
Conduct security review.
Final Acceptance Criteria
VS Code extension successfully connects to RepoHamster.
Candidate assessment sessions are authenticated.
Relevant developer activity is recorded.
AI usage is tracked accurately.
Assignment AI policies are enforced within the supported environment.
Git commits and final submissions are associated with the assessment.
Hidden tests independently verify the solution.
Engineering Intelligence Reports are generated.
Admin can review candidate development history.

Reminder: HamsterTrace is a planned future feature. Do not implement it during the initial RepoHamster MVP development unless explicitly requested.