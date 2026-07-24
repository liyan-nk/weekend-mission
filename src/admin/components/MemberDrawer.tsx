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
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition" 
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 select-none">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Member Audit Details</h3>
              <p className="text-[10px] text-zinc-500 font-mono tracking-tighter mt-0.5">Audit ID: {member.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs select-none">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold">Display Name</span>
              <div className="text-sm font-bold text-white py-1">{member.display_name}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold">Device UUID</span>
              <div className="font-mono text-zinc-400 select-all py-1">{member.device_id}</div>
            </div>

            <div className="space-y-1 border-t border-zinc-850 pt-4">
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold">Objective Assignment</span>
              <div className="text-sm font-bold text-purple-400 mt-1">
                {member.mission?.code} — {member.mission?.title}
              </div>
              <p className="text-zinc-400 mt-1 leading-relaxed font-sans">{member.mission?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-850 pt-4">
              <div>
                <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold block mb-1">Time Spun</span>
                <span className="font-mono text-zinc-405">
                  {new Date(member.assigned_at).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold block mb-1">Time Completed</span>
                <span className="font-mono text-zinc-405">
                  {member.completed_at 
                    ? new Date(member.completed_at).toLocaleString() 
                    : 'INCOMPLETE'}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-850 pt-4">
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold block">Submission Proof Text</span>
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl text-zinc-305 font-sans leading-relaxed select-text min-h-16 whitespace-pre-wrap">
                {member.proof_text || 'No description submitted.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
