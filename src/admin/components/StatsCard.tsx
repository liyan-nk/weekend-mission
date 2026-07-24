import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  indicator?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, indicator }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between select-none">
      <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">
        {label}
      </span>
      {indicator ? (
        <div className="mt-2 flex items-center gap-2">
          {indicator}
          <span className="text-lg font-bold text-white uppercase">{value}</span>
        </div>
      ) : (
        <span className="text-3xl font-black text-white mt-1 block">{value}</span>
      )}
    </div>
  );
};
