import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { motion } from 'framer-motion';
import type { Mission } from '../lib/db';

interface SubmissionFormProps {
  displayName: string;
  mission: Mission;
  onSubmit: (proofText: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const SubmissionForm: FC<SubmissionFormProps> = ({
  displayName,
  mission,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [proof, setProof] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(proof.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[310px] sm:max-w-[330px] p-8 flex flex-col justify-between aspect-[4/5] glass-panel-violet rounded-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 tracking-[0.25em] uppercase select-none">
          <span>SUBMISSION</span>
          <span className="text-purple-400 text-glow-violet">{mission.code}</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center my-6 space-y-4">
          {/* Readonly identity block */}
          <div className="flex justify-between items-center px-4 py-3 bg-zinc-950/40 border border-zinc-900/60 rounded-xl text-xs font-mono text-zinc-400 select-none">
            <span className="text-zinc-500 text-[10px] tracking-wider font-bold">MEMBER</span>
            <span className="truncate max-w-[150px] font-semibold text-zinc-300 font-sans text-xs">{displayName}</span>
          </div>

          {/* Readonly mission title */}
          <div className="px-4 py-3 bg-zinc-950/40 border border-zinc-900/60 rounded-xl text-xs font-mono text-zinc-400 text-left select-none">
            <span className="text-zinc-500 text-[10px] tracking-wider block mb-1 font-bold">OBJECTIVE</span>
            <span className="font-sans font-medium text-zinc-300 block text-xs leading-relaxed">{mission.title}</span>
          </div>

          {/* Optional proof input */}
          <div className="relative">
            <textarea
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="What did you accomplish? (Optional)"
              className="w-full h-24 px-4 py-3 bg-zinc-950/40 text-left text-white placeholder-zinc-700 border border-zinc-900 rounded-xl focus:outline-none focus:border-purple-900/80 focus:ring-1 focus:ring-purple-950 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition duration-300 font-sans text-xs resize-none box-glow"
              maxLength={200}
              aria-label="Description of what was completed"
            />
            <span className="absolute bottom-2.5 right-3 text-[9px] font-mono text-zinc-500 select-none">
              {proof.length}/200
            </span>
          </div>
        </form>

        {/* Actions */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-[10px] tracking-[0.25em] uppercase rounded-full shadow-[0_0_20px_rgba(245,158,11,0.15)] transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Confirm complete mission"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </motion.button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full py-2 text-zinc-500 hover:text-zinc-300 font-bold text-[9px] font-mono tracking-[0.2em] uppercase transition cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:underline"
            aria-label="Cancel submission"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
