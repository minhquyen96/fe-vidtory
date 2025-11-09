import { useCallback } from 'react'

declare global {
  interface Window {
    gtag: (type: string, gaId: string, params: Record<string, any>) => void
  }
}

interface EventParams {
  action: string
  params?: Record<string, any>
}

const useEventTracking = () => {
  const pageview = useCallback((url: string) => {
    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
    if (!gaId) {
      console.warn('Google Analytics ID not found')
      return
    }
    
    window.gtag('config', gaId, {
      page_path: url,
    })
  }, [])
  
  const event = useCallback(({ action, params = {} }: EventParams) => {
    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
    if (!gaId) {
      console.warn('Google Analytics ID not found')
      return
    }
    
    window.gtag('event', action, { ...params })
  }, [])

  return {
    pageview,
    event,
  }
}

export default useEventTracking
