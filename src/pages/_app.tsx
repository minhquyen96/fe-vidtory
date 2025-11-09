import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/context/AuthContext'
import { LoginModal } from '@/components/view/auth/LoginModal'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { appWithTranslation } from 'next-i18next'
import { TooltipProvider } from '@/components/ui/tooltip'
import { inter } from '@/constants/font'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { SWRConfig } from 'swr'
import { GoogleAdsLoader } from '@/helpers/googleAds'
import { GlobalErrorProvider } from '@/components/providers/GlobalErrorProvider'
import { NavigationLoading } from '@/components/layout/NavigationLoading'

function AppContent({ Component, pageProps }: Omit<AppProps, 'router'>) {
  return (
    <div className="min-h-screen bg-background text-foreground w-full">
      <Component {...pageProps} />
      <LoginModal />
    </div>
  )
}

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  useErrorHandler() // Add error handler for global error events
  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <NavigationLoading />
      <SWRConfig
        value={{ revalidateOnFocus: false, shouldRetryOnError: false }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <AuthProvider>
              <GlobalErrorProvider>
                <AppContent Component={Component} pageProps={pageProps} />
                <GoogleAdsLoader />
              </GlobalErrorProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </SWRConfig>
    </>
  )
}

export default appWithTranslation(App)
