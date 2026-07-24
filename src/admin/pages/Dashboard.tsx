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
    <div className="space-y-8 max-w-6xl w-full select-none font-sans text-zinc-100">
      {/* View Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Overview</h2>
        <p className="text-xs text-zinc-500 font-medium">Real-time status summaries for weekend event {weekendKey}.</p>
      </div>

      {/* Numerical Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          label="Weekend Status" 
          value={isWeekend ? 'Live' : 'Standby'}
          indicator={
            <span className={`w-1.5 h-1.5 rounded-full ${isWeekend ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-650'}`}></span>
          }
        />
        <StatsCard label="Total Spins" value={stats.assignedCount} />
        <StatsCard label="Completed Missions" value={stats.completedCount} />
        <StatsCard label="Completion Rate" value={`${stats.completionRate}%`} />
        <StatsCard label="Unique Members" value={stats.uniqueParticipants} />
      </div>

      {/* Main Split Layout: Alert center & Activity timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Needs Attention Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5">
            <ShieldAlert className="w-4 h-4 text-zinc-550" />
            <h3 className="text-xs font-bold text-zinc-350 tracking-wide uppercase">Needs Attention</h3>
          </div>

          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {needsAttention.length === 0 ? (
              <div className="bg-zinc-900/10 border border-zinc-800/40 p-6 rounded-xl text-center text-xs text-zinc-550 font-medium">
                No alerts detected. All systems operating normally!
              </div>
            ) : (
              needsAttention.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 border rounded-lg flex gap-3 items-start text-xs ${
                    item.type === 'ZERO_COMPLETIONS'
                      ? 'bg-rose-950/20 border-rose-900/30 text-rose-350'
                      : item.type === 'DUPLICATE_NAME' || item.type === 'OVERRIDE_ENABLED'
                      ? 'bg-amber-950/20 border-amber-900/30 text-amber-350'
                      : 'bg-zinc-900/40 border border-zinc-800/60 text-zinc-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 select-none">
                    {item.type === 'ZERO_COMPLETIONS' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-450" />
                    ) : item.type === 'DUPLICATE_NAME' || item.type === 'OVERRIDE_ENABLED' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-450" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-snug">{item.title}</h4>
                    <p className="text-[9.5px] text-zinc-550 font-mono mt-0.5 font-semibold">{item.subtitle}</p>
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
          <h3 className="text-xs font-bold text-zinc-350 tracking-wide uppercase">Community Insights</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Objective frequencies and velocity analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          {/* Most Assigned */}
          <div className="bg-zinc-900/10 border border-zinc-800/60 p-5 rounded-xl space-y-3 shadow-sm">
            <h4 className="text-[9.5px] font-mono font-bold text-zinc-450 tracking-wider uppercase">[ MOST ASSIGNED OBJECTIVES ]</h4>
            <ul className="space-y-2 text-xs">
              {insights.mostAssigned.length === 0 ? (
                <li className="text-zinc-650 italic font-semibold">No spins logged yet.</li>
              ) : (
                insights.mostAssigned.map((item, idx) => (
                  <li key={item.code} className="flex justify-between items-center py-0.5 font-medium border-b border-zinc-900/40 pb-1 last:border-0 last:pb-0">
                    <span className="truncate max-w-[70%] text-zinc-300">
                      {idx + 1}. {item.code} — {item.title}
                    </span>
                    <span className="font-mono text-zinc-550 text-[10px] shrink-0">{item.count} spins</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Least Assigned */}
          <div className="bg-zinc-900/10 border border-zinc-800/60 p-5 rounded-xl space-y-3 shadow-sm">
            <h4 className="text-[9.5px] font-mono font-bold text-zinc-450 tracking-wider uppercase">[ LEAST ASSIGNED OBJECTIVES ]</h4>
            <ul className="space-y-2 text-xs">
              {insights.leastAssigned.length === 0 ? (
                <li className="text-zinc-650 italic font-semibold">No spins logged yet.</li>
              ) : (
                insights.leastAssigned.map((item, idx) => (
                  <li key={item.code} className="flex justify-between items-center py-0.5 font-medium border-b border-zinc-900/40 pb-1 last:border-0 last:pb-0">
                    <span className="truncate max-w-[70%] text-zinc-300">
                      {idx + 1}. {item.code} — {item.title}
                    </span>
                    <span className="font-mono text-zinc-550 text-[10px] shrink-0">{item.count} spins</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Velocity Metrics */}
          <div className="bg-zinc-900/10 border border-zinc-800/60 p-5 rounded-xl flex flex-col justify-between shadow-sm">
            <h4 className="text-[9.5px] font-mono font-bold text-zinc-450 tracking-wider uppercase mb-3">[ VELOCITY METRICS ]</h4>
            <div className="flex-1 flex flex-col justify-center space-y-2.5">
              <div>
                <span className="text-[9px] font-mono text-zinc-550 font-bold block uppercase tracking-wide">Avg Completion Time</span>
                <span className="text-xl font-extrabold text-zinc-200 mt-1 block">
                  {insights.averageTime > 0 ? `${insights.averageTime} mins` : 'N/A'}
                </span>
              </div>
              <p className="text-[9.5px] text-zinc-500 leading-relaxed font-medium">
                Time elapsed from initial spin acceptance to completed proof description logs upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
