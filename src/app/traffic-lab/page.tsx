import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Zap,
  Flame,
  Activity,
  Cpu,
  Server,
  Gauge,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Sliders,
  Database,
  AlertTriangle,
  TrendingUp,
  Terminal,
  Workflow,
  Sparkles,
  Layers,
  Code2,
  HardDrive,
  BarChart3,
  Network,
} from 'lucide-react';
import { HamsterMascot } from '@/components/brand/HamsterMascot';

export const metadata: Metadata = {
  title: 'High-Traffic Arena & ScaleLab (Coming Soon)',
  description:
    'Hands-on distributed load simulation arena where engineers optimize code-level and service-level architectures to withstand 100,000+ RPS synthetic traffic spikes.',
};

export default function HighTrafficLabPage() {
  const codeLevelTasks = [
    {
      id: 'TASK-C1',
      title: 'Deadlock & Mutex Lock Contention Elimination',
      description:
        'Diagnose and replace coarse-grained synchronized mutex locks on high-throughput shared state (e.g. inventory decrements) with optimistic concurrency, atomic CAS primitives, or striped locking.',
      status: 'In Progress',
      priority: 'P0 High',
      difficulty: 'Hard',
    },
    {
      id: 'TASK-C2',
      title: 'Hot-Path Object Allocation & Garbage Collection Pause Reduction',
      description:
        'Refactor memory-intensive request parsers to use reusable byte buffers, object pools, and zero-copy string slicing, preventing stop-the-world GC latency spikes during 50k RPS load bursts.',
      status: 'Todo',
      priority: 'P1 Core',
      difficulty: 'Intermediate',
    },
    {
      id: 'TASK-C3',
      title: 'Database Connection Pool Exhaustion & Leak Remediation',
      description:
        'Fix unreleased database connection leaks, configure pool sizing and connection timeouts (HikariCP / pgBouncer / Go sql.DB), and optimize queries holding exclusive row locks.',
      status: 'Todo',
      priority: 'P0 High',
      difficulty: 'Hard',
    },
    {
      id: 'TASK-C4',
      title: 'Cache Stampede & Thundering Herd Defense',
      description:
        'Implement coalescing singleflight patterns, probabilistic early expiration (XFetch), and tiered L1 in-memory + L2 distributed Redis caches to prevent cache invalidation database crashes.',
      status: 'Todo',
      priority: 'P1 Core',
      difficulty: 'Intermediate',
    },
  ];

  const serviceLevelTasks = [
    {
      id: 'TASK-S1',
      title: 'Distributed Token Bucket Rate Limiting & Load Shedding',
      description:
        'Build sliding-window rate limiters with Redis scripts and load-shedding reverse proxies that gracefully reject non-critical requests when CPU utilization exceeds 85%, ensuring system survival.',
      status: 'In Progress',
      priority: 'P0 High',
      difficulty: 'Hard',
    },
    {
      id: 'TASK-S2',
      title: 'Circuit Breaker Pattern with Graceful Fallback Responses',
      description:
        'Implement resilient circuit breakers (Closed / Open / Half-Open state machines) guarding slow 3rd-party payment APIs, returning cached fallbacks rather than queuing cascading timeouts.',
      status: 'Todo',
      priority: 'P1 Core',
      difficulty: 'Intermediate',
    },
    {
      id: 'TASK-S3',
      title: 'Message Queue Backpressure & Buffer Drain Balancing',
      description:
        'Configure consumer concurrency, batch acknowledgement, and dead-letter queues in Kafka / RabbitMQ pipelines to prevent unbounded memory growth and out-of-memory worker crashes.',
      status: 'Todo',
      priority: 'P0 High',
      difficulty: 'Hard',
    },
    {
      id: 'TASK-S4',
      title: 'Read-Replica Routing & Replication Lag Tolerance',
      description:
        'Architect dynamic connection splitters directing read traffic to read-replicas while keeping write-after-read consistency guarantees for critical user paths.',
      status: 'Todo',
      priority: 'P2 Future',
      difficulty: 'Advanced',
    },
  ];

  const harnessTasks = [
    {
      id: 'TASK-H1',
      title: 'Distributed Synthetic Load Burst Generator (k6 & Autocannon)',
      description:
        'Deploy headless load worker nodes capable of simulating customizable traffic profiles: gradual warm-up, flash sale spike bursts (10k -> 100k RPS), and soak testing.',
      status: 'In Progress',
      milestone: 'Milestone 1',
    },
    {
      id: 'TASK-H2',
      title: 'Real-Time Streaming Telemetry (p50, p95, p99 & Resource Heatmap)',
      description:
        'Stream real-time latency distributions, 4xx/5xx HTTP error rates, CPU/RAM saturation, and thread pool exhaustion into an interactive live dashboard in the candidate Codespace.',
      status: 'Todo',
      milestone: 'Milestone 2',
    },
    {
      id: 'TASK-H3',
      title: 'Survival Score & Performance Degradation Evaluator',
      description:
        'Score candidate code submissions on 3 criteria: (1) p99 latency SLA compliance under peak load, (2) zero data loss / corruption, and (3) graceful recovery after load diminishes.',
      status: 'Todo',
      milestone: 'Milestone 3',
    },
    {
      id: 'TASK-H4',
      title: 'Post-Run Flamegraph & Bottleneck Trace Explorer',
      description:
        'Generate interactive flamegraphs showing candidate engineers the exact lines of code, lock waits, or SQL queries that caused bottleneck throttling.',
      status: 'Todo',
      milestone: 'Milestone 4',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--gh-bg)] bg-dev-grid text-[var(--gh-text)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Breadcrumb / Top Eyebrow */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[var(--gh-text-muted)]">
          <Link href="/dashboard" className="hover:text-[var(--yellow-bright)] transition">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-[var(--yellow-bright)] font-semibold">ScaleLab Traffic Arena</span>
          <span className="rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2 py-0.5 text-[10px] text-[var(--amber-badge-text)] font-bold uppercase ml-2 animate-pulse">
            Coming Soon
          </span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl border border-[var(--amber-badge-border)] bg-[var(--gh-bg-secondary)] p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,var(--yellow-glow-lg),transparent_70%)] pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)] px-3 py-1 text-xs font-mono font-bold text-[var(--amber-badge-text)]">
                <Flame className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                <span>HIGH-TRAFFIC LOAD SIMULATOR &bull; ENGINEERING ROADMAP</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-sans text-[var(--gh-text)] leading-tight">
                Master 100k+ RPS Systems Before You Hit Production.
              </h1>

              <p className="text-sm sm:text-base text-[var(--gh-text-secondary)] leading-relaxed font-sans">
                Most developers never get hands-on access to production systems handling massive traffic bursts.
                <strong> RepoHamster ScaleLab</strong> is an upcoming interactive load simulation arena where candidate code
                is bombarded with synthetic traffic spikes. You must diagnose bottlenecks and implement both <strong>code-level</strong> and <strong>service-level</strong> architectural changes to survive the surge.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <span className="inline-flex items-center space-x-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-1.5 text-[var(--gh-text-secondary)]">
                  <Activity className="h-3.5 w-3.5 text-[var(--yellow-bright)]" />
                  <span>Target: 10,000 &ndash; 100,000 RPS</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-1.5 text-[var(--gh-text-secondary)]">
                  <Cpu className="h-3.5 w-3.5 text-[#10B981]" />
                  <span>Real Memory &amp; CPU Constraints</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 rounded-lg border border-[var(--gh-border)] bg-[var(--gh-bg)] px-3 py-1.5 text-[var(--gh-text-secondary)]">
                  <Gauge className="h-3.5 w-3.5 text-rose-400" />
                  <span>Live Latency Heatmap</span>
                </span>
              </div>
            </div>

            {/* Mascot Graphic Badge */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-[var(--yellow-primary)]/40 bg-[var(--gh-bg)]/80 shadow-2xl backdrop-blur shrink-0 self-center lg:self-auto text-center space-y-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--amber-badge-bg)] border border-[var(--yellow-primary)] shadow-[var(--yellow-glow)] p-2">
                <HamsterMascot variant="normal" size={64} />
              </div>
              <div className="font-mono text-xs">
                <p className="font-bold text-[var(--gh-text)]">ScaleLab Engineer</p>
                <p className="text-[10px] text-[var(--yellow-bright)]">Status: Construction Active</p>
              </div>
              <div className="rounded-full bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-3 py-1 text-[11px] font-mono text-[var(--amber-badge-text)] font-semibold">
                Beta Target: Q1 2027
              </div>
            </div>
          </div>
        </div>

        {/* Why This Matters: Code-Level vs Service-Level Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] text-[var(--yellow-bright)]">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--gh-text)] font-sans">Level 1: Code-Level Surgery</h3>
                <p className="text-xs text-[var(--gh-text-muted)] font-mono">Micro-benchmarking inside the application runtime</p>
              </div>
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed">
              When millions of requests arrive, algorithmic sloppiness causes catastrophic failure. Candidates must resolve:
            </p>
            <ul className="space-y-2 text-xs font-mono text-[var(--gh-text-secondary)]">
              <li className="flex items-start space-x-2">
                <span className="text-[var(--yellow-bright)] font-bold">&bull;</span>
                <span>Thread contention on synchronized blocks &amp; global locks</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--yellow-bright)] font-bold">&bull;</span>
                <span>Allocation-heavy hot loops triggering Stop-the-World GC pauses</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--yellow-bright)] font-bold">&bull;</span>
                <span>Unbounded in-memory collections causing Out-Of-Memory (OOM) crashes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--yellow-bright)] font-bold">&bull;</span>
                <span>Database connection leaks starving the worker thread pool</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--yellow-primary)]/15 border border-[var(--yellow-primary)]/40 text-[var(--yellow-bright)]">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--gh-text)] font-sans">Level 2: Service-Level Architecture</h3>
                <p className="text-xs text-[var(--gh-text-muted)] font-mono">Macro-resilience across distributed boundaries</p>
              </div>
            </div>
            <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed">
              Resilience requires distributed mechanisms to prevent downstream outages from collapsing your whole stack:
            </p>
            <ul className="space-y-2 text-xs font-mono text-[var(--gh-text-secondary)]">
              <li className="flex items-start space-x-2">
                <span className="text-[var(--yellow-bright)] font-bold">&bull;</span>
                <span>Token bucket rate limiters shedding load at the gateway edge</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--yellow-bright)] font-bold">&bull;</span>
                <span>Circuit breakers isolating degraded downstream microservices</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--yellow-bright)] font-bold">&bull;</span>
                <span>Message queue backpressure preventing consumer buffer overflow</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[var(--yellow-bright)] font-bold">&bull;</span>
                <span>Cache stampede mitigation with coalescing singleflight locks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* SECTION 1: CODE-LEVEL TASKS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--gh-border)] gap-2">
            <div>
              <h2 className="text-lg font-bold text-[var(--gh-text)] font-sans flex items-center space-x-2">
                <Code2 className="h-5 w-5 text-[var(--yellow-bright)]" />
                <span>Planned TODO Tasks: Code-Level Optimization Challenges</span>
              </h2>
              <p className="text-xs text-[var(--gh-text-secondary)]">
                Hands-on coding challenges deployed directly inside GitHub Codespaces.
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--amber-badge-text)] bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
              Phase 1 Tasks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {codeLevelTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-3 hover:border-[var(--yellow-primary)]/50 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--gh-bg)] border border-[var(--gh-border)] font-bold text-[var(--yellow-bright)]">
                      {task.id}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--amber-badge-text)] bg-[var(--amber-badge-bg)] px-2 py-0.5 rounded-full border border-[var(--amber-badge-border)]">
                      {task.priority}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono rounded-full bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2 py-0.5 text-[var(--gh-text-muted)]">
                    {task.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--gh-text)] group-hover:text-[var(--yellow-bright)] transition font-sans">
                  {task.title}
                </h3>

                <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed font-sans">
                  {task.description}
                </p>

                <div className="pt-2 border-t border-[var(--gh-border)]/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[var(--gh-text-muted)]">Challenge Type: Runtime Profiling</span>
                  <span className="flex items-center space-x-1 text-[var(--yellow-bright)] font-semibold">
                    <Clock className="h-3 w-3" />
                    <span>{task.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: SERVICE-LEVEL TASKS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--gh-border)] gap-2">
            <div>
              <h2 className="text-lg font-bold text-[var(--gh-text)] font-sans flex items-center space-x-2">
                <Network className="h-5 w-5 text-[var(--yellow-bright)]" />
                <span>Planned TODO Tasks: Service-Level Distributed Challenges</span>
              </h2>
              <p className="text-xs text-[var(--gh-text-secondary)]">
                Multi-container architectural resilience and backpressure exercises.
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--amber-badge-text)] bg-[var(--amber-badge-bg)] border border-[var(--amber-badge-border)] px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
              Phase 2 Tasks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceLevelTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-5 space-y-3 hover:border-[var(--yellow-primary)]/50 transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--gh-bg)] border border-[var(--gh-border)] font-bold text-[var(--yellow-bright)]">
                      {task.id}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--amber-badge-text)] bg-[var(--amber-badge-bg)] px-2 py-0.5 rounded-full border border-[var(--amber-badge-border)]">
                      {task.priority}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono rounded-full bg-[var(--gh-bg)] border border-[var(--gh-border)] px-2 py-0.5 text-[var(--gh-text-muted)]">
                    {task.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--gh-text)] group-hover:text-[var(--yellow-bright)] transition font-sans">
                  {task.title}
                </h3>

                <p className="text-xs text-[var(--gh-text-secondary)] leading-relaxed font-sans">
                  {task.description}
                </p>

                <div className="pt-2 border-t border-[var(--gh-border)]/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[var(--gh-text-muted)]">Challenge Type: Distributed Systems</span>
                  <span className="flex items-center space-x-1 text-[var(--yellow-bright)] font-semibold">
                    <Clock className="h-3 w-3" />
                    <span>{task.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: HARNESS & EVALUATION ENGINE ROADMAP */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--gh-border)] gap-2">
            <div>
              <h2 className="text-lg font-bold text-[var(--gh-text)] font-sans flex items-center space-x-2">
                <Workflow className="h-5 w-5 text-[var(--yellow-bright)]" />
                <span>Platform Infrastructure &amp; Stress Harness Roadmap</span>
              </h2>
              <p className="text-xs text-[var(--gh-text-secondary)]">
                The underlying burst test runner, real-time metrics telemetry, and automated grading harness.
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--yellow-bright)] bg-[var(--gh-bg-secondary)] border border-[var(--yellow-primary)]/40 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
              System Blueprint
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {harnessTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--yellow-bright)] font-bold">{task.id}</span>
                    <span className="text-[10px] rounded-full bg-[var(--gh-bg)] px-2 py-0.5 border border-[var(--gh-border)] text-[var(--gh-text-muted)]">
                      {task.milestone}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[var(--gh-text)] leading-tight font-sans">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-[var(--gh-text-secondary)] leading-relaxed font-sans">
                    {task.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--gh-border)]/60 flex items-center space-x-1.5 text-[11px] font-mono text-[var(--yellow-bright)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--yellow-bright)] animate-pulse" />
                  <span>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Callout: Early Access & Scenarios Vote */}
        <div className="rounded-2xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--yellow-primary)]/20 border border-[var(--yellow-primary)]/40 text-[var(--yellow-bright)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[var(--gh-text)] font-sans">
              Want to Test High-Traffic Scenarios Early?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--amber-badge-text)] max-w-xl mx-auto leading-relaxed font-sans">
              We are actively developing the first batch of k6 load generation templates and Redis backpressure sandboxes.
              In the meantime, you can sharpen your debugging skills on our live real-world challenges!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 rounded-xl bg-[var(--yellow-button-bg)] px-5 py-2.5 font-bold text-[var(--yellow-button-text)] hover:bg-[var(--yellow-button-hover)] transition shadow-sm active:scale-95"
            >
              <span>Explore Current Challenges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg)] px-5 py-2.5 font-semibold text-[var(--gh-text)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/50 transition active:scale-95"
            >
              <span>Suggest a High-Scale Scenario</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
