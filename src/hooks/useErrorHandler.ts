import { useToast } from '@/hooks/use-toast'
import { useTranslation } from 'next-i18next'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { useEffect } from 'react'

export const useErrorHandler = () => {
  const { toast } = useToast()
  const { t } = useTranslation(I18N_NAMESPACES.COMMON)

  useEffect(() => {
    const handleTokenExpired = () => {
      toast({
        variant: 'destructive',
        title: t('error.token_expired.title'),
        description: t('error.token_expired.description'),
      })
    }

    window.addEventListener('error:token-expired', handleTokenExpired)

    return () => {
      window.removeEventListener('error:token-expired', handleTokenExpired)
    }
  }, [t, toast])
}
