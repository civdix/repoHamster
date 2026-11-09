import { HamsterMascot } from '@/components/brand/HamsterMascot';

export default function GlobalLoading() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-brand-lime/20 blur-xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-brand-lime/50 shadow-glow-lime">
          <HamsterMascot variant="avatar" size={56} className="animate-bounce" />
        </div>
      </div>
      <div className="text-center space-y-1.5">
        <h3 className="text-base font-bold text-white font-sans flex items-center justify-center space-x-2">
          <span>Loading RepoHamster...</span>
        </h3>
        <p className="text-xs text-slate-400 font-mono">Syncing workspace state & assignments</p>
      </div>
    </div>
  );
}
