import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWeekendStatus } from './hooks/useWeekendStatus';
import { getEntryForWeekend, assignWeekendMission, completeWeekendMission } from './lib/db';
import type { WeekendEntry, Mission } from './lib/db';
import { AvailabilityGuard } from './components/AvailabilityGuard';
import { LandingPage } from './components/LandingPage';
import { CinematicGenerator } from './components/CinematicGenerator';
import { MissionCard } from './components/MissionCard';
import { SubmissionForm } from './components/SubmissionForm';
import { CompletedState } from './components/CompletedState';
import { PublicWall } from './components/PublicWall';
import { sound } from './lib/sound';
import { Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

type FlowState =
  | 'INITIAL_LOADING'
  | 'CLOSED'
  | 'LANDING'
  | 'GENERATING'
  | 'MISSION_REVEALED'
  | 'MISSION_ASSIGNED'
  | 'SUBMITTING'
  | 'MISSION_COMPLETED';

export default function App() {
  const weekendStatus = useWeekendStatus();
  const [flowState, setFlowState] = useState<FlowState>('INITIAL_LOADING');
  const [deviceId, setDeviceId] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [activeEntry, setActiveEntry] = useState<WeekendEntry | null>(null);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(sound.getSoundEnabled());
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  
  // Pending API loading states
  const [isLoading, setIsLoading] = useState(false);

  // 1. Device ID Initialization
  useEffect(() => {
    let id = localStorage.getItem('wm_device_id');
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
      localStorage.setItem('wm_device_id', id);
    }
    setDeviceId(id);
  }, []);

  // 1b. Listen to input focus globally to detect when a virtual keyboard is likely active
  useEffect(() => {
    const handleFocusChange = () => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
      setIsKeyboardActive(!!isInput);
    };

    document.addEventListener('focusin', handleFocusChange);
    document.addEventListener('focusout', handleFocusChange);
    return () => {
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('focusout', handleFocusChange);
    };
  }, []);

  // 2. Initial Session Load / Restore Progress
  useEffect(() => {
    if (!deviceId) return;

    const checkCurrentState = async () => {
      if (!weekendStatus.isWeekend) {
        setFlowState('CLOSED');
        return;
      }

      setFlowState('INITIAL_LOADING');
      setErrorMsg('');
      try {
        const entry = await getEntryForWeekend(deviceId, weekendStatus.weekendKey);
        if (entry) {
          setActiveEntry(entry);
          setCurrentMission(entry.mission || null);
          setDisplayName(entry.display_name);
          
          if (entry.status === 'Assigned') {
            setFlowState('MISSION_ASSIGNED');
          } else if (entry.status === 'Completed') {
            setFlowState('MISSION_COMPLETED');
          }
        } else {
          // No current mission for this weekend: pre-fill cached name
          const cachedName = localStorage.getItem('wm_display_name') || '';
          setDisplayName(cachedName);
          setFlowState('LANDING');
        }
      } catch (err) {
        console.error('Session load failed:', err);
        setErrorMsg('Something went wrong. Try again.');
        setFlowState('LANDING');
      }
    };

    checkCurrentState();
  }, [deviceId, weekendStatus.isWeekend, weekendStatus.weekendKey]);

  // 3. User clicks SPIN on the landing page
  const handleSpinStart = async (name: string) => {
    sound.playClick();
    localStorage.setItem('wm_display_name', name);
    setDisplayName(name);
    
    setFlowState('GENERATING');
    setErrorMsg('');
    setIsLoading(true);

    const startTime = Date.now();

    try {
      const entry = await assignWeekendMission(deviceId, weekendStatus.weekendKey, name);
      
      // Calculate remaining animation duration to complete the 2.5s visual
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 2500 - elapsed);
      
      setTimeout(() => {
        setActiveEntry(entry);
        setCurrentMission(entry.mission || null);
        setFlowState('MISSION_REVEALED');
        setIsLoading(false);
      }, remaining);
    } catch (e) {
      console.error('Failed to assign mission:', e);
      // Wait for at least 1.5s so the error doesn't flash too fast
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1500 - elapsed);
      
      setTimeout(() => {
        setErrorMsg('Something went wrong. Try again.');
        setFlowState('LANDING');
        setIsLoading(false);
      }, remaining);
    }
  };

  // 5. User accepts the revealed mission
  const handleAcceptMission = () => {
    sound.playClick();
    setFlowState('MISSION_ASSIGNED');
  };

  // 6. User opens submission form
  const handleOpenSubmission = () => {
    sound.playClick();
    setFlowState('SUBMITTING');
  };

  // 7. Submission cancel/close
  const handleCancelSubmission = () => {
    sound.playClick();
    setFlowState('MISSION_ASSIGNED');
  };

  // 8. User submits text proof
  const handleCompleteSubmission = async (proofText: string) => {
    if (!activeEntry) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const updated = await completeWeekendMission(activeEntry.id, proofText);
      setActiveEntry(updated);
      setFlowState('MISSION_COMPLETED');
      
      // Play completion chime
      sound.playComplete();
      
      // Celebrate with premium minimal zinc/grayscale themed confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#a1a1aa', '#52525b', '#27272a']
      });
    } catch (e) {
      console.error('Submission failed:', e);
      setErrorMsg('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    sound.toggleSound(nextState);
    setSoundEnabled(nextState);
  };

  const showPublicWall = 
    weekendStatus.isWeekend && 
    flowState !== 'INITIAL_LOADING' && 
    flowState !== 'CLOSED' && 
    flowState !== 'GENERATING' &&
    !isKeyboardActive;

  return (
    <AvailabilityGuard status={weekendStatus}>
      {/* Poster Mesh Background and Noise */}
      <div className="absolute inset-0 -z-20 bg-mesh-glow pointer-events-none select-none" />
      <div className="absolute inset-0 -z-10 noise-overlay opacity-[0.9] pointer-events-none select-none" />
      
      {/* Premium floating decorative card silhouettes */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none select-none opacity-[0.02]">
        <div className="absolute top-[-5%] left-[-8%] w-[260px] h-[360px] border border-white rounded-3xl transform rotate-12" />
        <div className="absolute bottom-[-5%] right-[-8%] w-[260px] h-[360px] border border-white rounded-3xl transform -rotate-12" />
      </div>

      {/* Global Brand & Sound Controls HUD */}
      {flowState !== 'CLOSED' && flowState !== 'INITIAL_LOADING' && (
        <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-center select-none font-mono">
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-zinc-400 tracking-[0.25em] font-bold">WEEKEND MISSION</span>
            <span className="text-[7px] text-zinc-600 uppercase tracking-[0.25em] mt-0.5">BY UGC COMMUNITY</span>
          </div>
          
          <button
            onClick={handleToggleSound}
            className="px-2.5 py-1 text-[8px] tracking-[0.2em] uppercase transition bg-zinc-950/40 border border-zinc-900/80 rounded-full text-zinc-400 hover:text-zinc-200 hover:border-zinc-800 focus:outline-none cursor-pointer"
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? '🔊 ON' : '🔇 OFF'}
          </button>
        </div>
      )}

      {/* Main Single Page View Container */}
      <div className="relative z-10 w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden">
        {/* Error Alert Display */}
        {errorMsg && (
          <div className="absolute top-20 left-6 right-6 z-50 flex justify-center pointer-events-none">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-4 py-2 bg-red-950/40 border border-red-900/50 rounded-full text-[9px] font-mono text-red-400 tracking-widest uppercase backdrop-blur-md"
            >
              {errorMsg}
            </motion.div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {flowState === 'INITIAL_LOADING' && (
              <motion.div
                key="initial-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[80vh] text-zinc-600 font-mono text-[10px] tracking-widest uppercase gap-2.5"
              >
                <Loader2 className="animate-spin w-3.5 h-3.5 text-zinc-500" />
                <span>Preparing Mission...</span>
              </motion.div>
            )}

            {flowState === 'LANDING' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <LandingPage initialName={displayName} onSpin={handleSpinStart} />
              </motion.div>
            )}

            {flowState === 'GENERATING' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <CinematicGenerator />
              </motion.div>
            )}

            {flowState === 'MISSION_REVEALED' && currentMission && (
              <motion.div
                key="revealed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <MissionCard
                  mission={currentMission}
                  isAssigned={false}
                  onAccept={handleAcceptMission}
                />
              </motion.div>
            )}

            {flowState === 'MISSION_ASSIGNED' && currentMission && (
              <motion.div
                key="assigned"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <MissionCard
                  mission={currentMission}
                  isAssigned={true}
                  onComplete={handleOpenSubmission}
                />
              </motion.div>
            )}

            {flowState === 'SUBMITTING' && currentMission && (
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <SubmissionForm
                  displayName={displayName}
                  mission={currentMission}
                  onSubmit={handleCompleteSubmission}
                  onCancel={handleCancelSubmission}
                  isSubmitting={isLoading}
                />
              </motion.div>
            )}

            {flowState === 'MISSION_COMPLETED' && currentMission && (
              <motion.div
                key="completed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <CompletedState
                  displayName={displayName}
                  missionCode={currentMission.code}
                  missionTitle={currentMission.title}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Community Momentum stats wall footer */}
        {showPublicWall && (
          <PublicWall weekendKey={weekendStatus.weekendKey} />
        )}

        {/* Global Loading Spinner for syncing notifications */}
        {isLoading && flowState !== 'INITIAL_LOADING' && flowState !== 'SUBMITTING' && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[8px] text-zinc-500 font-mono tracking-widest uppercase">
            <Loader2 className="animate-spin w-2.5 h-2.5 text-zinc-400" />
            <span>Syncing</span>
          </div>
        )}
      </div>
    </AvailabilityGuard>
  );
}
