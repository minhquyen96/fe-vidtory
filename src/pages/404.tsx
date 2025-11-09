import React, { useEffect } from 'react'
import Link from 'next/link'
import { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { Layout } from '@/components/layout/Layout'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { useEventTrackingHelpers, EVENT_NAMES } from '@/helpers/eventTracking'
import { useRouter } from 'next/router'

const NotFoundPage: NextPage = () => {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  const { trackPageView, trackEvent } = useEventTrackingHelpers()
  const router = useRouter()

  // Track page view khi component mount
  useEffect(() => {
    trackPageView(EVENT_NAMES.PAGE_VIEW.NOT_FOUND, {
      page_type: 'error_page',
      error_code: '404',
      referrer: typeof window !== 'undefined' ? document.referrer : '',
    })
  }, [trackPageView])

  const handleBackToHomeClick = () => {
    trackEvent('NAVIGATION', EVENT_NAMES.NAVIGATION.BREADCRUMB_CLICK, {
      element: '404_back_to_home',
      button_text: 'Back to Home',
      destination: '/',
      current_page: '/404',
    })
  }

  return (
    <Layout noIndex>
      <Head>
        <title>Page Not Found | Vidtory</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist"
        />
      </Head>

      <div className="container mx-auto py-6 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
            <h1 className="sm+:text-7xl text-4xl font-extrabold text-primary">
              404
            </h1>

            <h2 className="sm+:text-3xl text-2xl font-bold">
              {t('error.404.title')}
            </h2>

            <p className="text-muted-foreground sm+:text-lg text-md">
              {t('error.404.description')}
            </p>

            <Link href="/" onClick={handleBackToHomeClick}>
              <Button className="mt-4" variant="default" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [I18N_NAMESPACES.COMMON])),
    },
  }
}

export default NotFoundPage
