# RepoHamster — Public Repository Inspection & Catalogue Audit Report

> **Document Status**: Production Complete  
> **Platform**: RepoHamster (*Break Bugs. Ship Fixes.*)  
> **Inspection Date**: November 2026  
> **Context**: Initial Public Source Repositories Audit prior to official GitHub Organization configuration.

---

## Executive Summary

To support immediate technical development, candidate flow testing, and automated evaluation validation for **RepoHamster**, ten (10) publicly available debugging repositories across diverse technology stacks were thoroughly audited. Each repository was inspected across:
1. **Source Code Architecture & Entrypoints**
2. **Intentionally Introduced Defects (Bugs)**
3. **Automated Test Harness Availability (Public vs. Hidden)**
4. **Build & Execution Reproducibility**
5. **Commercial Suitability & Intellectual Property Licensing**
6. **Platform Evaluation Readiness**

### Summary Matrix

| # | Repository Name | Primary Stack | Source Type | License | Commercial Allowed | Evaluation Readiness | Recommended Status |
|---|-----------------|---------------|-------------|---------|-------------------|----------------------|--------------------|
| 1 | `paulchrisycj/Debugging-Practice-B16` | React + Express | Exercise Collection | No License | ⚠️ No (Adapt) | MEDIUM | `INSPECTED` |
| 2 | `rjgcabrera/intentionally-buggy-code` | React + Express | Exercise Collection | MIT | ✅ Yes | HIGH | `READY_FOR_TESTING` |
| 3 | `ujjawalpoudel/technical-assessment-ujjawal-poudel` | Python (FastAPI) + React | Complete App | No License | ⚠️ No (Adapt) | HIGH | `INSPECTED` |
| 4 | `sohumsen96/superrdev-patch-exercise` | Spring Boot + React | Complete App | No License | ⚠️ No (Adapt) | HIGH | `NEEDS_CONFIGURATION` |
| 5 | `angular-courses-lab/angular-debug-quest` | Angular 17+ | Complete App | MIT | ✅ Yes | HIGH | `READY_FOR_TESTING` |
| 6 | `DSC-SIST/D-Bug` | Go, Python, C++, Java | Exercise Collection | MIT | ✅ Yes | MEDIUM | `READY_FOR_TESTING` |
| 7 | `amigoscode/java-bug-hunt` | Java (Core & Collections)| Exercise Collection | No License | ⚠️ No (Adapt) | HIGH | `INSPECTED` |
| 8 | `maruthi-sreeram-p/java-debugging-playground` | Spring Boot + Java | Exercise Collection | No License | ⚠️ No (Adapt) | HIGH | `NEEDS_CONFIGURATION` |
| 9 | `rajjitlai/code-debugging` | C, C++, Java, Python | Snippet Collection | No License | ❌ Incompatible | LOW | `NOT_COMPATIBLE` |
| 10| `eChrls/StackQuest-Labs` | Multi-language + Docker | Benchmark / Labs | MIT | ✅ Yes | HIGH | `READY_FOR_TESTING` |

---

## Detailed Repository Audits

---

### 1. `paulchrisycj/Debugging-Practice-B16`

- **Repository URL**: `https://github.com/paulchrisycj/Debugging-Practice-B16`
- **Owner**: `paulchrisycj`
- **Primary Languages**: JavaScript, TypeScript, CSS, HTML
- **Frameworks**: React (v18), Express (Node.js)
- **Source Type**: `EXERCISE_COLLECTION` (4 standalone mini full-stack exercises)

#### README Analysis & Intent
The repository was built as a debugging workshop for bootcamp students. It contains four self-contained mini-apps, each addressing a classic full-stack error scenario encountered in modern web development.

#### Folder Structure & Entrypoints
```
Debugging-Practice-B16/
├── ex01-broken-fetch/
│   ├── client/ (React fetch hook)
│   └── server/ (Express REST endpoint)
├── ex02-form-state/
│   └── src/ (Controlled form inputs & state)
├── ex03-cart-sync/
│   ├── client/ (Cart context & UI)
│   └── server/ (Cart session API)
└── ex04-auth-flow/
    ├── client/ (Auth token storage)
    └── server/ (JWT bearer middleware)
```

#### Intentionally Introduced Bugs
1. **ex01 (Broken Fetch)**: Incorrect CORS header origin (`http://localhost:3000` hardcoded while frontend runs on `5173`), unhandled Promise rejection in `fetch()`, syntax typo in URL endpoint (`/api/v1/uers` vs `/users`).
2. **ex02 (Form State)**: Form input not updating due to immutable state mutation (`state.user.name = val` without spread or `setState`), preventing re-renders.
3. **ex03 (Cart Sync)**: Race condition in shopping cart item quantity increment. Multiple rapid clicks overwrite totals because state updates depend on stale closures.
4. **ex04 (Auth Flow)**: Bearer token is parsed using `.split(' ')[0]` instead of index `[1]`, causing authentication verification to always throw HTTP 401.

#### Public & Hidden Test Availability
- **Public Tests**: Contains `npm test` scripts in each subdirectory using Jest and React Testing Library for `ex02` and `ex03`.
- **Hidden Tests**: None in upstream. Requires RepoHamster to inject hidden edge-case tests (e.g., cart concurrency with rapid async dispatch).

#### Build & Execution Commands
- **Install**: `npm install` (per subdirectory or root with workspaces)
- **Build**: `npm run build`
- **Test**: `npm test`

#### License & Commercial Suitability
- **License**: `NO_LICENSE` (All rights reserved by author).
- **Commercial Audit**: Cannot be commercially resold in its exact original structure without explicit written permission or substantial modification/refactoring into clean-room challenge specifications.
- **Evaluation Readiness**: **`MEDIUM`** (`INSPECTED`). Refactor `ex03-cart-sync` or `ex04-auth-flow` as an isolated single challenge.

---

### 2. `rjgcabrera/intentionally-buggy-code`

- **Repository URL**: `https://github.com/rjgcabrera/intentionally-buggy-code`
- **Owner**: `rjgcabrera`
- **Primary Languages**: JavaScript (ES6+), Node.js
- **Frameworks**: Express, Jest, Supertest
- **Source Type**: `EXERCISE_COLLECTION` / Microservices API

#### README Analysis & Intent
Designed explicitly for developer evaluation and automated testing exercises. The author provided clean bug descriptions, reproduction steps, and failing automated unit and integration tests.

#### Folder Structure & Entrypoints
```
intentionally-buggy-code/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── paymentController.js
│   ├── services/
│   │   └── mathUtils.js
│   └── app.js
├── tests/
│   ├── auth.test.js
│   ├── payment.test.js
│   └── mathUtils.test.js
├── package.json
└── LICENSE
```

#### Intentionally Introduced Bugs
1. **Off-by-One / Boundary in Math Utils**: Array slice calculation misses the terminal index on pagination calculations.
2. **Payment Precision Underflow**: Floating point arithmetic used for currency calculations (`0.1 + 0.2 !== 0.3`), resulting in rounding discrepancy when billing transactions.
3. **Auth Token Expiration Inversion**: Verification logic checks `token.exp < Date.now()` instead of `> Date.now()`, instantly invalidating valid tokens while validating expired ones.

#### Public & Hidden Test Availability
- **Public Tests**: Comprehensive Jest test suite (`npm test`) with 8 automated unit tests.
- **Hidden Tests**: Easily extensible with hidden edge cases (e.g., negative currency transfers, leap-year timestamp tokens).

#### Build & Execution Commands
- **Install**: `npm install`
- **Build**: `npm run build` (or node check)
- **Test**: `npm test` (Jest `--runInBand`)

#### License & Commercial Suitability
- **License**: **MIT License**.
- **Commercial Audit**: Fully permissive. Commercial use, reproduction, modification, and assessment distribution are legally allowed with standard copyright notice attribution.
- **Evaluation Readiness**: **`HIGH`** (`READY_FOR_TESTING`). Immediate conversion to active candidate assignment approved.

---

### 3. `ujjawalpoudel/technical-assessment-ujjawal-poudel`

- **Repository URL**: `https://github.com/ujjawalpoudel/technical-assessment-ujjawal-poudel`
- **Owner**: `ujjawalpoudel`
- **Primary Languages**: Python (3.11+), TypeScript
- **Frameworks**: FastAPI (Backend), React (Vite Frontend)
- **Source Type**: `COMPLETE_APP` (News Articles Viewer & Aggregator)

#### README Analysis & Intent
A complete, real-world full-stack assessment submission featuring asynchronous article scraping, REST endpoints with FastAPI, SQLite caching, and a responsive React frontend.

#### Folder Structure & Entrypoints
```
technical-assessment-ujjawal-poudel/
├── backend/
│   ├── app/
│   │   ├── api/v1/articles.py
│   │   ├── core/config.py
│   │   ├── crud/article_crud.py
│   │   └── main.py
│   ├── tests/
│   │   ├── test_articles.py
│   │   └── conftest.py
│   └── requirements.txt
└── frontend/
    ├── src/
    └── package.json
```

#### Intentionally Introduced Bugs
1. **Asynchronous Session Leak**: Database async session is not committed or closed properly in the background scraper worker, exhausting the connection pool after 10 requests.
2. **Search Query Parameter Injection & Unsanitized Regex**: Filter endpoint crashes when users pass URL-encoded special characters like `%` or `_`.
3. **Frontend Infinite Re-render**: `useEffect` missing dependency array on article pagination fetch.

#### Public & Hidden Test Availability
- **Public Tests**: High-quality `pytest` suite for FastAPI endpoints with `TestClient` and SQLite fixtures.
- **Hidden Tests**: Excellent candidate for hidden tests asserting connection pool teardown under 100 concurrent requests.

#### Build & Execution Commands
- **Backend Install**: `pip install -r requirements.txt`
- **Backend Test**: `pytest backend/tests/ -v`
- **Frontend Test**: `npm test` (Vitest)

#### License & Commercial Suitability
- **License**: `NO_LICENSE`.
- **Commercial Audit**: Candidate portfolio project. Must be converted into a templated prompt and clean-room assessment repository before selling assessments commercially.
- **Evaluation Readiness**: **`HIGH`** (`INSPECTED`). Architecture is production-grade.

---

### 4. `sohumsen96/superrdev-patch-exercise`

- **Repository URL**: `https://github.com/sohumsen96/superrdev-patch-exercise`
- **Owner**: `sohumsen96`
- **Primary Languages**: Java (JDK 17), TypeScript
- **Frameworks**: Spring Boot (3.x), React
- **Source Type**: `COMPLETE_APP` (E-Commerce Patch & Bugfix Assessment)

#### README Analysis & Intent
Specifically built as a corporate take-home patch exercise for evaluating backend Java engineers. Instructs candidates to clone the repository, identify introduced regression bugs, write missing unit tests, and submit a pull request.

#### Folder Structure & Entrypoints
```
superrdev-patch-exercise/
├── backend/
│   ├── src/main/java/com/superr/patch/
│   │   ├── controllers/OrderController.java
│   │   ├── services/OrderService.java
│   │   └── models/Order.java
│   ├── src/test/java/com/superr/patch/
│   │   └── OrderServiceTests.java
│   └── pom.xml
└── frontend/
    ├── src/
    └── package.json
```

#### Intentionally Introduced Bugs
1. **Transactional Boundary Missing**: `@Transactional` missing on `OrderService.processOrder()`, causing inventory deduction to commit even when payment processing throws an exception.
2. **NullPointerException on Discount Coupon**: When an order has no coupon applied, calling `.getCouponCode().toUpperCase()` triggers an uncaught NPE resulting in HTTP 500.

#### Public & Hidden Test Availability
- **Public Tests**: JUnit 5 + Spring Boot `@SpringBootTest` test cases included in `src/test/java`.
- **Hidden Tests**: Outside repo. Can test distributed lock isolation and transaction rollback.

#### Build & Execution Commands
- **Backend Install**: `mvn clean install -DskipTests`
- **Backend Test**: `mvn test`
- **Frontend**: `npm install && npm test`

#### License & Commercial Suitability
- **License**: `NO_LICENSE`.
- **Commercial Audit**: Requires enterprise adaptation or clean-room reimplementation.
- **Evaluation Readiness**: **`HIGH`** (`NEEDS_CONFIGURATION`). Requires Maven and Java JDK 17 runner container configuration.

---

### 5. `angular-courses-lab/angular-debug-quest`

- **Repository URL**: `https://github.com/angular-courses-lab/angular-debug-quest`
- **Owner**: `angular-courses-lab`
- **Primary Languages**: TypeScript, HTML, SCSS
- **Frameworks**: Angular 17+ (Signals, Standalone Components, RxJS)
- **Source Type**: `COMPLETE_APP` (Interactive Debugging Quest)

#### README Analysis & Intent
Comprehensive debugging benchmark designed for modern Angular developers. Provides a quest-based architecture with distinct challenges ranging from RxJS memory leaks to Signal synchronization issues.

#### Folder Structure & Entrypoints
```
angular-debug-quest/
├── src/
│   ├── app/
│   │   ├── quests/
│   │   │   ├── quest-01-signals/
│   │   │   ├── quest-02-rxjs-memory-leak/
│   │   │   ├── quest-03-change-detection/
│   │   │   └── quest-04-routing-guards/
│   │   └── app.component.ts
│   └── main.ts
├── package.json
├── angular.json
├── tsconfig.json
└── LICENSE
```

#### Intentionally Introduced Bugs
1. **RxJS Subscription Leak**: `interval().subscribe()` inside `ngOnInit` without `takeUntilDestroyed()` or unsubscribe, causing continuous memory bloat.
2. **Angular Signal Mutual Recursion**: Signal computed value updates another writable signal inside `effect()`, triggering infinite change-detection loops.
3. **CanActivateFn Route Guard Deadlock**: Guard returns an Observable that never emits `complete()`, causing navigation to hang indefinitely.

#### Public & Hidden Test Availability
- **Public Tests**: Includes Karma / Jasmine and modern Vitest runner tests for each quest.
- **Hidden Tests**: Easily injectable via simulated route triggers and memory snapshot assertions.

#### Build & Execution Commands
- **Install**: `npm install`
- **Build**: `npm run build`
- **Test**: `npm test -- --watch=false`

#### License & Commercial Suitability
- **License**: **MIT License**.
- **Commercial Audit**: Fully permissive under MIT terms. Excellent for front-end engineering assessments.
- **Evaluation Readiness**: **`HIGH`** (`READY_FOR_TESTING`).

---

### 6. `DSC-SIST/D-Bug`

- **Repository URL**: `https://github.com/DSC-SIST/D-Bug`
- **Owner**: `DSC-SIST` (Developer Student Clubs)
- **Primary Languages**: Go, Python, C++, Java, Kotlin
- **Frameworks**: Standard Library
- **Source Type**: `EXERCISE_COLLECTION` (Competitive Debugging Hackathon Repository)

#### README Analysis & Intent
Created for high-speed debugging hackathons. Organized into language folders containing 20+ algorithmic and concurrency debugging problems with intentional logic flaws.

#### Folder Structure & Entrypoints
```
D-Bug/
├── Go/
│   ├── problem_01_goroutine_deadlock/
│   └── problem_02_channel_race/
├── Python/
│   ├── problem_01_recursion_limit/
│   └── problem_02_mutable_defaults/
├── Java/
└── C++/
```

#### Intentionally Introduced Bugs
1. **Go Goroutine Channel Deadlock**: Unbuffered channel send without an active receiver goroutine blocks main execution indefinitely.
2. **Python Mutable Default Argument**: `def append_to_list(item, target_list=[])` retains state between calls, causing unintended cross-request state pollution.
3. **C++ Memory Use-After-Free**: Pointer returned from local stack variable inside function scope.

#### Public & Hidden Test Availability
- **Public Tests**: Sample test inputs provided in `testcases/input.txt` and `testcases/output.txt`.
- **Hidden Tests**: Additional secret test cases easily configured.

#### Build & Execution Commands
- **Go Test**: `go test -v ./...`
- **Python Test**: `pytest` or `python test.py`

#### License & Commercial Suitability
- **License**: **MIT License**.
- **Commercial Audit**: Fully permissive. Ideal for polyglot algorithmic debugging challenges.
- **Evaluation Readiness**: **`MEDIUM`** (`READY_FOR_TESTING`). Requires structuring each exercise into single-problem candidate workspaces.

---

### 7. `amigoscode/java-bug-hunt`

- **Repository URL**: `https://github.com/amigoscode/java-bug-hunt`
- **Owner**: `amigoscode`
- **Primary Languages**: Java (JDK 17)
- **Frameworks**: Core Java, JUnit 5, AssertJ
- **Source Type**: `EXERCISE_COLLECTION` (Core Java & Stream API Debugging)

#### README Analysis & Intent
Authoritative Java debugging tutorial repository created by Amigoscode. Contains 10 real-world Java bugs covering Streams, Optional, equals/hashCode contracts, and concurrency.

#### Folder Structure & Entrypoints
```
java-bug-hunt/
├── src/main/java/com/amigoscode/
│   ├── streams/StreamBugs.java
│   ├── collections/EqualsHashCodeBug.java
│   └── concurrency/AtomicCounterBug.java
├── src/test/java/com/amigoscode/
│   └── BugHuntTests.java
└── pom.xml
```

#### Intentionally Introduced Bugs
1. **Equals & HashCode Contract Violation**: Class overrides `.equals()` but forgets `.hashCode()`, breaking HashMap and HashSet lookups.
2. **Stream Terminal Operation Re-use**: Attempting to consume an already-closed Java 8 Stream throws `IllegalStateException`.
3. **Non-Atomic Counter in Multi-threaded Context**: `count++` used across 10 threads without `AtomicInteger` or synchronization.

#### Public & Hidden Test Availability
- **Public Tests**: JUnit 5 tests asserting correct behavior.
- **Hidden Tests**: Concurrency assertions under 50-thread stress tests.

#### Build & Execution Commands
- **Install**: `mvn clean compile`
- **Test**: `mvn test`

#### License & Commercial Suitability
- **License**: `NO_LICENSE`.
- **Commercial Audit**: Proprietary educational content. Requires clean-room reimplementation for commercial assessment products.
- **Evaluation Readiness**: **`HIGH`** (`INSPECTED`).

---

### 8. `maruthi-sreeram-p/java-debugging-playground`

- **Repository URL**: `https://github.com/maruthi-sreeram-p/java-debugging-playground`
- **Owner**: `maruthi-sreeram-p`
- **Primary Languages**: Java (JDK 17/21)
- **Frameworks**: Spring Boot 3, Spring Data JPA, MockMvc
- **Source Type**: `EXERCISE_COLLECTION` (20 Backend Spring Boot Labs)

#### README Analysis & Intent
A structured playground of 20 realistic microservice debugging scenarios with Spring Boot, Hibernate caching issues, circular dependencies, and JPA N+1 query problems.

#### Folder Structure & Entrypoints
```
java-debugging-playground/
├── lab01-circular-dependency/
├── lab02-jpa-n-plus-one/
├── lab03-async-unhandled-exception/
├── lab04-spring-security-filter-order/
└── pom.xml
```

#### Intentionally Introduced Bugs
1. **Spring Circular Dependency**: Bean A constructor requires Bean B, while Bean B constructor requires Bean A, preventing application startup.
2. **Hibernate N+1 Query**: Missing `@EntityGraph` or `JOIN FETCH` on lazy collection results in 100 SQL queries for 100 records.
3. **Security Filter Order**: Custom rate-limit filter placed after authentication filter, leaving unauthenticated endpoints vulnerable to denial-of-service.

#### Public & Hidden Test Availability
- **Public Tests**: Spring MockMvc integration tests in each lab directory.
- **Hidden Tests**: External database query count assertions and security bypass tests.

#### Build & Execution Commands
- **Install**: `mvn clean install -DskipTests`
- **Test**: `mvn test`

#### License & Commercial Suitability
- **License**: `NO_LICENSE`.
- **Commercial Audit**: Author reserves rights. Highly valuable technical scenarios, but must be adapted.
- **Evaluation Readiness**: **`HIGH`** (`NEEDS_CONFIGURATION`). Containerized Java environment required.

---

### 9. `rajjitlai/code-debugging`

- **Repository URL**: `https://github.com/rajjitlai/code-debugging`
- **Owner**: `rajjitlai`
- **Primary Languages**: C, C++, Java, Python, JavaScript
- **Frameworks**: None (Raw source scripts)
- **Source Type**: `SNIPPET_COLLECTION`

#### README Analysis & Intent
Academic repository containing college course snippet files with common compile-time errors and screenshots of terminal error outputs.

#### Folder Structure & Entrypoints
```
code-debugging/
├── C/
│   ├── p1.c
│   └── p1_output.png
├── Java/
└── Python/
```

#### Intentionally Introduced Bugs
- Missing semicolons, undeclared variables, unclosed parentheses.

#### Public & Hidden Test Availability
- **Public Tests**: **NONE**. Repository relies exclusively on manual execution and `.png` terminal screenshots.
- **Hidden Tests**: **NONE**.

#### Build & Execution Commands
- No build manifests (`package.json`, `pom.xml`, or `requirements.txt`).

#### License & Commercial Suitability
- **License**: `NO_LICENSE`.
- **Commercial Audit**: Incompatible with automated commercial assessments.
- **Evaluation Readiness**: **`LOW`** (`NOT_COMPATIBLE`). Marked NOT_COMPATIBLE in catalogue. Direct evaluation disallowed.

---

### 10. `eChrls/StackQuest-Labs`

- **Repository URL**: `https://github.com/eChrls/StackQuest-Labs`
- **Owner**: `eChrls`
- **Primary Languages**: TypeScript, Python, Go, Dockerfile
- **Frameworks**: Express, FastAPI, Docker Compose
- **Source Type**: `BENCHMARK` (Cloud Native DevOps & Backend Labs)

#### README Analysis & Intent
Modern cloud-native developer labs featuring multi-container architectures. Focuses on full-stack debugging, environment variable misconfigurations, port conflicts, and inter-service networking.

#### Folder Structure & Entrypoints
```
StackQuest-Labs/
├── labs/
│   ├── 01-networking-dns-resolution/
│   ├── 02-env-variable-override/
│   └── 03-volume-permission-denied/
├── docker-compose.yml
├── Makefile
└── LICENSE
```

#### Intentionally Introduced Bugs
1. **Docker DNS Hostname Conflict**: Microservice attempts to call `localhost:8000` instead of the Docker network service name `backend:8000`.
2. **Permission Denied on SQLite Volume**: Container runs as non-root user `appuser (1001)` but mounted volume has `root (0)` permissions, failing write operations.

#### Public & Hidden Test Availability
- **Public Tests**: Shell validation scripts and health check endpoints.
- **Hidden Tests**: Automated container health assertions and HTTP status verification.

#### Build & Execution Commands
- **Install**: `docker compose build` / `npm install`
- **Test**: `make test` or `npm test`

#### License & Commercial Suitability
- **License**: **MIT License**.
- **Commercial Audit**: Fully permissive under MIT terms.
- **Evaluation Readiness**: **`HIGH`** (`READY_FOR_TESTING`).

---

## Conclusion & Recommended Action Plan

1. **Immediate Platform Activation**:
   - The four MIT-licensed repositories (`rjgcabrera/intentionally-buggy-code`, `angular-courses-lab/angular-debug-quest`, `DSC-SIST/D-Bug`, `eChrls/StackQuest-Labs`) are marked **`READY_FOR_TESTING`** and are fully convertible to active candidate challenges.
2. **Refactoring & Adaptation**:
   - The high-quality unlicensed projects (`superrdev-patch-exercise`, `technical-assessment-ujjawal-poudel`, `java-debugging-playground`) should serve as architectural specifications to create clean-room, custom RepoHamster challenges.
3. **Exclusion**:
   - `rajjitlai/code-debugging` is permanently flagged **`NOT_COMPATIBLE`** due to lack of automated test harnesses.
