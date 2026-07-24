import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';

interface SidebarProps {
  isSupabase: boolean;
  weekendKey: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSupabase, weekendKey }) => {
  const activeClass = "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50 transition";
  const inactiveClass = "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-250 border border-transparent transition";

  return (
    <aside className="w-60 bg-zinc-900 border-r border-zinc-800/80 flex flex-col justify-between shrink-0 p-4 select-none font-sans">
      <div className="space-y-6">
        {/* Navigation Category 1 */}
        <div className="space-y-2">
          <div className="px-3 text-[9px] font-mono font-bold tracking-widest text-zinc-550 uppercase">
            Command Center
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-zinc-450" />
              <span>Overview</span>
            </NavLink>
          </nav>
        </div>

        {/* Navigation Category 2 */}
        <div className="space-y-2">
          <div className="px-3 text-[9px] font-mono font-bold tracking-widest text-zinc-550 uppercase">
            Operations
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/admin/members"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              <Users className="w-4 h-4 shrink-0 text-zinc-450" />
              <span>Members</span>
            </NavLink>

            <NavLink
              to="/admin/missions"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              <BookOpen className="w-4 h-4 shrink-0 text-zinc-450" />
              <span>Mission Library</span>
            </NavLink>
          </nav>
        </div>

        {/* Navigation Category 3 */}
        <div className="space-y-2">
          <div className="px-3 text-[9px] font-mono font-bold tracking-widest text-zinc-550 uppercase">
            Configuration
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
            >
              <Settings className="w-4 h-4 shrink-0 text-zinc-450" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Connection Info */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 p-3.5 rounded-xl text-[9px] font-mono text-zinc-500 space-y-1.5 shadow-sm">
        <div className="flex justify-between items-center">
          <span>DATABASE</span>
          <span className={`font-bold ${isSupabase ? 'text-emerald-500' : 'text-amber-500'}`}>
            {isSupabase ? 'SUPABASE' : 'MOCK'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>SERVER</span>
          <span className="font-bold text-emerald-500">CONNECTED</span>
        </div>
        <div className="flex justify-between items-center">
          <span>WEEKEND</span>
          <span className="font-bold text-zinc-400">{weekendKey}</span>
        </div>
      </div>
    </aside>
  );
};
