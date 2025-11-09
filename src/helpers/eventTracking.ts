import { eventTracking } from '@/constants/eventTracking'
import useEventTracking from '@/hooks/useEventTracking'

// Helper function để lấy thông tin chung cho tất cả events
const getCommonEventParams = (additionalParams?: Record<string, any>) => {
  const commonParams = {
    timestamp: new Date().toISOString(),
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    screen_resolution:
      typeof window !== 'undefined'
        ? `${window.screen.width}x${window.screen.height}`
        : '',
    viewport_size:
      typeof window !== 'undefined'
        ? `${window.innerWidth}x${window.innerHeight}`
        : '',
    language: typeof window !== 'undefined' ? window.navigator.language : '',
    timezone:
      typeof window !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : '',
  }

  return {
    ...commonParams,
    ...additionalParams,
  }
}

// Hook để sử dụng event tracking trong components
export const useEventTrackingHelpers = () => {
  const ga = useEventTracking()

  return {
    trackPageView: (
      eventName: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action: eventName,
        params: {
          page_title: eventName,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackEvent: (
      category: keyof typeof eventTracking,
      action: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: category,
          event_action: action,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    // Helper functions cho từng loại event cụ thể
    trackLessonEvent: (
      action: string,
      lessonId?: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'LESSON',
          event_action: action,
          lesson_id: lessonId,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackShadowingEvent: (
      action: string,
      lessonId?: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'SHADOWING',
          event_action: action,
          lesson_id: lessonId,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackDictationEvent: (
      action: string,
      lessonId?: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'DICTATION',
          event_action: action,
          lesson_id: lessonId,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackAuthEvent: (
      action: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'AUTH',
          event_action: action,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackNavigationEvent: (
      action: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'NAVIGATION',
          event_action: action,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackUIEvent: (action: string, additionalParams?: Record<string, any>) => {
      ga.event({
        action,
        params: {
          event_category: 'UI',
          event_action: action,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackErrorEvent: (
      action: string,
      error?: Error,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'ERROR',
          event_action: action,
          error_message: error?.message,
          error_stack: error?.stack,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackPerformanceEvent: (
      action: string,
      duration?: number,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'PERFORMANCE',
          event_action: action,
          duration,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackFeatureUsage: (
      action: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'FEATURE_USAGE',
          event_action: action,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    trackEngagement: (
      action: string,
      additionalParams?: Record<string, any>
    ) => {
      ga.event({
        action,
        params: {
          event_category: 'ENGAGEMENT',
          event_action: action,
          ...getCommonEventParams(additionalParams),
        },
      })
    },

    // Raw event tracking
    event: ga.event,
    pageview: ga.pageview,
  }
}

// Constants để sử dụng trong components
export const EVENT_NAMES = eventTracking
