import { useCallback } from 'react'
import { useBannedAccountDialog, BannedAccountData } from '@/components/ui/banned-account-dialog'

interface ApiError {
  status: string
  message: string
  code: string
  data?: any
}

export function useGlobalErrorHandler() {
  const { showBannedDialog, BannedDialog } = useBannedAccountDialog()

  const handleApiError = useCallback((error: any) => {
    // Check if it's an axios error with response
    if (error?.response?.status === 403) {
      const errorData: ApiError = error.response.data
      
      // Check if it's a banned account error
      if (errorData?.code === 'ACCOUNT_BANNED' && errorData?.data) {
        const bannedData: BannedAccountData = errorData.data
        showBannedDialog(errorData.message, bannedData)
        return true // Handled
      }
    }
    
    return false // Not handled
  }, [showBannedDialog])

  return {
    handleApiError,
    BannedDialog
  }
}
