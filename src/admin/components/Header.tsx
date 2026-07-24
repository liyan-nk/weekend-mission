import React from 'react';
import { RefreshCw, LogOut } from 'lucide-react';

interface HeaderProps {
  isWeekend: boolean;
  overrideState: string;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isWeekend,
  overrideState,
  loading,
  refreshing,
  onRefresh,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/80 px-6 py-3.5 flex justify-between items-center select-none shrink-0 font-sans">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-600 font-bold font-mono text-[9px] uppercase tracking-[0.25em]">OPERATIONS</span>
        <span className="text-zinc-700 font-light">/</span>
        <h1 className="text-xs font-semibold text-zinc-300">Command Center</h1>
      </div>

      {/* Control Actions and Status */}
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-mono text-zinc-400 font-semibold shadow-inner">
          <span className={`w-1.5 h-1.5 rounded-full ${isWeekend ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`}></span>
          <span>OVERRIDE: {overrideState.toUpperCase()}</span>
        </div>

        {/* Refresh Sync */}
        <button
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="p-1.5 bg-zinc-900 border border-zinc-800/80 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50"
          title="Refresh operations logs"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        {/* Muted Admin Profile HUD */}
        <div className="flex items-center gap-2.5 border-l border-zinc-800 pl-4 select-none">
          <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 uppercase shadow-inner border border-zinc-700/50">
            A
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-medium text-zinc-300 leading-tight">Admin Console</span>
            <span className="text-[8px] font-mono text-zinc-550 leading-none">admin@weekendmission.co</span>
          </div>

          <button
            onClick={onLogout}
            className="p-1 bg-zinc-900 border border-zinc-800/80 hover:bg-zinc-850 hover:text-red-400 rounded-lg text-zinc-400 transition cursor-pointer ml-1.5"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
