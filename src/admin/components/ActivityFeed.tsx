import React from 'react';
import { Clock } from 'lucide-react';
import type { WeekendEntry } from '../../lib/db';

interface ActivityFeedProps {
  entries: WeekendEntry[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ entries }) => {
  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center border-b border-zinc-805 pb-2 select-none">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Recent Activity</h3>
        </div>
        <span className="text-[8px] font-mono text-zinc-550 uppercase font-bold tracking-widest">REALTIME STREAM</span>
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl text-center text-xs text-zinc-550 font-semibold">
            No activity logged yet this weekend.
          </div>
        ) : (
          entries.slice(0, 10).map((e) => (
            <div key={e.id} className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-xl flex justify-between items-center text-xs">
              <div className="flex flex-col gap-1 min-w-0 mr-4">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="truncate">{e.display_name}</span>
                  <span className="text-zinc-650 font-normal font-mono text-[9px]">•</span>
                  <span className="text-zinc-500 font-mono text-[9px] font-semibold">{e.mission?.code}</span>
                </div>
                <div className="text-[10.5px] text-zinc-400 font-medium leading-normal truncate max-w-[280px] sm:max-w-md">
                  {e.status === 'Completed' 
                    ? `✓ Finished: "${e.mission?.title}"`
                    : `🎯 Spun Invitation: "${e.mission?.title}"`}
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5 shrink-0 select-none">
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase ${
                  e.status === 'Completed' 
                    ? 'bg-emerald-950/40 border border-emerald-900/30 text-emerald-400' 
                    : 'bg-purple-950/40 border border-purple-900/30 text-purple-400'
                }`}>
                  {e.status}
                </span>
                <span className="text-[8.5px] text-zinc-550 font-mono tracking-tighter">
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
