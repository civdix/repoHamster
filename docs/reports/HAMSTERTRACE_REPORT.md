HamsterTrace — Feature & Technical Specification

Parent Product: RepoHamster
Feature: Developer Activity Tracking, AI Governance & Engineering Intelligence
Status: PLANNED — Future Development
Priority: High
Implementation: Future Phase

1. Overview

HamsterTrace is an integrated developer activity tracking and engineering intelligence system for RepoHamster.

Its purpose is to evaluate not only the final code submitted by a candidate but also their development process.

Candidates will install the official RepoHamster VS Code extension before starting an assignment.

During an assessment, the extension will collect relevant development events, including:

Files inspected.
Files modified.
Debugging activities.
Terminal commands.
Test execution.
Git operations.
AI interactions through the approved assistant.
AI-generated code suggestions.
Accepted and rejected suggestions.
Research activities through approved resources.
Final code changes.

The collected information will be processed into a structured development timeline and an Engineering Intelligence Report.

2. Primary Objectives
Understand how candidates approach debugging.
Evaluate problem-solving strategies.
Measure code quality and testing practices.
Track platform-provided AI usage.
Enforce configurable AI assistance policies in managed environments.
Understand whether candidates validate AI-generated suggestions.
Give recruiters better insight into engineering abilities.
Establish a transparent and auditable assessment process.

3. System Components
A. HamsterTrace VS Code Extension

A dedicated VS Code extension that connects the candidate's development environment to RepoHamster.

Responsibilities:

Authenticate assessment sessions.
Verify the active assignment.
Record relevant editor events.
Track file opening and modification events.
Record Git operations.
Track configured test executions.
Collect supported terminal activity.
Track debugging session events.
Connect to the RepoHamster AI assistant.
Synchronize activity events with the backend.
Display assessment recording status.
Show remaining AI usage allowance.
B. Activity Collection Engine

Collect structured events such as:

FILE_OPENED
FILE_MODIFIED
FILE_SAVED
TERMINAL_COMMAND_EXECUTED
TEST_EXECUTED
DEBUG_SESSION_STARTED
DEBUG_SESSION_ENDED
GIT_COMMIT_CREATED
AI_REQUEST_SENT
AI_RESPONSE_RECEIVED
AI_PATCH_PROPOSED
AI_PATCH_ACCEPTED
AI_PATCH_REJECTED
DOCUMENTATION_RESOURCE_OPENED

Events should contain:

Candidate ID.
Assignment ID.
Assessment session ID.
Event type.
Timestamp.
Relevant metadata.
Associated file or resource where applicable.

Do not collect unrelated personal files, passwords, secrets, or arbitrary keystrokes.

C. AI Governance Engine

All RepoHamster-provided AI interactions should pass through a backend-controlled AI gateway.

The administrator can configure AI policies per assignment.

Supported modes:

Research Mode

Explain errors.
Explain existing code.
Answer conceptual questions.
Provide debugging guidance.
No direct platform-mediated file edits.

Assisted Coding Mode

Generate code suggestions.
Propose bug fixes.
Generate patches.
Allow candidates to review, accept, or reject patches.

No AI Mode

Disable platform-provided AI assistance.

Additional controls:

Maximum request count.
Maximum token allowance.
Maximum response size.
Model allowlist.
Assignment-specific AI permissions.
Usage analytics.

The extension alone must not be treated as a security boundary. Stronger restrictions require a managed development environment and network policies.

D. Managed Assessment Environment

Future integration with GitHub Codespaces or controlled development containers.

Requirements:

Approved extension allowlist.
Restricted network access.
Approved AI provider access.
Controlled development environment.
Candidate-specific assessment sessions.
Environment-level access restrictions.
Secure event collection.

Clearly communicate the limitations of external device and off-environment AI usage.

E. Activity Timeline

Build a chronological timeline of candidate activity.

Example:

10:00 — Assessment started.

10:03 — Inspected app.py.

10:07 — Investigated user_service.py.

10:10 — Executed pytest.

10:12 — Three tests failed.

10:15 — Asked AI to explain the failing query.

10:19 — Modified service implementation.

10:23 — Executed tests again.

10:27 — Two additional tests passed.

10:35 — Created Git commit.

10:40 — Submitted Pull Request.

The timeline should distinguish observed events from inferred interpretations.

F. Engineering Intelligence Engine

Analyze structured activity and final evaluation results.

Generate assessment dimensions:

Debugging methodology.
Root-cause investigation.
Code quality.
Testing discipline.
Problem-solving process.
AI utilization.
Independent reasoning.
Solution correctness.

Scores should be generated from explicit rubrics and verifiable evidence.

Do not equate AI request count with engineering ability.

Do not automatically interpret longer solving times or frequent file navigation as negative behavior.

4. Engineering Intelligence Report

Every completed assignment can generate a report containing:

Candidate Information
Candidate ID.
GitHub username.
Assignment.
Assessment duration.
Technical Results
Tests passed.
Tests failed.
Final score.
Code quality checks.
Submission commit SHA.
Development Activity
Files inspected.
Files modified.
Tests executed.
Debugging events.
Git activity.
AI Usage
Number of AI requests.
Token consumption.
AI mode used.
Accepted suggestions.
Rejected suggestions.
Patch validation results.
Engineering Evaluation
Debugging approach.
Testing practices.
Problem-solving methodology.
Code quality.
AI-assisted development practices.
Final Summary

A concise evidence-based assessment generated from the activity timeline and test results.

5. Suggested Architecture

VS Code Extension:

TypeScript.
VS Code Extension API.
VS Code Webview API.

Backend:

Existing RepoHamster backend.
REST API.
PostgreSQL.

AI:

Backend AI gateway.
Approved model providers.
Token and request accounting.

Activity Collection:

Structured event ingestion.
Event validation.
Secure batching.
Retry handling.
Assessment session association.

Analytics:

Activity timeline processor.
Engineering rubric engine.
Report generation.

Security:

Short-lived session credentials.
HTTPS.
Role-based access control.
Encryption.
Secret redaction.
Event integrity checks.
Explicit consent and retention policies.
6. Important Privacy Requirements
Inform candidates what is collected.
Obtain explicit consent before tracking begins.
Show a visible tracking indicator.
Only collect assessment-related activity.
Never implement hidden keylogging.
Never collect personal credentials.
Do not inspect unrelated repositories.
Provide clear data retention policies.
Restrict report access to authorized administrators.
Allow candidates to understand what information is used in their evaluation.
7. Implementation Roadmap

Phase 1: Extension Foundation

Build VS Code extension.
Implement authentication.
Connect assessment sessions.
Add visible recording status.

Phase 2: Activity Collection

File activity.
Git events.
Test events.
Debugger events.
Supported terminal events.

Phase 3: AI Integration

RepoHamster AI gateway.
Research Mode.
Assisted Coding Mode.
No AI Mode.
Usage accounting.
Patch acceptance tracking.

Phase 4: Managed Environment

Codespaces integration.
Extension allowlist.
Network restrictions.
Environment policies.

Phase 5: Engineering Intelligence

Event timeline.
Analysis engine.
Scoring rubric.
Candidate reports.
Admin analytics.
8. Definition of Success

HamsterTrace is successful when:

A candidate can start an assessment from RepoHamster.
The VS Code extension authenticates the assessment session.
Relevant development events are recorded.
Platform-provided AI requests are tracked.
Configured AI policies are enforced.
Events are associated with the correct candidate and assignment.
Final code is independently evaluated.
An evidence-based Engineering Intelligence Report is generated.

Product positioning:

"We don't just evaluate the code you write. We understand how you engineer."

Feature tagline:

Every decision tells a story.