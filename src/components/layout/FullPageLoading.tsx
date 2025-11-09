import loadingAnimation from '/public/lottie/loading.json'
import dynamic from 'next/dynamic'
// import { EncourageLoginModal } from '@/components/view/auth/EncourageLoginModal'
// import { SWRConfig } from 'swr'
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export function FullPageLoading() {
  return (
    <div className="h-full flex items-center justify-center relative w-full min-h-[300px]">
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        className="sm+:h-32 h-28 my-1 animate-bounce-slow"
      />
    </div>
  )
}
