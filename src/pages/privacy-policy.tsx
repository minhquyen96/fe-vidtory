import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@/components/layout/Layout'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  const { t } = useTranslation(I18N_NAMESPACES.POLICY)

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

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.informationCollection.title')}
              </h2>
              <div className="space-y-4">
                <p className="text-default-700">{t('sections.informationCollection.content')}</p>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('sections.informationCollection.personalData.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-default-700 ml-4">
                    <li>{t('sections.informationCollection.personalData.items.1')}</li>
                    <li>{t('sections.informationCollection.personalData.items.2')}</li>
                    <li>{t('sections.informationCollection.personalData.items.3')}</li>
                    <li>{t('sections.informationCollection.personalData.items.4')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('sections.informationCollection.usageData.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-default-700 ml-4">
                    <li>{t('sections.informationCollection.usageData.items.1')}</li>
                    <li>{t('sections.informationCollection.usageData.items.2')}</li>
                    <li>{t('sections.informationCollection.usageData.items.3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('sections.informationCollection.paymentData.title')}
                  </h3>
                  <p className="text-default-700">{t('sections.informationCollection.paymentData.content')}</p>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.usage.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-default-700 ml-4">
                <li>{t('sections.usage.items.1')}</li>
                <li>{t('sections.usage.items.2')}</li>
                <li>{t('sections.usage.items.3')}</li>
                <li>{t('sections.usage.items.4')}</li>
                <li>{t('sections.usage.items.5')}</li>
                <li>{t('sections.usage.items.6')}</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.sharing.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.sharing.content')}</p>
            </section>

            {/* Payment Processing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.payment.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.payment.content')}</p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.security.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.security.content')}</p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.rights.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-default-700 ml-4">
                <li>{t('sections.rights.items.1')}</li>
                <li>{t('sections.rights.items.2')}</li>
                <li>{t('sections.rights.items.3')}</li>
                <li>{t('sections.rights.items.4')}</li>
                <li>{t('sections.rights.items.5')}</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.cookies.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.cookies.content')}</p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t('sections.children.title')}
              </h2>
              <p className="text-default-700 mb-4">{t('sections.children.content')}</p>
            </section>

            {/* Changes to Policy */}
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
        I18N_NAMESPACES.POLICY,
        I18N_NAMESPACES.COMMON,
      ])),
    },
  }
}

