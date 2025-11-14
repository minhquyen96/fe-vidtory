import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface AIPoweredVideoSectionProps {
  className?: string
}

export function AIPoweredVideoSection({ className }: AIPoweredVideoSectionProps) {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.HOME)

  const features = [
    {
      id: 1,
      title: 'Avatar Marketing Video',
      description: 'Input a URL or Upload assets, AI generates marketing video with realistic UGC style Avatar.',
      icon: Icons.video,
      image: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/ai-video/m2v.png',
    },
    {
      id: 2,
      title: 'Product Anyshoot',
      description: 'AI generates product shooting, Fit any product anywhere. Perfect for try-on or product showcase.',
      icon: Icons.video,
      image: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/ai-video/product_anyshoot.png',
    },
    {
      id: 3,
      title: 'Character Swap',
      description: 'Naturally replace anyone in the photo / video with your custom character.',
      icon: Icons.users,
      image: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/ai-video/video_swap.webp',
    },
  ]

  return (
    <section className={cn('relative overflow-hidden bg-muted/20 py-8 sm+:py-16', className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-30   dark:bg-grid-slate-700-20" />
      
      {/* Gradient orbs */}
      <div className="absolute left-1/4 top-20 w-80 h-80 bg-primary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0" />
      <div className="absolute right-1/4 bottom-20 w-80 h-80 bg-secondary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-3000 z-0" />

      <div className="container mx-auto px-4 sm+:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm+:mb-10">
            <h2 className="text-2xl sm+:text-4xl font-bold text-foreground mb-2 sm+:mb-3">
              {t('aiPoweredVideo.title')}
            </h2>
            <p className="text-sm sm+:text-base text-foreground/70">
              {t('aiPoweredVideo.subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm+:grid-cols-3 gap-6 sm+:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.id}
                  className="group relative bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="aspect-video bg-muted/30 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-12 h-12 sm+:w-16 sm+:h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                              <svg class="w-6 h-6 sm+:w-8 sm+:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                          `
                        }
                      }}
                    />
                  </div>
                  <div className="p-5 sm+:p-6">
                    <h3 className="text-base sm+:text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm+:text-sm text-foreground/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

