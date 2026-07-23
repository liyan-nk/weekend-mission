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
    <div className="mt-auto pt-12 pb-6 flex flex-col items-center justify-center text-center font-mono select-none">
      <span className="text-[8px] text-zinc-700 uppercase tracking-[0.2em] mb-1">
        This Weekend
      </span>
      <span className="text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
        <span>{stats.assignedCount} Assigned</span>
        <span className="text-zinc-800">•</span>
        <span className="text-white">{stats.completedCount} Completed</span>
      </span>
    </div>
  );
};
