import React, { useEffect } from 'react'
import { useBannedAccountDialog, BannedAccountData } from '@/components/ui/banned-account-dialog'

interface GlobalErrorProviderProps {
  children: React.ReactNode
}

export function GlobalErrorProvider({ children }: GlobalErrorProviderProps) {
  const { showBannedDialog, BannedDialog } = useBannedAccountDialog()

  useEffect(() => {
    const handleAccountBanned = (event: CustomEvent) => {
      const { message, data } = event.detail
      if (data) {
        showBannedDialog(message, data as BannedAccountData)
      }
    }

    // Listen for banned account events
    window.addEventListener('error:account-banned', handleAccountBanned as EventListener)

    return () => {
      window.removeEventListener('error:account-banned', handleAccountBanned as EventListener)
    }
  }, [showBannedDialog])

  return (
    <>
      {children}
      <BannedDialog />
    </>
  )
}
