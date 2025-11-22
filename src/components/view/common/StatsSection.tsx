import { cn } from '@/lib/utils'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

interface StatsSectionProps {
  className?: string
}

export function StatsSection({ className }: StatsSectionProps) {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.HOME)
  const router = useRouter()

  const stats = [
    {
      value: '5x',
      label: 'production efficiency',
    },
    {
      value: '0',
      label: 'editing skills required',
    },
    {
      value: '5%',
      label: 'cost of real employees',
    },
  ]

  return (
    <section className={cn('relative overflow-hidden bg-muted/20 py-8 sm+:py-16', className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-30   dark:bg-grid-slate-700-20" />
      
      {/* Gradient orbs */}
      <div className="absolute -left-40 top-1/4 w-96 h-96 bg-secondary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0" />
      <div className="absolute -right-40 bottom-1/4 w-96 h-96 bg-primary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0" />

      <div className="container mx-auto px-4 sm+:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm+:mb-10">
            <h2 className="text-2xl sm+:text-4xl font-bold text-foreground mb-2 sm+:mb-3">
              {t('statsSection.title')}
            </h2>
            <p className="text-sm sm+:text-base text-foreground/70 mb-4 sm+:mb-6">
              {t('statsSection.subtitle')}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm+:grid-cols-3 gap-6 sm+:gap-8 mb-8 sm+:mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-background rounded-2xl p-6 sm+:p-8 border border-border/50 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl sm+:text-6xl font-bold text-primary mb-2 sm+:mb-3">
                  {stat.value}
                </div>
                <div className="text-xs sm+:text-sm text-foreground/60 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="text-base sm+:text-lg px-8 sm+:px-12 py-6 sm+:py-8"
              onClick={() => {
                router.push('/gemini-banana-pro')
              }}
            >
              {t('statsSection.cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

