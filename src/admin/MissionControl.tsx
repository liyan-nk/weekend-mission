import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAdmin } from './hooks/useAdmin';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { MissionLibrary } from './pages/MissionLibrary';
import { Settings } from './pages/Settings';
import { Loader2 } from 'lucide-react';

export const MissionControl: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // 1. Sync Authentication Session states
  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          setIsAuthenticated(!!session);
        } catch (e) {
          console.error('Auth verification error:', e);
        }
      } else {
        // Mock authentication is only available during local development
        if (import.meta.env.DEV) {
          const localAuth = localStorage.getItem('WM_ADMIN_LOGGED_IN');
          setIsAuthenticated(localAuth === 'true');
        } else {
          setIsAuthenticated(false);
        }
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
      // Local Mock Auth: Allowed only in development mode
      if (import.meta.env.DEV) {
        if (email === 'admin@weekendmission.co' && password === 'adminpassword') {
          localStorage.setItem('WM_ADMIN_LOGGED_IN', 'true');
          setIsAuthenticated(true);
        } else {
          setLoginError('Invalid credentials. Use admin@weekendmission.co / adminpassword in local development mode.');
        }
      } else {
        setLoginError('Production builds require a configured Supabase database to authenticate.');
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
      <div className="min-h-screen bg-zinc-955 flex flex-col items-center justify-center text-zinc-500 font-mono text-xs gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <span>AUTHENTICATING SECURE CORES...</span>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-955 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center font-mono text-[10px] tracking-[0.3em] text-zinc-600 mb-2">
            WEEKEND MISSION
          </div>
          <h2 className="text-center text-2xl font-extrabold text-white tracking-tight">
            Sign in to Mission Control
          </h2>
          {!isSupabaseConfigured() && import.meta.env.DEV && (
            <div className="mt-2 mx-auto max-w-sm px-4 py-2 bg-yellow-950/30 border border-yellow-800/40 rounded-lg text-center text-[10px] text-yellow-550 font-mono">
              [ Development Simulation Mode ]<br />
              Log in with admin@weekendmission.co / adminpassword
            </div>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-zinc-900 border border-zinc-800 py-8 px-6 sm:px-10 rounded-2xl shadow-xl space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-955 border border-zinc-800 rounded-lg text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-purple-600 transition"
                  placeholder="admin@weekendmission.co"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-955 border border-zinc-800 rounded-lg text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-purple-600 transition"
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
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-850 text-white rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-purple-900/10"
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
   WORKSPACE SHELL COMPONENT
   ========================================== */
interface WorkspaceProps {
  handleLogout: () => void;
}

const MissionControlWorkspace: React.FC<WorkspaceProps> = ({ handleLogout }) => {
  const admin = useAdmin();

  return (
    <div className="min-h-screen bg-zinc-955 flex flex-col font-sans text-zinc-100">
      {/* Top Operations Header HUD */}
      <Header 
        isWeekend={admin.weekendStatus.isWeekend}
        overrideState={admin.currentOverride}
        loading={admin.loading}
        refreshing={admin.refreshing}
        onRefresh={() => admin.loadData()}
        onLogout={handleLogout}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar 
          isSupabase={isSupabaseConfigured()} 
          weekendKey={admin.weekendStatus.weekendKey} 
        />

        {/* Content View Switcher */}
        <main className="flex-1 bg-zinc-955 overflow-y-auto p-8 relative flex flex-col justify-start">
          {admin.loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-955 text-zinc-550 font-mono text-xs gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span>SYNCING COMMAND CENTER DATA...</span>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  stats={admin.stats}
                  entries={admin.entries}
                  needsAttention={admin.needsAttentionList}
                  insights={admin.insights}
                  weekendKey={admin.weekendStatus.weekendKey}
                  isWeekend={admin.weekendStatus.isWeekend}
                />
              } />
              <Route path="/members" element={
                <Members 
                  entries={admin.entries} 
                  currentWeekendKey={admin.weekendStatus.weekendKey}
                />
              } />
              <Route path="/missions" element={
                <MissionLibrary 
                  missions={admin.missions}
                  missionAnalytics={admin.missionAnalytics}
                  toggleMissionActive={admin.toggleMissionActive}
                />
              } />
              <Route path="/settings" element={
                <Settings 
                  currentOverride={admin.currentOverride}
                  handleOverrideChange={admin.handleOverrideChange}
                  localDevForce={admin.localDevForce}
                  handleLocalForceToggle={admin.handleLocalForceToggle}
                  reloadAllData={() => admin.loadData(true)}
                />
              } />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};
