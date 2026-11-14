# Design & UI Overhaul Specification: repoHamster

## 1. Visual Identity & Design System
* **Aesthetic Direction:** High-craft, editorial developer-focused SaaS with warm minimalism, subtle micro-interactions, and high contrast.
* **Color Palette:**
  * **Primary Background:** Warm Alabaster / Off-White (`#FAF7F2` / `#F8F5F0`)
  * **Card & Surface Background:** Pure White (`#FFFFFF`) with crisp `1px solid #E6E1D6` borders and soft elevation shadows (`0 4px 20px rgba(0,0,0,0.03)`).
  * **Primary Text & Ink:** Deep Charcoal / Near-Black (`#141413`)
  * **Secondary Text:** Warm Slate (`#5C5A55`)
  * **Primary Accent:** Vibrant Ember Orange (`#FF5A1F`) — used for primary badges, active states, waveform/terminal highlights, and key metrics.
  * **Secondary Accents:** Emerald Green (`#10B981` for passing test cases/stars), Soft Amber (`#F59E0B` for Repo Stars), and Muted Stone (`#EFECE6` for pill tags).
* **Typography:**
  * **Headings:** Clean geometric sans-serif (`Plus Jakarta Sans` or `Inter`, tight tracking `-0.03em`, bold/extrabold weights with italic serif/display highlights for key value propositions).
  * **Body:** `Inter` (`15px–16px`, relaxed line-height `1.6`).
  * **Code, Metrics & Badges:** `JetBrains Mono` (`12px–13px`, uppercase tracking `0.06em` for section kickers).

---

## 2. Global Navigation Bar
* **Layout:** Sticky top bar (`height: 72px`), transparent/blur backdrop matching `#FAF7F2/90`.
* **Left:** `repoHamster` logo mark (custom orange hamster/terminal icon) + wordmark.
* **Center Links:** `Challenges`, `AI vs Non-AI Mode`, `How It Works`, `Leaderboard`.
* **Right Actions:** 
  * Text link: `Sign In`
  * Primary Pill CTA: Solid `#141413` button with white text: `Start Practicing →`

---

## 3. Landing Page Architecture

### Section A: Hero Section (2-Column Split)
* **Left Column (Copy & CTAs):**
  * **Headline:** 
    > Master Real-World Repo Assessments ***At Scale***
    > ***With AI*** *•* ***Without AI*** *•* ***Production Ready***
  * **Subheadline:** Practice authentic, multi-file repository engineering assessments designed like actual Big Tech Online Assessments (OAs). Debug, build features, and pass automated test suites in real time.
  * **CTA Group:** 
    * Primary Solid Dark Button: `Launch a Repo Challenge →`
    * Secondary Outline Button: `Explore Sample Repo`
* **Right Column (Interactive Visual / Attachment Container):**
  * Create a dedicated rounded container (`border-radius: 24px`, `#FFFFFF` surface, `1px solid #E6E1D6`, subtle outer shadow) representing a live simulated IDE/Repo Sandbox card.
  * **Placeholder Asset Slot:** Inside this hero card, include a clearly marked image/graphic attachment wrapper (`<div id="hero-visual-attachment">`) pre-populated with a clean sample placeholder image (`https://placehold.co/640x460/FAF7F2/141413?text=repoHamster+Interactive+IDE+Preview+%0A(Replace+with+Custom+Graphic)`) styled with floating status pills overlaid on the corners (e.g., `● Sandbox Ready`, `✓ 14/14 Unit Tests Passing`, `Mode: AI-Assisted`).

### Section B: Social Proof & Credibility Strip
* **Layout:** Centered single-column strip directly below the hero fold, separated by generous vertical padding (`48px`).
* **Top Line:** `Built by Shivam Dixit • Used by professionals at` (styled in `13px` muted slate `#5C5A55`).
* **Logo Row:** Monochrome, muted-opacity (`opacity: 0.65`, hover `1.0`) SVG logos of top MNCs evenly spaced:
  * **Google**, **Microsoft**, **Amazon**, **Meta**, **Uber**, **Atlassian**

### Section C: Bento Features Grid ("Built for Engineers. Ready for Big Tech.")
* **Section Kicker:** `FEATURES` (Orange monospace uppercase)
* **Section Title:** `Built for real codebases. Ready for interviews.`
* **Grid Structure:** Asymmetric 2-row Bento Grid (Row 1: Full-width or 60/40 split; Row 2: 2x2 balanced bento cards).

1. **Card 1 (Top Wide Bento — Language & Stack Support):**
   * **Kicker:** `MULTI-LANGUAGE SANDBOXES`
   * **Title:** `Code in the stack you actually ship`
   * **Description:** Spin up containerized multi-file repositories across 12+ languages and frameworks with pre-configured dependencies and instant execution.
   * **Visual Component:** Interactive pill cloud featuring **Python**, **JavaScript**, **TypeScript**, **Java**, **Go**, **C++**, **Rust**, **Ruby**, **C#**, **SQL**, plus a live mini-code preview box showing a repository file tree (`src/api/handler.go`, `tests/handler_test.go`) alongside a syntax-highlighted snippet.

2. **Card 2 (Middle-Left Bento — Test Case Execution):**
   * **Kicker:** `INSTANT VERIFICATION`
   * **Title:** `Automated test case grading in real time`
   * **Description:** Every repository comes with hidden edge-case suites, performance benchmarks, and integration checks—just like real company OAs.
   * **Visual Component:** Simulated test runner card showing:
     * `RUN` `pytest tests/test_rate_limiter.py`
     * Progress bar & latency pill (`Executed in 240 ms`)
     * Live checkmarks: `✓ Handles burst concurrency`, `✓ Redis fallback intact`, `✓ Memory footprint < 64MB`.

3. **Card 3 (Middle-Right Bento — AI-Assisted vs. Non-AI OA Prep):**
   * **Kicker:** `DUAL OA MODES`
   * **Title:** `Practice AI-Assisted and Non-AI Big Tech OAs`
   * **Description:** Prepare for both modern AI-enabled pair-programming rounds and strict, locked-down algorithmic/system-repo assessments.
   * **Visual Component:** Interactive toggle card UI showing two switchable tracks:
     * **Track A (`AI-Assisted Mode`):** Built-in AI copilot panel enabled, testing prompt engineering, code review, and rapid feature shipping.
     * **Track B (`Strict Non-AI Mode`):** Pure documentation + terminal environment to sharpen raw debugging and architectural instincts.

4. **Card 4 (Bottom-Left Bento — Gamification & Repo Stars):**
   * **Kicker:** `PROGRESSION & REWARDS`
   * **Title:** `Every solved assignment earns a Repo Star`
   * **Description:** Build a verifiable engineering portfolio. Earn Repo Stars for clean commits, edge-case coverage, and optimal runtime—unlocking harder tier challenges.
   * **Visual Component:** Streak & Star tracker card displaying earned stars (`★ 42 Repo Stars`), tier badges (`Distributed Systems • Gold`), and channel chips (`GitHub Sync`, `Public Profile`, `Leaderboard`, `Badges`).

5. **Card 5 (Bottom-Right Bento — Code Review & Post-Mortem QA):**
   * **Kicker:** `AUTOMATED CODE QA`
   * **Title:** `Line-by-line review the moment you submit`
   * **Description:** Don't just see pass/fail. Get granular feedback on time complexity, race conditions, error handling, and missed edge cases.
   * **Visual Component:** Annotated diff/review snippet with highlighted lines and inline mentor notes (`Good: Idempotency key validated`, `Improve: Handle timeout on upstream retry`).

---

## 4. Full Application UI Extensions (Consistent Warm-Editorial System)

### Page 2: Repo Challenges Directory (`/challenges`)
* **Header:** Clean warm-white header with search bar + filter pills (`All`, `Backend`, `Frontend`, `Full Stack`, `Systems`, `AI-Assisted`, `Non-AI`).
* **Challenge Cards:** White cards (`#FFFFFF`, `1px solid #E6E1D6`) displaying:
  * Difficulty pill (`Easy`, `Medium`, `Hard`) + Mode badge (`AI Allowed` / `No AI`).
  * Repository title & real-world scenario summary (e.g., *"Fix Race Condition in Distributed Payment Ledger"*).
  * Tech stack tags (`Go`, `PostgreSQL`, `Docker`) + Reward badge (`+3 ★ Repo Stars`).
  * Action button: `Clone & Solve →`.

### Page 3: Repo Challenge Workspace (`/workspace/:id`)
* **Top Utility Bar:** Back to challenges, Repo title, Countdown timer (optional OA mode), Mode indicator (`AI-Assisted` / `Non-AI Locked`), `Run Tests` button, and primary `Submit Solution` button (`#FF5A1F`).
* **3-Pane Split Layout:**
  * **Left Pane (`25%`):** Problem brief, requirements checklist, architecture notes, and collapsible File Explorer tree.
  * **Center Pane (`45%`):** Clean code editor with warm/light or high-contrast dark syntax theme toggle and open file tabs.
  * **Right Pane (`30%`):** Tabbed panel for **Test Cases** (live pass/fail breakdown + stdout/stderr logs) and **AI Assistant** (active in AI-Assisted mode; displays a crisp *"Disabled in Strict OA Mode"* lock card when in Non-AI mode).

### Page 4: User Dashboard (`/dashboard`)
* **Top Summary Strip (4 Bento KPI Cards):**
  * `Total Repo Stars` (`★ 48`)
  * `Solved Repositories` (`19 / 60`)
  * `OA Pass Rate` (`84%`)
  * `Current Streak` (`12 Days`)
* **Main Content Grid:**
  * **Left (`65%`):** "Continue Solving" active repo cards + Submission History table with commit status, test score (`12/12`), mode used, and stars earned.
  * **Right (`35%`):** Skill Breakdown radar/progress bars (`Debugging`, `API Design`, `Concurrency`, `Testing`) and Shareable Profile Card.

### Page 5: Contact & Enterprise / Campus Form (`/contact`)
* **Layout:** Centered 2-column card (`#FFFFFF` on `#FAF7F2` canvas) inspired by the *"Bring one workflow. We’ll map the rest."* footer CTA block.
* **Left Column:** Direct headline (*"Bring repoHamster to your team or campus."*), brief pitch on custom repo assessments, and direct contact details (`shivam@repohamster.dev`).
* **Right Column:** Clean, minimal form with `#FAF7F2` input fields (`Name`, `Work/College Email`, `Role / Organization`, `Use Case: Individual Prep / Hiring Team / University`, `Message`) and full-width dark submit button (`Send Message →`).
1