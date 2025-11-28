import React from 'react'
import { Icons } from '@/components/ui/icons'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useEventTrackingHelpers } from '@/helpers/eventTracking'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'

// Define review data type
export interface UserReview {
  id: string
  name: string
  avatar: string
  rating: number
  date: string
  country: string
  titleKey: string
  contentKey: string
}

interface UserReviewsProps {
  namespace: string
  title?: string
  subtitle?: string
  reviews: UserReview[]
  trackingLocation:
    | 'HOME'
    | 'TOPICS'
    | 'TOPIC_DETAIL'
    | 'LESSON'
    | 'SHADOWING'
    | 'DICTATION'
    | 'REVIEW'
    | 'PROFILE'
    | 'MY_NOTES'
    | 'AUTH'
    | 'NAVIGATION'
    | 'UI'
    | 'ERROR'
    | 'PERFORMANCE'
    | 'FEATURE_USAGE'
    | 'ENGAGEMENT'
}

export function UserReviews({
  namespace,
  title,
  subtitle,
  reviews,
  trackingLocation,
}: UserReviewsProps) {
  const { t } = useTranslationWithHTMLParser(namespace)
  const { trackEvent } = useEventTrackingHelpers()

  const handleReviewInteraction = (
    review: UserReview,
    index: number,
    interactionType: 'hover' | 'click'
  ) => {
    trackEvent(trackingLocation, 'REVIEW_CLICK', {
      review_id: review.id,
      review_index: index,
      reviewer_name: review.name,
      reviewer_country: review.country,
      review_rating: review.rating,
      review_date: review.date,
      interaction_type: interactionType,
      section: 'user_reviews',
    })
  }

  return (
    <section className="py-8 md:py-16 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-50 dark:bg-grid-slate-700-25" />
      
      {/* Gradient orbs */}
      <div className="absolute -left-20 top-40 w-72 h-72 bg-primary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0" />
      <div className="absolute -right-20 top-1/3 w-72 h-72 bg-secondary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0" />

      <div className="relative z-10">
        <div className="text-center mb-8 md:mb-12">
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scrolling reviews container */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 py-8 animate-scroll-reviews">
            {/* First set */}
            {reviews.map((review, index) => (
              <div
                key={`first-${review.id}`}
                className="flex-shrink-0 w-[300px] md:w-[380px] group bg-card/50 backdrop-blur-sm rounded-2xl shadow-md border border-primary/5 p-6 md:p-8 hover:border-primary/20 transition-all duration-300 hover:shadow-primary/5 cursor-pointer"
                onClick={() => handleReviewInteraction(review, index, 'click')}
                onMouseEnter={() =>
                  handleReviewInteraction(review, index, 'hover')
                }
              >
                <div className="flex items-start mb-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 ring-4 ring-background">
                      <AvatarImage
                        src={review.avatar}
                        alt={review.name}
                        className="object-cover"
                      />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3 md:ml-4 flex-1">
                    <div className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors">
                      {review.name}
                    </div>
                  </div>
                  <span className="inline-block px-2 md:px-3 py-1 text-xs font-medium rounded-full bg-primary/5 text-primary">
                    {review.country}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-4">
                  <span className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Icons.star
                        key={i}
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>

                <div className="font-medium text-lg md:text-xl mb-2 md:mb-3 group-hover:text-primary transition-colors">
                  {t(review.titleKey)}
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {t(review.contentKey)}
                </p>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {reviews.map((review, index) => (
              <div
                key={`second-${review.id}`}
                className="flex-shrink-0 w-[300px] md:w-[380px] group bg-card/50 backdrop-blur-sm rounded-2xl shadow-lg border border-primary/5 p-6 md:p-8 hover:border-primary/20 transition-all duration-300 hover:shadow-primary/5 cursor-pointer"
                onClick={() => handleReviewInteraction(review, index, 'click')}
                onMouseEnter={() =>
                  handleReviewInteraction(review, index, 'hover')
                }
              >
                <div className="flex items-start mb-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 ring-4 ring-background">
                      <AvatarImage
                        src={review.avatar}
                        alt={review.name}
                        className="object-cover"
                      />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3 md:ml-4 flex-1">
                    <div className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors">
                      {review.name}
                    </div>
                  </div>
                  <span className="inline-block px-2 md:px-3 py-1 text-xs font-medium rounded-full bg-primary/5 text-primary">
                    {review.country}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-4">
                  <span className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Icons.star
                        key={i}
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>

                <div className="font-medium text-lg md:text-xl mb-2 md:mb-3 group-hover:text-primary transition-colors">
                  {t(review.titleKey)}
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {t(review.contentKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
