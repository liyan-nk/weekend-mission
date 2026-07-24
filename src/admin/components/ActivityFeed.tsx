import React from 'react';
import { Clock } from 'lucide-react';
import type { WeekendEntry } from '../../lib/db';

interface ActivityFeedProps {
  entries: WeekendEntry[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ entries }) => {
  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5 select-none">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-500" />
          <h3 className="text-xs font-bold text-zinc-350 tracking-wide uppercase">Recent Activity</h3>
        </div>
        <span className="text-[8px] font-mono text-zinc-600 uppercase font-bold tracking-widest">Realtime Feed</span>
      </div>

      <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <div className="bg-zinc-900/20 border border-zinc-800/40 p-6 rounded-xl text-center text-xs text-zinc-550 font-medium">
            No activity logged yet this weekend.
          </div>
        ) : (
          entries.slice(0, 10).map((e) => (
            <div key={e.id} className="bg-zinc-900/20 border border-zinc-800/40 p-3.5 rounded-xl flex justify-between items-center text-xs">
              <div className="flex flex-col gap-1 min-w-0 mr-4">
                <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                  <span className="truncate">{e.display_name}</span>
                  <span className="text-zinc-700 font-normal font-mono text-[9px]">•</span>
                  <span className="text-zinc-500 font-mono text-[9px]">{e.mission?.code}</span>
                </div>
                <div className="text-[10px] text-zinc-450 leading-relaxed truncate max-w-[280px] sm:max-w-md">
                  {e.status === 'Completed' 
                    ? `Completed: "${e.mission?.title}"`
                    : `Spun: "${e.mission?.title}"`}
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1 select-none shrink-0">
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase border ${
                  e.status === 'Completed' 
                    ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                    : 'bg-amber-950/20 border-amber-900/30 text-amber-400'
                }`}>
                  {e.status}
                </span>
                <span className="text-[8px] text-zinc-600 font-mono tracking-tighter">
                  {new Date(e.completed_at || e.assigned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
