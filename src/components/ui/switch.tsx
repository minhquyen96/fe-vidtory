'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const switchVariants = cva(
  'inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: '',
        sm: '',
        lg: '',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const switchControlVariants = cva(
  'peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
  {
    variants: {
      size: {
        default: 'h-[20px] w-[36px]',
        sm: 'h-[16px] w-[28px]',
        lg: 'h-[24px] w-[44px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
  {
    variants: {
      size: {
        default: 'h-4 w-4',
        sm: 'h-3 w-3',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const switchLabelVariants = cva('text-sm text-foreground select-none', {
  variants: {
    size: {
      default: 'text-sm',
      sm: 'text-xs',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  label?: React.ReactNode
  className?: string
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, label, ...props }, ref) => (
  <div className={cn(switchVariants({ size, className }))}>
    <SwitchPrimitives.Root
      className={cn(switchControlVariants({ size }))}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
    </SwitchPrimitives.Root>
    {label && (
      <span className={cn(switchLabelVariants({ size }))}>{label}</span>
    )}
  </div>
))
Switch.displayName = 'Switch'

export { Switch }
