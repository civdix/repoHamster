HamsterTrace — Technical Architecture

Parent Project: RepoHamster
Feature: Developer Activity Tracking & AI Governance
Status: Planned
Implementation: Future Phase

1. System Overview

HamsterTrace is a VS Code-based developer activity tracking system integrated with RepoHamster.

It captures relevant development events during coding assessments and generates an Engineering Intelligence Report.

High-Level Architecture
mermaid
flowchart TD
    A[Candidate] --> B[RepoHamster Platform]
    B --> C[Assessment Session]
    C --> D[VS Code Extension]
    D --> E[Activity Collector]
    D --> F[RepoHamster AI Assistant]
    F --> G[AI Gateway]
    G --> H[Approved AI Models]
    E --> I[Backend API]
    G --> I
    I --> J[PostgreSQL]
    I --> K[Activity Processor]
    K --> L[Engineering Intelligence Engine]
    L --> M[Assessment Report]
    M --> N[Admin Dashboard]

2. Main Components
A. RepoHamster Platform

Responsibilities:

Candidate authentication.
Assignment management.
Assessment session creation.
Extension authorization.
AI policy configuration.
Candidate result management.
Admin dashboard.
B. HamsterTrace VS Code Extension

Technology: TypeScript + VS Code Extension API.

Responsibilities:

Authenticate assessment sessions.
Identify the active assignment.
Monitor relevant file activity.
Record supported terminal events.
Track Git activity.
Track debugger sessions.
Track test execution.
Connect to the approved AI assistant.
Synchronize activity with the backend.
Display tracking status.
C. Activity Collection Engine

Collect structured events.

Supported event types:

text
ASSESSMENT_STARTED
ASSESSMENT_ENDED
FILE_OPENED
FILE_MODIFIED
FILE_SAVED
TERMINAL_COMMAND_EXECUTED
TEST_EXECUTED
DEBUG_SESSION_STARTED
DEBUG_SESSION_ENDED
GIT_BRANCH_CHANGED
GIT_COMMIT_CREATED
AI_REQUEST_SENT
AI_RESPONSE_RECEIVED
AI_PATCH_PROPOSED
AI_PATCH_ACCEPTED
AI_PATCH_REJECTED
DOCUMENTATION_RESOURCE_OPENED


Each event should contain:

Event ID.
Candidate ID.
Assignment ID.
Session ID.
Event type.
Timestamp.
Relevant metadata.
Extension version.

Do not capture passwords, unrelated files, arbitrary keystrokes, or personal information.

D. AI Gateway

All platform-provided AI requests must pass through the backend.

Responsibilities:

Validate candidate sessions.
Check assignment AI permissions.
Enforce token limits.
Enforce request limits.
Select approved AI models.
Record AI prompts and responses.
Track generated code suggestions.
Track patch acceptance and rejection.
Record AI usage.

AI modes:

Research Mode.
Assisted Coding Mode.
No AI Mode.

The VS Code extension must not be treated as the security boundary. Enforce important restrictions server-side and, where required, through managed development environments.

E. Managed Development Environment

Future integration with GitHub Codespaces or controlled development containers.

Responsibilities:

Provide a consistent environment.
Configure approved extensions.
Restrict unauthorized network access.
Provide access to approved AI services.
Support assessment-specific configurations.
Protect evaluation infrastructure.
F. Engineering Intelligence Engine

Analyze collected activity and verified evaluation results.

Evaluation dimensions:

Debugging methodology.
Root-cause investigation.
Code quality.
Testing practices.
Problem-solving.
AI utilization.
Solution correctness.

Use explicit evaluation rubrics and supporting evidence.

Do not infer a candidate's abilities from isolated activity metrics.

3. Database Architecture

Proposed PostgreSQL tables:

AssessmentSessions
Column	Type
id	UUID
candidate_id	UUID
assignment_id	UUID
status	VARCHAR
started_at	TIMESTAMP
ended_at	TIMESTAMP
ActivityEvents
Column	Type
id	UUID
session_id	UUID
candidate_id	UUID
assignment_id	UUID
event_type	VARCHAR
metadata	JSONB
created_at	TIMESTAMP
AIInteractions
Column	Type
id	UUID
session_id	UUID
candidate_id	UUID
assignment_id	UUID
model	VARCHAR
mode	VARCHAR
prompt	TEXT
response	TEXT
input_tokens	INTEGER
output_tokens	INTEGER
created_at	TIMESTAMP
AIUsage
Column	Type
id	UUID
candidate_id	UUID
assignment_id	UUID
requests_used	INTEGER
tokens_used	INTEGER
updated_at	TIMESTAMP
DeveloperActions
Column	Type
id	UUID
session_id	UUID
action_type	VARCHAR
file_path	VARCHAR
metadata	JSONB
created_at	TIMESTAMP

Use proper indexes, foreign keys, unique constraints, and retention policies.

Sensitive prompt and code data should have explicit retention and access controls.

4. Backend API Design

Proposed endpoints:

Extension Authentication
text
POST /api/hamstertrace/auth
POST /api/hamstertrace/session/start
POST /api/hamstertrace/session/validate
POST /api/hamstertrace/session/end

Activity Collection
text
POST /api/hamstertrace/events
POST /api/hamstertrace/events/batch
GET  /api/hamstertrace/session/status

AI Gateway
text
POST /api/hamstertrace/ai/chat
POST /api/hamstertrace/ai/patch
GET  /api/hamstertrace/ai/usage
GET  /api/hamstertrace/ai/policy

Admin Analytics
text
GET /api/admin/hamstertrace/sessions
GET /api/admin/hamstertrace/candidates/:id
GET /api/admin/hamstertrace/timeline/:sessionId
GET /api/admin/hamstertrace/reports/:sessionId


All endpoints require authentication and authorization.

5. Activity Event Processing

Expected workflow:

Candidate starts an assignment.
RepoHamster creates an assessment session.
Candidate activates the VS Code extension.
Extension authenticates the session.
Extension collects relevant activity events.
Events are transmitted in batches.
Backend validates and stores events.
Activity processor creates a chronological timeline.
Evaluation engine independently checks the submitted code.
Engineering Intelligence Engine generates the report.

Events must be timestamped and associated with the exact assessment session.

Do not treat client-reported events as tamper-proof evidence.

6. Security Architecture

Security requirements:

HTTPS for all communications.
Short-lived extension authentication tokens.
Secure token storage.
Server-side AI policy enforcement.
Role-based access control.
Candidate-level data isolation.
Secret and credential redaction.
Event validation.
Rate limiting.
Audit logging.
Secure webhook verification.
Isolated test execution.
Explicit candidate consent.

Do not implement hidden surveillance or keylogging.

Do not access unrelated browser sessions or applications.

For stronger enforcement, use managed environments with restricted permissions and network policies.

7. Engineering Intelligence Report Flow
mermaid
flowchart TD
    A[Activity Events] --> C[Activity Processor]
    B[Automated Test Results] --> D[Evaluation Engine]
    C --> E[Engineering Intelligence Engine]
    D --> E
    E --> F[Evidence-Based Rubric]
    F --> G[Engineering Intelligence Report]
    G --> H[Admin Dashboard]


Report contents:

Candidate information.
Assignment information.
Assessment duration.
Tests passed and failed.
Files inspected and modified.
Test execution history.
Debugging timeline.
AI requests and usage.
Accepted and rejected AI suggestions.
Code quality results.
Engineering evaluation.
Final summary.
8. Technology Stack
Component	Technology
VS Code Extension	TypeScript
Extension Interface	VS Code Webview API
Backend	Existing RepoHamster backend
Database	PostgreSQL
ORM	Prisma / Drizzle
Authentication	Existing RepoHamster authentication
AI	Backend-controlled LLM gateway
Development Environment	GitHub Codespaces
Activity Storage	PostgreSQL JSONB
Evaluation	Isolated test runners
9. Implementation Phases
Phase 1 — Foundation
Extension project setup.
Extension authentication.
Session management.
Activity status indicator.
Phase 2 — Event Tracking
File events.
Git events.
Terminal events.
Debugger events.
Test events.
Phase 3 — AI Governance
AI gateway.
AI modes.
Usage limits.
Prompt tracking.
Patch tracking.
Phase 4 — Managed Environment
Codespaces integration.
Extension allowlist.
Network restrictions.
Environment policies.
Phase 5 — Intelligence
Timeline processing.
Evaluation rubrics.
Report generation.
Admin analytics.
10. Architectural Principles
HamsterTrace must remain a separate feature module within RepoHamster.
The extension must communicate with the backend through authenticated APIs.
AI credentials must never be exposed in the extension.
Evaluation must remain independent of client-reported activity.
Hidden tests must remain inaccessible to candidates.
Activity collection must be transparent and consent-based.
The system must support multiple programming languages and frameworks.
The architecture must allow future integration with additional IDEs.

Product vision:

"We don't just evaluate the code you write. We understand how you engineer."

HamsterTrace — Every decision tells a story.


Once you've created this file, your documentation structure will be:

```text
RepoHamster/
├── docs/
│   ├── features/
│   │   └── HAMSTERTRACE_REPORT.md
│   └── architecture/
│       └── HAMSTERTRACE_ARCHITECTURE.md
│
└── TODO/
    └── TODO_HAMSTERTRACE.md


You can now keep HamsterTrace documented and safely postpone implementation until the core RepoHamster platform is ready. 🐹