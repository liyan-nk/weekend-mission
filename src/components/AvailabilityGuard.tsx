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
      <div className="relative h-[100dvh] max-h-[100dvh] flex flex-col justify-between p-6 overflow-hidden select-none pt-[calc(env(safe-area-inset-top,0px)+1.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
        {/* Background Dot Matrix */}
        <div className="absolute inset-0 -z-20 bg-dot-matrix pointer-events-none select-none" />
        
        {/* Background visual stickers */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none select-none opacity-[0.06]">
          <div className="absolute top-[15%] left-[8%] text-3xl font-black text-black select-none">+</div>
          <svg className="absolute bottom-[20%] right-[10%] w-12 h-12 text-black fill-black rotate-12" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
          </svg>
        </div>

        {/* Top Dev Mode HUD Indicator */}
        <div className="flex justify-end z-50 select-none">
          {import.meta.env.DEV && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border-brutal-sm shadow-brutal-sm text-[9px] text-black font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>STANDBY</span>
              <button 
                onClick={toggleDebugWeekend} 
                className="ml-2 px-2.5 py-0.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-brutal-sm text-[8px] uppercase tracking-wider font-extrabold transition cursor-pointer btn-brutal-press"
              >
                Force Weekend
              </button>
            </div>
          )}
        </div>

        {/* Closed Content Event Announcement Banner */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto z-10 select-none max-h-[75vh] my-auto">
          <h1 className="text-[13vw] sm:text-7xl md:text-8xl font-black tracking-[-0.04em] uppercase leading-[0.85] text-black select-none">
            WEEKEND<br />
            <span className="text-[#FF6B35]">MISSION</span>
          </h1>
          <p className="mt-6 text-zinc-555 font-mono text-[9px] sm:text-xs tracking-[0.3em] uppercase mb-10 sm:mb-14 select-none font-bold opacity-90">
            Returns this Saturday
          </p>

          {/* Live Countdown Grid - Chunky Outlined Yellow blocks */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-[290px] sm:max-w-sm mb-6" aria-live="polite">
            <div className="flex flex-col items-center bg-[#FBBF24] border-brutal shadow-brutal-sm p-2 sm:p-3 rounded-2xl aspect-square justify-center">
              <span className="text-2xl sm:text-3xl md:text-5xl font-black font-mono text-black tracking-tight">{t.days}</span>
              <span className="text-[8px] text-black font-mono tracking-[0.15em] uppercase font-bold mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center bg-[#FBBF24] border-brutal shadow-brutal-sm p-2 sm:p-3 rounded-2xl aspect-square justify-center">
              <span className="text-2xl sm:text-3xl md:text-5xl font-black font-mono text-black tracking-tight">{t.hours}</span>
              <span className="text-[8px] text-black font-mono tracking-[0.15em] uppercase font-bold mt-1">Hours</span>
            </div>
            <div className="flex flex-col items-center bg-[#FBBF24] border-brutal shadow-brutal-sm p-2 sm:p-3 rounded-2xl aspect-square justify-center">
              <span className="text-2xl sm:text-3xl md:text-5xl font-black font-mono text-black tracking-tight">{t.minutes}</span>
              <span className="text-[8px] text-black font-mono tracking-[0.15em] uppercase font-bold mt-1">Mins</span>
            </div>
            <div className="flex flex-col items-center bg-[#FBBF24] border-brutal shadow-brutal-sm p-2 sm:p-3 rounded-2xl aspect-square justify-center">
              <span className="text-2xl sm:text-3xl md:text-5xl font-black font-mono text-black tracking-tight">{t.seconds}</span>
              <span className="text-[8px] text-black font-mono tracking-[0.15em] uppercase font-bold mt-1">Secs</span>
            </div>
          </div>
        </main>

        {/* Bottom Dev Simulation Controls */}
        <div className="flex justify-center z-50 select-none">
          {import.meta.env.DEV && (
            <div className="flex flex-wrap justify-center gap-2 items-center text-[8px] font-mono text-black bg-white px-4 py-2 rounded-full border-brutal-sm shadow-brutal-sm font-bold">
              <Terminal size={10} className="text-black" />
              <span>SIMULATE:</span>
              <button onClick={() => setDebugSimTime(48)} className="underline hover:text-[#FF6B35] cursor-pointer">Weekend (+48h)</button>
              <span>|</span>
              <button onClick={() => setDebugSimTime(0)} className="underline hover:text-red-500 cursor-pointer">Reset Everything</button>
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
        <div className="absolute top-8 right-8 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border-brutal-sm text-[10px] text-black font-mono shadow-brutal-sm select-none font-bold">
          <span className={`w-1.5 h-1.5 rounded-full ${status.isSimulated ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
          <span>{status.isSimulated ? 'SIMULATING' : 'WEEKEND LIVE'}</span>
          <button 
            onClick={toggleDebugWeekend} 
            className="ml-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border-brutal-sm text-[8px] uppercase tracking-wider font-extrabold transition cursor-pointer btn-brutal-press"
          >
            Switch to Weekday
          </button>
          {status.isSimulated && (
            <button 
              onClick={() => setDebugSimTime(0)} 
              className="px-2.5 py-0.5 rounded-full bg-[#FF6B35] hover:bg-[#ff7b4b] text-black border-brutal-sm text-[8px] uppercase tracking-wider font-extrabold transition cursor-pointer btn-brutal-press"
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
