import { I18N_NAMESPACES } from '@/constants/i18n'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { Layout } from './Layout'

export function FullPageError() {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  return (
    <div className="w-full h-full">
      <div className="p-12">
        <h1 className="text-4xl font-bold text-destructive mb-4">
          {t('error.title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('error.failToLoadData')}
        </p>
      </div>
    </div>
  )
}
