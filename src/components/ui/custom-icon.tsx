import React from 'react';
import { cn } from '@/lib/utils';

interface CustomIconProps {
  /**
   * The SVG component imported from a file
   * @example import Icon from './icon.svg'
   */
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  
  /**
   * Width and height of the icon in pixels
   * @default 24
   */
  size?: number;
  
  /**
   * Color of the icon
   * @default "currentColor"
   */
  color?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function CustomIcon({
  icon: Icon,
  size = 24,
  color = "currentColor",
  className,
}: CustomIconProps) {
  return (
    <Icon
      width={size}
      height={size}
      className={cn('', className)}
      color={color}
    />
  );
}

// Example usage in comments:
/*
// 1. Import your SVG
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import LoadingIcon from '@/assets/icons/loading.svg';
import StarIcon from '@/assets/icons/star.svg';

// 2. Use in your component
<CustomIcon 
  icon={ArrowRightIcon}
  size={20} 
  color="blue" 
/>

// With animation
<CustomIcon 
  icon={LoadingIcon}
  size={32}
  color="#FF0000"
  className="animate-spin"
/>

// With hover effect
<CustomIcon 
  icon={StarIcon}
  size={24}
  color="currentColor"
  className="hover:text-yellow-500"
/>
*/

// Example usage:
export const IconExamples = {
  // Simple path
  arrowRight: "M9 5l7 7-7 7",
  
  // Complete SVG
  check: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  `,
  
  // Multiple paths
  star: `
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  `,
  
  // Custom icon with multiple elements
  loading: `
    <circle cx="12" cy="12" r="10" opacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  `
} 