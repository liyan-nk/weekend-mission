import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="bg-zinc-900/10 border border-zinc-800/40 p-10 rounded-2xl flex flex-col items-center justify-center text-center select-none shadow-inner max-w-lg mx-auto my-8">
      <AlertCircle className="w-6 h-6 text-zinc-650 mb-3" />
      <p className="text-xs text-zinc-450 font-medium font-sans max-w-xs leading-relaxed">{message}</p>
    </div>
  );
};
