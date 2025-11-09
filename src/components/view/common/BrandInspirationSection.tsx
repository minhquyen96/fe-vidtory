import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { Button } from '@/components/ui/button'

interface BrandInspirationSectionProps {
  className?: string
}

export function BrandInspirationSection({ className }: BrandInspirationSectionProps) {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.HOME)

  const examples = [
    {
      id: 1,
      title: 'Product Showcase 1',
      video: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_1_ai.mp4',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_1_ai_poster.webp',
      productImage: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_1_product_image.webp',
    },
    {
      id: 2,
      title: 'Product Showcase 2',
      video: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_2_ai.mp4',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_2_ai_poster.webp',
      productImage: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_2_product_image.webp',
    },
    {
      id: 3,
      title: 'Product Showcase 3',
      video: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_3_ai.mp4',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_3_ai_poster.webp',
      productImage: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_3_product_image.webp',
    },
    {
      id: 4,
      title: 'Product Showcase 4',
      video: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_4_ai.mp4',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_4_ai_poster.webp',
      productImage: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_4_product_image.webp',
    },
    {
      id: 5,
      title: 'Product Showcase 5',
      video: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_5_ai.mp4',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_5_ai_poster.webp',
      productImage: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_5_product_image.webp',
    },
    {
      id: 6,
      title: 'Product Showcase 6',
      video: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_6_ai.mp4',
      poster: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_6_ai_poster.webp',
      productImage: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/agent/example_video_6_product_image.webp',
    }
  ]

  return (
    <section className={cn('relative overflow-hidden bg-background py-8 sm+:py-16', className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-50 [mask-image:radial-gradient(ellipse_at_center,white_70%,transparent)] dark:bg-grid-slate-700-25" />
      
      {/* Gradient orbs */}
      <div className="absolute -left-20 top-1/3 w-96 h-96 bg-primary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0" />
      <div className="absolute -right-20 bottom-1/3 w-96 h-96 bg-secondary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-3000 z-0" />
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-72 h-72 bg-primary/12 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-1000 z-0" />

      <div className="container mx-auto px-4 sm+:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm+:mb-10">
            <h2 className="text-2xl sm+:text-4xl font-bold text-foreground mb-3 sm+:mb-4">
              {t('brandInspiration.title')}
            </h2>
            <Button
              variant="outline"
              className="mt-3 sm+:mt-4"
              onClick={() => {
                // Handle create now
              }}
            >
              {t('brandInspiration.cta')}
            </Button>
          </div>

          {/* Examples Grid */}
          <div className="grid grid-cols-2 sm+:grid-cols-3 sm+:lg:grid-cols-4 gap-3 sm+:gap-4">
            {examples.map((example) => (
              <div
                key={example.id}
                className="group relative aspect-[3/4] bg-muted/30 rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all cursor-pointer shadow-md hover:shadow-xl"
              >
                <video
                  src={example.video}
                  poster={example.poster}
                  muted
                  playsInline
                  autoPlay
                  loop
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      const img = document.createElement('img')
                      img.src = example.poster
                      img.alt = example.title
                      img.className = 'absolute inset-0 w-full h-full object-cover'
                      img.onerror = () => {
                        img.style.display = 'none'
                        parent.innerHTML = `
                          <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                            <svg class="w-12 h-12 sm+:w-16 sm+:h-16 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        `
                      }
                      parent.appendChild(img)
                    }
                  }}
                />
                <img
                  src={example.productImage}
                  alt={example.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                {/* Reference/AI-Recreated badge like topview.ai */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] sm+:text-xs font-medium">
                    AI-Recreated
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

