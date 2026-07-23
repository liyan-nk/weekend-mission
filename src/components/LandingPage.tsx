import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  initialName: string;
  onSpin: (name: string) => void;
}

export const LandingPage: FC<LandingPageProps> = ({ initialName, onSpin }) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    onSpin(trimmed);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg flex flex-col items-center"
      >
        {/* Massive Event Poster Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.03em] uppercase leading-[0.9] text-white text-glow-violet select-none">
          WEEKEND<br />
          <span className="text-gradient-violet">MISSION</span>
        </h1>

        {/* Supporting Wording */}
        <div className="mt-6 text-zinc-500 font-mono text-[9px] sm:text-[11px] tracking-[0.3em] uppercase space-y-1 select-none opacity-80">
          <p>One Spin. One Mission. One Weekend.</p>
        </div>

        {/* Action Claim Card */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm mt-12 sm:mt-16 space-y-6">
          <div className="relative w-full">
            <input
              type="text"
              id="name-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="ENTER YOUR NAME"
              className="w-full px-5 py-4 bg-zinc-950/40 text-center text-white placeholder-zinc-700 border border-zinc-900 rounded-full focus:outline-none focus:border-purple-900/80 focus:ring-1 focus:ring-purple-950 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition duration-300 font-mono tracking-widest text-xs box-glow"
              maxLength={25}
              autoComplete="off"
              autoCapitalize="words"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Your display name"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 -bottom-6 text-[9px] text-zinc-500 font-mono tracking-wider"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* SPIN Button: Hero Event Claim Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase rounded-full shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] transition duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Spin to claim your mission"
          >
            SPIN
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
