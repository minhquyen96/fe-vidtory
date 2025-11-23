import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react'
import { apiService } from '@/services/api'
import { useTranslation } from 'next-i18next'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { useAuth } from '@/context/AuthContext'

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

interface ActivationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ActivationModal({
  isOpen,
  onClose,
  onSuccess,
}: ActivationModalProps) {
  const { t } = useTranslation(I18N_NAMESPACES.COMMON)
  const { isAuthenticated, openLoginModal } = useAuth()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activatedCredit, setActivatedCredit] = useState<number | null>(null)

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
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }
        // Refresh user data by reloading
        window.location.reload()
        // Reset form after 3 seconds
        setTimeout(() => {
          handleClose()
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

  const handleClose = () => {
    setCode('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && !success) {
      handleActivate()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {success ? (
          // Success Screen
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="text-success" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {t('activationModal.successTitle')}
            </h2>
            {activatedCredit !== null && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-1">
                  {t('activationModal.creditAdded')}
                </p>
                <p className="text-2xl font-bold text-primary">
                  +{activatedCredit.toLocaleString()} {t('activationModal.credits')}
                </p>
              </div>
            )}
            <p className="text-default-600 mb-6">
              {t('activationModal.successMessage')}
            </p>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={20} />
              <span className="font-semibold">
                {t('activationModal.enjoyPremium')}
              </span>
            </div>
          </div>
        ) : (
          // Activation Form
          <div className="flex flex-col gap-6 py-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t('activationModal.title')}
              </h2>
              <p className="text-default-600 text-sm">
                {t('activationModal.description')}
              </p>
            </div>

            <div className="space-y-4">
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
                  className="text-center text-lg font-mono tracking-wider"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleActivate}
                disabled={loading || !code.trim()}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all h-12 rounded-large font-bold"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    {t('activationModal.activating')}
                  </>
                ) : (
                  t('activationModal.activateButton')
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

