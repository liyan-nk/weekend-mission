import { useState } from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import type { Mission } from '../lib/db';
import { sound } from '../lib/sound';

interface MissionCardProps {
  mission: Mission;
  isAssigned: boolean;
  onAccept?: () => void;
  onComplete?: () => void;
}

export const MissionCard: FC<MissionCardProps> = ({
  mission,
  isAssigned,
  onAccept,
  onComplete
}) => {
  // If it's already locked (assigned), show it revealed by default.
  // Otherwise start face-down for suspense.
  const [revealed, setRevealed] = useState(isAssigned);

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    sound.playReveal();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center select-none">
      {/* Top Status Header for Locked Missions */}
      {isAssigned && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center space-y-1 select-none"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-purple-600 bg-purple-100 border-brutal-sm px-3 py-1 rounded-full font-mono font-extrabold shadow-brutal-sm">
            ACTIVE CONTRACT
          </span>
          <p className="text-[11px] text-zinc-650 font-semibold leading-relaxed max-w-[200px] mt-1.5">
            Complete the objective before the weekend ends.
          </p>
        </motion.div>
      )}

      {/* Collectible Trading Card Container */}
      <div 
        onClick={handleReveal}
        className="w-full max-w-[310px] sm:max-w-[330px] aspect-[4/5] [perspective:1000px] cursor-pointer"
      >
        <motion.div
          className="w-full h-full relative [transform-style:preserve-3d] select-none"
          animate={{ rotateY: revealed ? 180 : 0, scale: revealed ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* CARD BACK (Collectible Yellow Trading Ticket) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-[#FBBF24] border-brutal shadow-brutal-lg rounded-[2rem] p-8 flex flex-col justify-between items-center"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              visibility: revealed ? 'hidden' : 'visible'
            }}
          >
            {/* Header */}
            <div className="text-[8px] font-mono text-black tracking-[0.3em] uppercase font-black select-none">
              UGC WEEKEND MISSION
            </div>

            {/* Flat Divider */}
            <div className="w-12 h-1 bg-black rounded-full" />

            {/* Suspense body */}
            <div className="flex flex-col items-center space-y-3 select-none relative">
              {/* Sticker element in background */}
              <div className="absolute -top-6 text-black/5 text-7xl font-black select-none pointer-events-none">★</div>
              <span className="text-[10px] font-mono text-black tracking-[0.2em] uppercase font-black">
                INVITATION SEAL
              </span>
              <span className="bg-black text-white px-3 py-1 text-[10px] tracking-widest font-black uppercase rounded-lg border-brutal-sm shadow-brutal-sm mt-3">
                CLAIM ACCESS
              </span>
            </div>

            {/* Flat Divider */}
            <div className="w-12 h-1 bg-black rounded-full" />

            {/* Bottom Call to Action */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[9px] font-mono text-black tracking-[0.2em] uppercase font-black select-none"
            >
              TAP TO REVEAL
            </motion.div>
          </div>

          {/* CARD FRONT (Collectible Collectible Invitation Card) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-white border-brutal shadow-brutal-lg rounded-[2rem] p-8 flex flex-col justify-between items-center"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              visibility: revealed ? 'visible' : 'hidden'
            }}
          >
            {/* Top Header Group */}
            <div className="flex flex-col items-center space-y-2 font-mono select-none w-full">
              <span className="text-[8px] text-zinc-500 tracking-[0.25em] uppercase font-bold">WEEKEND INVITATION</span>
              
              {/* Yellow Square Badge */}
              <span className="bg-[#FBBF24] text-black border-brutal-sm px-3.5 py-1 text-xs tracking-widest font-mono font-black uppercase rounded-xl shadow-brutal-sm">
                {mission.code}
              </span>
            </div>

            {/* Flat Divider */}
            <div className="w-12 h-[3px] bg-black rounded-full" />

            {/* Center Mission Content Group */}
            <div className="flex flex-col items-center space-y-3 px-1 text-center select-none w-full">
              <h3 className="text-2xl sm:text-3xl font-black text-black leading-none tracking-tight uppercase max-w-[240px]">
                {mission.title}
              </h3>
              <p className="text-xs text-zinc-700 font-medium leading-relaxed max-w-[210px] mt-1.5 font-sans">
                {mission.description}
              </p>
            </div>

            {/* Flat Divider */}
            <div className="w-12 h-[3px] bg-black rounded-full" />

            {/* Bottom Metadata & Action Group */}
            <div className="w-full flex flex-col items-center space-y-6">
              {/* Deadline (Electric Violet Badge Accent) */}
              <div className="flex flex-col items-center select-none font-mono">
                <span className="text-[8px] text-zinc-400 tracking-[0.2em] uppercase font-bold">DEADLINE</span>
                <span className="text-[10px] text-purple-600 border-brutal-sm bg-purple-50 px-3 py-0.5 rounded-full shadow-brutal-sm font-extrabold tracking-wide mt-1.5">
                  SUNDAY • 11:59 PM
                </span>
              </div>

              {/* Action Button: Prevent click propagation to card flip handler */}
              <div className="w-full" onClick={(e) => e.stopPropagation()}>
                {!isAssigned ? (
                  <button
                    onClick={onAccept}
                    className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-brutal rounded-full shadow-brutal-md hover:shadow-brutal-lg transition duration-200 cursor-pointer font-extrabold text-[10px] tracking-[0.25em] uppercase focus:outline-none btn-brutal-press select-none"
                  >
                    Accept Mission
                  </button>
                ) : (
                  <button
                    onClick={onComplete}
                    className="w-full py-3.5 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black border-brutal rounded-full shadow-brutal-md hover:shadow-brutal-lg transition duration-200 cursor-pointer font-extrabold text-[10px] tracking-[0.25em] uppercase focus:outline-none btn-brutal-press select-none"
                  >
                    Complete Mission
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
