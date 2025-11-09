import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface AIAvatarSectionProps {
  className?: string
}

export function AIAvatarSection({ className }: AIAvatarSectionProps) {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.HOME)

  const avatars = [
    {
      id: 1,
      title: 'Avatar 4',
      description: 'Turn any photo to Avatar',
      image: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/ai-avatar/avatar_4_bg.png',
    },
    {
      id: 2,
      title: 'Product Avatar',
      description: 'Avatar showcases any product',
      image: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/ai-avatar/product_avatar_bg.png',
    },
    {
      id: 3,
      title: 'Design My Avatar',
      description: 'Create consistent Avatar',
      image: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/ai-avatar/design_my_avatar_bg.png',
    },
  ]

  return (
    <section className={cn('relative overflow-hidden bg-background py-8 sm+:py-16', className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-50 [mask-image:radial-gradient(ellipse_at_center,white_70%,transparent)] dark:bg-grid-slate-700-25" />
      
      {/* Gradient orbs */}
      <div className="absolute -right-20 top-40 w-96 h-96 bg-secondary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0" />
      <div className="absolute -left-20 bottom-40 w-96 h-96 bg-primary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0" />
      <div className="absolute left-1/3 top-1/4 w-64 h-64 bg-primary/12 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-1000 z-0" />

      <div className="container mx-auto px-4 sm+:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm+:mb-10">
            <h2 className="text-2xl sm+:text-4xl font-bold text-foreground mb-2 sm+:mb-3">
              {t('aiAvatar.title')}
            </h2>
            <p className="text-sm sm+:text-base text-foreground/70">
              {t('aiAvatar.subtitle')}
            </p>
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-1 sm+:grid-cols-3 gap-6 sm+:gap-8">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className="group relative bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={avatar.image}
                    alt={avatar.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                            <svg class="w-16 h-16 sm+:w-24 sm+:h-24 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        `
                      }
                    }}
                  />
                </div>
                <div className="p-4 sm+:p-6 bg-background">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base sm+:text-lg font-semibold text-foreground mb-1 sm+:mb-2">
                        {avatar.title}
                      </h3>
                      <p className="text-xs sm+:text-sm text-foreground/60">
                        {avatar.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm+:w-10 sm+:h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <Icons.chevronRight className="w-4 h-4 sm+:w-5 sm+:h-5 text-primary" />
                      </div>
                    </div>
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

