import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  indicator?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, indicator }) => {
  return (
    <div className="bg-white border border-zinc-900 p-6 rounded-xl flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] select-none">
      {/* Number (Hero) */}
      <div className="order-1 flex items-baseline gap-2">
        {indicator}
        <span className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight leading-none">
          {value}
        </span>
      </div>

      {/* Label (Secondary) */}
      <span className="order-2 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-450 mt-3 block">
        {label}
      </span>
    </div>
  );
};
