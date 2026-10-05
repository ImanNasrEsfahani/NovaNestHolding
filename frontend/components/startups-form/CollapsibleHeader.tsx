import React from 'react';
import ChevDown from 'public/static/logos/ChevDown';

interface Props {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  hasError?: boolean;
}

export default function CollapsibleHeader({ title, isOpen, onToggle, hasError }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`w-full flex items-center justify-between gap-4 p-2 lg:p-3
        bg-primary 
        rounded-sm
        hover:bg-[#222222CC]
        transition-colors duration-500
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/10
        ${hasError ? 'border border-red-400 text-red-700' : 'border-b border-primary/30 text-white' }`}

    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center text-white">
          <ChevDown/>
        </div>
        <span className="text-left">
          <p className="text-base md:text-lg text-white">{title}</p>
        </span>
      </div>
    </button>
  );
};
