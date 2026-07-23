import { useState } from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  initialName: string;
  onSpin: (name: string) => void;
}

export const LandingPage: FC<LandingPageProps> = ({ initialName, onSpin }) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white mb-2 text-glow">
          Weekend Mission
        </h1>

        {/* Subtitle */}
        <div className="text-zinc-500 font-light text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-10 sm:mb-14 space-y-1.5 select-none">
          <p>One Spin.</p>
          <p>One Mission.</p>
          <p>One Weekend.</p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative w-full">
            <input
              type="text"
              id="name-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-zinc-950/40 text-center text-white placeholder-zinc-700 border border-zinc-900 rounded-xl focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 focus-visible:ring-white focus-visible:border-white transition duration-300 font-sans tracking-wide text-sm box-glow"
              maxLength={40}
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
                className="absolute left-0 right-0 -bottom-6 text-[10px] text-zinc-500 font-mono tracking-wider"
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-3 bg-white text-black font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-zinc-100 transition duration-300 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Spin for mission"
          >
            SPIN
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
