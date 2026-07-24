import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="bg-white border border-zinc-900 p-8 rounded-xl flex flex-col items-center justify-center text-center select-none shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] max-w-md mx-auto my-8 font-sans">
      <AlertCircle className="w-5 h-5 text-zinc-400 mb-2.5" />
      <p className="text-xs text-zinc-600 font-bold max-w-xs leading-relaxed">{message}</p>
    </div>
  );
};
