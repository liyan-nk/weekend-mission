import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SettingsProps {
  currentOverride: 'automatic' | 'force-open' | 'force-closed';
  handleOverrideChange: (v: 'automatic' | 'force-open' | 'force-closed') => Promise<void>;
  localDevForce: boolean;
  handleLocalForceToggle: (v: boolean) => void;
  reloadAllData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  currentOverride,
  handleOverrideChange,
  localDevForce,
  handleLocalForceToggle,
  reloadAllData
}) => {
  const [loadingOverride, setLoadingOverride] = useState<boolean>(false);

  const onOverrideChange = async (val: 'automatic' | 'force-open' | 'force-closed') => {
    setLoadingOverride(true);
    try {
      await handleOverrideChange(val);
      reloadAllData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOverride(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl w-full select-none font-sans text-zinc-100">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Settings</h2>
        <p className="text-xs text-zinc-500 font-medium">Configure global event settings and developer debug overlays.</p>
      </div>

      {/* Global override options */}
      <div className="bg-zinc-900/10 border border-zinc-800/80 p-6 rounded-xl space-y-6">
        <div className="border-b border-zinc-900 pb-4">
          <h3 className="text-xs font-bold text-zinc-300 tracking-wide uppercase">Global Weekend Override</h3>
          <p className="text-[11px] text-zinc-500 mt-1.5 font-medium leading-relaxed">Force the event to open or close for all users globally, overriding standard Saturday/Sunday calendar rules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onOverrideChange('automatic')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'automatic'
                ? 'bg-sky-950/20 border-sky-500/60 text-white shadow-sm'
                : 'bg-zinc-950/40 border-zinc-850 text-zinc-450 hover:bg-zinc-900/60 hover:border-zinc-800'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Automatic (Default)</span>
            <p className="text-[10px] leading-normal opacity-90 font-medium">
              Normal operations. Event is active on Saturday and Sunday; standby countdown displays on weekdays.
            </p>
          </button>

          <button
            onClick={() => onOverrideChange('force-open')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'force-open'
                ? 'bg-emerald-950/20 border-emerald-500/60 text-white shadow-sm'
                : 'bg-zinc-950/40 border-zinc-855 text-zinc-450 hover:bg-zinc-900/60 hover:border-zinc-800'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Force Open</span>
            <p className="text-[10px] leading-normal opacity-90 font-medium">
              Forces the weekend event to be live immediately for everyone, regardless of what weekday it is.
            </p>
          </button>

          <button
            onClick={() => onOverrideChange('force-closed')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'force-closed'
                ? 'bg-rose-955/20 border-rose-500/60 text-white shadow-sm'
                : 'bg-zinc-950/40 border-zinc-855 text-zinc-450 hover:bg-zinc-900/60 hover:border-zinc-800'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Force Closed</span>
            <p className="text-[10px] leading-normal opacity-90 font-medium">
              Forces the standby countdown to display for everyone, closing the event even on Saturdays and Sundays.
            </p>
          </button>
        </div>

        {loadingOverride && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-550 uppercase tracking-widest">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
            <span>Syncing database override state...</span>
          </div>
        )}
      </div>

      {/* Local developer overrides - ONLY show in development builds */}
      {import.meta.env.DEV && (
        <div className="bg-zinc-900/10 border border-zinc-800/80 p-6 rounded-xl space-y-6">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="text-xs font-bold text-zinc-300 tracking-wide uppercase">Local Development overrides</h3>
            <p className="text-[11px] text-zinc-505 mt-1.5 font-medium leading-relaxed">Simulation overlays that apply to the current administrator browser view for testing (development only).</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-950/45 border border-zinc-850/80 rounded-xl">
            <div className="space-y-0.5 min-w-0 pr-4">
              <span className="text-xs font-semibold text-zinc-200 block">Force Weekend Time simulation</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-tighter leading-relaxed">
                Forces the current browser session to treat this weekday as a weekend (saved locally).
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={localDevForce}
                onChange={(e) => handleLocalForceToggle(e.target.checked)}
                className="sr-only peer focus:outline-none"
                aria-label="Toggle local force weekend override"
              />
              <div className="w-9 h-5 bg-zinc-900 border border-zinc-800/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-purple-400 peer-checked:bg-purple-950/40 peer-checked:border-purple-800/40 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-500 after:border-zinc-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
