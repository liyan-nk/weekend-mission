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
      {/* Top Status Header for Assigned Event Cards */}
      {isAssigned && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center space-y-1"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-purple-400 font-mono text-glow-violet font-semibold">
            ACTIVE CHALLENGE
          </span>
          <p className="text-[11px] text-zinc-500 font-light leading-relaxed max-w-[200px]">
            Good luck. Complete it before the weekend ends.
          </p>
        </motion.div>
      )}

      {/* Collectible Card Container */}
      <div 
        onClick={handleReveal}
        className="w-full max-w-[310px] sm:max-w-[330px] aspect-[4/5] [perspective:1000px] cursor-pointer"
      >
        <motion.div
          className="w-full h-full relative [transform-style:preserve-3d] select-none"
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* CARD BACK (Golden Ticket/Invitation Theme) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden glass-panel-gold rounded-3xl p-8 flex flex-col justify-center items-center"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              visibility: revealed ? 'hidden' : 'visible'
            }}
          >
            <div className="w-full flex flex-col items-center space-y-8 py-4">
              {/* Header */}
              <div className="text-[8px] font-mono text-gradient-gold tracking-[0.3em] uppercase font-bold text-glow-gold select-none">
                UGC WEEKEND MISSION
              </div>

              {/* Gold Divider Line */}
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />

              {/* Suspense body */}
              <div className="flex flex-col items-center space-y-3 select-none">
                <span className="text-[10px] font-mono text-zinc-400 tracking-[0.2em] uppercase text-glow">
                  INVITATION SEAL
                </span>
                <span className="text-amber-500/80 tracking-[0.3em] font-light text-lg">
                  •••• •••• ••••
                </span>
              </div>

              {/* Gold Divider Line */}
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />

              {/* Bottom Call to Action */}
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[9px] font-mono text-gradient-gold tracking-[0.2em] uppercase font-semibold text-glow-gold select-none"
              >
                TAP TO CLAIM
              </motion.div>
            </div>
          </div>

          {/* CARD FRONT (Revealed Collectible Invitation Theme) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] glass-panel-violet rounded-3xl p-8 flex flex-col justify-center items-center"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              visibility: revealed ? 'visible' : 'hidden'
            }}
          >
            <div className="w-full flex flex-col items-center space-y-6 py-2">
              {/* Top Header Group */}
              <div className="flex flex-col items-center space-y-1 font-mono select-none">
                <span className="text-[8px] text-zinc-500 tracking-[0.25em] uppercase">COLLECTIBLE</span>
                <span className="text-sm text-purple-400 tracking-[0.15em] font-medium mt-0.5 text-glow-violet">{mission.code}</span>
              </div>

              {/* Violet Divider */}
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

              {/* Center Mission Content Group */}
              <div className="flex flex-col items-center space-y-3 px-2 text-center select-none">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight text-glow max-w-[240px]">
                  {mission.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 font-light leading-relaxed max-w-[210px] mt-1">
                  {mission.description}
                </p>
              </div>

              {/* Violet Divider */}
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

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
                      className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-[10px] tracking-[0.25em] uppercase rounded-full shadow-[0_0_20px_rgba(245,158,11,0.15)] transition duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      Accept Mission
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onComplete}
                      className="w-full py-3.5 bg-zinc-950 border border-purple-900/60 text-purple-300 hover:bg-purple-950/20 hover:text-purple-200 hover:border-purple-500/80 font-bold text-[10px] tracking-[0.25em] uppercase rounded-full transition duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
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
