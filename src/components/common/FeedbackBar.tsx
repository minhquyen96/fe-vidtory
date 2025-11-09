import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { useEventTrackingHelpers, EVENT_NAMES } from '@/helpers/eventTracking'

const FEEDBACK_BAR_CLOSED_KEY = 'feedback_bar_closed'

export function FeedbackBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  const { trackEvent } = useEventTrackingHelpers()

  useEffect(() => {
    // Kiểm tra sessionStorage khi component mount
    const isClosed = sessionStorage.getItem(FEEDBACK_BAR_CLOSED_KEY) === 'true'
    setIsVisible(!isClosed)
  }, [])

  const handleFeedbackClick = () => {
    router.push('/feedbacks')
    trackEvent('FEATURE_USAGE', EVENT_NAMES.ENGAGEMENT.FEEDBACK_BUTTON, {
      current_page: router.pathname,
      action: 'feedback_clicked',
    })
  }

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem(FEEDBACK_BAR_CLOSED_KEY, 'true')
    trackEvent('UI', 'feedback_bar_close', {
      current_page: router.pathname,
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed right-0 bottom-14 z-40 mobile:hidden">
      <div
        className="bg-background border rounded-l-lg p-2 flex flex-col gap-3 items-center shadow-lg relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Nút đóng */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-muted"
          onClick={handleClose}
          title={t('common.close')}
        >
          <X className="h-3 w-3 text-red-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            'rounded-full transition-all duration-300',
            isHovered && 'scale-110'
          )}
          onClick={handleFeedbackClick}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>

        {/* Text hiển thị khi hover */}
        {isHovered && (
          <div className="absolute right-full mr-2 bg-background border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <span className="text-sm font-medium">{t('feedback.title')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
