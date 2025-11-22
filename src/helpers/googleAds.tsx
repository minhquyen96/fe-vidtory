import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export const GoogleAdsLoader = () => {
  // const { userData } = useAuth()
  // const { locale } = useRouter()
  // const scriptRef = useRef<HTMLScriptElement | null>(null)
  //
  // // Kiểm tra premium từ userData
  // const isPremium = userData?.premium?.status === 'active' &&
  //   userData.premium?.expires_at &&
  //   userData.premium.expires_at * 1000 >= new Date().getTime()
  //
  // useEffect(() => {
  //   const script = scriptRef.current
  //
  //   const removeAdsFullscreen = () => {
  //     const adsElement = document.querySelector(
  //       '.adsbygoogle.adsbygoogle-noablate'
  //     )
  //     if (!adsElement) return
  //     adsElement.remove()
  //     removeAdsFullscreen()
  //   }
  //
  //   const timeoutId = setTimeout(() => {
  //     // Nếu user là premium, không load ads và xóa ads nếu có
  //     if (isPremium) {
  //       if (script) {
  //         try {
  //           document.body.removeChild(script)
  //         } catch (e) {
  //           // Script có thể đã bị xóa
  //         }
  //         scriptRef.current = null
  //       }
  //       removeAdsFullscreen()
  //       return
  //     }
  //
  //     // Nếu đã có script rồi, không tạo lại
  //     if (script) return
  //
  //     // Chỉ load ads nếu không phải premium và locale không phải 'tr'
  //     if (!isPremium) {
  //       const scriptAds = document.createElement('script')
  //       scriptAds.id = 'adsbygoogle-init'
  //       scriptAds.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=`
  //       scriptAds.crossOrigin = 'anonymous'
  //
  //       document.body.appendChild(scriptAds)
  //       scriptRef.current = scriptAds
  //     }
  //   }, 200)
  //
  //   return () => {
  //     clearTimeout(timeoutId)
  //     if (script) {
  //       document.body.removeChild(script)
  //     }
  //     removeAdsFullscreen()
  //     scriptRef.current = null
  //   }
  // }, [isPremium, userData])

  return (
    <Script id="google-ads" strategy="afterInteractive">
      {`
          var adsbygoogle = [];
        `}
    </Script>
  )
}
