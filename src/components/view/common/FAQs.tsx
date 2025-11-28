import React, { useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { useEventTrackingHelpers } from '@/helpers/eventTracking'
import { Typography } from '@/components/ui/typography'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'

export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
}

export interface FAQCategory {
  id: string
  name: string
}

interface FAQsProps {
  namespace: string
  faqs: FAQ[]
  categories?: FAQCategory[]
  showCategories?: boolean
  showContactButton?: boolean
  trackingLocation?: 'HOME' | 'SHADOWING'
  className?: string
}

export function FAQs({
  namespace,
  faqs,
  categories = [],
  showCategories = true,
  showContactButton = true,
  trackingLocation = 'HOME',
  className = '',
}: FAQsProps) {
  const { t } = useTranslationWithHTMLParser(namespace)
  const router = useRouter()
  const { trackEvent } = useEventTrackingHelpers()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredFaqs =
    activeCategory === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory)

  const handleCategoryChange = (categoryId: string) => {
    trackEvent(trackingLocation, 'faq_toggle', {
      filter_type: 'category',
      from_category: activeCategory,
      to_category: categoryId,
      section: 'faqs',
    })

    setActiveCategory(categoryId)
  }

  const toggleQuestion = (id: string) => {
    const isOpening = activeId !== id
    const faq = faqs.find((f) => f.id === id)

    trackEvent(trackingLocation, 'faq_toggle', {
      faq_id: id,
      faq_category: faq?.category,
      action: isOpening ? 'open' : 'close',
      question_text: faq?.question,
      section: 'faqs',
    })

    setActiveId((prevId) => (prevId === id ? null : id))
  }

  const handleContactClick = () => {
    trackEvent(trackingLocation, 'faq_toggle', {
      button_location: 'faqs_contact',
      button_text: t('faqs.contact.button'),
      destination: routes.contactUs,
      section: 'faqs',
    })

    router.push(routes.contactUs)
  }

  return (
    <section className={`md:py-16 py-8 bg-background relative overflow-hidden ${className}`}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-50 dark:bg-grid-slate-700-25" />
      
      {/* Gradient orbs */}
      <div className="absolute -left-20 top-1/4 w-96 h-96 bg-primary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0" />
      <div className="absolute -right-20 bottom-1/4 w-96 h-96 bg-secondary/15 rounded-full  light:mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0" />

      <div className="container relative z-10">
        <div className="text-center md:mb-10 mb-4">
          <Typography variant="H32B" className="mb-4 mobile:H24B">
            {t('faqs.title')}
          </Typography>
          <Typography className="text-muted-foreground max-w-2xl mx-auto">
            {t('faqs.subtitle')}
          </Typography>
        </div>

        {/* Category filters */}
        {showCategories && categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              key="all"
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-background hover:bg-primary/10'
              }`}
            >
              {t('faqs.categories.all')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-background hover:bg-primary/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {(showCategories ? filteredFaqs : faqs).map((faq) => (
            <div
              key={faq.id}
              className={`bg-background border rounded-lg transition-all ${
                activeId === faq.id ? 'shadow-md' : ''
              }`}
            >
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left font-medium"
                onClick={() => toggleQuestion(faq.id)}
              >
                <span>{faq.question}</span>
                <Icons.chevronDown
                  className={`h-5 w-5 text-primary transition-transform ${
                    activeId === faq.id ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {activeId === faq.id && (
                <div className="px-6 pb-4">
                  <Typography className="text-muted-foreground">
                    {faq.answer}
                  </Typography>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact for more questions */}
        {/*{showContactButton && (*/}
        {/*  <div className="mt-12 text-center">*/}
        {/*    <Typography className="mb-4 text-muted-foreground">*/}
        {/*      {t('faqs.contact.question')}*/}
        {/*    </Typography>*/}
        {/*    <div*/}
        {/*      onClick={handleContactClick}*/}
        {/*      className="cursor-pointer inline-flex items-center justify-center h-10 px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-600 transition-colors"*/}
        {/*    >*/}
        {/*      {t('faqs.contact.button')}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </section>
  )
}
