import React from 'react';
import { Clock } from 'lucide-react';
import type { WeekendEntry } from '../../lib/db';

interface ActivityFeedProps {
  entries: WeekendEntry[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ entries }) => {
  return (
    <div className="bg-white border border-zinc-900 p-6 rounded-xl shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] font-sans">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-3 select-none">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-800" />
          <h3 className="text-xs font-bold text-zinc-900 tracking-wide uppercase font-mono">Recent Activity</h3>
        </div>
        <span className="text-[8px] font-mono text-zinc-400 uppercase font-bold tracking-widest">Realtime Feed</span>
      </div>

      <div className="space-y-3 mt-4 max-h-[50vh] overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <div className="bg-[#fbfaf8] border border-zinc-900/30 p-6 rounded-lg text-center text-xs text-zinc-500 font-semibold">
            No activity logged yet this weekend.
          </div>
        ) : (
          entries.slice(0, 10).map((e) => (
            <div key={e.id} className="bg-[#fbfaf8] border border-zinc-900/60 p-4 rounded-lg flex justify-between items-center text-xs">
              <div className="flex flex-col gap-1 min-w-0 mr-4">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <span className="truncate">{e.display_name}</span>
                  <span className="text-zinc-300 font-normal font-mono text-[9px]">•</span>
                  <span className="text-zinc-500 font-mono text-[9px] font-bold">{e.mission?.code}</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium leading-relaxed truncate max-w-[280px] sm:max-w-md">
                  {e.status === 'Completed' 
                    ? `Completed objective: "${e.mission?.title}"`
                    : `Rolled mission: "${e.mission?.title}"`}
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5 select-none shrink-0">
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase border ${
                  e.status === 'Completed' 
                    ? 'bg-emerald-50 border-emerald-900 text-emerald-800' 
                    : 'bg-amber-50 border-amber-900 text-amber-800'
                }`}>
                  {e.status}
                </span>
                <span className="text-[8px] text-zinc-400 font-mono tracking-tighter">
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
