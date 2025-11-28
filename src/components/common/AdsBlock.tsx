import React from 'react'
import { Card } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { GoogleAdSense, SquareAd } from './GoogleAdSense'
import { useAuth } from '@/context/AuthContext'
import classnames from 'classnames'

// Check if running in production
const isProd = process.env.NODE_ENV === 'production'

interface AdsBlockProps {
  /** Ad slot ID cho quảng cáo bên trái */
  leftAdSlot?: string
  /** Ad slot ID cho quảng cáo bên phải */
  rightAdSlot?: string
  /** Nội dung tùy chỉnh bên trái (fallback nếu không có adSlot) */
  leftContent?: React.ReactNode
  /** Nội dung tùy chỉnh bên phải (fallback nếu không có adSlot) */
  rightContent?: React.ReactNode
  /** Class name tùy chỉnh cho container */
  className?: string
  /** Có hiển thị trên mobile không */
  showOnMobile?: boolean
  /** Chiều cao tối thiểu của ads block */
  minHeight?: string
  /** Loại quảng cáo */
  adType?: 'square' | 'banner' | 'vertical'
  /** Layout style: 'sidebar' (2 bên) hoặc 'columns' (2 cột) */
  layout?: 'sidebar' | 'columns'
  /** Nội dung chính ở giữa (chỉ dùng với layout='sidebar') */
  children?: React.ReactNode
}

export const AdsBlock: React.FC<AdsBlockProps> = ({
  leftAdSlot,
  rightAdSlot,
  leftContent,
  rightContent,
  className,
  showOnMobile = false,
  minHeight = '200px',
  adType = 'square',
  layout = 'columns',
  children,
}) => {
  const { userData } = useAuth()

  // Kiểm tra premium từ userData
  const isPremium = userData?.premium?.status === 'active' && 
    userData.premium?.expires_at && 
    userData.premium.expires_at * 1000 >= new Date().getTime()

  // Nếu user là premium thì không hiển thị ads
  if (isPremium) {
    // Nếu có children (layout sidebar), chỉ hiển thị children
    if (layout === 'sidebar' && children) {
      return <>{children}</>
    }
    // Nếu không có children, không hiển thị gì
    return null
  }

  // Nếu không có nội dung nào thì không render
  if (!leftAdSlot && !rightAdSlot && !leftContent && !rightContent) {
    return null
  }

  const renderAdContent = (
    adSlot?: string,
    fallbackContent?: React.ReactNode
  ) => {
    if (adSlot) {
      switch (adType) {
        case 'square':
          return <SquareAd adSlot={adSlot} showOnMobile={showOnMobile} />
        case 'banner':
          return (
            <GoogleAdSense
              adSlot={adSlot}
              adFormat="auto"
              adWidth={728}
              adHeight={90}
              showOnMobile={showOnMobile}
            />
          )
        case 'vertical':
          return (
            <GoogleAdSense
              adSlot={adSlot}
              adFormat="auto"
              adWidth={160}
              adHeight={600}
              showOnMobile={showOnMobile}
            />
          )
        default:
          return <SquareAd adSlot={adSlot} showOnMobile={showOnMobile} />
      }
    }
    return fallbackContent
  }

  // Render ads content
  const renderAdCard = (
    adSlot?: string,
    fallbackContent?: React.ReactNode,
    isLeft = true
  ) => {
    if (!adSlot && !fallbackContent) return null

    return (
      <Card
        className={classnames(
          'p-2 md:p-4 w-full max-w-full overflow-hidden relative !border-none !shadow-none !bg-transparent',
          // Chỉ hiển thị màu gradient khi không phải production
          !isProd &&
            (isLeft
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800'
              : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800'),
        )}
      >
        <div className="flex flex-col items-center justify-center text-center w-full max-w-full overflow-hidden">
          {renderAdContent(adSlot, fallbackContent)}
        </div>
        {/* Hiển thị placeholder "Ads" khi không phải production */}
        {!isProd && (
          <span
            className={classnames(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'text-gray-900 dark:text-gray-100 font-medium text-sm',
              'pointer-events-none'
            )}
          >
            Ads
          </span>
        )}
      </Card>
    )
  }

  // Layout sidebar: ads ở 2 bên, content ở giữa
  if (layout === 'sidebar') {
    return (
      <>
        {/* Fixed Left Sidebar Ads - chỉ hiển thị trên màn hình lớn (xl+) */}
        <div
          className={classnames(
            'fixed left-0 z-20 h-screen',
            'hidden t2xl:block' // Luôn ẩn trên mobile/tablet, chỉ hiển thị từ lg+ (1024px)
          )}
        >
          <div className="w-64 h-full overflow-y-auto overflow-x-hidden">
            {renderAdCard(leftAdSlot, leftContent, true)}
          </div>
        </div>

        {/* Fixed Right Sidebar Ads - chỉ hiển thị trên màn hình lớn (xl+) */}
        <div
          className={classnames(
            'fixed right-0 z-20 h-screen',
            'hidden t2xl:block' // Luôn ẩn trên mobile/tablet, chỉ hiển thị từ lg+ (1024px)
          )}
        >
          <div className="w-64 h-full overflow-y-auto overflow-x-hidden">
            {renderAdCard(rightAdSlot, rightContent, false)}
          </div>
        </div>

        {/* Main Content with responsive margins */}
        <div
          className={classnames(
            'w-full',
            // showOnMobile ? 'block' : 'hidden md:block',
            // Responsive margins: chỉ có margin trên lg+ khi có sidebar ads
            't2xl:ml-64 t2xl:mr-64 t2xl:max-w-[calc(100%-512px)]',
            className
          )}
          style={{
            minHeight,
          }}
        >
          {children}
        </div>
      </>
    )
  }

  // Layout columns: ads ở 2 cột như cũ
  return (
    <div
      className={classnames(
        'w-full',
        showOnMobile ? 'block' : 'hidden md:block',
        className
      )}
      style={{ minHeight }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Left Ads */}
        {renderAdCard(leftAdSlot, leftContent, true)}

        {/* Right Ads */}
        {renderAdCard(rightAdSlot, rightContent, false)}
      </div>
    </div>
  )
}

// Component mẫu cho quảng cáo
export const SampleAdContent: React.FC<{
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
}> = ({ title, description, buttonText, onButtonClick }) => {
  return (
    <>
      <Typography variant="H16B" className="text-primary">
        {title}
      </Typography>
      <Typography variant="T14R" className="text-muted-foreground">
        {description}
      </Typography>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Typography variant="S12B">{buttonText}</Typography>
        </button>
      )}
    </>
  )
}

export default AdsBlock
