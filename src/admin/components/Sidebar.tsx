import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';

interface SidebarProps {
  isSupabase: boolean;
  weekendKey: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSupabase, weekendKey }) => {
  const activeClass = "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase bg-purple-600 text-white shadow-md shadow-purple-900/10";
  const inactiveClass = "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition";

  return (
    <aside className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 p-4 select-none">
      <nav className="space-y-1.5">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/admin/members"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <Users className="w-4 h-4" />
          <span>Members</span>
        </NavLink>

        <NavLink
          to="/admin/missions"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mission Library</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Connection Info */}
      <div className="bg-zinc-950 border border-zinc-800/80 p-3.5 rounded-xl text-[9px] font-mono text-zinc-500 space-y-1">
        <div className="flex justify-between items-center">
          <span>DATABASE</span>
          <span className={`font-bold ${isSupabase ? 'text-emerald-500' : 'text-yellow-500'}`}>
            {isSupabase ? 'SUPABASE' : 'MOCK'}
          </span>
        </div>
        <div>STATUS: ONLINE</div>
        <div>W_KEY: {weekendKey}</div>
      </div>
    </aside>
  );
};
