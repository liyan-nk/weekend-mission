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
      <div className="relative min-h-screen flex flex-col justify-between p-6 bg-grid">
        {/* Top Spacer or Debug Indicator */}
        <div className="flex justify-end">
          {import.meta.env.DEV && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Weekday Mode</span>
              <button 
                onClick={toggleDebugWeekend} 
                className="ml-2 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
              >
                Force Weekend
              </button>
            </div>
          )}
        </div>

        {/* Closed Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2 text-glow">
            Weekend Mission
          </h1>
          <p className="text-zinc-500 font-light tracking-[0.25em] text-[10px] uppercase mb-12 select-none">
            Returns this Saturday
          </p>

          {/* Live Countdown Grid */}
          <div className="grid grid-cols-4 gap-4 md:gap-6 w-full max-w-sm mb-8" aria-live="polite">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extralight font-mono text-white tracking-tight">{t.days}</span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-2 select-none">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extralight font-mono text-white tracking-tight">{t.hours}</span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-2 select-none">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extralight font-mono text-white tracking-tight">{t.minutes}</span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-2 select-none">Mins</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extralight font-mono text-white tracking-tight">{t.seconds}</span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-2 select-none">Secs</span>
            </div>
          </div>
        </main>

        {/* Bottom Spacer or Debug Controls */}
        <div className="flex justify-center">
          {import.meta.env.DEV && (
            <div className="flex flex-wrap justify-center gap-2 items-center text-[10px] font-mono text-zinc-500 bg-zinc-950 p-2 rounded-lg border border-zinc-900">
              <Terminal size={10} />
              <span>Simulate:</span>
              <button onClick={() => setDebugSimTime(48)} className="underline hover:text-zinc-300">Set Weekend Time (+48h)</button>
              <span>|</span>
              <button onClick={() => setDebugSimTime(0)} className="underline hover:text-zinc-300">Reset Time</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If weekend, render app
  return (
    <div className="relative min-h-screen bg-grid">
      {/* Dev Mode HUD */}
      {import.meta.env.DEV && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${status.isSimulated ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
          <span>{status.isSimulated ? 'Simulated Weekend' : 'Weekend Active'}</span>
          <button 
            onClick={toggleDebugWeekend} 
            className="ml-2 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            Switch to Weekday
          </button>
          {status.isSimulated && (
            <button 
              onClick={() => setDebugSimTime(0)} 
              className="px-2 py-0.5 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 transition"
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
