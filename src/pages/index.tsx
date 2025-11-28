import { GetStaticProps } from 'next'
import { Layout } from '@/components/layout/Layout'
import { Banner } from '@/components/view/common/Banner'
import { AIAvatarSection } from '@/components/view/common/AIAvatarSection'
import { AIPoweredVideoSection } from '@/components/view/common/AIPoweredVideoSection'
import { BrandInspirationSection } from '@/components/view/common/BrandInspirationSection'
import { ViralVideosSection } from '@/components/view/common/ViralVideosSection'
import { RealAIFeaturesSection } from '@/components/view/common/RealAIFeaturesSection'
import { StatsSection } from '@/components/view/common/StatsSection'
import { UserReviews } from '@/components/view/common/UserReviews'
import { FAQs } from '@/components/view/common/FAQs'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { SCHEMA } from '@/constants/seo'
import { renderPageSchema } from '@/helpers/seo'
import { useEventTrackingHelpers, EVENT_NAMES } from '@/helpers/eventTracking'
import { useEffect } from 'react'
import { Brain, Headphones, Mic, Target } from 'lucide-react'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { routes } from '@/constants'

export default function Home(props: { schema: string }) {
  const { schema } = props || {}
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.HOME)
  const { t: tAdvisors } = useTranslationWithHTMLParser(
    I18N_NAMESPACES.ADVISORS
  )
  const { trackPageView } = useEventTrackingHelpers()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    setTimeout(() => {
      router.push(routes.gemini)
    }, 100)
  }, [user])

  useEffect(() => {
    trackPageView(EVENT_NAMES.PAGE_VIEW.HOME, {
      page_type: 'landing',
      referrer: typeof window !== 'undefined' ? document.referrer : '',
    })
  }, [trackPageView])

  const commonProps = {
    namespace: I18N_NAMESPACES.HOME,
    trackingLocation: 'HOME' as const,
  }

  const steps = [
    {
      id: 1,
      image: 'https://assets.parroto.app/images/landing/step1.webp',
      titleKey: 'howTo.steps.1.title',
      altKey: 'howTo.steps.1.alt',
      descriptionKey: 'howTo.steps.1.description',
    },
    {
      id: 2,
      image: 'https://assets.parroto.app/images/landing/step2.webp',
      titleKey: 'howTo.steps.2.title',
      altKey: 'howTo.steps.2.alt',
      descriptionKey: 'howTo.steps.2.description',
    },
    {
      id: 3,
      image: 'https://assets.parroto.app/images/landing/step3.webp',
      titleKey: 'howTo.steps.3.title',
      altKey: 'howTo.steps.3.alt',
      descriptionKey: 'howTo.steps.3.description',
    },
    {
      id: 4,
      image: 'https://assets.parroto.app/images/landing/step4.webp',
      titleKey: 'howTo.steps.4.title',
      altKey: 'howTo.steps.4.alt',
      descriptionKey: 'howTo.steps.4.description',
    },
  ]

  const features = [
    {
      icon: Headphones,
      titleKey: 'features.listening.title',
      descriptionKey: 'features.listening.description',
      gradient: 'from-blue-600 to-cyan-500',
      featureType: 'listening',
    },
    {
      icon: Mic,
      titleKey: 'features.speaking.title',
      descriptionKey: 'features.speaking.description',
      gradient: 'from-purple-600 to-pink-500',
      featureType: 'speaking',
    },
    {
      icon: Brain,
      titleKey: 'features.memory.title',
      descriptionKey: 'features.memory.description',
      gradient: 'from-orange-600 to-yellow-500',
      featureType: 'memory',
    },
    {
      icon: Target,
      titleKey: 'features.progress.title',
      descriptionKey: 'features.progress.description',
      gradient: 'from-green-600 to-emerald-500',
      featureType: 'progress',
    },
  ]
  const faqs = [
    {
      id: '1',
      category: 'method',
      question: t('faqs.questions.1.question'),
      answer: t('faqs.questions.1.answer'),
    },
    {
      id: '2',
      category: 'benefits',
      question: t('faqs.questions.2.question'),
      answer: t('faqs.questions.2.answer'),
    },
    {
      id: '3',
      category: 'users',
      question: t('faqs.questions.3.question'),
      answer: t('faqs.questions.3.answer'),
    },
    {
      id: '4',
      category: 'usage',
      question: t('faqs.questions.4.question'),
      answer: t('faqs.questions.4.answer'),
    },
    {
      id: '5',
      category: 'content',
      question: t('faqs.questions.5.question'),
      answer: t('faqs.questions.5.answer'),
    },
    {
      id: '6',
      category: 'method',
      question: t('faqs.questions.6.question'),
      answer: t('faqs.questions.6.answer'),
    },
    {
      id: '7',
      category: 'technical',
      question: t('faqs.questions.7.question'),
      answer: t('faqs.questions.7.answer'),
    },
    {
      id: '8',
      category: 'usage',
      question: t('faqs.questions.8.question'),
      answer: t('faqs.questions.8.answer'),
    },
    {
      id: '9',
      category: 'content',
      question: t('faqs.questions.9.question'),
      answer: t('faqs.questions.9.answer'),
    },
    {
      id: '10',
      category: 'users',
      question: t('faqs.questions.10.question'),
      answer: t('faqs.questions.10.answer'),
    },
  ]

  const userReviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/100/100',
      rating: 5,
      date: '2 weeks ago',
      country: 'USA',
      titleKey: 'userReviews.1.title',
      contentKey: 'userReviews.1.content',
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: '/api/placeholder/100/100',
      rating: 5,
      date: '1 month ago',
      country: 'Singapore',
      titleKey: 'userReviews.2.title',
      contentKey: 'userReviews.2.content',
    },
    {
      id: '3',
      name: 'Emma Williams',
      avatar: '/api/placeholder/100/100',
      rating: 5,
      date: '3 weeks ago',
      country: 'UK',
      titleKey: 'userReviews.3.title',
      contentKey: 'userReviews.3.content',
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: '/api/placeholder/100/100',
      rating: 5,
      date: '1 week ago',
      country: 'South Korea',
      titleKey: 'userReviews.4.title',
      contentKey: 'userReviews.4.content',
    },
    {
      id: '5',
      name: 'Maria Garcia',
      avatar: '/api/placeholder/100/100',
      rating: 5,
      date: '2 months ago',
      country: 'Spain',
      titleKey: 'userReviews.5.title',
      contentKey: 'userReviews.5.content',
    },
    {
      id: '6',
      name: 'James Wilson',
      avatar: '/api/placeholder/100/100',
      rating: 5,
      date: '3 weeks ago',
      country: 'Canada',
      titleKey: 'userReviews.6.title',
      contentKey: 'userReviews.6.content',
    },
    {
      id: '7',
      name: 'Lisa Anderson',
      avatar: '/api/placeholder/100/100',
      rating: 5,
      date: '1 month ago',
      country: 'Australia',
      titleKey: 'userReviews.7.title',
      contentKey: 'userReviews.7.content',
    },
    {
      id: '8',
      name: 'Thomas Brown',
      avatar: '/api/placeholder/100/100',
      rating: 5,
      date: '2 weeks ago',
      country: 'Germany',
      titleKey: 'userReviews.8.title',
      contentKey: 'userReviews.8.content',
    },
  ]

  return (
    <Layout title={t('title')} description={t('description')}>
      {/* {renderPageSchema(schema as any)} */}
      <div className="mx-auto bg-background">
        <Banner {...commonProps} />
        {/* <LogoWall /> */}
        <AIAvatarSection />
        <AIPoweredVideoSection />
        <BrandInspirationSection />
        <ViralVideosSection />
        <RealAIFeaturesSection />
        <StatsSection />
        <UserReviews
          namespace={I18N_NAMESPACES.HOME}
          title={t('userReviews.title')}
          reviews={userReviews}
          trackingLocation="HOME"
        />
        <FAQs
          namespace={I18N_NAMESPACES.HOME}
          faqs={faqs}
          showCategories={false}
          showContactButton={true}
          trackingLocation="HOME"
        />
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const schema = await SCHEMA[locale as keyof typeof SCHEMA]
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        I18N_NAMESPACES.COMMON,
        I18N_NAMESPACES.HOME,
        I18N_NAMESPACES.ADVISORS,
      ])),
      schema,
    },
  }
}
