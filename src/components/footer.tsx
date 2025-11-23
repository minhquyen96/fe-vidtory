import React from 'react'
import Link from 'next/link'
import { I18N_NAMESPACES } from '@/constants/i18n'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import LogoIcon from '@/assets/icons/logo.svg'
import { CustomIcon } from '@/components/ui/custom-icon'
import { useEventTrackingHelpers, EVENT_NAMES } from '@/helpers/eventTracking'
import { useRouter } from 'next/router'

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
)

const TiktokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
      fill="#FF004F"
    />
    <path
      d="M15.84 8.66v7a6.34 6.34 0 0 1-10.86 4.43 6.33 6.33 0 0 1 5.36-10.75 6.84 6.84 0 0 1 1 .05v3.5a2.93 2.93 0 0 0-.88-.13 2.89 2.89 0 0 0-2.31 4.64 2.89 2.89 0 0 0 5.2-1.74V2h3.47v.44a4.83 4.83 0 0 0 3.77 4.25 4.85 4.85 0 0 0 1 .1v3.4a8.16 8.16 0 0 1-4.77-1.52"
      fill="#00F2EA"
    />
  </svg>
)

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="#0A66C2"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  </svg>
)

const ThreadsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="#fff"
      d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.883h-.066c-.646.006-1.316.138-1.997.394-.744.279-1.437.681-2.063 1.196l-1.336-1.577c.751-.618 1.636-1.122 2.63-1.497.96-.363 1.94-.552 2.916-.561h.076c1.71.007 3.055.537 4.002 1.579.948 1.044 1.406 2.44 1.406 4.279v.011c1.924.484 3.312 1.608 3.934 3.177.69 1.737.534 4.30-2.123 6.61-1.692 1.458-4.023 2.242-6.526 2.267z"
    />
    <path
      fill="#fff"
      d="M15.305 13.120c-.365-.02-.714-.026-1.04-.026-.802 0-1.464.156-1.856.436-.436.312-.684.744-.636 1.123.038.317.201.62.459.852.262.235.608.379 1.002.417.579.056 1.259-.021 2.071-1.802z"
    />
  </svg>
)

const RedditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="#FF4500"
      d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
    />
  </svg>
)

const ProductHuntIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="#DA552F"
      d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.8s-.806-1.8-1.801-1.8zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.803c2.319 0 4.199 1.881 4.199 4.2s-1.88 4.2-4.199 4.2z"
    />
  </svg>
)

const currentYear = new Date().getFullYear()

export function Footer() {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  const { trackEvent } = useEventTrackingHelpers()
  const router = useRouter()

  const footerLinks = [
    {
      titleKey: 'footer.information',
      links: [
        { title: t('footer.privacy'), href: '/privacy-policy' },
        // { title: t('footer.about_us'), href: '/about-us' },
        { title: t('footer.terms'), href: '/terms-of-service' },
        // { title: t('footer.contact_us'), href: '/contact-us' },
        // { title: t('footer.feedbacks'), href: '/feedbacks' },
      ],
    },
    {
      titleKey: 'footer.features',
      links: [
        { title: t('footer.feature1.title'), href: '/#feature1' },
        { title: t('footer.feature2.title'), href: '/#feature2' },
        { title: t('footer.feature3.title'), href: '/#feature3' },
      ],
    },
  ]

  const handleLogoClick = () => {
    trackEvent('NAVIGATION', EVENT_NAMES.NAVIGATION.BREADCRUMB_CLICK, {
      element: 'footer_logo',
      destination: '/',
      current_page: router.pathname,
      section: 'footer',
    })
  }

  const handleFooterLinkClick = (href: string, title: string) => {
    trackEvent('NAVIGATION', EVENT_NAMES.NAVIGATION.BREADCRUMB_CLICK, {
      element: 'footer_link',
      link_title: title,
      destination: href,
      current_page: router.pathname,
      section: 'footer',
    })
  }

  const handleSocialClick = (platform: string) => {
    trackEvent('NAVIGATION', EVENT_NAMES.NAVIGATION.SOCIAL_CLICK, {
      platform,
      current_page: router.pathname,
      section: 'footer',
    })
  }

  const handleAppDownloadClick = (platform: string) => {
    trackEvent('NAVIGATION', 'APP_DOWNLOAD_CLICK', {
      platform,
      current_page: router.pathname,
      section: 'footer',
    })
  }

  return (
    <footer className="bg-[#111] text-white">
      <div className="container py-12 sm:py-6">
        <div className="grid grid-cols-1 sm+:grid-cols-2 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-block mb-4"
              onClick={handleLogoClick}
            >
              <div className="flex items-center">
                <CustomIcon icon={LogoIcon} className="w-32 h-10" />
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div className="flex sm+:justify-between sm:justify-between">
            {footerLinks.map((group) => (
              <div key={group.titleKey} className="sm:col-span-1">
                <h3 className="font-medium mb-4">{t(group.titleKey)}</h3>
                <ul className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                  {group.links.map((link) => (
                    <li key={link.title} className="col-span-1">
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={() =>
                          handleFooterLinkClick(link.href, link.title)
                        }
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 sm:mt-6 pt-8 sm:pt-4 border-t border-gray-800">
          <div className="flex flex-col sm+:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-400">
                © {currentYear} Vidtory. All rights reserved.
              </p>
              {/*<div className="flex items-center gap-3 ml-4">*/}
              {/*  <a*/}
              {/*    href="https://www.facebook.com/parroto.english"*/}
              {/*    target="_blank"*/}
              {/*    rel="noopener noreferrer"*/}
              {/*    className="hover:opacity-80 transition-opacity"*/}
              {/*    onClick={() => handleSocialClick('facebook')}*/}
              {/*    aria-label="Facebook"*/}
              {/*  >*/}
              {/*    <FacebookIcon />*/}
              {/*  </a>*/}
              {/*  <a*/}
              {/*    href="https://tiktok.com/@parroto.app"*/}
              {/*    target="_blank"*/}
              {/*    rel="noopener noreferrer"*/}
              {/*    className="hover:opacity-80 transition-opacity"*/}
              {/*    onClick={() => handleSocialClick('tiktok')}*/}
              {/*    aria-label="TikTok"*/}
              {/*  >*/}
              {/*    <TiktokIcon />*/}
              {/*  </a>*/}
              {/*  <a*/}
              {/*    href="https://www.linkedin.com/company/parroto"*/}
              {/*    target="_blank"*/}
              {/*    rel="noopener noreferrer"*/}
              {/*    className="hover:opacity-80 transition-opacity"*/}
              {/*    onClick={() => handleSocialClick('linkedin')}*/}
              {/*    aria-label="LinkedIn"*/}
              {/*  >*/}
              {/*    <LinkedInIcon />*/}
              {/*  </a>*/}
              {/*  <a*/}
              {/*    href="https://www.threads.com/@parroto.app"*/}
              {/*    target="_blank"*/}
              {/*    rel="noopener noreferrer"*/}
              {/*    className="hover:opacity-80 transition-opacity"*/}
              {/*    onClick={() => handleSocialClick('threads')}*/}
              {/*    aria-label="Threads"*/}
              {/*  >*/}
              {/*    <ThreadsIcon />*/}
              {/*  </a>*/}
              {/*  /!* <a*/}
              {/*    href="https://www.reddit.com/r/Vidtory/"*/}
              {/*    target="_blank"*/}
              {/*    rel="noopener noreferrer"*/}
              {/*    className="hover:opacity-80 transition-opacity"*/}
              {/*    onClick={() => handleSocialClick('reddit')}*/}
              {/*    aria-label="Reddit"*/}
              {/*  >*/}
              {/*    <RedditIcon />*/}
              {/*  </a> *!/*/}
              {/*  <a*/}
              {/*    href="https://www.producthunt.com/products/parroto-dictation-shadowing"*/}
              {/*    target="_blank"*/}
              {/*    rel="noopener noreferrer"*/}
              {/*    className="hover:opacity-80 transition-opacity"*/}
              {/*    onClick={() => handleSocialClick('producthunt')}*/}
              {/*    aria-label="Product Hunt"*/}
              {/*  >*/}
              {/*    <ProductHuntIcon />*/}
              {/*  </a>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
