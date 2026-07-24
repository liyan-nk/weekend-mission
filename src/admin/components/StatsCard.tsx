import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  indicator?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, indicator }) => {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between select-none shadow-sm">
      <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">
        {label}
      </span>
      {indicator ? (
        <div className="mt-3 flex items-center gap-2">
          {indicator}
          <span className="text-lg font-bold text-zinc-100 uppercase leading-none">{value}</span>
        </div>
      ) : (
        <span className="text-2xl font-black text-zinc-100 mt-2 block leading-none font-sans tracking-tight">{value}</span>
      )}
    </div>
  );
};
