import React from 'react'
import { GetStaticProps } from 'next'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Layout } from '@/components/layout/Layout'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function HistoryPage() {
  return (
    <Layout showHeader={false} showFooter={false} noIndex>
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">History</h1>
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Your workflow history will appear here</p>
          </div>
        </div>
      </DashboardLayout>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        I18N_NAMESPACES.COMMON,
        I18N_NAMESPACES.HOME,
      ])),
    },
  }
}

