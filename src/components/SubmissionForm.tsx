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
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm bg-zinc-950/20 border border-zinc-900 rounded-2xl p-8 flex flex-col justify-between aspect-[4/5] box-glow-active"
      >
        {/* Header */}
        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 tracking-widest">
          <span>SUBMISSION</span>
          <span>{mission.code}</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center my-6 space-y-5">
          {/* Readonly identity block */}
          <div className="flex justify-between items-center px-4 py-2.5 bg-zinc-950/40 border border-zinc-900 rounded-xl text-xs font-mono text-zinc-400 select-none">
            <span className="text-zinc-500">MEMBER:</span>
            <span className="truncate max-w-[150px] font-medium text-zinc-300">{displayName}</span>
          </div>

          {/* Readonly mission title */}
          <div className="px-4 py-2.5 bg-zinc-950/40 border border-zinc-900 rounded-xl text-xs font-mono text-zinc-400 text-left select-none">
            <span className="text-zinc-500 block mb-1">OBJECTIVE:</span>
            <span className="font-sans font-normal text-zinc-300 block">{mission.title}</span>
          </div>

          {/* Optional proof input */}
          <div className="relative">
            <textarea
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="What did you accomplish? (Optional)"
              className="w-full h-24 px-4 py-3 bg-zinc-950/40 text-left text-white placeholder-zinc-755 border border-zinc-900 rounded-xl focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 focus-visible:ring-white focus-visible:border-white transition duration-300 font-sans text-xs resize-none box-glow"
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
            className="w-full py-3 bg-white text-black font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-zinc-100 transition duration-300 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Confirm complete mission"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </motion.button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full py-2.5 text-zinc-500 hover:text-zinc-300 font-medium text-[10px] font-mono tracking-widest uppercase transition cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:underline"
            aria-label="Cancel submission"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
