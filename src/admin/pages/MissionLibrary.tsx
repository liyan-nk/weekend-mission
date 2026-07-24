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
    <div className="space-y-6 max-w-6xl w-full select-none font-sans">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Mission Library</h2>
        <p className="text-xs text-zinc-400">Configure enabled library options and review rolling analytics.</p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((m) => {
          const analytics = missionAnalytics[m.code] || { assigned: 0, completed: 0 };
          const timesAssigned = analytics.assigned;
          const completionRate = analytics.assigned > 0 ? Math.round((analytics.completed / analytics.assigned) * 100) : 0;

          return (
            <div key={m.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center text-xs">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 select-none mb-1">
                  <span className="bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded font-mono text-[9px] text-zinc-400 font-bold uppercase shadow-inner">
                    {m.code}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${m.active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                </div>
                <h3 className="font-bold text-white leading-tight truncate">{m.title}</h3>
                <p className="text-[10px] text-zinc-450 leading-relaxed mt-1 truncate">{m.description}</p>
                
                {/* Visual Analytics Row */}
                <div className="flex gap-4 mt-2.5 font-mono text-[8.5px] text-zinc-500 font-bold uppercase">
                  <span>Assigned: <span className="text-zinc-350">{timesAssigned} times</span></span>
                  <span>Rate: <span className={completionRate > 0 ? 'text-[#10B981]' : 'text-zinc-355'}>{completionRate}%</span></span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 select-none">
                {toggleLoadingId === m.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                ) : (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={m.active}
                      onChange={() => handleToggle(m.id, m.active)}
                      className="sr-only peer focus:outline-none"
                      aria-label={`Toggle active state for mission ${m.code}`}
                    />
                    <div className="w-9 h-5 bg-zinc-950 border border-zinc-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-500 after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:bg-emerald-400 peer-checked:bg-emerald-950/45 peer-checked:border-emerald-800/40" />
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
