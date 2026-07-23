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
    <div className="flex-1 flex flex-col justify-between items-center w-full px-6 py-6 text-center select-none max-h-[72dvh] sm:max-h-[75dvh] mx-auto max-w-lg my-auto">
      {/* Top spacing helper */}
      <div className="h-6 sm:h-10" />

      {/* Title & Subtitle Group */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center select-none"
      >
        {/* Massive responsive fluid typography */}
        <h1 className="text-[14vw] sm:text-8xl md:text-9xl font-black tracking-[-0.04em] uppercase leading-[0.85] text-black select-none">
          WEEKEND<br />
          <span className="text-[#FF6B35]">MISSION</span>
        </h1>

        <div className="mt-4 text-zinc-650 font-mono text-[9px] sm:text-xs tracking-[0.25em] uppercase font-bold select-none opacity-90">
          One Spin. One Mission. One Weekend.
        </div>
      </motion.div>

      {/* Input name and SPIN Action Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-[290px] sm:max-w-sm flex flex-col gap-y-4 mt-8">
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
            className="w-full px-5 py-3.5 bg-sky-100 hover:bg-sky-200/80 text-center text-black placeholder-sky-700/60 border-brutal rounded-2xl focus:outline-none focus:bg-sky-200 transition duration-200 font-mono tracking-widest text-[10px] sm:text-xs font-bold uppercase shadow-brutal-sm focus:shadow-brutal-md focus:translate-x-[-2px] focus:translate-y-[-2px]"
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
              className="absolute left-0 right-0 -bottom-5 text-[8px] text-zinc-600 font-mono tracking-wider font-bold"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* SPIN: Tactile physical press button */}
        <button
          type="submit"
          className="w-full py-4 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-extrabold text-[10px] sm:text-xs tracking-[0.25em] uppercase border-brutal rounded-full shadow-brutal-md hover:shadow-brutal-lg transition duration-200 cursor-pointer focus:outline-none btn-brutal-press select-none"
          aria-label="Spin to claim your weekend mission"
        >
          SPIN
        </button>
      </form>
    </div>
  );
};
