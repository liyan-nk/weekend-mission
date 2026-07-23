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
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col items-center space-y-8"
      >
        {/* Glow animated check icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          className="w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950/40 flex items-center justify-center box-glow-active"
        >
          <Check className="text-white w-5 h-5" strokeWidth={1.5} />
        </motion.div>

        {/* Text Details */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-white text-glow">
            Mission Complete.
          </h1>
          
          <div className="text-xs text-zinc-500 font-light tracking-wider uppercase font-mono">
            {displayName} // {missionCode}
          </div>
          
          <p className="text-xs text-zinc-400 font-light max-w-[240px] mx-auto leading-relaxed border-t border-zinc-900/50 pt-4">
            "{missionTitle}"
          </p>
        </div>

        {/* Closing Ritual Message */}
        <div className="pt-8 text-zinc-500 font-light text-[10px] tracking-[0.25em] uppercase space-y-1.5">
          <p>Thanks for showing up.</p>
          <p>See you next weekend.</p>
        </div>
      </motion.div>
    </div>
  );
};
