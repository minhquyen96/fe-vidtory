import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Ban } from 'lucide-react'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'

export interface BannedAccountData {
  ban_id: string
  reason: string
  banned_at: string
  expires_at: string
  is_permanent: boolean
}

export interface BannedAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  message: string
  data: BannedAccountData
}

export function BannedAccountDialog({
  isOpen,
  onClose,
  message,
  data
}: BannedAccountDialogProps) {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMUNITY)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-red-50 dark:bg-red-950">
              <Ban className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left text-red-600 dark:text-red-400">
                {t('banned.title')}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Main message */}
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {data.is_permanent 
                    ? t('banned.permanentMessage')
                    : t('banned.message', { date: formatDate(data.expires_at) })
                  }
                </p>
                {data.reason && (
                  <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                    {t('banned.reason', { reason: data.reason })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>{t('banned.bannedAt', {date: formatDate(data.banned_at)})}</span>
            </div>
            {!data.is_permanent && (
              <div className="flex justify-between">
                <span>{t('banned.expiresAt', {date: formatDate(data.expires_at)})}</span>
              </div>
            )}
          </div>

          {/* Support message */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('banned.contactSupport')}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={handleClose}
            className="w-full"
            variant="default"
          >
            {t('banned.okButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook để sử dụng banned account dialog
export function useBannedAccountDialog() {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean
    message: string
    data: BannedAccountData | null
  }>({
    isOpen: false,
    message: '',
    data: null
  })

  const showBannedDialog = React.useCallback((message: string, data: BannedAccountData) => {
    setDialogState({
      isOpen: true,
      message,
      data
    })
  }, [])

  const hideBannedDialog = React.useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const BannedDialogComponent = React.useCallback(() => {
    if (!dialogState.data) return null
    
    return (
      <BannedAccountDialog
        isOpen={dialogState.isOpen}
        onClose={hideBannedDialog}
        message={dialogState.message}
        data={dialogState.data}
      />
    )
  }, [dialogState, hideBannedDialog])

  return {
    showBannedDialog,
    hideBannedDialog,
    BannedDialog: BannedDialogComponent
  }
}
