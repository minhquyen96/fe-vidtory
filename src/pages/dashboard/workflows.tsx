import React, { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Layout } from '@/components/layout/Layout'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getWorkflowsApi, Workflow } from '@/api/workflows'
import { Clock, Image as ImageIcon, Loader2 } from 'lucide-react'

export default function WorkflowsPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true)
        const response = await getWorkflowsApi({
          limit: 50,
          sort_by: 'updated_at',
          sort_order: 'desc',
        })
        if (response?.data?.workflows) {
          setWorkflows(response.data.workflows)
        } else {
          setError('Failed to load workflows')
        }
      } catch (err) {
        console.error('Error loading workflows:', err)
        setError('Failed to load workflows')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [])

  const handleWorkflowClick = (workflow: Workflow) => {
    router.push(`/editor/${workflow.id}`)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Workflows</h1>

          {loading ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 p-8">
              <Loader2 className="h-8 w-8 text-[rgb(171,223,0)] animate-spin mb-3" />
              <p className="text-gray-500">Loading workflows...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No workflows yet. Create your first workflow!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm+:grid-cols-4 gap-6">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  onClick={() => handleWorkflowClick(workflow)}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="h-32 bg-gray-200 relative">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {workflow.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {workflow.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(workflow.updated_at)}</span>
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

