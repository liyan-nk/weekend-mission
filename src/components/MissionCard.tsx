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
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center select-none">
      {/* Top Status Header for Locked Missions */}
      {isAssigned && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center space-y-1.5"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-500/80 font-mono">
            MISSION LOCK
          </span>
          <p className="text-[11px] text-zinc-500 font-light leading-relaxed max-w-[200px]">
            Good luck. See you after completing it.
          </p>
        </motion.div>
      )}

      {/* 3D Card Container */}
      <div 
        onClick={handleReveal}
        className="w-full max-w-[310px] sm:max-w-[330px] aspect-[4/5] [perspective:1000px] cursor-pointer"
      >
        <motion.div
          className="w-full h-full relative [transform-style:preserve-3d] select-none"
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* CARD BACK (Hidden state) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-zinc-955/25 border border-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center box-glow-active"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              visibility: revealed ? 'hidden' : 'visible'
            }}
          >
            <div className="w-full flex flex-col items-center space-y-8 py-4">
              {/* Header */}
              <div className="text-[8px] font-mono text-zinc-500 tracking-[0.25em] uppercase select-none">
                UGC WEEKEND MISSION
              </div>

              {/* Visual rhythm lines */}
              <div className="w-8 h-[1px] bg-zinc-900/60" />

              {/* Suspense body */}
              <div className="flex flex-col items-center space-y-3 select-none">
                <span className="text-[10px] font-mono text-zinc-400 tracking-[0.2em] uppercase text-glow">
                  MISSION GENERATED
                </span>
                <span className="text-zinc-500 tracking-[0.3em] font-light text-lg">
                  ••••••••••••••••
                </span>
              </div>

              <div className="w-8 h-[1px] bg-zinc-900/60" />

              {/* Bottom Call to Action */}
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[9px] font-mono text-zinc-500 tracking-[0.2em] uppercase select-none"
              >
                TAP TO REVEAL
              </motion.div>
            </div>
          </div>

          {/* CARD FRONT (Revealed State) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-zinc-950/30 border border-zinc-900 rounded-2xl p-8 flex flex-col justify-center items-center box-glow-active"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              visibility: revealed ? 'visible' : 'hidden'
            }}
          >
            <div className="w-full flex flex-col items-center space-y-6 py-2">
              {/* Top Header Group */}
              <div className="flex flex-col items-center space-y-1 font-mono select-none">
                <span className="text-[8px] text-zinc-500 tracking-[0.25em] uppercase">MISSION CODE</span>
                <span className="text-sm text-zinc-300 font-mono tracking-widest font-medium mt-0.5">{mission.code}</span>
              </div>

              {/* Visual rhythm divider */}
              <div className="w-8 h-[1px] bg-zinc-900/60" />

              {/* Center Mission Content Group */}
              <div className="flex flex-col items-center space-y-3 px-2 text-center select-none">
                <h3 className="text-xl sm:text-2xl font-extralight text-white leading-tight tracking-tight text-glow max-w-[240px]">
                  {mission.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 font-light leading-relaxed max-w-[210px]">
                  {mission.description}
                </p>
              </div>

              {/* Visual rhythm divider */}
              <div className="w-8 h-[1px] bg-zinc-900/60" />

              {/* Bottom Metadata & Action Group */}
              <div className="w-full flex flex-col items-center space-y-6">
                {/* Deadline */}
                <div className="flex flex-col items-center space-y-1 font-mono select-none">
                  <span className="text-[8px] text-zinc-500 tracking-[0.2em] uppercase font-mono">DEADLINE</span>
                  <span className="text-[10px] text-zinc-300 font-light font-mono tracking-wide">SUNDAY • 11:59 PM</span>
                </div>

                {/* Action Button: Prevent click propagation to card flip handler */}
                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                  {!isAssigned ? (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onAccept}
                      className="w-full py-3 bg-white text-black font-semibold text-[10px] tracking-widest uppercase rounded-xl hover:bg-zinc-100 transition duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Accept Mission
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onComplete}
                      className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 font-semibold text-[10px] tracking-widest uppercase rounded-xl transition duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      Complete Mission
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
