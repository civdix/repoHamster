export interface AssignmentSeed {
  slug: string;
  title: string;
  description: string;
  repoUrl: string;
  baseBranch: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: string;
  framework: string;
  estimatedTimeMinutes: number;
  instructions: string;
  publicTestInfo: string;
  hiddenTestSpec: {
    runnerCommand: string;
    testCases: Array<{
      id: string;
      name: string;
      description: string;
      points: number;
    }>;
  };
  passingThresholdPercent: number;
  aiRequestLimit: number;
  aiTokenLimit: number;
}

export const PREDEFINED_ASSIGNMENTS: AssignmentSeed[] = [
  // 1. Python (React + Django)
  {
    slug: 'mock-01-returns-desk',
    title: 'Returns Desk: Django REST & React Order Return Validation',
    description:
      'Debug a multi-step customer return authorization workflow in a React & Django service where race conditions allow duplicate refund vouchers and item condition validation fails.',
    repoUrl: 'https://github.com/Anirudhpahwa/ai-assisted-oa-practice/tree/main/mock-01-returns-desk',
    baseBranch: 'main',
    difficulty: 'INTERMEDIATE',
    language: 'Python & TypeScript',
    framework: 'React & Django',
    estimatedTimeMinutes: 45,
    instructions: `### Problem Description

In our e-commerce returns processing desk, customer support handles multi-item RMA (Return Merchandise Authorization) requests. Two critical defects are causing incorrect refunds:

1. **Duplicate Refund Voucher Generation (Concurrency)**:
   When a customer clicks "Submit Return" rapidly or concurrent requests arrive for the same return ID, the Django backend creates duplicate credit vouchers because the voucher generation routine does not enforce atomic verification or unique idempotency keys.

2. **Item Condition Discount Calculation Flaw**:
   In the React frontend, item condition deductions (Opened, Damaged, Restocking Fee) calculate with inverted percentage weights, causing refunds to exceed original invoice totals.

### Expected Behavior
- Return submissions must be strictly idempotent. Repeated submission attempts must return the existing voucher record with HTTP 200.
- Condition discounts must be subtracted from the original item price, never exceeding the net transaction value.
- Passes all Django unit tests and React component verification tests.

### Target Files to Investigate
- \`backend/returns/services.py\`
- \`backend/returns/views.py\`
- \`frontend/src/components/ReturnForm.tsx\`

### Testing
- Run backend tests: \`pytest\` or \`python manage.py test\`
- Run frontend tests: \`npm test\`
- Public and hidden test cases must pass for completion.`,
    publicTestInfo: '2 Public Tests: Single item return calculation and voucher creation.',
    hiddenTestSpec: {
      runnerCommand: 'pytest tests/test_hidden.py',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Concurrent RMA Voucher Creation Stress Test',
          description: 'Simulates parallel submissions for the same order ID to ensure idempotency.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Negative Restocking Fee Boundary Invariance',
          description: 'Ensures net refund calculation cannot exceed initial charge or drop below zero.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'State Mutation Rollback On Service Exception',
          description: 'Verifies database rollback if payment gateway communication fails.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'mock-02-leave-desk',
    title: 'Leave Desk: Employee Paid Time Off Balance & Overlap Validator',
    description:
      'Fix an employee PTO reservation leak in Django where overlapping leave date ranges pass validation, and React calendar fails to render pending approvals.',
    repoUrl: 'https://github.com/Anirudhpahwa/ai-assisted-oa-practice/tree/main/mock-02-leave-desk',
    baseBranch: 'main',
    difficulty: 'BEGINNER',
    language: 'Python & TypeScript',
    framework: 'React & Django',
    estimatedTimeMinutes: 35,
    instructions: `### Problem Description

The HR Leave Desk application tracks employee PTO requests. Users report two critical problems:

1. **Overlapping Leave Date Acceptance**:
   When employees request leave covering dates already booked or pending approval, the Django backend validation passes because the date comparison uses an exclusive rather than inclusive overlap query (\`start_date > existing_end\` instead of range overlap).

2. **Negative Balance Over-Deduction**:
   Employees can request more days than their available balance due to an unhandled optimistic balance deduction race condition.

### Expected Behavior
- Any date overlap with existing APPROVED or PENDING leave must be rejected with HTTP 400 \`OVERLAPPING_LEAVE_DATES\`.
- Leave requests exceeding the employee's current accrued days must be blocked.
- React calendar view must properly reflect pending status with amber badge indicators.

### Target Files to Investigate
- \`backend/leave/validators.py\`
- \`backend/leave/models.py\`
- \`frontend/src/components/CalendarView.tsx\`

### Testing
- Backend: \`pytest\`
- Frontend: \`npm test\`
- All tests must pass.`,
    publicTestInfo: '2 Public Tests: Single leave creation and balance inquiry.',
    hiddenTestSpec: {
      runnerCommand: 'pytest tests/test_hidden.py',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Inclusive Date Range Overlap Boundary Matrix',
          description: 'Tests partial, enclosed, and identical date range overlap edge cases.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Leap Year & Public Holiday Exclusion Verification',
          description: 'Verifies working day count excludes recognized company holidays.',
          points: 30,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Zero Balance Edge Case Rejection',
          description: 'Asserts employees with zero days accrued are prevented from booking PTO.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'mock-03-stock-count-desk',
    title: 'Stock Count Desk: Warehouse Inventory Reconciliation & Audit Sync',
    description:
      'Debug inventory drift between physical warehouse scans and warehouse ledger records caused by unhandled batch transactions and React barcode scanner state debounce.',
    repoUrl: 'https://github.com/Anirudhpahwa/ai-assisted-oa-practice/tree/main/mock-03-stock-count-desk',
    baseBranch: 'main',
    difficulty: 'INTERMEDIATE',
    language: 'Python & TypeScript',
    framework: 'React & Django',
    estimatedTimeMinutes: 40,
    instructions: `### Problem Description

The warehouse cycle count system compares physical barcode audit scans against ERP inventory totals:

1. **Batch Scan Transaction Partial Failure**:
   During bulk count synchronization, if a single item code is unrecognized, previous valid scan increments are committed without audit rollback, corrupting the inventory ledger.

2. **Barcode Scanner Double-Event Debounce**:
   Hardware barcode scanners fire rapid newline events that trigger duplicate counter increments in the React state due to an unthrottled \`onKeyDown\` listener.

### Expected Behavior
- Batch counts must execute in an atomic transaction (\`transaction.atomic()\`). Any invalid SKU must roll back the entire batch with detailed error reporting.
- Scanner inputs must be debounced by 250ms to guarantee single-increment semantics.

### Target Files to Investigate
- \`backend/inventory/views.py\`
- \`backend/inventory/services.py\`
- \`frontend/src/hooks/useBarcodeScanner.ts\`

### Testing
- Run test suite: \`pytest\` and \`npm test\``,
    publicTestInfo: '2 Public Tests: Single barcode lookup and batch reconciliation.',
    hiddenTestSpec: {
      runnerCommand: 'pytest tests/test_hidden.py',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Batch Scan Atomic Rollback On Invalid SKU',
          description: 'Asserts zero records committed when batch contains malformed identifiers.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Concurrent Warehouse Audit Thread Contention',
          description: 'Simulates 50 simultaneous counting terminals scanning identical SKUs.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Physical vs Logical Ledger Variance Calculation',
          description: 'Validates variance percentage formula down to 2 decimal places.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'mock-04-help-desk',
    title: 'Help Desk: Support Ticket SLA Escalation & Priority Queue',
    description:
      'Resolve priority escalation starvation in a customer support ticket engine where urgent tickets get skipped and WebSocket updates fail to notify online support agents.',
    repoUrl: 'https://github.com/Anirudhpahwa/ai-assisted-oa-practice/tree/main/mock-04-help-desk',
    baseBranch: 'main',
    difficulty: 'ADVANCED',
    language: 'Python & TypeScript',
    framework: 'React & Django',
    estimatedTimeMinutes: 50,
    instructions: `### Problem Description

The IT Help Desk engine manages customer incident ticketing and automated tier escalations:

1. **Priority Inversion & Starvation**:
   The automated worker queue prioritizes newly created low-priority tickets over aging high-priority tickets due to an inverted sorting key in the Redis priority queue pop routine.

2. **SLA Countdown Timer Desynchronization**:
   In the React ticket dashboard, the SLA breach countdown timer calculates client-side elapsed time without normalizing against server UTC timestamps, causing false breach alerts across timezones.

### Expected Behavior
- Priority queue must order tickets by \`(priority_weight * age_minutes)\` descending to ensure zero starvation.
- SLA countdown must strictly derive from server UTC breach deadlines.

### Target Files to Investigate
- \`backend/tickets/queue.py\`
- \`backend/tickets/tasks.py\`
- \`frontend/src/components/TicketTimer.tsx\`

### Testing
- Run backend & frontend test suites. All tests must pass.`,
    publicTestInfo: '2 Public Tests: Ticket creation and basic SLA timer computation.',
    hiddenTestSpec: {
      runnerCommand: 'pytest tests/test_hidden.py',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Urgent Ticket Anti-Starvation Verification',
          description: 'Ensures P1 tickets are dispatched ahead of 500 queued P3 items.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'UTC Timezone Invariant SLA Calculation',
          description: 'Tests timer consistency across UTC-8, UTC+0, and UTC+5:30 offsets.',
          points: 30,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Agent Re-assignment Queue Integrity',
          description: 'Verifies unassigned tickets return cleanly to available pool upon agent disconnect.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'mock-05-equipment-loan-desk',
    title: 'Equipment Loan Desk: Hardware Asset Checkout & Return Tracking',
    description:
      'Fix a double-checkout vulnerability in an IT hardware asset tracker where simultaneous device checkouts bypass serial number reservation constraints.',
    repoUrl: 'https://github.com/Anirudhpahwa/ai-assisted-oa-practice/tree/main/mock-05-equipment-loan-desk',
    baseBranch: 'main',
    difficulty: 'INTERMEDIATE',
    language: 'Python & TypeScript',
    framework: 'React & Django',
    estimatedTimeMinutes: 40,
    instructions: `### Problem Description

The Equipment Loan Desk manages enterprise laptops, monitors, and testing devices:

1. **Hardware Double-Allocation Race**:
   When two team members attempt to check out the same laptop serial number at the same time, both requests succeed because the status check (\`status == AVAILABLE\`) occurs before acquiring an exclusive row lock.

2. **Overdue Penalty Grace Period Calculation**:
   The return validator charges overdue penalties for weekend returns when the loan agreement specifies business-day grace periods.

### Expected Behavior
- Checkouts must acquire an exclusive database lock using \`select_for_update()\` inside an atomic transaction.
- Business days only must be counted towards loan duration and penalty calculations.

### Target Files to Investigate
- \`backend/assets/services.py\`
- \`backend/assets/models.py\`
- \`frontend/src/components/CheckoutModal.tsx\`

### Testing
- Run test runner: \`pytest\``,
    publicTestInfo: '2 Public Tests: Asset search and standard single-device checkout.',
    hiddenTestSpec: {
      runnerCommand: 'pytest tests/test_hidden.py',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Concurrent 50-Request Serial Allocation Contention',
          description: 'Verifies exactly 1 checkout succeeds and 49 receive 409 Conflict.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Business Day Grace Period Boundary Test',
          description: 'Tests returns spanning Saturday/Sunday without penalty charges.',
          points: 30,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Asset Status Lifecycle Transition Guard',
          description: 'Ensures decommissioned and in-repair assets cannot be requested.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  // 2. Python (React and Flask)
  {
    slug: 'debugging-interview-cosmon',
    title: 'Cosmon Full-Stack: Flask API & React Interactive State Bug Hunt',
    description:
      'Diagnose and repair asynchronous data synchronization, CORS authentication middleware headers, and broken state propagation in an interactive Flask & React interview application.',
    repoUrl: 'https://github.com/Cosmon-Inc/debugging_interview',
    baseBranch: 'main',
    difficulty: 'INTERMEDIATE',
    language: 'Python & JavaScript',
    framework: 'React & Flask',
    estimatedTimeMinutes: 45,
    instructions: `### Problem Description

The Cosmon interview debugging codebase contains intentional defects distributed across both the Flask API backend and the React web interface:

1. **CORS & Cookie Session Middleware Header Mismatch**:
   The Flask server rejects authenticated session requests from the React development server due to improper \`Access-Control-Allow-Credentials\` configuration and mismatched \`SameSite\` cookie policies.

2. **Uncaught Payload Validation Exception**:
   API endpoints fail with unhandled 500 Internal Server Errors when unexpected JSON keys or empty arrays are submitted.

3. **React Infinite Re-render Loop**:
   An un-memoized object reference inside a \`useEffect\` dependency array triggers continuous re-renders, freezing the browser tab under user interaction.

### Expected Behavior
- CORS middleware must properly whitelist credentials and allowed frontend origins.
- All API routes must validate payload schemas gracefully and return HTTP 400 for bad input.
- React components must render cleanly without unneeded re-render cycles.

### Target Files to Investigate
- \`server/app.py\`
- \`client/src/App.js\`
- \`client/src/components/\`

### Testing
- Run test suites for both client and server.`,
    publicTestInfo: '2 Public Tests: API health check and initial React component mount.',
    hiddenTestSpec: {
      runnerCommand: 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'CORS Preflight & Session Cookie Security Check',
          description: 'Validates OPTIONS preflight response headers and credential permissions.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Malformed JSON Payload Graceful 400 Handling',
          description: 'Ensures server returns sanitized JSON error bodies rather than tracebacks.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'React Render Count Stability Assertion',
          description: 'Verifies component renders fewer than 3 times on initial load.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  // 3. SpringBoot (Java)
  {
    slug: 'mock-08-work-order-desk',
    title: 'Work Order Desk: Spring Boot Facility Maintenance & Resource Allocation',
    description:
      'Fix transactional rollback failures and connection pool starvation in a Spring Boot JPA maintenance scheduling microservice under peak submission load.',
    repoUrl: 'https://github.com/Anirudhpahwa/ai-assisted-oa-practice/tree/main/mock-08-work-order-desk',
    baseBranch: 'main',
    difficulty: 'ADVANCED',
    language: 'Java',
    framework: 'Spring Boot & Hibernate',
    estimatedTimeMinutes: 50,
    instructions: `### Problem Description

The Facility Maintenance Work Order service processes work requests, technician dispatching, and spare parts inventory:

1. **Transactional Rollback Failure**:
   In \`WorkOrderService.java\`, when an inventory reservation fails due to stock shortage, the work order entity remains committed in the database because the method catches generic \`Exception\` without rolling back the transaction.

2. **HikariCP Connection Pool Exhaustion**:
   A repository query streaming large historical work orders does not close the database cursor, leaking database connections and causing HTTP 500 errors after 20 sequential requests.

### Expected Behavior
- Any failure during parts reservation must roll back the work order creation transaction completely.
- Streaming database queries must use try-with-resources to guarantee cursor and connection closure.

### Target Files to Investigate
- \`src/main/java/com/facility/workorder/service/WorkOrderService.java\`
- \`src/main/java/com/facility/workorder/repository/WorkOrderRepository.java\`

### Testing
- Run Maven tests: \`mvn test\``,
    publicTestInfo: '2 Public Tests: Single work order creation and technician assignment.',
    hiddenTestSpec: {
      runnerCommand: 'mvn test -Dtest=HiddenTestSuite',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Spring @Transactional Rollback Verification On Error',
          description: 'Asserts no orphan work orders exist when spare parts inventory throws exception.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'HikariCP 50-Request Connection Leak Assertion',
          description: 'Validates active connection pool returns to zero idle leaks.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Optimistic Locking (@Version) Conflict Recovery',
          description: 'Tests concurrent status updates with proper retry handling.',
          points: 25,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  // 4. C++
  {
    slug: 'mock-06-shift-roster-desk',
    title: 'Shift Roster Desk: C++ Scheduling Engine & Memory Safety Audit',
    description:
      'Debug undefined behavior, heap use-after-free, and integer overflow in a high-performance C++ employee shift permutation and roster optimization engine.',
    repoUrl: 'https://github.com/Anirudhpahwa/ai-assisted-oa-practice/tree/main/mock-06-shift-roster-desk',
    baseBranch: 'main',
    difficulty: 'ADVANCED',
    language: 'C++',
    framework: 'C++20 & CMake',
    estimatedTimeMinutes: 55,
    instructions: `### Problem Description

The Shift Roster solver generates 24/7 staff schedules while optimizing constraint satisfaction:

1. **Use-After-Free in Shift Permutation Backtracking**:
   In \`roster_solver.cpp\`, a worker pointer is stored in an internal solution vector after its owning container has been resized, causing a dangling pointer and segmentation fault under AddressSanitizer.

2. **Integer Overflow in Accumulated Rest Hours**:
   Accumulated shift rest minutes are stored in a signed 16-bit integer (\`int16_t\`), overflowing into negative values for full-month rosters and falsely violating minimum rest laws.

### Expected Behavior
- Roster engine must compile and run cleanly with \`-fsanitize=address,undefined\`.
- All integer accumulations must use 64-bit integer types (\`int64_t\`).
- Solver must produce valid rosters satisfying all legal working-hour constraints.

### Target Files to Investigate
- \`src/roster_solver.cpp\`
- \`src/constraints.cpp\`
- \`include/roster.h\`

### Testing
- Run test executable: \`ctest --verbose\` or \`./build/roster_tests\``,
    publicTestInfo: '2 Public Tests: Single-week shift generation and rest constraint check.',
    hiddenTestSpec: {
      runnerCommand: './build/hidden_tests',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'AddressSanitizer (ASan) Memory Cleanliness Run',
          description: 'Validates zero heap-use-after-free or buffer overflow errors.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Large 30-Day Shift Integer Overflow Verification',
          description: 'Tests accumulated rest calculation across 720 hours without numeric wrap.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Maximum Consecutive Work Hours Enforcement',
          description: 'Asserts no staff member is scheduled for more than 5 consecutive shifts.',
          points: 25,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  // 5. Node.js & React
  {
    slug: 'ex01-broken-fetch',
    title: 'Exercise 1: Broken Fetch & Network Error Recovery in React',
    description:
      'Fix unhandled asynchronous Promise rejections, missing abort controllers, and stale loading states in an API data-fetching React application.',
    repoUrl: 'https://github.com/paulchrisycj/Debugging-Practice-B16/tree/main/ex01-broken-fetch',
    baseBranch: 'main',
    difficulty: 'BEGINNER',
    language: 'JavaScript',
    framework: 'React & Node.js',
    estimatedTimeMinutes: 30,
    instructions: `### Problem Description

In this frontend exercise, a React application loads user records from a remote REST API:

1. **Unhandled HTTP 4xx/5xx Responses**:
   The fetch call treats HTTP 404 and 500 errors as successful responses because \`fetch()\` only rejects on network failure, displaying blank cards rather than informative error states.

2. **Memory Leak from In-Flight Request on Unmount**:
   If the user navigates away while a slow request is in flight, the resolution callback calls \`setState\` on an unmounted component, generating React console warnings.

### Expected Behavior
- Must check \`response.ok\` and throw a readable error if the server returns non-200 status codes.
- Must use \`AbortController\` to cancel pending requests when the component unmounts.
- Must display an error alert with a retry button on failure.

### Target Files to Investigate
- \`src/UserList.jsx\`
- \`src/api/users.js\`

### Testing
- Run: \`npm test\``,
    publicTestInfo: '2 Public Tests: Successful user fetch render and loading indicator.',
    hiddenTestSpec: {
      runnerCommand: 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'HTTP 500 Internal Error Graceful Handling',
          description: 'Verifies error banner displays and retry button correctly re-fetches.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'AbortController Unmount Teardown Check',
          description: 'Ensures fetch signal aborts upon rapid component unmount.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Empty Payload Array Null State Handling',
          description: 'Asserts proper empty state rendered when API returns empty collection.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'ex02-state-traps',
    title: 'Exercise 2: React State Traps & Asynchronous Batching Quirks',
    description:
      'Debug subtle bugs caused by direct state mutation, stale closure values inside callbacks, and unbatched state updates causing missed renders.',
    repoUrl: 'https://github.com/paulchrisycj/Debugging-Practice-B16/tree/main/ex02-state-traps',
    baseBranch: 'main',
    difficulty: 'BEGINNER',
    language: 'JavaScript',
    framework: 'React 18',
    estimatedTimeMinutes: 30,
    instructions: `### Problem Description

This exercise showcases common state management traps in modern React applications:

1. **Direct In-Place Array Mutation**:
   The item list handler executes \`items.push(newItem)\` followed by \`setItems(items)\`. Because the array reference has not changed, React skips reconciliation and the UI does not update.

2. **Stale Closure in Interval Callback**:
   A periodic score counter reads the initial value of \`count\` from component mount rather than using a functional updater (\`setCount(prev => prev + 1)\`), freezing the counter display at 1.

### Expected Behavior
- State updates must always create new object and array references (immutable spread \`[...items, newItem]\`).
- State updates relying on previous values must use functional updater callbacks.

### Target Files to Investigate
- \`src/Counter.jsx\`
- \`src/ItemList.jsx\`

### Testing
- Run: \`npm test\``,
    publicTestInfo: '2 Public Tests: Item add button and counter increment.',
    hiddenTestSpec: {
      runnerCommand: 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Immutable State Spread Verification',
          description: 'Asserts state reference changes on every item addition.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Timer Interval Closure Invariance Test',
          description: 'Verifies interval counter increments continuously over 5 ticks.',
          points: 35,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Batch State Updates Coherence Check',
          description: 'Ensures multiple sequential dispatches resolve accurately.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'ex03-effects-races',
    title: 'Exercise 3: useEffect Race Conditions & Cleanup Omissions',
    description:
      'Eliminate race conditions where out-of-order network responses overwrite newer user searches, and fix memory leaks from missing useEffect cleanup routines.',
    repoUrl: 'https://github.com/paulchrisycj/Debugging-Practice-B16/tree/main/ex03-effects-races',
    baseBranch: 'main',
    difficulty: 'INTERMEDIATE',
    language: 'TypeScript',
    framework: 'React & Hooks',
    estimatedTimeMinutes: 35,
    instructions: `### Problem Description

In a live search auto-suggest component:

1. **Out-of-Order Network Response Overwrite**:
   When a user types "cat" and then quickly types "catalog", the network request for "cat" takes 800ms while "catalog" resolves in 200ms. The older response for "cat" arrives last and overwrites the newer search results.

2. **Missing Resize Event Listener Cleanup**:
   A window resize listener registered in \`useEffect\` is never removed in a cleanup return function, causing memory consumption to grow with every tab change.

### Expected Behavior
- Must use an active cancellation flag or \`AbortController\` inside \`useEffect\` to discard stale async results.
- Must return a cleanup function from \`useEffect\` to remove event listeners.

### Target Files to Investigate
- \`src/SearchBox.tsx\`
- \`src/hooks/useWindowDimensions.ts\`

### Testing
- Run: \`npm test\``,
    publicTestInfo: '2 Public Tests: Search input change and window size calculation.',
    hiddenTestSpec: {
      runnerCommand: 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Slow Response Stale Overwrite Race Simulation',
          description: 'Simulates fast second query followed by delayed first query.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Window Event Listener Teardown Verification',
          description: 'Asserts window.removeEventListener is called on unmount.',
          points: 30,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Debounce Search Input Rate Limiting',
          description: 'Ensures keystrokes within 200ms trigger only one network request.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'ex04-express-middleware',
    title: 'Exercise 4: Express Middleware Error Propagation & Header Deadlocks',
    description:
      'Fix "Cannot set headers after they are sent to the client" errors, unhandled async errors in middleware chains, and hanging HTTP requests in Express.',
    repoUrl: 'https://github.com/paulchrisycj/Debugging-Practice-B16/tree/main/ex04-express-middleware',
    baseBranch: 'main',
    difficulty: 'INTERMEDIATE',
    language: 'JavaScript',
    framework: 'Node.js & Express',
    estimatedTimeMinutes: 40,
    instructions: `### Problem Description

An Express.js REST microservice crashes frequently in production with header errors:

1. **Duplicate Response Execution**:
   In authentication middleware, when an invalid token is detected, the code calls \`res.status(401).json(...)\` without a \`return\` statement. Execution continues down the chain and calls \`next()\`, resulting in a fatal \`ERR_HTTP_HEADERS_SENT\` exception.

2. **Unhandled Promise Rejections in Async Route Handlers**:
   An async route reading from a database does not catch rejected promises, causing unhandled rejections that leave client requests hanging indefinitely until timeout.

### Expected Behavior
- Must immediately return after sending an HTTP response in middleware.
- Async middleware and route handlers must catch errors and forward them via \`next(err)\`.
- A global 4-parameter error handler must catch all exceptions.

### Target Files to Investigate
- \`src/middleware/auth.js\`
- \`src/routes/users.js\`
- \`src/server.js\`

### Testing
- Run: \`npm test\``,
    publicTestInfo: '2 Public Tests: Valid token access and basic 401 response.',
    hiddenTestSpec: {
      runnerCommand: 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: 'Double-Response Suppression Header Invariant',
          description: 'Verifies no ERR_HTTP_HEADERS_SENT thrown on rejected tokens.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Async Error Forwarding To Central Handler',
          description: 'Asserts async exceptions produce 500 JSON without hanging sockets.',
          points: 30,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'CORS Headers On Error Responses',
          description: 'Ensures error responses still include proper security and CORS headers.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },

  {
    slug: 'mock-07-event-signup-desk',
    title: 'Event Signup Desk: Node.js & React High-Capacity Registration Engine',
    description:
      'Resolve ticket oversubscription in an event reservation API where simultaneous candidate registrations exceed venue capacity and Redis lock TTL expires prematurely.',
    repoUrl: 'https://github.com/Anirudhpahwa/ai-assisted-oa-practice/tree/main/mock-07-event-signup-desk',
    baseBranch: 'main',
    difficulty: 'ADVANCED',
    language: 'TypeScript',
    framework: 'Node.js & React',
    estimatedTimeMinutes: 45,
    instructions: `### Problem Description

The Event Signup Desk processes high-demand developer conference registrations:

1. **Capacity Oversubscription Under Burst Traffic**:
   When hundreds of attendees click "Register" simultaneously for an event with 5 remaining seats, 20+ registrations are confirmed because capacity verification is separated from reservation write.

2. **Registration Idempotency Key Expiration**:
   If an attendee's connection stutters and they submit again with the same idempotency key, the backend treats it as a second registration attempt.

### Expected Behavior
- Registration writes must be atomic. Under no circumstances may total confirmed tickets exceed venue capacity.
- Idempotency keys must be validated for 24 hours to return the initial registration status.

### Target Files to Investigate
- \`backend/src/services/registrationService.ts\`
- \`backend/src/routes/events.ts\`
- \`frontend/src/components/RegisterButton.tsx\`

### Testing
- Run: \`npm test\``,
    publicTestInfo: '2 Public Tests: Single ticket registration and remaining capacity check.',
    hiddenTestSpec: {
      runnerCommand: 'npm run test:hidden',
      testCases: [
        {
          id: 'HIDDEN-TC-01',
          name: '100-User Concurrent Capacity Saturation Test',
          description: 'Asserts exactly 5 tickets allocated when 100 users register in parallel.',
          points: 40,
        },
        {
          id: 'HIDDEN-TC-02',
          name: 'Idempotency Key Deduplication Check',
          description: 'Ensures identical idempotency key returns cached confirmation.',
          points: 30,
        },
        {
          id: 'HIDDEN-TC-03',
          name: 'Ticket Release On Payment Timeout',
          description: 'Verifies unconfirmed reservations return to inventory after 10 minutes.',
          points: 30,
        },
      ],
    },
    passingThresholdPercent: 100,
    aiRequestLimit: 15,
    aiTokenLimit: 10000,
  },
];
