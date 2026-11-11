export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 4 Metric Counter Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-4 space-y-3">
            <div className="h-4 w-28 rounded bg-[var(--gh-bg)]" />
            <div className="h-8 w-16 rounded bg-[var(--gh-border)]" />
            <div className="h-3 w-36 rounded bg-[var(--gh-bg)]" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-44 rounded bg-[var(--gh-border)]" />
          <div className="h-8 w-48 rounded-xl bg-[var(--gh-bg)]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full rounded-lg bg-[var(--gh-bg)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
