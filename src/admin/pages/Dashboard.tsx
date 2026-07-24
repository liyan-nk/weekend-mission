import React from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { ActivityFeed } from '../components/ActivityFeed';
import type { WeekendEntry } from '../../lib/db';
import type { AttentionItem } from '../hooks/useAdmin';

interface DashboardViewProps {
  stats: { assignedCount: number; completedCount: number; completionRate: number; uniqueParticipants: number };
  entries: WeekendEntry[];
  needsAttention: AttentionItem[];
  insights: { mostAssigned: any[]; leastAssigned: any[]; averageTime: number };
  weekendKey: string;
  isWeekend: boolean;
}

export const Dashboard: React.FC<DashboardViewProps> = ({ 
  stats, 
  entries, 
  needsAttention, 
  insights,
  weekendKey,
  isWeekend
}) => {
  return (
    <div className="space-y-10 max-w-6xl w-full select-none font-sans text-zinc-900 p-2">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 leading-none">Overview</h2>
        <p className="text-xs text-zinc-500 font-bold mt-1 font-mono tracking-wide uppercase">Command Room Ops // {weekendKey}</p>
      </div>

      {/* Numerical Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          label="Weekend Status" 
          value={isWeekend ? 'Live' : 'Standby'}
          indicator={
            <span className={`w-2 h-2 rounded-full ${isWeekend ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-350'}`}></span>
          }
        />
        <StatsCard label="Total Spins" value={stats.assignedCount} />
        <StatsCard label="Completed Missions" value={stats.completedCount} />
        <StatsCard label="Completion Rate" value={`${stats.completionRate}%`} />
        <StatsCard label="Unique Members" value={stats.uniqueParticipants} />
      </div>

      {/* Split Alert and Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Needs Attention Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <ShieldAlert className="w-4 h-4 text-zinc-900" />
            <h3 className="text-xs font-bold text-zinc-900 tracking-wide uppercase font-mono">Needs Attention</h3>
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {needsAttention.length === 0 ? (
              <div className="bg-white border border-zinc-900 p-6 rounded-xl text-center text-xs text-zinc-500 font-semibold shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                No alerts detected. All systems operating normally!
              </div>
            ) : (
              needsAttention.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 border rounded-xl flex gap-3 items-start text-xs shadow-[2.5px_2.5px_0px_0px_rgba(24,24,27,1)] ${
                    item.type === 'ZERO_COMPLETIONS'
                      ? 'bg-rose-50 border-rose-900 text-rose-950 font-bold'
                      : item.type === 'DUPLICATE_NAME' || item.type === 'OVERRIDE_ENABLED'
                      ? 'bg-amber-50 border-amber-900 text-amber-950 font-bold'
                      : 'bg-white border-zinc-900 text-zinc-900'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 select-none">
                    {item.type === 'ZERO_COMPLETIONS' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-800" />
                    ) : item.type === 'DUPLICATE_NAME' || item.type === 'OVERRIDE_ENABLED' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-800" />
                    ) : (
                      <Info className="w-4 h-4 text-zinc-650" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-snug">{item.title}</h4>
                    <p className="text-[9px] text-zinc-500 font-mono mt-1 font-bold leading-none">{item.subtitle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity feed column */}
        <div className="lg:col-span-7">
          <ActivityFeed entries={entries} />
        </div>

      </div>

      {/* Community Insights Grid */}
      <div className="border-t border-zinc-900 pt-8 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 tracking-wide uppercase font-mono">Community Insights</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-bold">Objective frequencies and velocity analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          {/* Most Assigned */}
          <div className="bg-white border border-zinc-900 p-5 rounded-xl space-y-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            <h4 className="text-[9.5px] font-mono font-bold text-zinc-400 tracking-wider uppercase">[ MOST ASSIGNED OBJECTIVES ]</h4>
            <ul className="space-y-2.5 text-xs font-bold">
              {insights.mostAssigned.length === 0 ? (
                <li className="text-zinc-500 italic font-bold">No spins logged yet.</li>
              ) : (
                insights.mostAssigned.map((item, idx) => (
                  <li key={item.code} className="flex justify-between items-center py-0.5 border-b border-zinc-100 pb-1.5 last:border-0 last:pb-0 text-zinc-800">
                    <span className="truncate max-w-[70%] text-zinc-800">
                      {idx + 1}. {item.code} — {item.title}
                    </span>
                    <span className="font-mono text-zinc-500 text-[10px] shrink-0">{item.count} spins</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Least Assigned */}
          <div className="bg-white border border-zinc-900 p-5 rounded-xl space-y-4 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            <h4 className="text-[9.5px] font-mono font-bold text-zinc-400 tracking-wider uppercase">[ LEAST ASSIGNED OBJECTIVES ]</h4>
            <ul className="space-y-2.5 text-xs font-bold">
              {insights.leastAssigned.length === 0 ? (
                <li className="text-zinc-500 italic font-bold">No spins logged yet.</li>
              ) : (
                insights.leastAssigned.map((item, idx) => (
                  <li key={item.code} className="flex justify-between items-center py-0.5 border-b border-zinc-100 pb-1.5 last:border-0 last:pb-0 text-zinc-800">
                    <span className="truncate max-w-[70%] text-zinc-800">
                      {idx + 1}. {item.code} — {item.title}
                    </span>
                    <span className="font-mono text-zinc-500 text-[10px] shrink-0">{item.count} spins</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Velocity Metrics */}
          <div className="bg-white border border-zinc-900 p-5 rounded-xl flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            <h4 className="text-[9.5px] font-mono font-bold text-zinc-400 tracking-wider uppercase mb-3">[ VELOCITY METRICS ]</h4>
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div>
                <span className="text-[9px] font-mono text-zinc-400 font-bold block uppercase tracking-wide">Avg Completion Time</span>
                <span className="text-2xl font-black text-zinc-900 mt-1 block">
                  {insights.averageTime > 0 ? `${insights.averageTime} mins` : 'N/A'}
                </span>
              </div>
              <p className="text-[9.5px] text-zinc-500 leading-normal font-sans font-bold">
                Time elapsed from initial spin acceptance to completed proof description logs upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
