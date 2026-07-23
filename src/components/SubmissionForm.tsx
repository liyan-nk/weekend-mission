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
    <div className="flex-1 flex flex-col justify-center items-center w-full px-6 py-4 select-none max-h-[82vh] my-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-[88%] max-w-[310px] sm:max-w-[330px] p-6 sm:p-8 flex flex-col justify-between aspect-[4/5] max-h-[62dvh] bg-white border-brutal shadow-brutal-lg rounded-[2rem] relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-mono text-zinc-500 tracking-[0.25em] uppercase select-none font-bold">
          <span>SUBMISSION</span>
          <span className="text-purple-600 font-extrabold">{mission.code}</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center my-4 space-y-3">
          {/* Readonly identity block */}
          <div className="flex justify-between items-center px-4 py-2 bg-zinc-50 border border-black rounded-xl text-[10px] sm:text-xs font-mono text-black select-none font-bold">
            <span className="text-zinc-500 text-[9px] tracking-wider">MEMBER</span>
            <span className="truncate max-w-[140px] font-extrabold font-sans text-[10px] sm:text-xs">{displayName}</span>
          </div>

          {/* Readonly mission title */}
          <div className="px-4 py-2 bg-zinc-50 border border-black rounded-xl text-[10px] sm:text-xs font-mono text-black text-left select-none font-bold">
            <span className="text-zinc-500 text-[9px] tracking-wider block mb-0.5">OBJECTIVE</span>
            <span className="font-sans font-medium text-black block text-[10px] sm:text-xs leading-tight truncate">{mission.title}</span>
          </div>

          {/* Optional proof input */}
          <div className="relative">
            <textarea
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="What did you accomplish? (Optional)"
              className="w-full h-18 sm:h-22 px-4 py-2.5 bg-sky-50 hover:bg-sky-100/40 text-left text-black placeholder-sky-805 border border-black rounded-xl focus:outline-none focus:bg-sky-100 transition duration-200 font-sans text-xs resize-none select-none font-medium"
              maxLength={200}
              aria-label="Description of what was completed"
            />
            <span className="absolute bottom-2 right-3 text-[8px] font-mono text-zinc-500 select-none">
              {proof.length}/200
            </span>
          </div>
        </form>

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-brutal rounded-full shadow-brutal-md hover:shadow-brutal-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none btn-brutal-press font-extrabold text-[9px] sm:text-[10px] tracking-[0.25em] uppercase select-none"
            aria-label="Confirm complete mission"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full py-1 text-zinc-500 hover:text-black font-bold text-[9px] font-mono tracking-[0.2em] uppercase transition cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:underline select-none"
            aria-label="Cancel submission"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
