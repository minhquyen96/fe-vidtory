import classnames from 'classnames'
import React, {
  ElementType,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useMemo,
} from 'react'

export type TypoVariant =
  | 'H56B+'
  | 'H32B'
  | 'H30B+'
  | 'H44B'
  | 'B32B'
  | 'B42B'
  | 'H24B'
  | 'H24b'
  | 'H20B'
  | 'H18B'
  | 'H16B'
  | 'H14B'
  | 'T28R'
  | 'T20R'
  | 'T18R'
  | 'T16R'
  | 'T14R'
  | 'T12R'
  | 'T10R'
  | 'S12B'
  | 'S10B'
  | 'H12B'

interface Typography extends HTMLAttributes<HTMLOrSVGImageElement> {
  className?: string
  children?: ReactNode
  variant?: TypoVariant
  href?: string
  target?: string
  as?: ElementType
}

export const Typography = forwardRef<HTMLOrSVGImageElement, Typography>(
  (
    { className, children, variant = 'T16R', as: Element = 'p', ...rest },
    ref
  ) => {
    const typoClasses = useMemo(() => {
      switch (variant) {
        case 'H56B+':
          return 'font-bold text-[56px] leading-14'
        case 'H32B':
          return 'font-bold text-[32px] leading-[44px]'
        case 'H30B+':
          return 'font-bold text-[30px] leading-[40px]'
        case 'H44B':
          return 'font-semibold text-[44px] leading-14'
        case 'B42B':
          return 'font-semibold text-[34px] leading-[48px]'
        case 'B32B':
          return 'font-semibold text-[32px] leading-[44px]'
        case 'H24B':
          return 'font-semibold text-[24px] leading-[32px]'
        case 'H24b':
          return 'font-bold text-[24px] leading-[32px]'
        case 'H12B':
          return 'font-bold text-[13px] leading-[20px]'
        case 'H20B':
          return 'font-semibold text-[20px] leading-[28px] tracking-[0.02em]'
        case 'H18B':
          return 'font-semibold text-[18px] leading-[24px]'
        case 'H16B':
          return 'font-semibold text-[16px] leading-[20px]'
        case 'H14B':
          return 'font-semibold text-[14px] leading-[18px]'
        case 'T28R':
          return 'font-normal text-[28px] leading-[38px]'
        case 'T20R':
          return 'font-normal text-[20px] leading-[30px]'
        case 'T18R':
          return 'font-normal text-[18px] leading-[30px]'
        case 'T16R':
          return 'font-normal text-[16px] leading-[24px]'
        case 'T14R':
          return 'font-normal text-[14px] leading-[20px]'
        case 'T12R':
          return 'font-normal text-[12px] leading-[18px]'
        case 'T10R':
          return 'font-normal text-[10px] leading-[16px]'
        case 'S12B':
          return 'font-semibold text-[12px] leading-[16px]'
        case 'S10B':
          return 'font-semibold text-[10px] leading-[14px]'
        default:
          return 'font-normal text-[16px] leading-[24px]'
      }
    }, [variant])

    return (
      <Element
        ref={ref}
        className={classnames(typoClasses, className)}
        {...rest}
      >
        {children}
      </Element>
    )
  }
)

Typography.displayName = 'Typography'
