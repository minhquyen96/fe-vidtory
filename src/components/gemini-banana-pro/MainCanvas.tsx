import {
  Wand2,
  ImagePlus,
  StepForward,
  CopyPlus,
  Repeat,
  Trash2,
  X,
} from 'lucide-react'
import { useTranslation } from 'next-i18next'
import { AppMode } from '@/types/gemini-banana-pro'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface MainCanvasProps {
  resultImage: string | null
  isLoading: boolean
  error: { message: string; status?: number } | null
  activePage: AppMode
  mobileTab?: 'editor' | 'preview'
  premiumStatus?: 'active' | 'inactive' | 'expired' | undefined
  onPreviewAction?: (
    action: 'remix' | 'ref' | 'delete' | 'continue' | 'variant' | 'recreate'
  ) => void
  onMobileTabChange?: (tab: 'editor' | 'preview') => void
  onRemoveWatermark?: () => void
}

export function MainCanvas({
  resultImage,
  isLoading,
  error,
  activePage,
  mobileTab = 'preview',
  premiumStatus,
  onPreviewAction,
  onMobileTabChange,
  onRemoveWatermark,
}: MainCanvasProps) {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO)
  const showWatermark = premiumStatus !== 'active'
  const handlePreviewAction = (
    action: 'remix' | 'ref' | 'delete' | 'continue' | 'variant' | 'recreate'
  ) => {
    if (onPreviewAction) {
      onPreviewAction(action)
    }
  }

  return (
    <div
      className={`flex-1 flex-col min-w-0 bg-content2 relative ${
        mobileTab === 'editor' ? 'hidden sm+:flex' : 'flex'
      } sm+:mb-0`}
    >
      {/* Canvas Center */}
      <div className="flex-1 relative overflow-visible flex flex-col items-center justify-center p-4 sm+:p-10 pt-16 sm+:pt-20">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-6 py-4 rounded-lg backdrop-blur-md max-w-md text-center z-20">
            <p className="font-medium text-base">
              {t('labels.somethingWentWrong')}
            </p>
            {error?.status && (
              <p className="text-xs mt-2 text-danger/70 font-mono">
                {t('labels.errorStatus')}: {error?.status}
              </p>
            )}
          </div>
        )}

        {!resultImage && !isLoading && !error && (
          <div className="text-center z-10 px-4">
            <div className="w-20 h-20 sm+:w-24 sm+:h-24 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-6 sm+:mb-8 shadow-sm">
              <Wand2 className="text-default-400" size={32} />
            </div>
            <h3 className="text-foreground font-semibold text-xl sm+:text-2xl mb-2 sm+:mb-3">
              {t('labels.readyTitle')}
            </h3>
            <p className="text-default-500 max-w-xs mx-auto text-sm sm+:text-base">
              {t('labels.readyDesc')}
            </p>
            {onMobileTabChange && (
              <button
                onClick={() => onMobileTabChange('editor')}
                className="mt-6 px-6 py-2 bg-default-200 rounded-full text-sm font-medium sm+:hidden"
              >
                {t('labels.openEditor')}
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center gap-6 z-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-default-200"></div>
              <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-base font-semibold text-default-500 animate-pulse">
              {t('labels.generating')}
            </p>
          </div>
        )}

        {resultImage && !isLoading && (
          <div className="relative max-w-full max-h-[calc(100vh-250px)] sm+:max-h-[calc(100vh-300px)] flex flex-col shadow-2xl shadow-black/20 rounded-lg ring-1 ring-default-200 bg-content1 animate-in fade-in zoom-in-95 group/image">
            {/* ACTION OVERLAY - COMPACT SIZE & HOVER COLOR FIX */}
            <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-content1/90 backdrop-blur-md border border-default-200 text-foreground px-3 sm+:px-4 py-1.5 h-9 rounded-full flex items-center gap-2 sm+:gap-4 shadow-medium opacity-100 z-40 whitespace-nowrap">
              {/* Common Action: Reference */}
              <button
                onClick={() => handlePreviewAction('ref')}
                className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors"
                title={t('labels.useAsRef')}
              >
                <ImagePlus size={18} />
                <span className="hidden sm+:inline">
                  {t('labels.useAsRef')}
                </span>
              </button>

              <div className="w-px h-4 sm+:h-5 bg-default-300"></div>

              {/* Comic Specific Actions */}
              {activePage === AppMode.COMIC ? (
                <button
                  onClick={() => handlePreviewAction('continue')}
                  className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors"
                  title={t('labels.genNext')}
                >
                  <StepForward size={18} />
                  <span className="hidden sm+:inline">
                    {t('labels.genNext')}
                  </span>
                </button>
              ) : (
                /* Ads/Info Specific Actions */
                <>
                  <button
                    onClick={() => handlePreviewAction('variant')}
                    className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors"
                    title={t('labels.makeVariant')}
                  >
                    <CopyPlus size={18} />
                    <span className="hidden sm+:inline">
                      {t('labels.makeVariant')}
                    </span>
                  </button>

                  <div className="w-px h-4 sm+:h-5 bg-default-300"></div>

                  <button
                    onClick={() => handlePreviewAction('recreate')}
                    className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors"
                    title={t('labels.recreate')}
                  >
                    <Repeat size={18} />
                    <span className="hidden sm+:inline">
                      {t('labels.recreate')}
                    </span>
                  </button>
                </>
              )}

              <div className="w-px h-4 sm+:h-5 bg-default-300"></div>

              <button
                onClick={() => handlePreviewAction('delete')}
                className="flex items-center gap-2 text-sm font-bold hover:text-danger hover:bg-transparent transition-colors text-default-400 p-2 rounded-full"
                title={t('labels.delete')}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <img
              src={resultImage}
              alt="Result"
              className="w-auto h-auto max-w-full max-h-[calc(100vh-350px)] sm+:max-h-[calc(100vh-340px)] object-contain rounded-lg bg-white"
            />

            {/* Watermark Overlay - Only show if not premium */}
            {showWatermark && (
              <div className="absolute bottom-2 right-2 z-30 group/watermark">
                <div className="relative">
                  <img
                    src="https://assets.vidtory.ai/images/logo_wtm_2.png"
                    alt="Vidtory Logo"
                    className="sm+:h-4 h-3 w-auto"
                  />
                  {onRemoveWatermark && (
                    <button
                      onClick={onRemoveWatermark}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover/watermark:opacity-100 transition-opacity hover:bg-danger/90"
                      title={
                        t('labels.removeWatermark') ||
                        'Nâng cấp để bỏ watermark'
                      }
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
