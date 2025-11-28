import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@/components/layout/Layout'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function TermsOfServicePage() {
  const { t } = useTranslation(I18N_NAMESPACES.TOS)
  const router = useRouter()

  return (
    <Layout
      title={t('title')}
      description={t('description')}
      noIndex
    >
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-default-500 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">{t('common.back')}</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('title')}
            </h1>
            <p className="text-default-600 text-sm md:text-base">
              {t('lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-default dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.introduction.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.introduction.content')}</p>
            </section>

            {/* Acceptance */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.acceptance.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.acceptance.content')}</p>
            </section>

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.services.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.services.content')}</p>
            </section>

            {/* Credits and Purchases */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.credits.title')}
              </h2>
              <div className="space-y-4">
                <p className="text-default-700">{t('sections.credits.content')}</p>
                <ul className="list-disc list-inside space-y-2 text-default-700 ml-4">
                  <li>{t('sections.credits.items.1')}</li>
                  <li>{t('sections.credits.items.2')}</li>
                  <li>{t('sections.credits.items.3')}</li>
                  <li>{t('sections.credits.items.4')}</li>
                  <li>{t('sections.credits.items.5')}</li>
                </ul>
              </div>
            </section>

            {/* Activation Codes */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.activationCodes.title')}
              </h2>
              <div className="space-y-4">
                <p className="text-default-700">{t('sections.activationCodes.content')}</p>
                <ul className="list-disc list-inside space-y-2 text-default-700 ml-4">
                  <li>{t('sections.activationCodes.items.1')}</li>
                  <li>{t('sections.activationCodes.items.2')}</li>
                  <li>{t('sections.activationCodes.items.3')}</li>
                </ul>
              </div>
            </section>

            {/* Premium Subscription */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.premium.title')}
              </h2>
              <div className="space-y-4">
                <p className="text-default-700">{t('sections.premium.content')}</p>
                <ul className="list-disc list-inside space-y-2 text-default-700 ml-4">
                  <li>{t('sections.premium.items.1')}</li>
                  <li>{t('sections.premium.items.2')}</li>
                  <li>{t('sections.premium.items.3')}</li>
                </ul>
              </div>
            </section>

            {/* Refund Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.refund.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.refund.content')}</p>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.responsibilities.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-default-700 ml-4">
                <li>{t('sections.responsibilities.items.1')}</li>
                <li>{t('sections.responsibilities.items.2')}</li>
                <li>{t('sections.responsibilities.items.3')}</li>
                <li>{t('sections.responsibilities.items.4')}</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.intellectualProperty.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.intellectualProperty.content')}</p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.liability.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.liability.content')}</p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.changes.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.changes.content')}</p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.contact.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.contact.content')}</p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        I18N_NAMESPACES.TOS,
        I18N_NAMESPACES.COMMON,
      ])),
    },
  }
}

