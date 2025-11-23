import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
              }
            `,
          }}
        />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                  page_path: window.location.pathname,
                });
          `,
          }}
        />
        <meta name="google-adsense-account" content="ca-pub-8370399241480974" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org",
              "@type": "Corporation",
              "@id": "https://vidtory.ai/#organization",
              "name": "Vidtory",
              "alternateName": "Vidtory AI Video Generator",
              "url": "https://vidtory.ai",
              "logo": "https://assets.vidtory.ai/images/favicon/logo.png",
              "description": "Vidtory is an AI-powered video generation platform that helps creators produce professional videos for stories, education, entertainment, and marketing. Create engaging video content with AI avatars, voiceovers, and automated editing.",
              "foundingDate": "2025",
              "founder": {
                "@type": "Organization",
                "name": "Vidtory Team"
              },
              "additionalType": [
                "https://en.wikipedia.org/wiki/Video_editing",
                "https://en.wikipedia.org/wiki/Artificial_intelligence"
              ],
              "image": [
                "https://vidtory.ai/preview.jpg",
                "https://assets.vidtory.ai/images/favicon/logo.png"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+84972796574",
                "email": "mailto:contact@vidtory.ai",
                "contactType": "Customer Service",
                "contactOption": "HearingImpairedSupported",
                "areaServed": "VN",
                "availableLanguage": [
                  "vi-VN",
                  "en",
                  "ar",
                  "de",
                  "el",
                  "es",
                  "id",
                  "ja",
                  "ko",
                  "ms",
                  "pt",
                  "ru",
                  "th",
                  "tr",
                  "uk",
                  "zh"
                ]
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
                "name": "Vidtory: AI Video Generator",
                "description": "Create professional AI-generated videos for stories, education, entertainment, and marketing. Generate engaging video content with AI avatars, natural voiceovers, and automated editing tools.",
                "operatingSystem": "Web Browser",
                "applicationCategory": "MultimediaApplication",
                "image": "https://vidtory.ai/preview.jpg",
                "contentRating": "Everyone",
                "author": {
                    "@type": "Organization",
                    "name": "Vidtory Team",
                    "url": "https://vidtory.ai"
                },
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                },
                "url": "https://vidtory.ai"
            }
            `,
          }}
        />
      </body>
    </Html>
  )
}
