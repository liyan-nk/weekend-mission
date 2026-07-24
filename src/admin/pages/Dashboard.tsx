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
    <div className="space-y-8 max-w-6xl w-full select-none font-sans">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Operational Overview</h2>
        <p className="text-xs text-zinc-400">Real-time status summaries for weekend event {weekendKey}.</p>
      </div>

      {/* Numerical Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          label="Weekend Status" 
          value={isWeekend ? 'Live' : 'Standby'}
          indicator={
            <span className={`w-2.5 h-2.5 rounded-full ${isWeekend ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></span>
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
          <div className="flex items-center gap-2 border-b border-zinc-805 pb-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Needs Attention</h3>
          </div>

          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {needsAttention.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl text-center text-xs text-zinc-500 font-medium">
                No alerts detected. All systems operating normally!
              </div>
            ) : (
              needsAttention.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 border rounded-xl flex gap-3 items-start ${
                    item.type === 'DUPLICATE_NAME' || item.type === 'OVERRIDE_ENABLED'
                      ? 'bg-yellow-950/25 border-yellow-900/30 text-yellow-300'
                      : item.type === 'ZERO_COMPLETIONS'
                      ? 'bg-red-950/25 border-red-900/30 text-red-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'ZERO_COMPLETIONS' ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : item.type === 'DUPLICATE_NAME' || item.type === 'OVERRIDE_ENABLED' ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Info className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1 font-semibold">{item.subtitle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity feed wrapper */}
        <div className="lg:col-span-7">
          <ActivityFeed entries={entries} />
        </div>

      </div>

      {/* Community Insights Grid */}
      <div className="border-t border-zinc-800 pt-8 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Community Insights</h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">Objective frequencies and velocity analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Most Assigned */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase">[ MOST ASSIGNED OBJECTIVES ]</h4>
            <ul className="space-y-2 text-xs">
              {insights.mostAssigned.length === 0 ? (
                <li className="text-zinc-650 italic">No spins logged yet.</li>
              ) : (
                insights.mostAssigned.map((item, idx) => (
                  <li key={item.code} className="flex justify-between items-center py-0.5">
                    <span className="truncate max-w-[70%] font-semibold text-white">
                      {idx + 1}. {item.code} — {item.title}
                    </span>
                    <span className="font-mono text-zinc-500 font-bold shrink-0">{item.count} spins</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Least Assigned */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase">[ LEAST ASSIGNED OBJECTIVES ]</h4>
            <ul className="space-y-2 text-xs">
              {insights.leastAssigned.length === 0 ? (
                <li className="text-zinc-650 italic">No spins logged yet.</li>
              ) : (
                insights.leastAssigned.map((item, idx) => (
                  <li key={item.code} className="flex justify-between items-center py-0.5">
                    <span className="truncate max-w-[70%] font-semibold text-white">
                      {idx + 1}. {item.code} — {item.title}
                    </span>
                    <span className="font-mono text-zinc-500 font-bold shrink-0">{item.count} spins</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Velocity Metrics */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between">
            <h4 className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase mb-3">[ VELOCITY METRICS ]</h4>
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold block uppercase tracking-wide">Avg Completion Time</span>
                <span className="text-2xl font-black text-white mt-1">
                  {insights.averageTime > 0 ? `${insights.averageTime} mins` : 'N/A'}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                Time elapsed from initial spin acceptance to completed proof description logs upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
