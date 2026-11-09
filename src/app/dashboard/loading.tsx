import { HamsterMascot } from '@/components/brand/HamsterMascot';
import { Layers } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Personalized Welcome Card Skeleton */}
      <div className="rounded-2xl border border-card-border bg-[#121624]/60 p-6 sm:p-8">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700/60" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 rounded-lg bg-slate-800" />
            <div className="h-4 w-72 rounded-lg bg-slate-800/60" />
          </div>
        </div>
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-card-border bg-card p-4 space-y-3">
            <div className="h-4 w-24 rounded bg-slate-800" />
            <div className="h-8 w-16 rounded bg-slate-700" />
            <div className="h-3 w-32 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>

      {/* Assignments Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-5 w-44 rounded bg-slate-800" />
            <div className="h-3 w-64 rounded bg-slate-800/60" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl border border-card-border bg-card p-5 space-y-4 min-h-[220px]"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 w-20 rounded-full bg-slate-800" />
                  <div className="h-5 w-16 rounded-full bg-slate-800" />
                </div>
                <div className="h-5 w-3/4 rounded bg-slate-700" />
                <div className="h-3 w-full rounded bg-slate-800/70" />
                <div className="h-3 w-4/5 rounded bg-slate-800/70" />
              </div>
              <div className="h-9 w-full rounded-xl bg-slate-800/90" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
