import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface RealAIFeaturesSectionProps {
  className?: string
}

export function RealAIFeaturesSection({ className }: RealAIFeaturesSectionProps) {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.HOME)

  const features = [
    {
      id: 1,
      title: 'AI script',
      description: 'Using GPT-4o, our tool learns from 5 million videos to write perfect scripts.',
      icon: Icons.edit,
    },
    {
      id: 2,
      title: 'AI-powered clip selection and editing',
      description: 'AI automatically understands, selects, and edits your video clips.',
      icon: Icons.video,
    },
    {
      id: 3,
      title: 'AI voiceover',
      description: 'OpenAI and ElevenLabs provide lifelike AI voices for professional, engaging video content.',
      icon: Icons.mic,
    },
    {
      id: 4,
      title: 'AI avatars',
      description: 'Our AI tool provides diverse avatars designed specifically for marketing.',
      icon: Icons.user,
    },
    {
      id: 5,
      title: 'AI auto-caption',
      description: 'AI auto-generates diverse subtitle styles for viral short videos.',
      icon: Icons.sparkles,
    },
    {
      id: 6,
      title: '20+ language support',
      description: 'Supports 20+ languages and AI voices for comprehensive video solutions.',
      icon: Icons.globe,
    },
  ]

  return (
    <section className={cn('relative overflow-hidden bg-background py-8 sm+:py-16', className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-50 dark:bg-grid-slate-700-25" />
      
      {/* Gradient orbs */}
      <div className="absolute -left-20 top-20 w-72 h-72 bg-primary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0" />
      <div className="absolute -right-20 top-1/2 w-72 h-72 bg-secondary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0" />

      <div className="container mx-auto px-4 sm+:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm+:mb-10">
            <h2 className="text-2xl sm+:text-4xl font-bold text-foreground mb-2 sm+:mb-3">
              {t('realAIFeatures.title')}
            </h2>
          </div>

          {/* Features Grid - 2 columns on tablet, 3 on desktop like topview.ai */}
          <div className="grid grid-cols-1 sm+:grid-cols-2 gap-4 sm+:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.id}
                  className="group relative bg-background rounded-xl p-4 sm+:p-5 border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-3 sm+:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm+:w-12 sm+:h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 sm+:w-6 sm+:h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm+:text-base font-semibold text-foreground mb-1 sm+:mb-2 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm+:text-sm text-foreground/60 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
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

