import React from 'react'
import { AdsBlock } from './AdsBlock'

interface AdsLayoutProps {
  children: React.ReactNode
  leftAdSlot: string
  rightAdSlot: string
  adType?: 'banner' | 'square' | 'vertical'
  className?: string
  minHeight?: string
}

/**
 * Component layout đơn giản để wrap content với ads
 * Nếu wrap thì hiển thị ads, không wrap thì không hiển thị
 */
export const AdsLayout: React.FC<AdsLayoutProps> = ({
  children,
  leftAdSlot,
  rightAdSlot,
  adType = 'square',
  className,
  minHeight = '400px',
}) => {
  return (
    // <AdsBlock
    //   leftAdSlot={leftAdSlot}
    //   rightAdSlot={rightAdSlot}
    //   adType={adType}
    //   layout="sidebar"
    //   showOnMobile={false}
    //   className={className}
    //   minHeight={minHeight}
    // >
    <>{children}</>
    // </AdsBlock>
  )
}
