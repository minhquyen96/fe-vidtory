import React, { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Layout } from '@/components/layout/Layout'
import {
  Zap,
  BookOpen,
  Upload as UploadIcon,
  ArrowRight,
  Clock,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getTemplatesApi, Template } from '@/api/templates'

const GETTING_STARTED_STORAGE_KEY = 'dashboard_hide_getting_started'

export default function DashboardPage() {
  const router = useRouter()
  const [showGettingStarted, setShowGettingStarted] = useState(true)
  const [templates, setTemplates] = useState<Template[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(true)

  useEffect(() => {
    // Check localStorage on mount
    const hidden = localStorage.getItem(GETTING_STARTED_STORAGE_KEY)
    if (hidden === 'true') {
      setShowGettingStarted(false)
    }
  }, [])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setTemplatesLoading(true)
        const response = await getTemplatesApi({
          status: 'approved', // Only show approved templates
          limit: 4, // Show only 4 templates on home page
          sort_by: 'created_at',
          sort_order: 'desc',
        })
        if (response?.data?.templates) {
          setTemplates(response.data.templates)
        }
      } catch (err) {
        console.error('Error loading templates:', err)
      } finally {
        setTemplatesLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleDontShowAgain = () => {
    localStorage.setItem(GETTING_STARTED_STORAGE_KEY, 'true')
    setShowGettingStarted(false)
  }

  const handleTemplateClick = (template: Template) => {
    // Navigate to editor with template workflow
    router.push({
      pathname: '/editor',
      query: {
        template: template.id,
      },
    })
  }

  const handleViewAllTemplates = () => {
    router.push('/dashboard/templates')
  }

  const handleStartBuilding = () => {
    router.push('/editor')
  }

  const handleBrowseTemplates = () => {
    router.push('/dashboard/templates')
  }

  const handleImportNow = () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const jsonString = event.target?.result as string
            const workflowData = JSON.parse(jsonString)
            // Store workflow data in localStorage to be loaded in editor
            localStorage.setItem('pending_import_workflow', JSON.stringify(workflowData))
            // Navigate to editor
            router.push('/editor?import=true')
          } catch (error) {
            console.error('Error loading workflow:', error)
            alert('Failed to load workflow. Please check the file format.')
          }
        }
        reader.readAsText(file)
      }
      input.click()
    } catch (error) {
      console.error('Error opening file dialog:', error)
      alert('Failed to open file dialog. Please try again.')
    }
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
        <div className="p-8 mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[rgb(171,223,0)] mb-2">
              Welcome back to Vidtory.
            </h1>
            <p className="text-gray-600">
              Create amazing AI-powered visual workflows.
            </p>
          </div>

          {/* Getting Started Section */}
          {showGettingStarted && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Getting Started
                </h2>
                <button
                  onClick={handleDontShowAgain}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Don't Show Again
                </button>
              </div>
              <div className="grid grid-cols-1 sm+:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[rgb(171,223,0)]/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-[rgb(171,223,0)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Build Your First Workflow
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create your first AI workflow in minutes.
                  </p>
                  <Button 
                    onClick={handleStartBuilding}
                    className="w-full bg-[rgb(171,223,0)] hover:bg-[rgb(171,223,0)]/90 text-gray-900"
                  >
                    Start Building
                  </Button>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Learn from Templates
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Explore pre-built workflow templates.
                  </p>
                  <Button 
                    onClick={handleBrowseTemplates}
                    variant="outline" 
                    className="w-full"
                  >
                    Browse Templates
                  </Button>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-[rgb(171,223,0)]/10 flex items-center justify-center mb-4">
                    <UploadIcon className="w-6 h-6 text-[rgb(171,223,0)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Import Existing Project
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Import your saved workflow files.
                  </p>
                  <Button 
                    onClick={handleImportNow}
                    variant="outline" 
                    className="w-full"
                  >
                    Import Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recently Edited Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recently Edited
              </h2>
              <button className="text-sm text-[rgb(171,223,0)] hover:text-[rgb(171,223,0)]/80 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm+:grid-cols-4 gap-6">
              {/* Workflow Card 1 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-32 bg-gray-200 relative">
                  {/* Placeholder for image */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Holiday Campaign 2024
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    Complete workflow for holiday marketing...
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>

              {/* Workflow Card 2 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-32 bg-gray-200 relative">
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Product Photography
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    AI-enhanced product photography workflow.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>1 day ago</span>
                  </div>
                </div>
              </div>

              {/* Workflow Card 3 */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-32 bg-gray-200 relative">
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Fashion Editorial
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    Professional fashion photography workflow.
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Templates Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Workflow Templates
              </h2>
              <button
                onClick={handleViewAllTemplates}
                className="text-sm text-[rgb(171,223,0)] hover:text-[rgb(171,223,0)]/80 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {templatesLoading ? (
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
                         //   onMouseEnter={(e) => {
                         //     const video = e.currentTarget
                         //     video.play().catch(() => {
                         //       // Ignore autoplay errors
                         //     })
                         //   }}
                         //   onMouseLeave={(e) => {
                         //     const video = e.currentTarget
                         //     video.pause()
                         //     video.currentTime = 0
                         //   }}
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
                        <span className="text-xs font-medium text-[rgb(171,223,0)] bg-[rgb(171,223,0)]/10 px-2 py-0.5 rounded">
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
