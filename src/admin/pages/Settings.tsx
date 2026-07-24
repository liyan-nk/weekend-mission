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
    <div className="space-y-8 max-w-3xl w-full select-none font-sans">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">System Settings</h2>
        <p className="text-xs text-zinc-400">Configure global event settings and developer debug overlays.</p>
      </div>

      {/* Global override three-state buttons */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
        <div className="border-b border-zinc-850 pb-4">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Global Weekend Override</h3>
          <p className="text-xs text-zinc-405 mt-1">Force the event to open or close for all users globally, overriding standard Saturday/Sunday calendar rules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onOverrideChange('automatic')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'automatic'
                ? 'bg-purple-950/20 border-purple-500/80 text-white shadow-md'
                : 'bg-zinc-955 border-zinc-850 text-zinc-450 hover:bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Automatic (Default)</span>
            <p className="text-[10px] leading-relaxed opacity-95">
              Normal operations. Event is active on Saturday and Sunday; standby countdown displays on weekdays.
            </p>
          </button>

          <button
            onClick={() => onOverrideChange('force-open')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'force-open'
                ? 'bg-emerald-950/20 border-emerald-500/80 text-white shadow-md'
                : 'bg-zinc-955 border-zinc-850 text-zinc-450 hover:bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Force Open</span>
            <p className="text-[10px] leading-relaxed opacity-95">
              Forces the weekend event to be live immediately for everyone, regardless of what weekday it is.
            </p>
          </button>

          <button
            onClick={() => onOverrideChange('force-closed')}
            disabled={loadingOverride}
            className={`p-4 border rounded-xl flex flex-col justify-between text-left transition cursor-pointer disabled:opacity-50 ${
              currentOverride === 'force-closed'
                ? 'bg-red-950/20 border-red-500/80 text-white shadow-md'
                : 'bg-zinc-955 border-zinc-850 text-zinc-450 hover:bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Force Closed</span>
            <p className="text-[10px] leading-relaxed opacity-95">
              Forces the standby countdown to display for everyone, closing the event even on Saturdays and Sundays.
            </p>
          </button>
        </div>

        {loadingOverride && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
            <span>Syncing database override state...</span>
          </div>
        )}
      </div>

      {/* Local developer overrides - ONLY show in development builds */}
      {import.meta.env.DEV && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
          <div className="border-b border-zinc-850 pb-4">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Local Development overrides</h3>
            <p className="text-xs text-zinc-405 mt-1">Simulation overlays that apply to the current administrator browser view for testing (development only).</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-955 border border-zinc-855 rounded-xl">
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
      )}
    </div>
  );
};
