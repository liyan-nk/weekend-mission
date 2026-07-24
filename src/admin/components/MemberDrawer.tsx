import React from 'react';
import { X } from 'lucide-react';
import type { WeekendEntry } from '../../lib/db';

interface MemberDrawerProps {
  member: WeekendEntry | null;
  onClose: () => void;
}

export const MemberDrawer: React.FC<MemberDrawerProps> = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 transition-opacity duration-300" 
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-[#fbfaf8] border-l border-zinc-900 flex flex-col shadow-xl">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-zinc-900 flex justify-between items-center bg-[#f5f3ee] select-none">
            <div>
              <h3 className="text-xs font-black text-zinc-900 tracking-wide uppercase">Member Registry Details</h3>
              <p className="text-[9px] text-zinc-450 font-mono tracking-tighter mt-0.5">Audit ID: {member.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-white border border-zinc-900 hover:bg-zinc-100 text-zinc-800 rounded-lg transition cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Drawer Body details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs select-none text-zinc-900">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase font-bold">Display Name</span>
              <div className="text-sm font-bold text-zinc-900 py-0.5">{member.display_name}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase font-bold">Device UUID</span>
              <div className="font-mono text-[10px] text-zinc-600 select-all py-0.5">{member.device_id}</div>
            </div>

            <div className="space-y-1.5 border-t border-zinc-900/20 pt-4">
              <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase font-bold">Objective Assignment</span>
              <div className="text-xs font-black text-purple-700 mt-1.5 font-mono">
                {member.mission?.code} — {member.mission?.title}
              </div>
              <p className="text-zinc-600 mt-1 leading-relaxed font-sans font-semibold">{member.mission?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-900/20 pt-4">
              <div>
                <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase font-bold block mb-1">Time Spun</span>
                <span className="font-mono text-zinc-600">
                  {new Date(member.assigned_at).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase font-bold block mb-1">Time Completed</span>
                <span className="font-mono text-zinc-600">
                  {member.completed_at 
                    ? new Date(member.completed_at).toLocaleString() 
                    : 'INCOMPLETE'}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-900/20 pt-4">
              <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase font-bold block">Submission Proof Text</span>
              <div className="bg-white border border-zinc-900 p-4 rounded-lg text-zinc-700 font-sans leading-relaxed select-text min-h-16 whitespace-pre-wrap font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {member.proof_text || 'No description submitted.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
