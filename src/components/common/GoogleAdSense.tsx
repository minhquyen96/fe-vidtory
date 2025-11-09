import React, { useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'

interface GoogleAdSenseProps {
  /** Ad unit ID từ Google AdSense */
  adSlot: string
  /** Kích thước quảng cáo */
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  /** Chiều rộng quảng cáo */
  adWidth?: number
  /** Chiều cao quảng cáo */
  adHeight?: number
  /** Class CSS tùy chỉnh */
  className?: string
  /** Có hiển thị trên mobile không */
  showOnMobile?: boolean
  /** Responsive ads */
  responsive?: boolean
}

export const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adWidth,
  adHeight,
  className = '',
  showOnMobile = true,
  responsive = true,
}) => {
  const adRef = useRef<HTMLModElement>(null)
  const { userData } = useAuth()

  // Kiểm tra premium từ userData
  const isPremium = userData?.premium?.status === 'active' && 
    userData.premium?.expires_at && 
    userData.premium.expires_at * 1000 >= new Date().getTime()

  // Nếu user là premium thì không hiển thị ads
  if (isPremium) {
    return null
  }

  useEffect(() => {
    try {
      // Kiểm tra xem Google AdSense đã được load chưa
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        // Push ad vào queue để render
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        )
      }
    } catch (error) {
      console.error('Error loading Google AdSense:', error)
    }
  }, [])

  // Không render trên mobile nếu showOnMobile = false
  if (
    !showOnMobile &&
    typeof window !== 'undefined' &&
    window.innerWidth < 768
  ) {
    return null
  }

  return (
    <div
      className={`ads-container w-full max-w-full overflow-hidden ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle w-full max-w-full"
        style={{
          display: 'block',
          width: adWidth ? `${adWidth}px` : '100%',
          height: adHeight ? `${adHeight}px` : 'auto',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
        data-ad-client="ca-pub-8370399241480974"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

// Component cho quảng cáo banner ngang
export const BannerAd: React.FC<{
  adSlot: string
  className?: string
  showOnMobile?: boolean
}> = ({ adSlot, className = '', showOnMobile = true }) => {
  const { userData } = useAuth()

  // Kiểm tra premium từ userData
  const isPremium = userData?.premium?.status === 'active' && 
    userData.premium?.expires_at && 
    userData.premium.expires_at * 1000 >= new Date().getTime()

  // Nếu user là premium thì không hiển thị ads
  if (isPremium) {
    return null
  }

  return (
    <GoogleAdSense
      adSlot={adSlot}
      adFormat="auto"
      adWidth={728}
      adHeight={90}
      className={`banner-ad ${className}`}
      showOnMobile={showOnMobile}
      responsive={true}
    />
  )
}

// Component cho quảng cáo vuông
export const SquareAd: React.FC<{
  adSlot: string
  className?: string
  showOnMobile?: boolean
}> = ({ adSlot, className = '', showOnMobile = true }) => {
  const { userData } = useAuth()

  // Kiểm tra premium từ userData
  const isPremium = userData?.premium?.status === 'active' && 
    userData.premium?.expires_at && 
    userData.premium.expires_at * 1000 >= new Date().getTime()

  // Nếu user là premium thì không hiển thị ads
  if (isPremium) {
    return null
  }

  return (
    <GoogleAdSense
      adSlot={adSlot}
      adFormat="auto"
      adWidth={300}
      adHeight={250}
      className={`square-ad ${className}`}
      showOnMobile={showOnMobile}
      responsive={true}
    />
  )
}

// Component cho quảng cáo dọc
export const VerticalAd: React.FC<{
  adSlot: string
  className?: string
  showOnMobile?: boolean
}> = ({ adSlot, className = '', showOnMobile = true }) => {
  const { userData } = useAuth()

  // Kiểm tra premium từ userData
  const isPremium = userData?.premium?.status === 'active' && 
    userData.premium?.expires_at && 
    userData.premium.expires_at * 1000 >= new Date().getTime()

  // Nếu user là premium thì không hiển thị ads
  if (isPremium) {
    return null
  }

  return (
    <GoogleAdSense
      adSlot={adSlot}
      adFormat="auto"
      adWidth={160}
      adHeight={600}
      className={`vertical-ad ${className}`}
      showOnMobile={showOnMobile}
      responsive={true}
    />
  )
}

export default GoogleAdSense
