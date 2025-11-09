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
import { AlertTriangle, Trash2, Flag, Info } from 'lucide-react'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning' | 'info'
  icon?: React.ReactNode
}

const variantConfig = {
  default: {
    icon: Info,
    confirmButtonVariant: 'default' as const,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  destructive: {
    icon: Trash2,
    confirmButtonVariant: 'destructive' as const,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950'
  },
  warning: {
    icon: AlertTriangle,
    confirmButtonVariant: 'default' as const,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950'
  },
  info: {
    icon: Flag,
    confirmButtonVariant: 'default' as const,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  }
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'default',
  icon
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const IconComponent = config.icon

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${config.bgColor}`}>
              {icon || <IconComponent className={`h-5 w-5 ${config.iconColor}`} />}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">{title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left mt-2 ml-11">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-row justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmButtonVariant}
            onClick={handleConfirm}
            className="min-w-[80px]"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook để sử dụng confirm dialog dễ dàng hơn
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    variant?: ConfirmDialogProps['variant']
    confirmText?: string
    cancelText?: string
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  const showConfirm = React.useCallback((options: {
    title: string
    description: string
    onConfirm: () => void
    variant?: ConfirmDialogProps['variant']
    confirmText?: string
    cancelText?: string
  }) => {
    setDialogState({
      isOpen: true,
      ...options
    })
  }, [])

  const hideConfirm = React.useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const ConfirmDialogComponent = React.useCallback(() => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={hideConfirm}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      description={dialogState.description}
      variant={dialogState.variant}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
    />
  ), [dialogState, hideConfirm])

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog: ConfirmDialogComponent
  }
}
