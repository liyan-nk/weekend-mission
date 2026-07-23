import type { FC, ReactNode } from 'react';
import type { WeekendStatus } from '../hooks/useWeekendStatus';
import { Terminal } from 'lucide-react';

interface AvailabilityGuardProps {
  status: WeekendStatus;
  children: ReactNode;
}

export const AvailabilityGuard: FC<AvailabilityGuardProps> = ({ status, children }) => {
  // Developer helper to toggle weekday/weekend simulation in Dev Mode
  const toggleDebugWeekend = () => {
    const current = localStorage.getItem('WM_DEBUG_FORCE_WEEKEND');
    if (current === 'true') {
      localStorage.removeItem('WM_DEBUG_FORCE_WEEKEND');
    } else {
      localStorage.setItem('WM_DEBUG_FORCE_WEEKEND', 'true');
    }
    window.location.reload();
  };

  const setDebugSimTime = (hoursOffset: number) => {
    if (hoursOffset === 0) {
      localStorage.removeItem('WM_DEBUG_SIMULATED_TIME');
      localStorage.removeItem('WM_DEBUG_FORCE_WEEKEND');
      localStorage.removeItem('wm_device_id');
      localStorage.removeItem('wm_display_name');
      localStorage.removeItem('wm_mock_entries');
    } else {
      const simulatedTime = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
      localStorage.setItem('WM_DEBUG_SIMULATED_TIME', simulatedTime.toISOString());
    }
    window.location.reload();
  };

  // Format countdown remaining time
  const formatCountdown = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    const pad = (n: number) => String(n).padStart(2, '0');

    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds)
    };
  };

  if (!status.isWeekend) {
    const t = formatCountdown(status.countdownMs);

    return (
      <div className="relative min-h-[100dvh] flex flex-col justify-between p-6 overflow-hidden">
        {/* Background Mesh and Noise Grain */}
        <div className="absolute inset-0 -z-20 bg-mesh-glow pointer-events-none select-none" />
        <div className="absolute inset-0 -z-10 noise-overlay opacity-[0.9] pointer-events-none select-none" />

        {/* Top Dev Mode HUD Indicator */}
        <div className="flex justify-end z-50 select-none">
          {import.meta.env.DEV && (
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/60 border border-zinc-900/80 text-[10px] text-zinc-400 font-mono backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>WEEKDAY STANDBY</span>
              <button 
                onClick={toggleDebugWeekend} 
                className="ml-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 text-purple-300 transition cursor-pointer text-[8px] uppercase tracking-wider"
              >
                Force Weekend
              </button>
            </div>
          )}
        </div>

        {/* Closed Content Event Announcement Banner */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto z-10 select-none">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.03em] uppercase leading-[0.9] text-white text-glow-violet select-none">
            WEEKEND<br />
            <span className="text-gradient-violet">MISSION</span>
          </h1>
          <p className="mt-6 text-zinc-500 font-mono text-[9px] sm:text-[11px] tracking-[0.3em] uppercase mb-12 sm:mb-16 select-none opacity-80">
            Returns this Saturday
          </p>

          {/* Live Countdown Grid with Amber highlights */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 w-full max-w-sm mb-8" aria-live="polite">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extrabold font-mono text-gradient-gold text-glow-gold tracking-tight">{t.days}</span>
              <span className="text-[8px] text-zinc-500 font-mono tracking-[0.2em] uppercase mt-2">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extrabold font-mono text-gradient-gold text-glow-gold tracking-tight">{t.hours}</span>
              <span className="text-[8px] text-zinc-500 font-mono tracking-[0.2em] uppercase mt-2">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extrabold font-mono text-gradient-gold text-glow-gold tracking-tight">{t.minutes}</span>
              <span className="text-[8px] text-zinc-500 font-mono tracking-[0.2em] uppercase mt-2">Mins</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extrabold font-mono text-gradient-gold text-glow-gold tracking-tight">{t.seconds}</span>
              <span className="text-[8px] text-zinc-500 font-mono tracking-[0.2em] uppercase mt-2">Secs</span>
            </div>
          </div>
        </main>

        {/* Bottom Dev Simulation Controls */}
        <div className="flex justify-center z-50">
          {import.meta.env.DEV && (
            <div className="flex flex-wrap justify-center gap-2 items-center text-[8px] font-mono text-zinc-500 bg-zinc-950/60 px-4 py-2.5 rounded-full border border-zinc-900/80 backdrop-blur-md select-none">
              <Terminal size={10} className="text-zinc-650" />
              <span>OVERRIDE:</span>
              <button onClick={() => setDebugSimTime(48)} className="underline hover:text-zinc-300 cursor-pointer">Weekend (+48h)</button>
              <span>|</span>
              <button onClick={() => setDebugSimTime(0)} className="underline hover:text-zinc-300 cursor-pointer">Reset Everything</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If weekend is active, render the app layers
  return (
    <div className="relative min-h-screen">
      {/* Dev Mode HUD */}
      {import.meta.env.DEV && (
        <div className="absolute top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-955/60 border border-zinc-900/80 text-[10px] text-zinc-400 font-mono backdrop-blur-md select-none">
          <span className={`w-1.5 h-1.5 rounded-full ${status.isSimulated ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
          <span>{status.isSimulated ? 'SIMULATING' : 'WEEKEND LIVE'}</span>
          <button 
            onClick={toggleDebugWeekend} 
            className="ml-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition cursor-pointer text-[8px] uppercase tracking-wider font-semibold"
          >
            Switch to Weekday
          </button>
          {status.isSimulated && (
            <button 
              onClick={() => setDebugSimTime(0)} 
              className="px-2.5 py-0.5 rounded-full bg-red-950/40 hover:bg-red-900/40 border border-red-900/60 text-red-300 transition cursor-pointer text-[8px] uppercase tracking-wider font-semibold"
            >
              Clear Sim
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
