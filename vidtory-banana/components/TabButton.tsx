import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: LucideIcon;
  className?: string;
}

export const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, label, icon: Icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-large transition-all duration-200 font-medium text-sm
        ${
          isActive
            ? 'bg-primary text-primary-foreground shadow-primary-lg'
            : 'bg-transparent text-default-400 hover:bg-default-100 hover:text-foreground'
        }
        ${className}
        active:scale-95
      `}
    >
      <Icon size={20} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};