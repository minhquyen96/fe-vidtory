import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Flag } from 'lucide-react'

export interface ReportDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  placeholder?: string
  loadingText?: string
}

export function ReportDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Report',
  cancelText = 'Cancel',
  placeholder = 'Please describe why you are reporting this content...',
  loadingText = 'Reporting...'
}: ReportDialogProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setReason('')
    setIsSubmitting(false)
    onClose()
  }

  const handleConfirm = async () => {
    if (!reason.trim()) return
    
    setIsSubmitting(true)
    try {
      await onConfirm(reason.trim())
      handleClose()
    } catch (error) {
      console.error('Report failed:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-yellow-50 dark:bg-yellow-950">
              <Flag className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left mt-2 ml-11">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <Textarea
            placeholder={placeholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
        </div>
        
        <DialogFooter className="flex-row justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
            className="min-w-[80px]"
          >
            {isSubmitting ? loadingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook để sử dụng report dialog dễ dàng hơn
export function useReportDialog() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: (reason: string) => void
    confirmText?: string
    cancelText?: string
    placeholder?: string
    loadingText?: string
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  const showReport = React.useCallback((options: {
    title: string
    description: string
    onConfirm: (reason: string) => void
    confirmText?: string
    cancelText?: string
    placeholder?: string
    loadingText?: string
  }) => {
    setDialogState({
      isOpen: true,
      ...options
    })
  }, [])

  const hideReport = React.useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const ReportDialogComponent = React.useCallback(() => (
    <ReportDialog
      isOpen={dialogState.isOpen}
      onClose={hideReport}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      description={dialogState.description}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      placeholder={dialogState.placeholder}
      loadingText={dialogState.loadingText}
    />
  ), [dialogState, hideReport])

  return {
    showReport,
    hideReport,
    ReportDialog: ReportDialogComponent
  }
}
