import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CompletedStateProps {
  displayName: string;
  missionCode: string;
  missionTitle: string;
}

export const CompletedState: FC<CompletedStateProps> = ({
  displayName,
  missionCode,
  missionTitle
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col items-center space-y-8"
      >
        {/* Glow animated emerald check badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          className="w-16 h-16 rounded-full flex items-center justify-center glass-panel-emerald"
        >
          <Check className="text-emerald-400 w-6 h-6 text-glow-emerald" strokeWidth={2.5} />
        </motion.div>

        {/* Text Details */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.02em] uppercase leading-tight select-none">
            MISSION<br />
            <span className="text-gradient-emerald text-glow-emerald">COMPLETE</span>
          </h1>
          
          <div className="text-[10px] text-zinc-500 font-mono tracking-[0.25em] uppercase">
            {displayName} // {missionCode}
          </div>
          
          <p className="text-xs text-zinc-300 font-medium max-w-[240px] mx-auto leading-relaxed border-t border-zinc-900/60 pt-4 font-sans select-none">
            "{missionTitle}"
          </p>
        </div>

        {/* Closing Ritual Message */}
        <div className="pt-10 text-zinc-500 font-mono text-[9px] tracking-[0.25em] uppercase space-y-1.5 opacity-80">
          <p>Thanks for showing up.</p>
          <p>See you next weekend.</p>
        </div>
      </motion.div>
    </div>
  );
};
