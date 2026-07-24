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
    <header className="sticky top-0 z-20 bg-[#f5f3ee] border-b border-zinc-900/60 px-6 py-3 flex justify-between items-center select-none shrink-0 font-sans">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 font-bold font-mono text-[9px] uppercase tracking-[0.25em]">OPERATIONS</span>
        <span className="text-zinc-400 font-light">/</span>
        <h1 className="text-xs font-bold text-zinc-800">Command Center</h1>
      </div>

      {/* Control Actions and Status */}
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-white border border-zinc-900 rounded-full text-[9px] font-mono text-zinc-700 font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          <span className={`w-1.5 h-1.5 rounded-full ${isWeekend ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`}></span>
          <span>OVERRIDE: {overrideState.toUpperCase()}</span>
        </div>

        {/* Refresh Sync */}
        <button
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="p-1.5 bg-white border border-zinc-900 hover:bg-zinc-100 rounded-lg text-zinc-655 hover:text-zinc-900 transition cursor-pointer disabled:opacity-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          title="Refresh operations logs"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        {/* Profile Info */}
        <div className="flex items-center gap-2.5 border-l border-zinc-900/30 pl-4">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-zinc-900 uppercase border border-zinc-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            A
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] font-bold text-zinc-800 leading-tight">Admin Console</span>
            <span className="text-[8px] font-mono text-zinc-405 leading-none">admin@weekendmission.co</span>
          </div>

          <button
            onClick={onLogout}
            className="p-1 bg-white border border-zinc-900 hover:bg-zinc-100 hover:text-red-600 rounded-lg text-zinc-500 transition cursor-pointer ml-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            title="Sign Out"
          >
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
