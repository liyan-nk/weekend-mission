import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import { DEFAULT_MISSIONS } from '../lib/db';

const DECODING_LABELS = [
  'SHUFFLING DATABASE...',
  'RETRIEVING WEEKEND ARCHIVES...',
  'FILTERING UNSEEN TASKS...',
  'DECODING OBJECTIVE PARADIGMS...',
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
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs aspect-[4/5] bg-zinc-950/20 border border-zinc-900 rounded-2xl relative overflow-hidden flex flex-col justify-between p-8 box-glow-active"
      >
        {/* Dynamic scanning laser line */}
        <motion.div
          className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Top Header Grid */}
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 tracking-wider">
          <span>DECODING UNIT</span>
          <span>EST. SEC // 2.5</span>
        </div>

        {/* Center Cipher Area */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          {/* Mission Code Cipher */}
          <motion.div
            key={currentCode}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-mono font-medium tracking-widest text-zinc-400"
          >
            {currentCode}
          </motion.div>

          {/* Title Scrambler */}
          <div className="h-10 flex items-center justify-center">
            <span className="text-sm font-mono text-zinc-500 tracking-widest text-center select-none uppercase blur-[0.5px]">
              {scrambledTitle}
            </span>
          </div>
        </div>

        {/* Bottom Loading Progress Details */}
        <div className="space-y-4 font-mono">
          {/* Status Label */}
          <div className="flex justify-between text-[10px] tracking-widest text-zinc-500 text-left">
            <span className="truncate max-w-[80%]">{statusText}</span>
            <span>{progress}%</span>
          </div>

          {/* Simple Premium Progress Bar */}
          <div className="w-full h-[1px] bg-zinc-900 relative">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
