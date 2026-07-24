import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Mission } from '../../lib/db';

interface MissionsProps {
  missions: Mission[];
  missionAnalytics: { [code: string]: { assigned: number; completed: number } };
  toggleMissionActive: (missionId: number, currentActive: boolean) => Promise<void>;
}

export const MissionLibrary: React.FC<MissionsProps> = ({ 
  missions, 
  missionAnalytics, 
  toggleMissionActive 
}) => {
  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);

  const handleToggle = async (missionId: number, currentActive: boolean) => {
    setToggleLoadingId(missionId);
    try {
      await toggleMissionActive(missionId, currentActive);
    } catch (e) {
      console.error(e);
    } finally {
      setToggleLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl w-full select-none font-sans text-zinc-900 p-2">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 leading-none">Mission Library</h2>
        <p className="text-xs text-zinc-505 font-bold mt-1 font-mono tracking-wide uppercase">Rolling Objectives and Usage Frequency</p>
      </div>

      {/* Grid listing collectable card deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {missions.map((m) => {
          const analytics = missionAnalytics[m.code] || { assigned: 0, completed: 0 };
          const timesAssigned = analytics.assigned;
          const completionRate = analytics.assigned > 0 ? Math.round((analytics.completed / analytics.assigned) * 100) : 0;

          return (
            <div key={m.id} className="bg-white border-2 border-zinc-900 p-5 rounded-xl flex justify-between items-center text-xs shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,1)] select-none">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-2 font-bold">
                  <span className="bg-[#f5f3ee] border border-zinc-900 px-2 py-0.5 rounded font-mono text-[9px] text-zinc-900 uppercase">
                    {m.code}
                  </span>
                  <span className={`px-2 py-0.5 border border-zinc-900 rounded-[4px] font-mono text-[8px] font-bold tracking-wide uppercase ${
                    m.active 
                      ? 'bg-emerald-50 text-emerald-805' 
                      : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {m.active ? 'ACTIVE' : 'MUTED'}
                  </span>
                </div>
                <h3 className="text-sm font-black text-zinc-900 leading-tight truncate">{m.title}</h3>
                <p className="text-[10.5px] text-zinc-500 leading-normal mt-1 truncate font-medium">{m.description}</p>
                
                {/* Visual Analytics Row */}
                <div className="flex gap-4 mt-3 font-mono text-[8.5px] text-zinc-450 font-bold uppercase border-t border-zinc-100 pt-2.5">
                  <span>Assigned: <span className="text-zinc-800">{timesAssigned} times</span></span>
                  <span>Completion Rate: <span className={completionRate > 0 ? 'text-[#10B981]' : 'text-zinc-450'}>{completionRate}%</span></span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 select-none">
                {toggleLoadingId === m.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                ) : (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={m.active}
                      onChange={() => handleToggle(m.id, m.active)}
                      className="sr-only peer focus:outline-none"
                      aria-label={`Toggle active state for mission ${m.code}`}
                    />
                    <div className="w-9 h-5 bg-[#f5f3ee] border-2 border-zinc-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-zinc-900 peer-checked:bg-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-400 after:border-zinc-900 after:border after:rounded-full after:h-3 after:w-3 after:transition-all" />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
