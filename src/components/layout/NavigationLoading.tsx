import { useState } from 'react'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

const LOADER_THRESHOLD = 250

export const NavigationLoading = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    let timer: NodeJS.Timeout

    const start = () =>
      (timer = setTimeout(() => setLoading(true), LOADER_THRESHOLD))

    const end = () => {
      if (timer) {
        clearTimeout(timer)
      }
      setLoading(false)
    }

    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', end)
    router.events.on('routeChangeError', end)

    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', end)
      router.events.off('routeChangeError', end)

      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [router.events])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 animate-progress" />
  )
}
