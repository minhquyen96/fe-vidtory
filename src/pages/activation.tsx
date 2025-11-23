import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, Sparkles, Key, ArrowLeft } from 'lucide-react'
import { apiService } from '@/services/api'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

interface ActivationResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    code: string
    package?: {
      name: string
      credit: number
    }
    premium?: {
      status: string
      expires_at?: number | null
      activated_at?: number | null
      credit?: number
    }
  }
}

export default function ActivationPage() {
  const { t } = useTranslation(I18N_NAMESPACES.COMMON)
  const router = useRouter()
  const { isAuthenticated, openLoginModal, loading: authLoading } = useAuth()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activatedCredit, setActivatedCredit] = useState<number | null>(null)

  // Redirect to login if not authenticated (after auth check completes)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Don't redirect automatically, just show login button
    }
  }, [isAuthenticated, authLoading])

  const handleActivate = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      openLoginModal()
      return
    }

    // Validate code
    if (!code.trim()) {
      setError(t('activationModal.codeRequired'))
      return
    }

    try {
      setLoading(true)
      setError(null)

      const result = await apiService.post<ActivationResponse>(
        '/activation-codes/activate',
        {
          code: code.trim(),
        }
      )

      if (result.status === 'success' && result.data) {
        // Store activated credit amount
        const creditAmount = result.data.package?.credit || 0
        setActivatedCredit(creditAmount)
        setSuccess(true)
        
        // Refresh user data by reloading the page
        // This will trigger AuthContext to fetch updated user data
        setTimeout(() => {
          window.location.href = '/ai-creative-generator'
        }, 3000)
      } else {
        setError(result.message || t('activationModal.activateFailed'))
      }
    } catch (err: any) {
      console.error('Activation error:', err)
      setError(
        err.response?.data?.message ||
          err.message ||
          t('activationModal.activateFailed')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && !success) {
      handleActivate()
    }
  }

  return (
    <Layout
      title={t('activationModal.title')}
      description={t('activationModal.description')}
    >
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-default-500 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">{t('common.back')}</span>
          </Link>

          {success ? (
            // Success Screen
            <div className="bg-content1 border border-divider rounded-large shadow-lg p-8 md:p-10 text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-success" size={48} />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {t('activationModal.successTitle')}
              </h1>
              {activatedCredit !== null && (
                <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-lg font-semibold text-foreground mb-1">
                    {t('activationModal.creditAdded')}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    +{activatedCredit.toLocaleString()} {t('activationModal.credits')}
                  </p>
                </div>
              )}
              <p className="text-default-600 mb-8 text-lg">
                {t('activationModal.successMessage')}
              </p>
              <div className="flex items-center justify-center gap-2 text-primary mb-6">
                <Sparkles size={24} />
                <span className="font-semibold text-lg">
                  {t('activationModal.enjoyPremium')}
                </span>
              </div>
              <p className="text-sm text-default-500">
                {t('activationModal.redirecting') || 'Đang chuyển hướng...'}
              </p>
            </div>
          ) : (
            // Activation Form
            <div className="bg-content1 border border-divider rounded-large shadow-lg p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="text-primary" size={32} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {t('activationModal.title')}
                </h1>
                <p className="text-default-600 text-sm md:text-base">
                  {t('activationModal.description')}
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="activation-code"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t('activationModal.codeLabel')}
                  </label>
                  <Input
                    id="activation-code"
                    type="text"
                    placeholder={t('activationModal.codePlaceholder')}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase())
                      setError(null)
                    }}
                    onKeyPress={handleKeyPress}
                    className="text-center text-lg md:text-xl font-mono tracking-wider h-12"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-3 rounded-lg text-sm">
                    {t('activationModal.loginRequired') ||
                      'Vui lòng đăng nhập để kích hoạt mã.'}
                  </div>
                )}

                <Button
                  onClick={handleActivate}
                  disabled={loading || !code.trim() || !isAuthenticated}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all h-12 rounded-large font-bold text-base"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      {t('activationModal.activating')}
                    </>
                  ) : !isAuthenticated ? (
                    t('activationModal.loginToActivate') || 'Đăng nhập để kích hoạt'
                  ) : (
                    t('activationModal.activateButton')
                  )}
                </Button>

                {!isAuthenticated && (
                  <Button
                    onClick={() => openLoginModal()}
                    variant="outline"
                    className="w-full h-12 rounded-large font-semibold"
                    size="lg"
                  >
                    {t('common.login') || 'Đăng nhập'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        I18N_NAMESPACES.COMMON,
      ])),
    },
  }
}

