import React from 'react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="bg-zinc-900/40 border border-zinc-850 p-10 rounded-2xl text-center text-xs text-zinc-500 font-medium font-sans select-none">
      {message}
    </div>
  );
};
