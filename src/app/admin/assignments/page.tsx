import Link from 'next/link';
import prisma from '@/lib/db';
import {
  Layers,
  Code2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bot,
  Timer,
  Clock,
} from 'lucide-react';
import { AssignmentEditorModal } from '@/components/admin/AssignmentEditorModal';

export const dynamic = 'force-dynamic';

export default async function AdminAssignmentsPage() {
  let assignments: any[] = [];
  try {
    assignments = await prisma.assignment.findMany({
      include: {
        candidateAssignments: true,
        pullRequests: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (err) {
    console.error('[ADMIN ASSIGNMENTS] Query error:', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Debugging Assignment Repositories</h2>
          <p className="text-xs text-slate-400">
            Configure repository connections, edit instructions, set AI token limits, and manage passing thresholds.
          </p>
        </div>

        <AssignmentEditorModal isNew={true} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assignments.map((assignment: any) => {
          const completedCount = (assignment.candidateAssignments || []).filter((ca: any) => ca.status === 'COMPLETED').length;
          const totalAttempts = (assignment.candidateAssignments || []).length;

          return (
            <div
              key={assignment.id}
              className="rounded-xl border border-card-border bg-card p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-card-border bg-[#0a0d14] px-2.5 py-0.5 text-[10px] font-mono text-slate-300">
                      {assignment.language} • {assignment.framework}
                    </span>
                    <span className="rounded-full border border-amber-800/40 bg-amber-950/40 px-2 py-0.5 text-[10px] font-mono text-amber-400 font-semibold">
                      {assignment.difficulty}
                    </span>
                    {assignment.isActive ? (
                      <span className="rounded-full border border-lime-800/40 bg-lime-950/40 px-2 py-0.5 text-[10px] font-mono text-brand-lime">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                        DISABLED
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base">{assignment.title}</h3>
                  <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">{assignment.description}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <AssignmentEditorModal assignment={assignment} />
                  <a
                    href={assignment.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-card-border bg-[#0a0d14] p-2 text-slate-400 hover:text-white transition"
                    title="Open GitHub Repository"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Specs & Configuration Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-card-border bg-[#0a0d14] p-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Repository</span>
                  <a
                    href={assignment.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-lime hover:underline truncate block"
                  >
                    {assignment.repoUrl.replace('https://github.com/', '')}
                  </a>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">AI Limit / Candidate</span>
                  <span className="text-purple-300">
                    {assignment.aiRequestLimit} req / {assignment.aiTokenLimit.toLocaleString()} tok
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Passing Threshold</span>
                  <span className="text-brand-lime font-semibold">{assignment.passingThresholdPercent}%</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Completion Rate</span>
                  <span className="text-white">
                    {completedCount} / {totalAttempts} candidates ({totalAttempts > 0 ? Math.round((completedCount / totalAttempts) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
