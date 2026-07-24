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
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center select-none shrink-0 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
          ⭐
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-wide">Mission Control</h1>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Community Operations Command</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Override Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-400 font-bold shadow-inner">
          <span className={`w-1.5 h-1.5 rounded-full ${isWeekend ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></span>
          <span>WEEKEND OVERRIDE: {overrideState.toUpperCase()}</span>
        </div>

        {/* Sync/Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={loading || refreshing}
          className="p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50"
          title="Refresh statistics logs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        {/* Sign Out Action */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 border border-red-900/30 hover:bg-red-900/20 rounded-lg text-xs font-mono font-bold text-red-400 uppercase transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
