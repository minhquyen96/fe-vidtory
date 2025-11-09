import { ReactNode } from 'react'
import Head from 'next/head'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { useRouter } from 'next/router'
import { languages } from '@/types/language'
// import { ShareBar } from '@/components/common/ShareBar'
// import { FeedbackBar } from '@/components/common/FeedbackBar'
// import { AppBanner } from '@/components/common/AppBanner'

interface LayoutProps {
  children: ReactNode
  /** Whether to show the header, defaults to true */
  noIndex?: boolean
  showHeader?: boolean
  /** Whether to show the footer, defaults to true */
  showFooter?: boolean
  /** Additional classes for the main content wrapper */
  className?: string
  /** Page title */
  title?: string
  /** Page description for SEO */
  description?: string
  /** Additional meta tags */
  meta?: {
    name: string
    content: string
  }[]
  /** URL of the page thumbnail/og:image */
  thumbnail?: string
}

export function Layout({
  children,
  noIndex = false,
  showHeader = true,
  showFooter = true,
  className = '',
  title = 'Vidtory - AI Video Generator for Every Niche',
  description = 'Create professional AI-generated videos for stories, education, entertainment, and more. Transform your ideas into engaging video content with our powerful AI video generation platform.',
  meta = [],
}: LayoutProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="robots"
          content={
            noIndex ? 'noindex, nofollow' : process.env.NEXT_PUBLIC_URL_INDEX
          }
        />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          href="https://assets.vidtory.ai/images/favicon/favicon.svg"
          type="image/svg+xml"
          sizes="any"
        />
        {/* Viewport */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta itemProp="name" content={title} />
        <meta name="author" content="Vidtory Team" />
        <meta itemProp="image" content="https://vidtory.ai/preview.webp" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image:src"
          content="https://vidtory.ai/preview.webp"
        />
        <meta name="twitter:image" content="https://vidtory.ai/preview.webp" />

        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image" content="https://vidtory.ai/preview.webp" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://assets.vidtory.ai/images/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          href="https://assets.vidtory.ai/images/favicon/96x96.png"
          sizes="96x96"
          type="image/png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://assets.vidtory.ai/images/favicon/32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://assets.vidtory.ai/images/favicon/16x16.png"
        />

        <link rel="alternate" href="https://vidtory.ai" hrefLang="x-default" />
        <link rel="alternate" href="https://vidtory.ai" hrefLang="en" />

        {Object.values(languages)
          .slice(1)
          .map((item) => (
            <link
              rel="alternate"
              key={`${item.key}_alternate`}
              href={`https://vidtory.ai/${item.key}`}
              hrefLang={item.hrefLang}
            />
          ))}

        <link
          rel="canonical"
          href={`https://vidtory.ai${
            router.locale === 'en' ? '' : `/${router.locale}`
          }${router.asPath === '/' ? '' : router.asPath}`}
        />

        {/*/!* Additional meta tags *!/*/}
        {/*{meta.map((tag, index) => (*/}
        {/*  <meta key={index} name={tag.name} content={tag.content} />*/}
        {/*))}*/}
      </Head>

      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-background">
        {showHeader && <Header />}
        <main className={cn('flex-grow', className)}>{children}</main>

        {showFooter && <Footer />}
        <Toaster />
      </div>
    </>
  )
}
