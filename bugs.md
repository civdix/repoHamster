# 🐹 RepoHamster: Comprehensive Bug Catalog & Test Case Specification

This document provides a complete reference of all bugs, public test suites, and authoritative hidden evaluation test cases configured in RepoHamster.

---

## 1. Active Primary Challenge: `Still & Form` (Commerce API & React Storefront)

- **Repository**: [`https://github.com/repohamster/Still-Form`](https://github.com/repohamster/Still-Form)
- **Base Branch**: `main`
- **Tech Stack**: React 19, Express 5, Vite 6, Vitest, React Testing Library, jsdom, Supertest
- **Test Runner Command**: `npm test`
- **Passing Threshold**: 100%

### Problem Overview
`Still & Form` is a modern home-goods storefront. It contains three deliberate, production-grade flaws in its commerce logic:
1. Non-atomic in-memory cart decrement leading to race conditions and negative inventory quantities.
2. Sales tax calculation & tiered discount threshold boundary bugs.
3. Order checkout lack of idempotency allowing duplicate order creation on rapid retries.

---

### Public Test Suites (Visible to Candidate in Workspace)
Candidates can run these locally in the terminal via `npm test` (or targeted scripts):

| Test Suite File | Test Name | Purpose / Assertion | Expected vs. Actual |
| :--- | :--- | :--- | :--- |
| `client/src/tests/format.test.js` | `formatCurrency handles cents correctly` | Verifies integer cent values are formatted to USD currency strings (e.g. `2499` ➔ `"$24.99"`). | **Actual**: Handles cents correctly. Passes out of the box. |
| `client/src/tests/format.test.js` | `formatCurrency handles zero & negative amounts` | Tests edge cases like `$0.00` and `-$5.00`. | **Actual**: Passes out of the box. |
| `client/src/tests/storefront.test.jsx` | `storefront renders product catalog` | Asserts product listing cards and price tags render from initial state. | **Actual**: Passes. |
| `client/src/tests/storefront.test.jsx` | `cart item counter updates on add` | Asserts UI badge increments when "Add to Cart" is clicked. | **Actual**: Passes. |
| `server/tests/api.test.js` | `GET /api/products returns catalog array` | Verifies product catalog endpoint returns active SKU list. | **Actual**: Passes with HTTP 200. |
| `server/tests/api.test.js` | `POST /api/cart item addition` | Adds item to cart session and verifies item quantity in response. | **Actual**: Passes for single item additions. |
| `server/tests/api.test.js` | `POST /api/cart item decrement boundary` | **FAILING TEST**: Decrements cart item quantity. | **Actual Failure**: Rapid decrements allow quantity to drop to `0` or negative without removing the item or enforcing $\ge 1$. |
| `server/tests/business.test.js` | `calculates subtotal with promo code` | **FAILING TEST**: Tests tiered coupon threshold logic (e.g. `SUMMER20` on orders over $50). | **Actual Failure**: Discount evaluates against gross total before tax instead of net taxable subtotal, causing boundary errors. |
| `server/tests/business.test.js` | `calculates state sales tax rules` | Verifies tax rate lookups for configured states. | **Actual**: Passes for basic states. |

---

### Authoritative Hidden Test Suites (Executed Strictly in Isolated Sandbox)
These test cases are never revealed to the candidate in the repository. They verify robustness and boundary conditions:

```
[ Isolated Test Sandbox ]
    ├── HIDDEN-TC-01: Atomic Cart Item Modification (35 pts)
    ├── HIDDEN-TC-02: Tax & Promotional Invariant (35 pts)
    └── HIDDEN-TC-03: Order Checkout Idempotency (30 pts)
```

#### `HIDDEN-TC-01`: Atomic Cart Item Modification and Quantity Boundary
- **Points**: 35 / 100
- **Runner Command**: `npm test`
- **What It Verifies**:
  - Simulates 10 concurrent asynchronous decrement requests using `Promise.all()` on a cart item with stock = 2.
  - Verifies cart item quantity **cannot drop below 1** or become negative.
  - Verifies that decrementing past 1 either cleanly removes the item from the active cart or returns HTTP 400 Bad Request.
- **Pass Criteria**: `cart.items.every(i => i.qty >= 1)` and no race condition deadlocks.

#### `HIDDEN-TC-02`: Tax Calculation & Promotional Discount Invariant
- **Points**: 35 / 100
- **Runner Command**: `npm test`
- **What It Verifies**:
  - Validates discount calculation against randomized floating-point basket totals with odd cent amounts (e.g. `$49.99`, `$50.00`, `$50.01`).
  - Asserts that promotional discount thresholds apply strictly to qualifying items before tax, and sales tax is computed on the discounted taxable subtotal.
  - Asserts that rounding follows standard half-up cent rules (`Math.round`), avoiding 1-cent drift.
- **Pass Criteria**: Final transaction `total === Math.round(subtotal - discount + tax)` across 50 boundary vectors.

#### `HIDDEN-TC-03`: Order Checkout Idempotency & State Transition
- **Points**: 30 / 100
- **Runner Command**: `npm test`
- **What It Verifies**:
  - Dispatches parallel checkout requests with identical cart tokens and customer session headers.
  - Asserts that only **one single order record** is created in the orders collection.
  - Asserts that secondary concurrent requests receive the existing confirmed order ID or HTTP 409/422 without duplicate billing or state corruption.
  - Asserts the cart is cleanly reset to empty upon successful order creation.
- **Pass Criteria**: Exactly 1 order in confirmed state; active cart emptied; zero orphaned sessions.

---

## 2. Reference Catalog: Test Cases for All 13 Challenge Repositories

Below are the test case specifications for all 13 challenge modules in the RepoHamster curriculum:

### 1. `mock-01-returns-desk` (Python / React & Django)
- **Repository**: `ai-assisted-oa-practice/mock-01-returns-desk`
- **Public Tests**:
  - `test_single_item_return_calculation`: Validates standard item return pricing.
  - `test_voucher_creation_endpoint`: Checks HTTP 201 on RMA voucher generation.
- **Hidden Test Spec** (`pytest tests/test_hidden.py`):
  - `HIDDEN-TC-01`: **Concurrent RMA Voucher Creation Stress Test** (35 pts) - Parallel RMA requests for same order must return original voucher idempotently.
  - `HIDDEN-TC-02`: **Negative Restocking Fee Boundary Invariance** (35 pts) - Net refund cannot exceed initial invoice price or become negative.
  - `HIDDEN-TC-03`: **State Mutation Rollback On Service Exception** (30 pts) - Database transaction rolls back if payment gateway emits 500.

---

### 2. `mock-02-leave-desk` (Python / React & Django)
- **Repository**: `ai-assisted-oa-practice/mock-02-leave-desk`
- **Public Tests**:
  - `test_single_pto_booking`: Single day PTO deduction from allowance.
  - `test_leave_balance_display`: React component balance display.
- **Hidden Test Spec** (`pytest tests/test_hidden.py`):
  - `HIDDEN-TC-01`: **Overlapping Date Range Invariant Verification** (35 pts) - Rejects overlapping vacation dates across different request IDs.
  - `HIDDEN-TC-02`: **Zero & Negative PTO Accrual Bounds** (35 pts) - Prevents booking more days than remaining accrued balance.
  - `HIDDEN-TC-03`: **Timezone Boundary Leap Year Invariant** (30 pts) - Normalizes UTC timestamps across daylight saving transitions.

---

### 3. `mock-03-stock-count-desk` (Python / React & Django)
- **Repository**: `ai-assisted-oa-practice/mock-03-stock-count-desk`
- **Public Tests**:
  - `test_warehouse_sku_count`: Basic increment/decrement of warehouse inventory counts.
- **Hidden Test Spec** (`pytest tests/test_hidden.py`):
  - `HIDDEN-TC-01`: **Distributed Mutex Lock on SKU Adjustments** (35 pts) - Rejects concurrent writes without acquired lock token.
  - `HIDDEN-TC-02`: **Negative Stock Floor Enforcer** (35 pts) - Rejects decrements below 0 stock.
  - `HIDDEN-TC-03`: **Audit Log Discrepancy Tracking** (30 pts) - Validates audit ledger entry for every inventory adjustment.

---

### 4. `mock-04-help-desk` (Python / React & Django)
- **Repository**: `ai-assisted-oa-practice/mock-04-help-desk`
- **Public Tests**:
  - `test_ticket_creation`: Creates customer support ticket with priority.
- **Hidden Test Spec** (`pytest tests/test_hidden.py`):
  - `HIDDEN-TC-01`: **SLA Breach Auto-Escalation State Machine** (35 pts) - Validates state transition to ESCALATED when timestamp exceeds SLA window.
  - `HIDDEN-TC-02`: **Agent Assignment Mutual Exclusion** (35 pts) - Prevents assigning single ticket to two agents simultaneously.
  - `HIDDEN-TC-03`: **XSS / HTML Sanitization on Ticket Notes** (30 pts) - Sanitizes `<script>` and `javascript:` in notes.

---

### 5. `mock-05-equipment-loan-desk` (Python / React & Django)
- **Repository**: `ai-assisted-oa-practice/mock-05-equipment-loan-desk`
- **Public Tests**:
  - `test_asset_loan_checkout`: Checks out laptop/monitor to employee.
- **Hidden Test Spec** (`pytest tests/test_hidden.py`):
  - `HIDDEN-TC-01`: **Concurrent Loan Allocation Prevention** (35 pts) - Parallel checkout requests for same serial number.
  - `HIDDEN-TC-02`: **Past-Date Return Constraint** (35 pts) - Expected return date cannot be in the past.
  - `HIDDEN-TC-03`: **Asset Deprecation Invariant Calculation** (30 pts) - Depreciation formula matches linear salvage schedule.

---

### 6. `debugging_interview` (Python / React & Flask)
- **Repository**: `Cosmon-Inc/debugging_interview`
- **Public Tests**:
  - `test_user_registration`: Basic user signup and JWT issuance.
- **Hidden Test Spec** (`pytest tests/`):
  - `HIDDEN-TC-01`: **SQL Injection & ORM Query Parameterization** (35 pts) - Injection payloads in search query must not bypass auth.
  - `HIDDEN-TC-02`: **JWT Token Expiration & UTC Timestamping** (35 pts) - Expired tokens return HTTP 401 strictly.
  - `HIDDEN-TC-03`: **CORS Whitelist Origin Reflection** (30 pts) - Prevents unauthorized origins from accessing session cookies.

---

### 7. `mock-08-work-order-desk` (Java / Spring Boot & Thymeleaf/React)
- **Repository**: `ai-assisted-oa-practice/mock-08-work-order-desk`
- **Public Tests**:
  - `testWorkOrderCreation`: Standard JPA save and retrieval.
- **Hidden Test Spec** (`mvn clean test -B`):
  - `HIDDEN-TC-01`: **Optimistic Locking (@Version) StaleObjectStateException** (35 pts) - Verifies concurrent modification throws Conflict and retries safely.
  - `HIDDEN-TC-02`: **Budget Allocation Overflow Prevention** (35 pts) - Total parts cost cannot exceed work order budget cap.
  - `HIDDEN-TC-03`: **Circular Dependency in Subtask DAG** (30 pts) - Rejects cyclic task dependencies (`Task A -> Task B -> Task A`).

---

### 8. `mock-06-shift-roster-desk` (C++ / GoogleTest)
- **Repository**: `ai-assisted-oa-practice/mock-06-shift-roster-desk`
- **Public Tests**:
  - `RosterTest.AddWorker`: Inserts worker into schedule.
- **Hidden Test Spec** (`ctest --output-on-failure`):
  - `HIDDEN-TC-01`: **Memory Leak Free Execution (Valgrind/ASan)** (35 pts) - Zero memory leaks or dangling pointers during roster rebuilds.
  - `HIDDEN-TC-02`: **Mandatory 11-Hour Rest Period Constraint** (35 pts) - Prevents scheduling shift within 11 hours of previous shift.
  - `HIDDEN-TC-03`: **Thread-Safe Roster Mutex Lock** (30 pts) - 16 concurrent threads updating schedule without data corruption.

---

### 9. `ex01-broken-fetch` (JavaScript / Node.js & React)
- **Repository**: `paulchrisycj/Debugging-Practice-B16/ex01-broken-fetch`
- **Public Tests**:
  - `fetchUser handles 200 OK`: Asserts parsed JSON return.
- **Hidden Test Spec** (`npm test`):
  - `HIDDEN-TC-01`: **HTTP 404 & 500 Error Response Handling** (35 pts) - Does not throw unhandled promise rejection on non-200 status.
  - `HIDDEN-TC-02`: **Network AbortController Timeout** (35 pts) - Aborts dangling requests after 5000ms.
  - `HIDDEN-TC-03`: **Empty Body / Malformed JSON Resilience** (30 pts) - Graceful fallback on empty responses.

---

### 10. `ex02-state-traps` (TypeScript / React)
- **Repository**: `paulchrisycj/Debugging-Practice-B16/ex02-state-traps`
- **Public Tests**:
  - `counter renders initial zero`: Basic render test.
- **Hidden Test Spec** (`npm test`):
  - `HIDDEN-TC-01`: **Stale State Closure in setTimeout** (35 pts) - Functional state updater (`setCount(prev => prev + 1)`) prevents dropped increments.
  - `HIDDEN-TC-02`: **Batched Mutation Invariant** (35 pts) - 5 rapid clicks result in count = 5.
  - `HIDDEN-TC-03`: **Component Unmount Memory Leak Guard** (30 pts) - Cancels timers on unmount.

---

### 11. `ex03-effects-races` (TypeScript / React)
- **Repository**: `paulchrisycj/Debugging-Practice-B16/ex03-effects-races`
- **Public Tests**:
  - `renders search query input`: UI input check.
- **Hidden Test Spec** (`npm test`):
  - `HIDDEN-TC-01`: **Out-of-Order Promise Cancellation** (35 pts) - Ensures slower previous query response does not overwrite faster latest query response.
  - `HIDDEN-TC-02`: **Debounced Input Propagation** (35 pts) - Debounces rapid keystrokes to single network request.
  - `HIDDEN-TC-03`: **Race Condition Race Window Stress Test** (30 pts) - Validates active request flag cleanup.

---

### 12. `ex04-express-middleware` (JavaScript / Express 5)
- **Repository**: `paulchrisycj/Debugging-Practice-B16/ex04-express-middleware`
- **Public Tests**:
  - `GET /health returns 200`: Basic health check.
- **Hidden Test Spec** (`npm test`):
  - `HIDDEN-TC-01`: **Unhandled Error in Async Middleware** (35 pts) - Express 5 error handling catches rejected promises without crashing process.
  - `HIDDEN-TC-02`: **Next() Multiple Invocation Guard** (35 pts) - Prevents calling `next()` after headers are sent (`ERR_HTTP_HEADERS_SENT`).
  - `HIDDEN-TC-03`: **Rate Limiter IP Extraction Behind Proxy** (30 pts) - Evaluates `X-Forwarded-For` header securely.

---

### 13. `mock-07-event-signup-desk` (Node.js & Express)
- **Repository**: `ai-assisted-oa-practice/mock-07-event-signup-desk`
- **Public Tests**:
  - `test_event_registration`: Standard attendee signup.
- **Hidden Test Spec** (`npm test`):
  - `HIDDEN-TC-01`: **Capacity Overflow Prevention Under Concurrency** (35 pts) - 20 parallel registrations for 5 seats must register exactly 5 attendees and 15 waitlisted.
  - `HIDDEN-TC-02`: **Duplicate Email Unique Constraint** (35 pts) - Prevents duplicate signups for same attendee.
  - `HIDDEN-TC-03`: **Waitlist Promotion Transaction** (30 pts) - Canceling registration promotes top waitlist attendee atomically.
