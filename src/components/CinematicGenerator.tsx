import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_MISSIONS } from '../lib/db';

const DECODING_LABELS = [
  'AUTHENTICATING ACCESS...',
  'PREPARING COLLECTIBLE CARD...',
  'ENGRAVING OBJECTIVE SEALS...',
  'FORMATTING INVITATION DATA...',
  'SNAP-LOCKING PARAMETERS...'
];

export const CinematicGenerator: FC = () => {
  const [currentCode, setCurrentCode] = useState('WM-000');
  const [scrambledTitle, setScrambledTitle] = useState('----------');
  const [statusText, setStatusText] = useState(DECODING_LABELS[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5s visual progression
    const start = Date.now();

    const tick = () => {
      const now = Date.now();
      const elapsed = now - start;

      // 1. Calculate Progress (cap at 100%)
      const percent = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(percent);

      // 2. Update Status Text
      const statusIndex = Math.min(
        Math.floor((elapsed / duration) * DECODING_LABELS.length),
        DECODING_LABELS.length - 1
      );
      setStatusText(DECODING_LABELS[statusIndex]);

      // 3. Shuffle Text
      const randomMission = DEFAULT_MISSIONS[Math.floor(Math.random() * DEFAULT_MISSIONS.length)];
      setCurrentCode(randomMission.code);

      const titleLen = randomMission.title.length;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+-=';
      let result = '';
      for (let i = 0; i < titleLen; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setScrambledTitle(result);

      // Tactile Haptic Tick on mobile device
      if (Math.floor(elapsed / 100) % 2 === 0) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    };

    const interval = setInterval(tick, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-[310px] sm:max-w-[330px] aspect-[4/5] p-8 flex flex-col justify-between relative overflow-hidden glass-panel-violet rounded-2xl"
      >
        {/* Dynamic scanning laser line in Violet */}
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent pointer-events-none z-10"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Top Header Grid */}
        <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 tracking-[0.25em] uppercase">
          <span>CHAMBER STATUS</span>
          <span>PREPARING</span>
        </div>

        {/* Center Printing Cipher Area */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-5">
          <div className="text-[7px] font-mono text-zinc-600 tracking-[0.3em] uppercase select-none opacity-40">
            [ ESTABLISHING CONNECTION ]
          </div>
          
          {/* Mission Code Cipher */}
          <motion.div
            key={currentCode}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-mono tracking-[0.2em] font-extralight text-purple-400 text-glow-violet"
          >
            {currentCode}
          </motion.div>

          {/* Title Scrambler */}
          <div className="h-10 flex items-center justify-center px-4">
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest text-center select-none uppercase opacity-85">
              {scrambledTitle}
            </span>
          </div>
        </div>

        {/* Bottom Loading Progress Details */}
        <div className="space-y-4 font-mono">
          {/* Status Label */}
          <div className="flex justify-between text-[9px] tracking-widest text-zinc-400 text-left">
            <span className="truncate max-w-[80%]">{statusText}</span>
            <span className="text-purple-400">{progress}%</span>
          </div>

          {/* Premium Progress Bar */}
          <div className="w-full h-[3px] bg-zinc-950 border border-zinc-900/60 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
