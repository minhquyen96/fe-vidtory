import React from 'react';
import { LucideIcon, Info } from 'lucide-react';

/**
 * BUTTON COMPONENT
 */
interface DSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export const DSButton: React.FC<DSButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  icon: Icon, 
  children, 
  className = '', 
  disabled,
  ...props 
}) => {
  // Base styles
  const baseStyles = "relative flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
  
  // Size styles
  const sizeStyles = {
    sm: "px-3 py-2 text-xs rounded-small",
    md: "px-4 py-2.5 text-sm rounded-large",
    lg: "px-6 py-3.5 text-base rounded-large",
  };

  // Variant styles
  const variantStyles = {
    // Gradient: High emphasis (Brand)
    gradient: "bg-brand-gradient hover:bg-brand-gradient-hover text-black shadow-lg shadow-primary/20 hover:shadow-primary/30",
    // Primary: Solid Emerald (Standard CTA)
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20",
    // Secondary: Bordered
    secondary: "bg-default-100 hover:bg-default-200 text-foreground border border-default-200",
    // Ghost: Transparent
    ghost: "bg-transparent hover:bg-default-100 text-default-600 hover:text-foreground",
    // Icon: Rounded
    icon: "p-2 rounded-full hover:bg-default-100 text-default-500 hover:text-foreground aspect-square",
    // Danger
    danger: "bg-danger/10 text-danger hover:bg-danger/20",
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      ) : null}
      {children}
    </button>
  );
};

/**
 * CARD COMPONENT
 */
interface DSCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const DSCard: React.FC<DSCardProps> = ({ children, hoverable, className = '', ...props }) => {
  return (
    <div 
      className={`
        bg-content1 rounded-large border border-default-100 
        ${hoverable ? 'hover:border-default-300 hover:shadow-medium transition-all cursor-pointer' : 'shadow-sm'}
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * SIDEBAR ITEM COMPONENT
 */
interface DSSidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  isExpanded?: boolean;
  badge?: string;
  onClick?: () => void;
  isMobile?: boolean;
}

export const DSSidebarItem: React.FC<DSSidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  active, 
  isExpanded = true, 
  badge, 
  onClick,
  isMobile
}) => {
  if (isMobile) {
    return (
      <button 
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 ${active ? 'text-primary' : 'text-default-500'}`}
      >
        <div className={`p-1.5 rounded-medium ${active ? 'bg-primary/10' : 'bg-transparent'}`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        </div>
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center rounded-2xl transition-all duration-200 relative
        ${isExpanded 
            ? 'w-full px-3 py-3 gap-3 flex-row text-left' 
            : 'w-full flex-col justify-center gap-1.5 py-4 px-1' 
        }
        ${active ? 'bg-default-100 text-foreground font-semibold shadow-sm' : 'text-default-500 hover:text-foreground hover:bg-default-100'}
      `}
      title={label}
    >
      <div className={`flex items-center justify-center ${!isExpanded ? 'p-1' : ''}`}>
        <Icon 
          size={isExpanded ? 20 : 24} 
          strokeWidth={active ? 2.5 : 2} 
          className={`shrink-0 transition-colors ${active ? 'text-foreground' : 'text-default-400 group-hover:text-foreground'}`} 
        />
      </div>
      
      {/* Label logic: Wrap text when collapsed */}
      <span className={`
        transition-all duration-200
        ${isExpanded 
            ? 'text-sm whitespace-nowrap tracking-tight' 
            : 'text-[10px] font-medium text-center leading-tight opacity-90 group-hover:opacity-100 whitespace-normal w-full break-words'
        }
      `}>
        {label}
      </span>

      {/* Badge Logic */}
      {badge && (
        <span className={`
            bg-danger/10 text-danger font-bold rounded-full transition-all
            ${isExpanded 
                ? 'ml-auto text-[9px] px-1.5 py-0.5' 
                : 'absolute top-1 right-1 w-2 h-2 p-0 ring-2 ring-content1'
            }
        `}>
             {isExpanded && badge}
        </span>
      )}
    </button>
  );
};

/**
 * SECTION HEADER COMPONENT
 */
export const DSSectionHeader: React.FC<{ title: string; isExpanded?: boolean }> = ({ title, isExpanded = true }) => {
  if (!isExpanded) return <div className="h-4"></div>; // Spacer when collapsed
  return (
    <div className="px-3 pb-2 pt-6">
      <h3 className="text-[10px] font-bold text-default-400 uppercase tracking-widest">{title}</h3>
    </div>
  );
};

/**
 * TOOLTIP WRAPPER
 */
export const DSTooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  return (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-[200px] p-2 bg-foreground text-background text-xs rounded-medium shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-center">
        {content}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px border-4 border-transparent border-b-foreground"></div>
      </div>
    </div>
  );
};