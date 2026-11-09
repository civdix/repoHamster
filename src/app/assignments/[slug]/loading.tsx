export default function AssignmentDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse">
      {/* Navigation Breadcrumb Skeleton */}
      <div className="flex items-center justify-between border-b border-card-border pb-4">
        <div className="h-4 w-44 rounded bg-slate-800" />
        <div className="h-6 w-24 rounded-full bg-slate-800" />
      </div>

      {/* Main Header Card Skeleton */}
      <div className="rounded-2xl border border-card-border bg-[#0d101a] p-6 sm:p-8 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex gap-2">
              <div className="h-5 w-28 rounded-full bg-slate-800" />
              <div className="h-5 w-20 rounded-full bg-slate-800" />
              <div className="h-5 w-24 rounded-full bg-slate-800" />
            </div>
            <div className="h-8 w-2/3 rounded-lg bg-slate-700" />
            <div className="h-4 w-5/6 rounded bg-slate-800/80" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-44 rounded-xl bg-slate-800" />
            <div className="h-10 w-40 rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Two column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-card-border bg-card p-6 space-y-4">
            <div className="h-5 w-48 rounded bg-slate-700" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-800" />
              <div className="h-4 w-11/12 rounded bg-slate-800" />
              <div className="h-4 w-4/5 rounded bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-800" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-card-border bg-card p-6 space-y-4">
            <div className="h-5 w-36 rounded bg-slate-700" />
            <div className="h-24 w-full rounded-xl bg-slate-800/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
