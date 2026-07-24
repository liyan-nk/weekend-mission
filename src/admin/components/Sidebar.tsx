import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';

interface SidebarProps {
  isSupabase: boolean;
  weekendKey: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSupabase, weekendKey }) => {
  const activeClass = "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold bg-white border border-zinc-900 text-zinc-900 shadow-[1.5px_1.5px_0px_0px_rgba(24,24,27,1)] transition-all";
  const inactiveClass = "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900 border border-transparent transition-all";

  return (
    <aside className="w-60 bg-[#f5f3ee] border-r border-zinc-900/60 flex flex-col justify-between shrink-0 p-5 select-none font-sans">
      <div className="space-y-6">
        {/* Category 1 */}
        <div className="space-y-2">
          <div className="px-3 text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
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

        {/* Category 2 */}
        <div className="space-y-2">
          <div className="px-3 text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
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

        {/* Category 3 */}
        <div className="space-y-2">
          <div className="px-3 text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
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
      <div className="bg-white border border-zinc-900 p-3.5 rounded-lg text-[9px] font-mono text-zinc-500 space-y-1.5 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] select-none">
        <div className="flex justify-between items-center">
          <span>DATABASE</span>
          <span className={`font-bold ${isSupabase ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isSupabase ? 'SUPABASE' : 'MOCK'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>SERVER</span>
          <span className="font-bold text-emerald-700">CONNECTED</span>
        </div>
        <div className="flex justify-between items-center">
          <span>WEEKEND</span>
          <span className="font-bold text-zinc-700">{weekendKey}</span>
        </div>
      </div>
    </aside>
  );
};
