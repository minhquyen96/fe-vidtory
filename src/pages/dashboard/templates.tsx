import React, { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Layout } from '@/components/layout/Layout'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getTemplatesApi, Template } from '@/api/templates'
import { Clock, Image as ImageIcon } from 'lucide-react'

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const response = await getTemplatesApi({
          status: 'approved', // Only show approved templates
          limit: 50,
          sort_by: 'created_at',
          sort_order: 'desc',
        })
        if (response?.data?.templates) {
          setTemplates(response.data.templates)
        } else {
          setError('Failed to load templates')
        }
      } catch (err) {
        console.error('Error loading templates:', err)
        setError('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleTemplateClick = (template: Template) => {
    // Navigate to editor with template workflow
    router.push({
      pathname: '/editor',
      query: {
        template: template.id,
      },
    })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        return `${diffMinutes} minutes ago`
      }
      return `${diffHours} hours ago`
    } else if (diffDays === 1) {
      return '1 day ago'
    } else {
      return `${diffDays} days ago`
    }
  }

  return (
    <Layout showHeader={false} showFooter={false} noIndex>
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Templates</h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="animate-spin h-8 w-8"
                  style={{ color: 'rgb(171, 223, 0)' }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-sm text-gray-500">Loading templates...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No templates available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm+:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Preview Image/Video */}
                  <div className="bg-gray-200 relative aspect-video overflow-hidden flex items-center justify-center">
                    {template.preview_video ? (
                      <video
                        src={template.preview_video}
                        className="w-full h-full object-contain"
                        muted
                        playsInline
                        autoPlay
                        loop
                        // onMouseEnter={(e) => {
                        //   const video = e.currentTarget
                        //   video.play().catch(() => {
                        //     // Ignore autoplay errors
                        //   })
                        // }}
                        // onMouseLeave={(e) => {
                        //   const video = e.currentTarget
                        //   video.pause()
                        //   video.currentTime = 0
                        // }}
                      />
                    ) : template.preview_image ? (
                      <img
                        src={template.preview_image}
                        alt={template.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {template.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(template.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

