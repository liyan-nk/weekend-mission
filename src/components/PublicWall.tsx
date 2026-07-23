import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { getWeekendStats } from '../lib/db';

interface PublicWallProps {
  weekendKey: string;
}

export const PublicWall: FC<PublicWallProps> = ({ weekendKey }) => {
  const [stats, setStats] = useState<{ assignedCount: number; completedCount: number } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getWeekendStats(weekendKey);
        setStats(res);
      } catch (e) {
        console.warn('Failed to load wall stats:', e);
      }
    };
    fetchStats();
    
    // Poll every 30 seconds to keep stats updated without manual refresh
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [weekendKey]);

  if (!stats) return null;

  return (
    <div className="mt-auto pt-16 pb-6 flex flex-col items-center justify-center text-center font-mono select-none">
      <span className="text-[8px] text-zinc-500 uppercase tracking-[0.25em] mb-2 font-bold select-none opacity-85">
        THIS WEEKEND
      </span>
      <span className="text-[8px] sm:text-[9px] text-black font-extrabold uppercase tracking-[0.2em] flex items-center gap-2 bg-white border-brutal-sm px-4 py-1.5 shadow-brutal-sm rounded-xl select-none">
        <span>{stats.assignedCount} ASSIGNED</span>
        <span className="text-zinc-400">•</span>
        <span className="text-[#10B981] font-black">{stats.completedCount} COMPLETED</span>
      </span>
    </div>
  );
};
