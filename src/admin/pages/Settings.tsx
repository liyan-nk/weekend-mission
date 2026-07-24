import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="space-y-8 max-w-3xl w-full select-none font-sans text-zinc-900 p-2"
    >
      {/* Title */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 leading-none">Settings</h2>
        <p className="text-xs text-zinc-505 font-bold mt-1 font-mono tracking-wide uppercase">System Overrides and Controls</p>
      </div>

      {/* Global overrides option deck */}
      <div className="bg-white border-2 border-zinc-900 p-6 rounded-xl space-y-6 shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,1)]">
        <div className="border-b border-zinc-100 pb-4">
          <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase font-mono">Global Weekend Override</h3>
          <p className="text-[11px] text-zinc-500 mt-1.5 font-bold leading-relaxed">
            Forces the event to open or close for all users globally. This overrides standard calendar checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold">
          <button
            onClick={() => onOverrideChange('automatic')}
            disabled={loadingOverride}
            className={`p-4 border rounded-lg flex flex-col justify-between text-left transition-all cursor-pointer disabled:opacity-50 active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(24,24,27,1)] ${
              currentOverride === 'automatic'
                ? 'bg-sky-50 border-2 border-zinc-900 text-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]'
                : 'bg-white border border-zinc-350 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-500'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Automatic (Default)</span>
            <p className="text-[10px] leading-normal opacity-90 font-semibold font-sans">
              Normal operations. Event is active on Saturday and Sunday; standby countdown displays on weekdays.
            </p>
          </button>

          <button
            onClick={() => onOverrideChange('force-open')}
            disabled={loadingOverride}
            className={`p-4 border rounded-lg flex flex-col justify-between text-left transition-all cursor-pointer disabled:opacity-50 active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(24,24,27,1)] ${
              currentOverride === 'force-open'
                ? 'bg-emerald-50 border-2 border-zinc-900 text-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]'
                : 'bg-white border border-zinc-350 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-500'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Force Open</span>
            <p className="text-[10px] leading-normal opacity-90 font-semibold font-sans">
              Forces the weekend event to be live immediately for everyone, regardless of what weekday it is.
            </p>
          </button>

          <button
            onClick={() => onOverrideChange('force-closed')}
            disabled={loadingOverride}
            className={`p-4 border rounded-lg flex flex-col justify-between text-left transition-all cursor-pointer disabled:opacity-50 active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(24,24,27,1)] ${
              currentOverride === 'force-closed'
                ? 'bg-rose-50 border-2 border-zinc-900 text-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]'
                : 'bg-white border border-zinc-350 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-500'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5">Force Closed</span>
            <p className="text-[10px] leading-normal opacity-90 font-semibold font-sans">
              Forces the standby countdown to display for everyone, closing the event even on Saturdays and Sundays.
            </p>
          </button>
        </div>

        {loadingOverride && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-405 uppercase tracking-widest font-bold">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-900" />
            <span>Syncing database override state...</span>
          </div>
        )}
      </div>

      {/* Local developer overrides - ONLY show in development builds */}
      {import.meta.env.DEV && (
        <div className="bg-white border-2 border-zinc-900 p-6 rounded-xl space-y-6 shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,1)]">
          <div className="border-b border-zinc-100 pb-4">
            <h3 className="text-xs font-bold text-zinc-800 tracking-wide uppercase font-mono">Local Development overrides</h3>
            <p className="text-[11px] text-zinc-500 mt-1.5 font-bold leading-relaxed">
              Simulation overlays that apply to the current administrator browser view for testing (development only).
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#f5f3ee] border border-zinc-900 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-0.5 min-w-0 pr-4">
              <span className="text-xs font-bold text-zinc-900 block">Force Weekend Time simulation</span>
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
              <div className="w-9 h-5 bg-white border-2 border-zinc-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-zinc-900 peer-checked:bg-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-400 after:border-zinc-900 after:border after:rounded-full after:h-3 after:w-3 after:transition-all" />
            </label>
          </div>
        </div>
      )}
    </motion.div>
  );
};
