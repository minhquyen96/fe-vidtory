import { useTranslation } from 'next-i18next'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { ANDROID_APP_URL, IOS_APP_URL } from '@/constants/env'
import React from 'react'

export const DownloadAppBanner = () => {
  const { t: tCommon } = useTranslation(I18N_NAMESPACES.COMMON)

  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="md:py-16 py-8 bg-background">
      <div className="mx-auto container">
        <div className="relative rounded-2xl shadow-xl overflow-hidden bg-muted">
          <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-12 md:gap-8 gap-4">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary animate-fade-in">
                {tCommon('download_banner.title')}
              </h2>
              <p className="text-primary text-lg max-w-xl animate-fade-in delay-100">
                {tCommon('download_banner.description')}
              </p>
            </div>
            <div className="flex gap-4 pt-4 justify-center md:justify-start animate-fade-in delay-200">
              <button
                onClick={() => handleDownload(IOS_APP_URL)}
                className="relative group transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <img
                  src="https://assets.parroto.app/images/apple-download.svg"
                  alt="Download on App Store"
                  className="h-14 w-auto"
                />
              </button>

              {/*<button*/}
              {/*  onClick={() => handleDownload(ANDROID_APP_URL)}*/}
              {/*  className="relative group transform transition-all duration-200 hover:scale-105 active:scale-95"*/}
              {/*>*/}
              {/*  <img*/}
              {/*    src="https://assets.parroto.app/images/android-download.svg"*/}
              {/*    alt="Get it on Google Play"*/}
              {/*    className="h-14 w-auto"*/}
              {/*  />*/}
              {/*</button>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
