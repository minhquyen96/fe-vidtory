import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface ViralVideosSectionProps {
  className?: string
}

export function ViralVideosSection({ className }: ViralVideosSectionProps) {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.HOME)

  const useCases = [
    {
      id: 1,
      title: 'App Promotion',
      description: 'Let the avatar showcase your app to create a video',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/product-avatar-1.webp',
      videoUrl: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/product-avatar-1.mp4',
    },
    {
      id: 2,
      title: 'Product Marketing',
      description: 'Let the avatar hold your product to create a video',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/product-avatar-3-new.webp',
      videoUrl: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/product-avatar-3-new.mp4',
    },
    {
      id: 3,
      title: 'Try-On Video',
      description: 'Let the avatar wear your clothes to create a video',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/product-avatar-2-new.webp',
      videoUrl: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/product-avatar-2-new.mp4',
    },
  ]

  return (
    <section className={cn('relative overflow-hidden bg-muted/20 py-8 sm+:py-16', className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-30   dark:bg-grid-slate-700-20" />
      
      {/* Gradient orbs */}
      <div className="absolute left-1/3 top-20 w-80 h-80 bg-secondary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0" />
      <div className="absolute right-1/3 bottom-20 w-80 h-80 bg-primary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0" />

      <div className="container mx-auto px-4 sm+:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm+:mb-10">
            <h2 className="text-2xl sm+:text-4xl font-bold text-foreground mb-2 sm+:mb-3">
              {t('viralVideos.title')}
            </h2>
          </div>

          {/* Use Cases Grid */}
          <div className="grid grid-cols-1 sm+:grid-cols-3 gap-6 sm+:gap-8">
            {useCases.map((useCase) => (
              <div
                key={useCase.id}
                className="group relative bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
                  <video
                    src={useCase.videoUrl}
                    poster={useCase.poster}
                    muted
                    playsInline
                    loop
                    className="absolute inset-0 w-full h-full object-cover"
                    onMouseEnter={(e) => {
                      const video = e.currentTarget
                      video.play().catch(() => {
                        // Ignore play errors
                      })
                    }}
                    onMouseLeave={(e) => {
                      const video = e.currentTarget
                      video.pause()
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        const img = document.createElement('img')
                        img.src = useCase.poster
                        img.alt = useCase.title
                        img.className = 'absolute inset-0 w-full h-full object-cover'
                        img.onerror = () => {
                          img.style.display = 'none'
                          parent.innerHTML = `
                            <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                              <svg class="w-16 h-16 sm+:w-24 sm+:h-24 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                          `
                        }
                        parent.appendChild(img)
                      }
                    }}
                  />
                  {/* Play button overlay - show when paused */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 sm+:w-16 sm+:h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Icons.play className="w-6 h-6 sm+:w-8 sm+:h-8 text-white ml-1" />
                    </div>
                  </div>
                  {/* Mute icon like topview.ai */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                    <button
                      className="w-8 h-8 sm+:w-10 sm+:h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        const video = e.currentTarget.closest('.group')?.querySelector('video') as HTMLVideoElement
                        if (video) {
                          video.muted = !video.muted
                        }
                      }}
                    >
                      <Icons.mic className="w-4 h-4 sm+:w-5 sm+:h-5 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4 sm+:p-6 bg-background">
                  <h3 className="text-base sm+:text-lg font-semibold text-foreground mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-xs sm+:text-sm text-foreground/60">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

