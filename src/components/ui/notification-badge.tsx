import { VariantProps } from 'class-variance-authority'
import { ReactNode } from 'react'
import { badgeVariants } from './badge'
import { cn } from '@/lib/utils'

interface NotificationBadgeProps {
  label: ReactNode
  variant?: VariantProps<typeof badgeVariants>['variant']
  show?: boolean
  className?: string
}

const variantStyles = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive dark:bg-destructive/60 text-white',
  outline: 'bg-background text-foreground border border-input',
}

export const NotificationBadge = ({
  label,
  variant,
  show,
  className,
}: NotificationBadgeProps) => {
  const variantWithFallback = variant ?? 'default'
  return (
    <div
      className={cn(
        'absolute inline-flex items-center justify-center w-6 h-6 text-xs font-semibold border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900',
        variantStyles[variantWithFallback],
        show ? 'block' : 'hidden',
        className
      )}
    >
      <span className="flex items-center justify-center w-full h-full">
        {label}
      </span>
    </div>
  )
}
