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
        {/* Solid green check badge with thick black borders and flat offset shadow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          className="w-16 h-16 rounded-full bg-[#10B981] border-brutal shadow-brutal-md flex items-center justify-center select-none"
        >
          <Check className="text-white w-7 h-7" strokeWidth={3} />
        </motion.div>

        {/* Text Details */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase leading-[0.85] text-black select-none">
            MISSION<br />
            <span className="text-[#10B981]">COMPLETE</span>
          </h1>
          
          <div className="text-[10px] text-zinc-500 font-mono tracking-[0.25em] uppercase font-bold">
            {displayName} // {missionCode}
          </div>
          
          <p className="text-xs text-zinc-800 font-bold max-w-[240px] mx-auto leading-relaxed border-t-2 border-black pt-4 font-sans select-none">
            "{missionTitle}"
          </p>
        </div>

        {/* Closing Ritual Message */}
        <div className="pt-10 text-zinc-650 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase space-y-1.5 font-bold opacity-90">
          <p>Thanks for showing up.</p>
          <p>See you next weekend.</p>
        </div>
      </motion.div>
    </div>
  );
};
