import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  getAllEntriesForAdmin, 
  getAllMissionsForAdmin, 
  toggleMissionActiveAdmin, 
  getWeekendOverrideAdmin, 
  setWeekendOverrideAdmin,
  type WeekendEntry,
  type Mission
} from '../lib/db';
import { useWeekendStatus } from '../hooks/useWeekendStatus';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  ShieldAlert, 
  Download, 
  LogOut, 
  RefreshCw, 
  Search, 
  Loader2, 
  Clock, 
  ChevronRight, 
  X,
  AlertTriangle
} from 'lucide-react';

export const MissionControl: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // 1. Authentication State Sync
  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          setIsAuthenticated(!!session);
        } catch (e) {
          console.error('Auth check error:', e);
        }
      } else {
        const localAuth = localStorage.getItem('WM_ADMIN_LOGGED_IN');
        setIsAuthenticated(localAuth === 'true');
      }
      setCheckingAuth(false);
    };

    checkAuth();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setLoginError(error.message);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        setLoginError(err.message || 'An error occurred during login.');
      } finally {
        setLoginLoading(false);
      }
    } else {
      // Local Mock Login
      if (email === 'admin@weekendmission.co' && password === 'adminpassword') {
        localStorage.setItem('WM_ADMIN_LOGGED_IN', 'true');
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid admin credentials. Use admin@weekendmission.co / adminpassword in local simulation mode.');
      }
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('WM_ADMIN_LOGGED_IN');
    }
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 font-mono text-xs gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <span>AUTHENTICATING COMMANDS...</span>
      </div>
    );
  }

  // RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center font-mono text-[10px] tracking-[0.3em] text-zinc-550 mb-2">
            WEEKEND MISSION
          </div>
          <h2 className="text-center text-2xl font-extrabold text-white tracking-tight">
            Sign in to Mission Control
          </h2>
          {!isSupabaseConfigured() && (
            <div className="mt-2 mx-auto max-w-sm px-4 py-2 bg-yellow-950/30 border border-yellow-800/40 rounded-lg text-center text-[10px] text-yellow-550 font-mono">
              [ Offline Simulation Mode ]<br />
              Log in with admin@weekendmission.co / adminpassword
            </div>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-zinc-900 border border-zinc-800/80 py-8 px-6 sm:px-10 rounded-2xl shadow-xl space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-zinc-405 font-mono uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-purple-600 transition"
                  placeholder="admin@weekendmission.co"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-zinc-405 font-mono uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-purple-600 transition"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-xs font-semibold text-red-400 font-mono tracking-wide leading-relaxed">
                  ⚠️ {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-purple-900/10"
              >
                {loginLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                SIGN IN
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MissionControlWorkspace handleLogout={handleLogout} />
  );
};

/* ==========================================
   MISSION CONTROL COMPONENT WORKSPACE
   ========================================== */
interface WorkspaceProps {
  handleLogout: () => void;
}

const MissionControlWorkspace: React.FC<WorkspaceProps> = ({ handleLogout }) => {
  const [entries, setEntries] = useState<WeekendEntry[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentOverride, setCurrentOverride] = useState<'automatic' | 'force-open' | 'force-closed'>('automatic');
  const [localDevForce, setLocalDevForce] = useState<boolean>(false);

  const weekendStatus = useWeekendStatus();
  const location = useLocation();

  // Load Initial Admin Data
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const allEntries = await getAllEntriesForAdmin();
      const allMissions = await getAllMissionsForAdmin();
      const overrideVal = await getWeekendOverrideAdmin();
      
      setEntries(allEntries);
      setMissions(allMissions);
      setCurrentOverride(overrideVal);
      setLocalDevForce(localStorage.getItem('WM_DEBUG_FORCE_WEEKEND') === 'true');
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh Dashboard feed every 20 seconds (as requested: 15-30s)
    const refreshTimer = setInterval(() => {
      setRefreshing(true);
      loadData(true);
    }, 20000);

    return () => clearInterval(refreshTimer);
  }, []);

  // Compute Metrics & Insight Lists
  const stats = useMemo(() => {
    const currentWeekendEntries = entries.filter(e => e.weekend_key === weekendStatus.weekendKey);
    const assignedCount = currentWeekendEntries.length;
    const completedCount = currentWeekendEntries.filter(e => e.status === 'Completed').length;
    const completionRate = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;
    const uniqueParticipants = new Set(currentWeekendEntries.map(e => e.device_id)).size;

    return {
      assignedCount,
      completedCount,
      completionRate,
      uniqueParticipants
    };
  }, [entries, weekendStatus.weekendKey]);

  // Compute Insights (Most/Least assigned, Completion percentage, Average Completion Time)
  const insights = useMemo(() => {
    // 1. Most/Least assigned
    const assignmentCounts: { [code: string]: { title: string; count: number; completed: number } } = {};
    
    entries.forEach((e) => {
      if (e.mission) {
        if (!assignmentCounts[e.mission.code]) {
          assignmentCounts[e.mission.code] = { title: e.mission.title, count: 0, completed: 0 };
        }
        assignmentCounts[e.mission.code].count += 1;
        if (e.status === 'Completed') {
          assignmentCounts[e.mission.code].completed += 1;
        }
      }
    });

    const countsList = Object.entries(assignmentCounts).map(([code, d]) => ({
      code,
      title: d.title,
      count: d.count,
      completed: d.completed,
      rate: d.count > 0 ? Math.round((d.completed / d.count) * 100) : 0
    }));

    const mostAssigned = [...countsList].sort((a, b) => b.count - a.count).slice(0, 5);
    const leastAssigned = [...countsList].sort((a, b) => a.count - b.count).slice(0, 5);

    // Calculate Average Completion Time
    let totalMs = 0;
    let completedWithTime = 0;
    entries.forEach((e) => {
      if (e.status === 'Completed' && e.completed_at) {
        const diff = new Date(e.completed_at).getTime() - new Date(e.assigned_at).getTime();
        if (diff > 0) {
          totalMs += diff;
          completedWithTime += 1;
        }
      }
    });

    const averageTime = completedWithTime > 0 
      ? Math.round(totalMs / completedWithTime / 1000 / 60) // in minutes
      : 0;

    return {
      mostAssigned,
      leastAssigned,
      averageTime
    };
  }, [entries]);

  // Needs Attention Section logic:
  const needsAttentionList = useMemo(() => {
    const list: { type: string; title: string; subtitle: string }[] = [];
    const currentWeekendEntries = entries.filter(e => e.weekend_key === weekendStatus.weekendKey);

    // 1. Members who haven't completed yet
    const uncompleted = currentWeekendEntries.filter(e => e.status === 'Assigned');
    uncompleted.forEach((u) => {
      list.push({
        type: 'UNCOMPLETED',
        title: `${u.display_name} has not finished`,
        subtitle: `Assigned: ${u.mission?.code || 'WM'} // Spun ${new Date(u.assigned_at).toLocaleTimeString()}`
      });
    });

    // 2. Inactive missions check
    const inactiveCount = missions.filter(m => !m.active).length;
    if (inactiveCount > 0) {
      list.push({
        type: 'INACTIVE_MISSIONS',
        title: `${inactiveCount} Disabled Missions`,
        subtitle: 'Some library options are temporarily turned off from rolls'
      });
    }

    // 3. Duplicate display names
    const names = currentWeekendEntries.map(e => e.display_name.trim().toLowerCase());
    const duplicates = names.filter((name, idx) => names.indexOf(name) !== idx);
    const uniqueDupes = Array.from(new Set(duplicates));
    uniqueDupes.forEach((dName) => {
      list.push({
        type: 'DUPLICATE_NAME',
        title: `Duplicate Display Name: "${dName}"`,
        subtitle: 'Multiple device logs recorded with this identity'
      });
    });

    return list;
  }, [entries, missions, weekendStatus.weekendKey]);

  const activeTab = location.pathname.split('/').pop() || 'admin';

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100">
      {/* Top Operations Header HUD */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            ⭐
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">Mission Control</h1>
            <p className="text-[10px] text-zinc-550 font-mono tracking-widest uppercase">Community Operations Command</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-400 font-bold shadow-inner">
            <span className={`w-1.5 h-1.5 rounded-full ${weekendStatus.isWeekend ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></span>
            <span>WEEKEND OVERRIDE: {currentOverride.toUpperCase()}</span>
          </div>

          <button
            onClick={() => {
              setRefreshing(true);
              loadData();
            }}
            disabled={loading || refreshing}
            className="p-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 border border-red-900/30 hover:bg-red-900/20 rounded-lg text-xs font-mono font-bold text-red-400 uppercase transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 p-4 select-none">
          <nav className="space-y-1.5">
            <Link
              to="/admin"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition ${
                activeTab === 'admin' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/10' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-250'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>

            <Link
              to="/admin/members"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition ${
                activeTab === 'members' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/10' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-250'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Members</span>
            </Link>

            <Link
              to="/admin/missions"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition ${
                activeTab === 'missions' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/10' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-250'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Mission Library</span>
            </Link>

            <Link
              to="/admin/settings"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition ${
                activeTab === 'settings' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/10' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-250'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Connected Database info badge */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-3.5 rounded-xl text-[9px] font-mono text-zinc-500 space-y-1">
            <div className="flex justify-between items-center">
              <span>DATABASE</span>
              <span className={`font-bold ${isSupabaseConfigured() ? 'text-emerald-500' : 'text-yellow-500'}`}>
                {isSupabaseConfigured() ? 'SUPABASE' : 'MOCK'}
              </span>
            </div>
            <div>STATUS: ONLINE</div>
            <div>W_KEY: {weekendStatus.weekendKey}</div>
          </div>
        </aside>

        {/* Content Tabs Switch */}
        <main className="flex-1 bg-zinc-950 overflow-y-auto p-8 relative flex flex-col justify-start">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-zinc-500 font-mono text-xs gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span>SYNCING MISSION CONTROL...</span>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <DashboardView 
                  stats={stats} 
                  entries={entries} 
                  needsAttention={needsAttentionList} 
                  insights={insights}
                  weekendKey={weekendStatus.weekendKey}
                  isWeekend={weekendStatus.isWeekend}
                />
              } />
              <Route path="/members" element={
                <MembersView 
                  entries={entries} 
                  currentWeekendKey={weekendStatus.weekendKey}
                />
              } />
              <Route path="/missions" element={
                <MissionsView 
                  missions={missions} 
                  reloadMissions={() => loadData(true)} 
                />
              } />
              <Route path="/settings" element={
                <SettingsView 
                  currentOverride={currentOverride}
                  setCurrentOverride={setCurrentOverride}
                  localDevForce={localDevForce}
                  setLocalDevForce={setLocalDevForce}
                  reloadAllData={() => loadData(true)}
                />
              } />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

/* ==========================================
   TAB VIEW 1: OPERATIONAL OVERVIEW
   ========================================== */
interface DashboardViewProps {
  stats: { assignedCount: number; completedCount: number; completionRate: number; uniqueParticipants: number };
  entries: WeekendEntry[];
  needsAttention: { type: string; title: string; subtitle: string }[];
  insights: { mostAssigned: any[]; leastAssigned: any[]; averageTime: number };
  weekendKey: string;
  isWeekend: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  stats, 
  entries, 
  needsAttention, 
  insights,
  weekendKey,
  isWeekend
}) => {
  return (
    <div className="space-y-8 max-w-6xl w-full">
      {/* Page Title Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Operational Overview</h2>
        <p className="text-xs text-zinc-400">Current status and activity statistics for weekend event {weekendKey}.</p>
      </div>

      {/* Large Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Weekend Status</span>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isWeekend ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></span>
            <span className="text-lg font-bold text-white uppercase">{isWeekend ? 'Live' : 'Standby'}</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Total Spins</span>
          <span className="text-3xl font-black text-white mt-1">{stats.assignedCount}</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Completions</span>
          <span className="text-3xl font-black text-[#10B981] mt-1">{stats.completedCount}</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Completion Rate</span>
          <span className="text-3xl font-black text-white mt-1">{stats.completionRate}%</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between col-span-2 lg:col-span-1">
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">Unique Members</span>
          <span className="text-3xl font-black text-white mt-1">{stats.uniqueParticipants}</span>
        </div>
      </div>

      {/* Main Operations Split: Needs Attention & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Needs Attention Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 select-none">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Needs Attention</h3>
          </div>

          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {needsAttention.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl text-center text-xs text-zinc-500 font-medium">
                No alerts detected. Everything is running smoothly!
              </div>
            ) : (
              needsAttention.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 border rounded-xl flex gap-3 items-start ${
                    item.type === 'DUPLICATE_NAME' 
                      ? 'bg-yellow-950/20 border-yellow-900/30 text-yellow-200'
                      : item.type === 'INACTIVE_MISSIONS'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'DUPLICATE_NAME' ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-zinc-550 font-mono mt-1 font-semibold">{item.subtitle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2 select-none">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Recent Activity</h3>
            </div>
            <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-widest">AUTO REFRESHING</span>
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {entries.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl text-center text-xs text-zinc-500 font-medium">
                No activity logged yet this weekend.
              </div>
            ) : (
              entries.slice(0, 10).map((e) => (
                <div key={e.id} className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-xl flex justify-between items-center text-xs">
                  <div className="flex flex-col gap-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{e.display_name}</span>
                      <span className="text-zinc-600 font-normal font-mono text-[9px]">•</span>
                      <span className="text-zinc-550 font-mono text-[9px] font-semibold">{e.mission?.code}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-medium leading-relaxed font-sans truncate max-w-[280px] sm:max-w-md">
                      {e.status === 'Completed' 
                        ? `✓ Finished: "${e.mission?.title}"`
                        : `🎯 Spinning Invitation: "${e.mission?.title}"`}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase ${
                      e.status === 'Completed' 
                        ? 'bg-emerald-950/40 border border-emerald-900/30 text-emerald-400' 
                        : 'bg-purple-950/40 border border-purple-900/30 text-purple-400'
                    }`}>
                      {e.status}
                    </span>
                    <span className="text-[8px] text-zinc-500 font-mono tracking-tighter">
                      {new Date(e.completed_at || e.assigned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Insights Row */}
      <div className="border-t border-zinc-800 pt-8 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Community Insights</h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">Ranked usage frequencies across the timeless library.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Most Assigned */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl space-y-3 select-none">
            <h4 className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase">[ MOST ASSIGNED OBJECTIVES ]</h4>
            <ul className="space-y-2 text-xs">
              {insights.mostAssigned.length === 0 ? (
                <li className="text-zinc-650 italic">No spins logged yet.</li>
              ) : (
                insights.mostAssigned.map((item, idx) => (
                  <li key={item.code} className="flex justify-between items-center py-0.5">
                    <span className="truncate max-w-[70%] font-semibold text-white">
                      {idx + 1}. {item.code} — {item.title}
                    </span>
                    <span className="font-mono text-zinc-500 font-bold">{item.count} spins</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Least Assigned */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl space-y-3 select-none">
            <h4 className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase">[ LEAST ASSIGNED OBJECTIVES ]</h4>
            <ul className="space-y-2 text-xs">
              {insights.leastAssigned.length === 0 ? (
                <li className="text-zinc-650 italic">No spins logged yet.</li>
              ) : (
                insights.leastAssigned.map((item, idx) => (
                  <li key={item.code} className="flex justify-between items-center py-0.5">
                    <span className="truncate max-w-[70%] font-semibold text-white">
                      {idx + 1}. {item.code} — {item.title}
                    </span>
                    <span className="font-mono text-zinc-500 font-bold">{item.count} spins</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Time Insights */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between select-none">
            <h4 className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase mb-3">[ VELOCITY METRICS ]</h4>
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold block uppercase tracking-wide">Avg Completion Time</span>
                <span className="text-2xl font-black text-white mt-1">
                  {insights.averageTime > 0 ? `${insights.averageTime} mins` : 'N/A'}
                </span>
              </div>
              <p className="text-[10px] text-zinc-600 leading-relaxed leading-normal">
                Time elapsed from initial spin acceptance to proof text verification submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   TAB VIEW 2: MEMBERS GRID & DETAILS
   ========================================== */
interface MembersViewProps {
  entries: WeekendEntry[];
  currentWeekendKey: string;
}

const MembersView: React.FC<MembersViewProps> = ({ entries, currentWeekendKey }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Assigned' | 'Completed'>('all');
  const [weekendFilter, setWeekendFilter] = useState<'current' | 'all'>('current');
  const [selectedMember, setSelectedMember] = useState<WeekendEntry | null>(null);

  // 1. Filter and Search logic
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      // Search Display Name or Code
      const nameMatch = e.display_name.toLowerCase().includes(searchQuery.toLowerCase());
      const codeMatch = e.mission?.code.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      if (searchQuery && !nameMatch && !codeMatch) return false;

      // Filter Status
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;

      // Filter Weekend Key
      if (weekendFilter === 'current' && e.weekend_key !== currentWeekendKey) return false;

      return true;
    });
  }, [entries, searchQuery, statusFilter, weekendFilter, currentWeekendKey]);

  // CSV Export utility
  const handleExportCSV = () => {
    if (filteredEntries.length === 0) return;
    
    const headers = ['Display Name', 'Mission Code', 'Status', 'Assigned At', 'Completed At', 'Submission'];
    const rows = filteredEntries.map((e) => [
      `"${e.display_name.replace(/"/g, '""')}"`,
      `"${e.mission?.code || ''}"`,
      `"${e.status}"`,
      `"${e.assigned_at}"`,
      `"${e.completed_at || ''}"`,
      `"${(e.proof_text || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `members_export_${weekendFilter === 'current' ? currentWeekendKey : 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl w-full flex-1 flex flex-col justify-start">
      {/* Title */}
      <div className="flex justify-between items-center select-none shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Event Members Database</h2>
          <p className="text-xs text-zinc-400">Search, filter, and audit participant submissions.</p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredEntries.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 text-xs font-mono font-bold text-white uppercase rounded-xl transition cursor-pointer shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and search parameters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none shrink-0 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
        <div className="relative col-span-2">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-650" />
          <input
            type="text"
            placeholder="Search by display name or mission code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-purple-600 transition"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-purple-600 transition cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Assigned">Status: Assigned</option>
            <option value="Completed">Status: Completed</option>
          </select>
        </div>

        <div>
          <select
            value={weekendFilter}
            onChange={(e) => setWeekendFilter(e.target.value as any)}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-purple-600 transition cursor-pointer"
          >
            <option value="current">Current Weekend ({currentWeekendKey})</option>
            <option value="all">All Weekends</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 min-h-[40vh] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto overflow-y-auto max-h-[52vh] flex-1">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-zinc-950/60 border-b border-zinc-850 font-mono text-[9px] uppercase tracking-wider text-zinc-550 select-none sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5">Display Name</th>
                <th className="px-6 py-3.5">Mission Code</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Assigned Time</th>
                <th className="px-6 py-3.5">Completed Time</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 font-medium font-sans">
                    No matching members found.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-zinc-950/45 transition">
                    <td className="px-6 py-3.5 font-bold text-white">{e.display_name}</td>
                    <td className="px-6 py-3.5 font-mono text-zinc-400 font-bold">{e.mission?.code || '—'}</td>
                    <td className="px-6 py-3.5 select-none">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase ${
                        e.status === 'Completed' 
                          ? 'bg-emerald-950/40 border border-emerald-900/30 text-emerald-400' 
                          : 'bg-purple-950/40 border border-purple-900/30 text-purple-400'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-450 font-mono text-[10px]">
                      {new Date(e.assigned_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-3.5 text-zinc-450 font-mono text-[10px]">
                      {e.completed_at 
                        ? new Date(e.completed_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </td>
                    <td className="px-6 py-3.5 text-right select-none">
                      <button
                        onClick={() => setSelectedMember(e)}
                        className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer flex items-center gap-1.5 ml-auto text-[10px] font-mono font-bold"
                      >
                        <span>AUDIT</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info counts */}
        <div className="bg-zinc-950/40 border-t border-zinc-850 px-6 py-3 flex justify-between items-center text-[10px] font-mono text-zinc-550 select-none shrink-0">
          <span>SHOWING {filteredEntries.length} OF {entries.length} LOGS</span>
          <span>W_KEY: {currentWeekendKey}</span>
        </div>
      </div>

      {/* DETAIL SIDE DRAWER (AUDIT PANEL) */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop mask */}
          <div 
            onClick={() => setSelectedMember(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition" 
          />

          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 select-none">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">Member Registry Details</h3>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-tighter mt-0.5">Device Audit ID: {selectedMember.id}</p>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body details */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs select-none">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold">Display Name</span>
                  <div className="text-sm font-bold text-white py-1">{selectedMember.display_name}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold">Device UUID</span>
                  <div className="font-mono text-zinc-400 select-all py-1">{selectedMember.device_id}</div>
                </div>

                <div className="space-y-1 border-t border-zinc-850 pt-4">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold">Objective Assignment</span>
                  <div className="text-sm font-bold text-purple-400 mt-1">
                    {selectedMember.mission?.code} — {selectedMember.mission?.title}
                  </div>
                  <p className="text-zinc-400 mt-1 leading-relaxed font-sans">{selectedMember.mission?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-850 pt-4">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold block mb-1">Time Spun</span>
                    <span className="font-mono text-zinc-350">
                      {new Date(selectedMember.assigned_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold block mb-1">Time Completed</span>
                    <span className="font-mono text-zinc-350">
                      {selectedMember.completed_at 
                        ? new Date(selectedMember.completed_at).toLocaleString() 
                        : 'INCOMPLETE'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-850 pt-4">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold block">Submission Proof Text</span>
                  <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl text-zinc-300 font-sans leading-relaxed select-text min-h-16 whitespace-pre-wrap">
                    {selectedMember.proof_text || 'No proof description submitted.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* ==========================================
   TAB VIEW 3: MISSION LIBRARY
   ========================================== */
interface MissionsViewProps {
  missions: Mission[];
  reloadMissions: () => void;
}

const MissionsView: React.FC<MissionsViewProps> = ({ missions, reloadMissions }) => {
  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);

  const handleToggleActive = async (missionId: number, currentActive: boolean) => {
    setToggleLoadingId(missionId);
    try {
      await toggleMissionActiveAdmin(missionId, !currentActive);
      reloadMissions();
    } catch (e) {
      console.error('Failed to toggle mission state:', e);
    } finally {
      setToggleLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl w-full">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Mission Library</h2>
        <p className="text-xs text-zinc-400">Enable or disable specific tasks to filter them from new spins.</p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((m) => (
          <div key={m.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center text-xs">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 select-none mb-1">
                <span className="bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded font-mono text-[9px] text-zinc-400 font-bold uppercase shadow-inner">
                  {m.code}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${m.active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              </div>
              <h3 className="font-bold text-white leading-tight truncate">{m.title}</h3>
              <p className="text-[10px] text-zinc-450 leading-relaxed leading-normal mt-1 truncate">{m.description}</p>
            </div>

            <div className="shrink-0 flex items-center gap-2 select-none">
              {toggleLoadingId === m.id ? (
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              ) : (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={m.active}
                    onChange={() => handleToggleActive(m.id, m.active)}
                    className="sr-only peer focus:outline-none"
                    aria-label={`Toggle active state for mission ${m.code}`}
                  />
                  <div className="w-9 h-5 bg-zinc-950 border border-zinc-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-500 after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:bg-emerald-400 peer-checked:bg-emerald-950/45 peer-checked:border-emerald-800/40" />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   TAB VIEW 4: SYSTEM CONTROLS & SETTINGS
   ========================================== */
interface SettingsViewProps {
  currentOverride: 'automatic' | 'force-open' | 'force-closed';
  setCurrentOverride: (v: 'automatic' | 'force-open' | 'force-closed') => void;
  localDevForce: boolean;
  setLocalDevForce: (v: boolean) => void;
  reloadAllData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  currentOverride,
  setCurrentOverride,
  localDevForce,
  setLocalDevForce,
  reloadAllData
}) => {
  const [loadingOverride, setLoadingOverride] = useState<boolean>(false);

  const handleOverrideChange = async (val: 'automatic' | 'force-open' | 'force-closed') => {
    setLoadingOverride(true);
    try {
      await setWeekendOverrideAdmin(val);
      setCurrentOverride(val);
      reloadAllData();
    } catch (e) {
      console.error('Failed to set settings override:', e);
    } finally {
      setLoadingOverride(false);
    }
  };

  const handleLocalForceToggle = (checked: boolean) => {
    if (checked) {
      localStorage.setItem('WM_DEBUG_FORCE_WEEKEND', 'true');
      setLocalDevForce(true);
    } else {
      localStorage.removeItem('WM_DEBUG_FORCE_WEEKEND');
      setLocalDevForce(false);
    }
    // Refresh to apply state simulation changes
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-3xl w-full">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">System Settings</h2>
        <p className="text-xs text-zinc-400">Configure global weekend rules and local developer overrides.</p>
      </div>

      {/* Global Weekend Override options */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
        <div className="border-b border-zinc-850 pb-4 select-none">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Global Weekend Override</h3>
          <p className="text-xs text-zinc-400 mt-1">Force the event to open or close for all users globally, overriding the automatic calendar days.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
          <button
            onClick={() => handleOverrideChange('automatic')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'automatic'
                ? 'bg-purple-950/20 border-purple-500/80 text-white shadow-md'
                : 'bg-zinc-950 border-zinc-850 text-zinc-450 hover:bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Automatic (Default)</span>
            <p className="text-[10px] leading-relaxed opacity-95">
              Normal operations. Event is active on Saturday and Sunday; standby countdown displays on weekdays.
            </p>
          </button>

          <button
            onClick={() => handleOverrideChange('force-open')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'force-open'
                ? 'bg-emerald-950/20 border-emerald-500/80 text-white shadow-md'
                : 'bg-zinc-950 border-zinc-850 text-zinc-450 hover:bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Force Open</span>
            <p className="text-[10px] leading-relaxed opacity-95">
              Forces the weekend event to be live immediately for everyone, regardless of what weekday it is.
            </p>
          </button>

          <button
            onClick={() => handleOverrideChange('force-closed')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'force-closed'
                ? 'bg-red-950/20 border-red-500/80 text-white shadow-md'
                : 'bg-zinc-950 border-zinc-850 text-zinc-450 hover:bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Force Closed</span>
            <p className="text-[10px] leading-relaxed opacity-95">
              Forces the standby countdown to display for everyone, closing the event even on Saturdays and Sundays.
            </p>
          </button>
        </div>

        {loadingOverride && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest select-none">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
            <span>Syncing database override state...</span>
          </div>
        )}
      </div>

      {/* Local Developer Override check */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
        <div className="border-b border-zinc-850 pb-4 select-none">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Local Development overrides</h3>
          <p className="text-xs text-zinc-400 mt-1">Simulation overlays that apply to the current administrator browser view for testing.</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-850 rounded-xl select-none">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">Force Weekend Time simulation</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-tighter leading-relaxed">
              Forces the current browser session to treat this weekday as a weekend (saved locally).
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input
              type="checkbox"
              checked={localDevForce}
              onChange={(e) => handleLocalForceToggle(e.target.checked)}
              className="sr-only peer focus:outline-none"
              aria-label="Toggle local force weekend override"
            />
            <div className="w-9 h-5 bg-zinc-900 border border-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-500 after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:bg-purple-400 peer-checked:bg-purple-950/45 peer-checked:border-purple-800/45" />
          </label>
        </div>
      </div>
    </div>
  );
};
