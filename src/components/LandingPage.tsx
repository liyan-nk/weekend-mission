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
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg flex flex-col items-center"
      >
        {/* Massive Neo-Brutalist Header */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-[-0.04em] uppercase leading-[0.85] text-black select-none">
          WEEKEND<br />
          <span className="text-[#FF6B35]">MISSION</span>
        </h1>

        {/* Supporting Copy */}
        <div className="mt-8 text-zinc-650 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase space-y-1 select-none font-medium">
          <p>One Spin. One Mission. One Weekend.</p>
        </div>

        {/* Action Input Form */}
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
              className="w-full px-6 py-4 bg-sky-100 hover:bg-sky-200/80 text-center text-black placeholder-sky-805 border-brutal rounded-2xl focus:outline-none focus:bg-sky-200 transition duration-200 font-mono tracking-widest text-xs font-bold uppercase shadow-brutal-sm focus:shadow-brutal-md focus:translate-x-[-2px] focus:translate-y-[-2px]"
              maxLength={20}
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
                className="absolute left-0 right-0 -bottom-6 text-[9px] text-zinc-600 font-mono tracking-wider font-bold"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* SPIN Button: Chunky, Orange, Rounded Pill with Hard Offset Shadow */}
          <button
            type="submit"
            className="w-full py-4.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase border-brutal rounded-full shadow-brutal-md hover:shadow-brutal-lg transition duration-200 cursor-pointer focus:outline-none btn-brutal-press select-none"
            aria-label="Spin to claim your weekend mission"
          >
            SPIN
          </button>
        </form>
      </motion.div>
    </div>
  );
};
