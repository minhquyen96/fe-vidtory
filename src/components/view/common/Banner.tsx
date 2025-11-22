import { I18nNamespace } from '@/constants/i18n'
import { Button, ButtonLink } from '@/components/ui/button'
import { useRouter } from 'next/router'
import { useEventTrackingHelpers } from '@/helpers/eventTracking'
import { routes } from '@/constants'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { useAuth } from '@/context/AuthContext'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'

interface BannerProps {
  namespace: I18nNamespace
  trackingLocation: 'HOME' | 'SHADOWING'
  className?: string
}

export function Banner({
  namespace,
  trackingLocation,
  className = '',
}: BannerProps) {
  const { t } = useTranslationWithHTMLParser(namespace)
  const router = useRouter()
  const { trackEvent } = useEventTrackingHelpers()
  const { openLoginModal, user } = useAuth()

  const handleGetStartedClick = () => {
    trackEvent(
      trackingLocation,
      `${trackingLocation.toLowerCase()}_get_started_click`,
      {
        button_location: 'banner',
        button_text: t('hero.cta'),
        destination: '/gemini-banana-pro',
      }
    )
    router.push('/gemini-banana-pro')
  }

  const [selectedUseCase, setSelectedUseCase] = useState<string>('videoEditing')
  const [selectedFeature, setSelectedFeature] =
    useState<string>('autoSubtitles')
  const sliderRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      key: 'autoSubtitles',
      titleKey: 'hero.features.autoSubtitles.title',
      descriptionKey: 'hero.features.autoSubtitles.description',
    },
    {
      key: 'brandKit',
      titleKey: 'hero.features.brandKit.title',
      descriptionKey: 'hero.features.brandKit.description',
    },
    {
      key: 'dubbing',
      titleKey: 'hero.features.dubbing.title',
      descriptionKey: 'hero.features.dubbing.description',
    },
    {
      key: 'textToVideo',
      titleKey: 'hero.features.textToVideo.title',
      descriptionKey: 'hero.features.textToVideo.description',
    },
    {
      key: 'aiClips',
      titleKey: 'hero.features.aiClips.title',
      descriptionKey: 'hero.features.aiClips.description',
    },
    {
      key: 'aiAvatars',
      titleKey: 'hero.features.aiAvatars.title',
      descriptionKey: 'hero.features.aiAvatars.description',
    },
    {
      key: 'recorder',
      titleKey: 'hero.features.recorder.title',
      descriptionKey: 'hero.features.recorder.description',
    },
  ]

  const handleFeatureClick = (key: string) => {
    setSelectedFeature(key)
    trackEvent(
      trackingLocation,
      `${trackingLocation.toLowerCase()}_feature_click`,
      {
        feature: key,
        location: 'banner',
      }
    )

    // Scroll slider to selected item
    if (sliderRef.current) {
      const itemIndex = features.findIndex((f) => f.key === key)
      const itemElement = sliderRef.current.children[itemIndex] as HTMLElement
      if (itemElement) {
        itemElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }

  const selectedFeatureData = features.find((f) => f.key === selectedFeature)

  const useCases = [
    {
      key: 'videoEditing',
      titleKey: 'everythingYouNeed.items.videoEditing.title',
      descriptionKey: 'everythingYouNeed.items.videoEditing.description',
    },
    {
      key: 'aiAvatars',
      titleKey: 'everythingYouNeed.items.aiAvatars.title',
      descriptionKey: 'everythingYouNeed.items.aiAvatars.description',
    },
    {
      key: 'recording',
      titleKey: 'everythingYouNeed.items.recording.title',
      descriptionKey: 'everythingYouNeed.items.recording.description',
    },
    {
      key: 'stockLibrary',
      titleKey: 'everythingYouNeed.items.stockLibrary.title',
      descriptionKey: 'everythingYouNeed.items.stockLibrary.description',
    },
    {
      key: 'collaboration',
      titleKey: 'everythingYouNeed.items.collaboration.title',
      descriptionKey: 'everythingYouNeed.items.collaboration.description',
    },
    {
      key: 'publishing',
      titleKey: 'everythingYouNeed.items.publishing.title',
      descriptionKey: 'everythingYouNeed.items.publishing.description',
    },
  ]

  const handleUseCaseClick = (key: string) => {
    setSelectedUseCase(key)
    trackEvent(
      trackingLocation,
      `${trackingLocation.toLowerCase()}_usecase_click`,
      {
        usecase: key,
        location: 'banner',
      }
    )
  }

  const selectedUseCaseData = useCases.find((uc) => uc.key === selectedUseCase)

  return (
    <>
      <section
        className={`relative overflow-hidden bg-background ${className}`}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 z-10 bg-grid-slate-100-50 dark:bg-grid-slate-700-25" />

        {/* Gradient orbs */}
        <div className="absolute -left-20 top-20 w-96 h-96 bg-primary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-20" />
        <div className="absolute -right-20 bottom-20 w-96 h-96 bg-secondary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-20" />

        <div className="container mx-auto px-4 sm+:px-6 py-8 sm+:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Title */}
            <h1 className="text-3xl sm+:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-md sm+:text-xl text-foreground/70 sm+:mb-8 mb-6 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4 sm+:mb-8">
              <Button
                size="lg"
                className="text-lg h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                onClick={handleGetStartedClick}
              >
                {t('hero.cta')}
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-2 sm+:gap-6 sm+:mt-12 mt-6 mb-4">
              {features.map((feature) => {
                const isSelected = selectedFeature === feature.key
                return (
                  <button
                    key={feature.key}
                    onClick={() => handleFeatureClick(feature.key)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : 'bg-primary/30 text-foreground/80 hover:bg-primary/80 border border-border/50'
                    )}
                  >
                    {t(feature.titleKey)}
                  </button>
                )
              })}
            </div>

            {/* Selected Feature Description */}
            {selectedFeatureData && (
              <div className="text-center mt-4 animate-in fade-in duration-300">
                <p className="text-sm text-foreground/60 max-w-2xl mx-auto">
                  {t(selectedFeatureData.descriptionKey)}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Slider Section - Veed.io Style */}
      <section className="relative overflow-hidden bg-background">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-slate-100-30   dark:bg-grid-slate-700-20" />

        <div className="container mx-auto px-4 sm+:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Slider Container with Veed.io Style Interface */}
            <div
              ref={sliderRef}
              className="flex gap-4 sm+:gap-6 overflow-x-auto hide-scrollbars snap-x snap-mandatory scroll-smooth pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {features.map((feature) => {
                const isSelected = selectedFeature === feature.key
                return (
                  <div
                    key={feature.key}
                    className={cn(
                      'flex-shrink-0 w-[calc(100vw-2rem)] sm+:w-full snap-center',
                      'rounded-xl border-2 overflow-hidden transition-all duration-300',
                      isSelected
                        ? 'border-primary shadow-2xl shadow-primary/20'
                        : 'border-border/50 opacity-60 hover:opacity-100'
                    )}
                    onClick={() => handleFeatureClick(feature.key)}
                  >
                    {/* Veed.io Style Interface */}
                    <div className="bg-muted/30 h-[500px] sm+:h-[600px] flex">
                      {/* Left Sidebar - Tools */}
                      <div className="hidden sm+:flex w-12 lg:w-16 bg-background border-r border-border/50 flex-col items-center py-3 sm+:py-4 gap-2 sm+:gap-3">
                        <button className="w-8 h-8 sm+:w-10 sm+:h-10 rounded-lg hover:bg-muted flex items-center justify-center">
                          <Icons.menu className="w-4 h-4 sm+:w-5 sm+:h-5 text-foreground/60" />
                        </button>
                        <button className="w-8 h-8 sm+:w-10 sm+:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Icons.video className="w-4 h-4 sm+:w-5 sm+:h-5 text-primary" />
                        </button>
                        <button className="w-8 h-8 sm+:w-10 sm+:h-10 rounded-lg hover:bg-muted flex items-center justify-center">
                          <Icons.mic className="w-4 h-4 sm+:w-5 sm+:h-5 text-foreground/60" />
                        </button>
                        <button className="w-8 h-8 sm+:w-10 sm+:h-10 rounded-lg hover:bg-muted flex items-center justify-center">
                          <Icons.edit className="w-4 h-4 sm+:w-5 sm+:h-5 text-foreground/60" />
                        </button>
                        <button className="w-8 h-8 sm+:w-10 sm+:h-10 rounded-lg hover:bg-muted flex items-center justify-center">
                          <Icons.play className="w-4 h-4 sm+:w-5 sm+:h-5 text-foreground/60" />
                        </button>
                      </div>

                      {/* Main Content Area */}
                      <div className="flex-1 flex flex-col">
                        {/* Top Bar */}
                        <div className="h-12 sm+:h-14 bg-background border-b border-border/50 flex items-center justify-between px-3 sm+:px-6">
                          <div className="flex items-center gap-2 sm+:gap-4">
                            <button className="flex items-center gap-1 sm+:gap-2 text-xs sm+:text-sm text-foreground/60 hover:text-foreground">
                              <Icons.chevronLeft className="w-3 h-3 sm+:w-4 sm+:h-4" />
                              <span className="truncate max-w-[120px] sm+:max-w-none">
                                {t(feature.titleKey)}
                              </span>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 sm+:gap-3">
                            <button className="hidden sm+:block px-3 sm+:px-4 py-1 sm+:py-1.5 rounded-md text-xs sm+:text-sm font-medium bg-muted hover:bg-muted/80">
                              Share
                            </button>
                            <button className="px-3 sm+:px-4 py-1 sm+:py-1.5 rounded-md text-xs sm+:text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                              Done
                            </button>
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 grid grid-cols-1 sm+:grid-cols-2 gap-0">
                          {/* Left Panel - Editor */}
                          <div className="bg-background p-3 sm+:p-6 border-b sm+:border-b-0 sm+:border-r border-border/50 overflow-y-auto">
                            <div className="space-y-3 sm+:space-y-4">
                              {/* Style Controls */}
                              <div className="flex items-center gap-2 sm+:gap-3 mb-4 sm+:mb-6">
                                <button className="px-3 sm+:px-4 py-1.5 sm+:py-2 rounded-md bg-muted hover:bg-muted/80 text-xs sm+:text-sm font-medium flex items-center gap-1 sm+:gap-2">
                                  <Icons.edit className="w-3 h-3 sm+:w-4 sm+:h-4" />
                                  <span className="hidden sm+:inline">
                                    Style
                                  </span>
                                </button>
                                <button className="w-7 h-7 sm+:w-8 sm+:h-8 rounded-md border border-border/50 hover:bg-muted flex items-center justify-center">
                                  <span className="text-xs sm+:text-sm font-bold italic">
                                    I
                                  </span>
                                </button>
                              </div>

                              {/* Categories */}
                              <div className="flex gap-1.5 sm+:gap-2 mb-3 sm+:mb-4 overflow-x-auto hide-scrollbars">
                                <button className="px-2.5 sm+:px-3 py-1 sm+:py-1.5 rounded-full text-xs font-medium bg-primary text-primary-foreground whitespace-nowrap">
                                  All
                                </button>
                                <button className="px-2.5 sm+:px-3 py-1 sm+:py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 whitespace-nowrap">
                                  Business
                                </button>
                                <button className="px-2.5 sm+:px-3 py-1 sm+:py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 whitespace-nowrap">
                                  Social
                                </button>
                                <button className="px-2.5 sm+:px-3 py-1 sm+:py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 whitespace-nowrap">
                                  Retro
                                </button>
                              </div>

                              {/* Subtitle Items */}
                              <div className="space-y-1.5 sm+:space-y-2">
                                {[1, 2, 3, 4].map((item) => (
                                  <div
                                    key={item}
                                    className={cn(
                                      'p-2 sm+:p-3 rounded-lg border cursor-pointer transition-all',
                                      item === 1 && isSelected
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                                    )}
                                  >
                                    <div className="flex items-center justify-between mb-0.5 sm+:mb-1">
                                      <span
                                        className={cn(
                                          'text-[10px] sm+:text-xs font-medium truncate flex-1',
                                          item === 1 && isSelected
                                            ? 'text-primary'
                                            : 'text-foreground/60'
                                        )}
                                      >
                                        {item === 1
                                          ? 'FIRST LINE OF YOUR SUBS'
                                          : 'First line of your subs'}
                                      </span>
                                      {item === 1 && (
                                        <button className="text-[10px] sm+:text-xs text-primary hover:text-primary/80 ml-2 flex-shrink-0">
                                          Edit
                                        </button>
                                      )}
                                    </div>
                                    <div className="text-[10px] sm+:text-xs text-foreground/40">
                                      00:0{item} - 00:0{item + 1}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right Panel - Video Preview */}
                          <div className="bg-muted/20 p-3 sm+:p-6 flex flex-col">
                            <div className="flex-1 rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 border border-border/50 relative min-h-[200px] sm+:min-h-0">
                              {/* Fake Video Preview */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center space-y-2 sm+:space-y-4">
                                  <div className="w-20 h-20 sm+:w-32 sm+:h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                    <Icons.video className="w-10 h-10 sm+:w-16 sm+:h-16 text-primary/40" />
                                  </div>
                                  <div className="space-y-1 sm+:space-y-2">
                                    <div className="text-base sm+:text-2xl font-bold text-foreground/80">
                                      {t(feature.titleKey)}
                                    </div>
                                    <div className="text-xs sm+:text-sm text-foreground/60">
                                      Video Preview
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Subtitle Overlay */}
                              {isSelected && (
                                <div className="absolute bottom-4 sm+:bottom-8 left-1/2 -translate-x-1/2">
                                  <div className="px-3 sm+:px-6 py-2 sm+:py-3 bg-black/80 backdrop-blur-sm rounded-lg">
                                    <span className="text-sm sm+:text-lg font-semibold text-white">
                                      {t(feature.titleKey).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Timeline */}
                            <div className="mt-3 sm+:mt-4 space-y-1.5 sm+:space-y-2">
                              <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all',
                                    isSelected
                                      ? 'bg-primary'
                                      : 'bg-foreground/20'
                                  )}
                                  style={{ width: '30%' }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[10px] sm+:text-xs text-foreground/60">
                                <span>00:00</span>
                                <div className="flex items-center gap-1.5 sm+:gap-2">
                                  <button className="w-5 h-5 sm+:w-6 sm+:h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center">
                                    <Icons.chevronLeft className="w-2.5 h-2.5 sm+:w-3 sm+:h-3" />
                                  </button>
                                  <button className="w-7 h-7 sm+:w-8 sm+:h-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center">
                                    <Icons.play className="w-3 h-3 sm+:w-4 sm+:h-4 text-primary" />
                                  </button>
                                  <button className="w-5 h-5 sm+:w-6 sm+:h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center">
                                    <Icons.chevronRight className="w-2.5 h-2.5 sm+:w-3 sm+:h-3" />
                                  </button>
                                </div>
                                <span>00:10</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
