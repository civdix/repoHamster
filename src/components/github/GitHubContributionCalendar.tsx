'use client';

import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, Flame, Trophy } from 'lucide-react';

interface ActivityItem {
  date: string | Date;
  count?: number;
}

interface GitHubContributionCalendarProps {
  activities?: ActivityItem[];
  username: string;
}

interface DayData {
  dateStr: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  monthName: string;
  dayOfWeek: number;
}

export function GitHubContributionCalendar({ activities = [], username }: GitHubContributionCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<{ dateStr: string; count: number } | null>(null);

  // Generate 52 weeks of day grid up to today
  const { weeks, totalContributions, monthsLabels } = useMemo(() => {
    // Map activities by date YYYY-MM-DD
    const activityMap = new Map<string, number>();
    for (const act of activities) {
      const d = new Date(act.date);
      if (!isNaN(d.getTime())) {
        const key = d.toISOString().split('T')[0];
        activityMap.set(key, (activityMap.get(key) || 0) + (act.count || 1));
      }
    }

    const today = new Date();
    // 52 weeks * 7 = 364 days
    const totalDays = 52 * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);

    const days: DayData[] = [];
    let runningTotal = 0;

    for (let i = 0; i < totalDays; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];
      const count = activityMap.get(dateStr) || 0;
      runningTotal += count;

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 4) level = 4;
      else if (count === 3) level = 3;
      else if (count === 2) level = 2;
      else if (count === 1) level = 1;

      days.push({
        dateStr,
        count,
        level,
        monthName: current.toLocaleString('default', { month: 'short' }),
        dayOfWeek: current.getDay(),
      });
    }

    // Split into 52 columns of 7 days
    const weekCols: DayData[][] = [];
    for (let w = 0; w < 52; w++) {
      weekCols.push(days.slice(w * 7, (w + 1) * 7));
    }

    // Extract month labels with column indices
    const mLabels: Array<{ text: string; colIndex: number }> = [];
    let lastMonth = '';
    weekCols.forEach((week, idx) => {
      const firstDay = week[0];
      if (firstDay && firstDay.monthName !== lastMonth) {
        lastMonth = firstDay.monthName;
        mLabels.push({ text: firstDay.monthName, colIndex: idx });
      }
    });

    return {
      weeks: weekCols,
      totalContributions: runningTotal,
      monthsLabels: mLabels,
    };
  }, [activities]);

  // Color map strictly conforming to YELLOW + DARK theme
  const getCellColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 1:
        return 'bg-[#422006] hover:bg-[#592c08] border border-[#713f12]/40'; // Subtle dark amber
      case 2:
        return 'bg-[#713f12] hover:bg-[#854d0e] border border-[#ca8a04]/40'; // Mid amber
      case 3:
        return 'bg-[#ca8a04] hover:bg-[#d97706] shadow-[0_0_6px_rgba(202,138,4,0.4)]'; // Golden yellow
      case 4:
        return 'bg-[#facc15] hover:bg-[#fde047] shadow-[0_0_10px_rgba(250,204,21,0.6)]'; // Vibrant yellow
      case 0:
      default:
        return 'bg-[#161b22] hover:bg-[#21262d] border border-[#30363d]/50'; // GitHub empty cell
    }
  };

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 sm:p-5 text-slate-200">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-yellow-400" />
            <span>
              {totalContributions.toLocaleString()} contributions in the last year
            </span>
          </h3>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Verified pull requests, bug fixes, and hidden harness evaluations
          </p>
        </div>

        {/* Hover date tooltip preview */}
        <div className="h-6 flex items-center">
          {hoveredDay ? (
            <span className="text-xs font-mono text-yellow-300 bg-yellow-950/60 border border-yellow-700/60 px-2.5 py-0.5 rounded-md animate-in fade-in">
              <strong>{hoveredDay.count}</strong> contribution{hoveredDay.count === 1 ? '' : 's'} on {hoveredDay.dateStr}
            </span>
          ) : (
            <span className="text-[11px] font-mono text-slate-500">
              Hover over a day square to view activity
            </span>
          )}
        </div>
      </div>

      {/* 52-Week Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          {/* Months Header */}
          <div className="flex text-[10px] font-mono text-slate-400 mb-1 pl-8">
            {monthsLabels.map((m, i) => (
              <span
                key={i}
                style={{ width: `${(100 / 52) * 4.3}%` }}
                className="truncate"
              >
                {m.text}
              </span>
            ))}
          </div>

          <div className="flex">
            {/* Day of Week Labels */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-slate-500 pr-2 py-0.5 select-none w-7 shrink-0">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* 52-Week Columns */}
            <div className="flex gap-[3px] flex-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px] flex-1">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onMouseEnter={() => setHoveredDay({ dateStr: day.dateStr, count: day.count })}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${day.count} contributions on ${day.dateStr}`}
                      className={`h-[11px] w-full rounded-[2px] transition-colors cursor-pointer ${getCellColor(
                        day.level
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Footer & Legend (Yellow + Dark only) */}
      <div className="mt-4 pt-3 border-t border-[#21262d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 text-yellow-400">
            <Flame className="h-3.5 w-3.5" />
            <span>Active Contributor</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-300">
            <Trophy className="h-3.5 w-3.5 text-yellow-500" />
            <span>Daily streaks verified</span>
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-1.5 self-end sm:self-center">
          <span className="text-[10px] text-slate-500">Less</span>
          <div className="h-[10px] w-[10px] rounded-[2px] bg-[#161b22] border border-[#30363d]/50" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-[#422006] border border-[#713f12]/40" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-[#713f12]" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-[#ca8a04]" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-[#facc15]" />
          <span className="text-[10px] text-slate-500">More</span>
        </div>
      </div>
    </div>
  );
}
