export type PageCode = 'SHADOWING' | 'DICTATION'
export type LocaleCode = keyof typeof MAPPING_LOCALES_SCHEMA

interface LocaleData {
  lang: string
  description: string
  mainEntity: any[]
}

export const isValidLocale = (locale: string | undefined): locale is LocaleCode => {
  return locale !== undefined && locale in MAPPING_LOCALES_SCHEMA
}

export const getValidLocale = (locale: string | undefined): LocaleCode => {
  if (isValidLocale(locale)) {
    return locale
  }
  return 'en' // fallback to English
}

export const MAPPING_LOCALES_SCHEMA = {
  en: {
    url: '',
    code: 'en',
  },
  id: {
    url: '/id',
    code: 'id-ID',
  },
  ja: {
    url: '/ja',
    code: 'ja-JP',
  },
  ko: {
    url: '/ko',
    code: 'ko-KR',
  },
  th: {
    url: '/th',
    code: 'th-TH',
  },
  vi: {
    url: '/vi',
    code: 'vi-VN',
  },
  'zh-CN': {
    url: '/zh-CN',
    code: 'zh-CN',
  },
  'zh-TW': {
    url: '/zh-TW',
    code: 'zh-TW',
  },
  ar: {
    url: '/ar',
    code: 'ar-SA',
  },
  cs: {
    url: '/cs',
    code: 'cs-CZ',
  },
  de: {
    url: '/de',
    code: 'de-DE',
  },
  el: {
    url: '/el',
    code: 'el-GR',
  },
  es: {
    url: '/es',
    code: 'es',
  },
  fr: {
    url: '/fr',
    code: 'fr-FR',
  },
  hu: {
    url: '/hu',
    code: 'hu-HU',
  },
  it: {
    url: '/it',
    code: 'it-IT',
  },
  ms: {
    url: '/ms',
    code: 'ms-MY',
  },
  nl: {
    url: '/nl',
    code: 'nl-NL',
  },
  pt: {
    url: '/pt',
    code: 'pt',
  },
  ru: {
    url: '/ru',
    code: 'ru-RU',
  },
  tr: {
    url: '/tr',
    code: 'tr-TR',
  },
  uk: {
    url: '/uk',
    code: 'uk-UA',
  },
}

export const MAPPING_SCHEMA_SCREEN: Record<PageCode, any> = {
  SHADOWING: {
    path: 'video-story',
    description:
      '"Create engaging story videos with Vidtory\'s AI-powered video generation platform. Generate professional videos for stories, education, entertainment, and more."',
    name: '"AI Video Story Creator - Vidtory"',
    alternateName: '"Vidtory Video Story Generator"',
  },
  DICTATION: {
    path: 'niche-templates',
    description:
      '"Generate professional videos for any niche with Vidtory\'s AI video templates. Choose from templates designed for stories, education, entertainment, marketing, and more."',
    name: '"AI Niche Video Templates - Vidtory"',
    alternateName: '"Vidtory Niche Video Generator"',
  },
}

export const renderPageUseCaseSchema = (locale: LocaleCode, page: PageCode) => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `
             {
                "@context": "http://schema.org",
                "@type": "WebPage",
                "@id": "https://vidtory.ai${
                  MAPPING_LOCALES_SCHEMA?.[locale]?.url || ''
                }/${MAPPING_SCHEMA_SCREEN?.[page]?.path}/#webpage",
                "url": "https://vidtory.ai${
                  MAPPING_LOCALES_SCHEMA?.[locale]?.url || ''
                }/${MAPPING_SCHEMA_SCREEN?.[page]?.path}/",
                "description": ${MAPPING_SCHEMA_SCREEN?.[page]?.description},
                "name": ${MAPPING_SCHEMA_SCREEN?.[page]?.name},
                "alternateName": ${
                  MAPPING_SCHEMA_SCREEN?.[page]?.alternateName
                },
                "image": "https://vidtory.ai/preview.webp",
                "inLanguage": "${MAPPING_LOCALES_SCHEMA?.[locale]?.code || ''}",
                "isPartOf":{
                    "@type": "WebSite",
                    "@id": "https://vidtory.ai/#website",
                    "url": "https://vidtory.ai",
                    "name": "Vidtory",
                    "description": "Create professional AI-generated videos for stories, education, entertainment, and marketing. Transform your ideas into engaging video content with our powerful AI video generation platform.",
                    "publisher": {
                      "@id": "vidtory"
                    },
                    "author": {
                        "@id": "vidtory"
                    },
                    "copyrightHolder": {
                        "@id": "vidtory"
                    },
                    "about": [{
                      "@id": "video_generation/ai_video",
                      "name": "AI Video Generation",
                      "url": "https://en.wikipedia.org/wiki/Video_editing"
                    }]
                }, 
                "potentialAction": {
                  "@type": "ReserveAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://vidtory.ai/${
                      MAPPING_SCHEMA_SCREEN?.[page]?.path
                    }",
                    "inLanguage": "SIN",
                    "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/IOSPlatform", "http://schema.org/AndroidPlatform"]
                  },
                  "result": {
                    "@type": "Reservation",
                    "name": ${MAPPING_SCHEMA_SCREEN?.[page]?.name}
                  }
                }
            }
            `,
      }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Vidtory - AI Video Generator",
                "url": "https://vidtory.ai",
                "description": "Create professional AI-generated videos for stories, education, entertainment, and marketing. Generate engaging video content with AI avatars, natural voiceovers, and automated editing tools.",
                "operatingSystem": "Web Browser",
                "applicationCategory": "MultimediaApplication",
                "image": "https://vidtory.ai/preview.webp",
                "contentRating": "Everyone",
                "author": {
                    "@type": "Organization",
                    "name": "Vidtory Team",
                    "url": "https://vidtory.ai"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "1000"
                },
                "offers": [{
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                }]
            }
            `,
      }}
    />
  </>
)

export const renderPageSchema = (localeData: LocaleData) => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `
        {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "@id": "https://vidtory.ai/${localeData?.lang}",
            "url": "https://vidtory.ai/${localeData?.lang}",
            "inLanguage": "${localeData?.lang}",
            "name": "Vidtory",
            "description": "${localeData?.description}",
            "mainEntity": {
              "@type": "WebApplication",
              "@id": "https://vidtory.ai/#app",
              "name": "Vidtory",
              "alternateName": [
                "Vidtory AI Video Generator",
                "AI Video Story Creator",
                "Niche Video Templates Generator",
                "vidtory.ai"
              ],
              "image": "https://assets.vidtory.ai/images/favicon/logo.png",
              "operatingSystem": "Web Browser",
               "applicationCategory": "MultimediaApplication",
               "featureList": [
                "Generate AI videos for stories, education, entertainment, and marketing",
                "Choose from hundreds of AI avatars and voices",
                "Smart script generation for any niche",
                "Easy video editing and export in multiple formats",
                "Professional video templates for different use cases"
               ],
              "offers": {
                "@type": "Offer",
                "price": "0"
              }
            }
        }
            `,
      }}
    ></script>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `
        {
       "@context": "https://schema.org",
       "@type": "FAQPage",
       "mainEntity": ${JSON.stringify(localeData?.mainEntity)}
        }
      `,
      }}
    ></script>
  </>
)
