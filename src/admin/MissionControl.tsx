import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
      <div className="min-h-screen bg-[#fbfaf8] flex flex-col items-center justify-center text-zinc-600 font-mono text-xs gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
        <span>Authenticating admin session...</span>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md select-none">
          <div className="text-center font-mono text-[9px] tracking-[0.25em] text-zinc-500 mb-2 font-bold">
            WEEKEND MISSION
          </div>
          <h2 className="text-center text-xl font-black text-zinc-900 tracking-tight">
            Sign in to Mission Control
          </h2>
          {!isSupabaseConfigured() && import.meta.env.DEV && (
            <div className="mt-2 mx-auto max-w-sm px-4 py-2 bg-amber-50 border border-zinc-900 rounded-lg text-center text-[10px] text-amber-900 font-mono font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              [ Development Simulation Mode ]<br />
              Log in with admin@weekendmission.co / adminpassword
            </div>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white border-2 border-zinc-900 py-8 px-6 sm:px-10 rounded-xl shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbfaf8] border border-zinc-900 rounded-lg text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition font-medium"
                  placeholder="admin@weekendmission.co"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbfaf8] border border-zinc-900 rounded-lg text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition font-medium"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-900 rounded-lg text-xs font-bold text-rose-900 leading-normal font-sans">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white disabled:text-zinc-500 rounded-lg text-xs font-bold tracking-wide transition flex justify-center items-center gap-2 cursor-pointer font-sans shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-zinc-900"
              >
                {loginLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Sign In
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
    <div className="min-h-screen bg-[#fbfaf8] flex flex-col font-sans text-zinc-900">
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
        <main className="flex-1 bg-[#fbfaf8] overflow-y-auto p-8 relative flex flex-col justify-start">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                stats={admin.stats}
                entries={admin.entries}
                needsAttention={admin.needsAttentionList}
                insights={admin.insights}
                weekendKey={admin.weekendStatus.weekendKey}
                isWeekend={admin.weekendStatus.isWeekend}
                loading={admin.loading}
              />
            } />
            <Route path="/members" element={
              <Members 
                entries={admin.entries} 
                currentWeekendKey={admin.weekendStatus.weekendKey}
                loading={admin.loading}
                showToast={admin.showToast}
              />
            } />
            <Route path="/missions" element={
              <MissionLibrary 
                missions={admin.missions}
                missionAnalytics={admin.missionAnalytics}
                toggleMissionActive={admin.toggleMissionActive}
                loading={admin.loading}
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
        </main>
      </div>

      {/* Lightweight Toast Alert Notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none font-sans">
        <AnimatePresence>
          {admin.toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={`px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider shadow-sm pointer-events-auto flex items-center gap-2 ${
                toast.type === 'warning'
                  ? 'bg-rose-50 border-rose-900 text-rose-955 shadow-rose-900/10'
                  : toast.type === 'info'
                  ? 'bg-sky-50 border-sky-900 text-sky-955 shadow-sky-900/10'
                  : 'bg-emerald-50 border-emerald-905 text-emerald-805 shadow-emerald-900/10'
              }`}
            >
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
