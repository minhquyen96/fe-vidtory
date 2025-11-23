import { History, DownloadCloud, Loader2, Trash2, ImagePlus, Download } from 'lucide-react'
import { useTranslation } from 'next-i18next'
import { type HistoryItem } from '@/services/geminiBananaService'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { AppMode } from '@/types/gemini-banana-pro'

interface HistoryGalleryProps {
  history: HistoryItem[]
  loadingHistory: boolean
  resultImage: string | null
  activePage: AppMode
  onImageSelect: (imageUrl: string) => void
  onRemix: (item: HistoryItem, e: React.MouseEvent) => void
  onDelete: (id: string, e: React.MouseEvent) => void
  onDownloadAll: () => void
  onUseAsRef?: (imageUrl: string, mode: AppMode) => void
}

export function HistoryGallery({
  history,
  loadingHistory,
  resultImage,
  activePage,
  onImageSelect,
  onRemix,
  onDelete,
  onDownloadAll,
  onUseAsRef,
}: HistoryGalleryProps) {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO)

  // Filter history based on active page mode (Session Isolation)
  const filteredHistory = history.filter((item) => {
    // Convert API mode to AppMode for comparison
    const itemMode = item.mode === 'comic' ? AppMode.COMIC 
                   : item.mode === 'advertising' ? AppMode.ADVERTISING
                   : AppMode.INFOGRAPHIC
    return itemMode === activePage
  })

  return (
    <div className="h-[100px] sm+:h-[140px] bg-content1 border-t border-divider flex flex-col shrink-0 z-20">
      {/* Header */}
      <div className="h-8 sm+:h-9 px-4 sm+:px-6 flex items-center justify-between border-b border-divider bg-default-50">
        <div className="flex items-center gap-2 text-[10px] sm+:text-xs font-bold text-default-500 uppercase tracking-wider">
          <History size={12} className="sm+:w-[14px] sm+:h-[14px]" />
          {t('labels.history')}
        </div>
        {filteredHistory.length > 0 && (
          <button
            onClick={onDownloadAll}
            className="flex items-center gap-1 text-[10px] sm+:text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Download size={12} className="sm+:w-[14px] sm+:h-[14px]" />
            {t('labels.downloadAll')}
          </button>
        )}
      </div>
      {/* List Area */}
      <div className="flex-1 flex items-center gap-2 sm+:gap-3 p-2 sm+:p-3 overflow-x-auto custom-scrollbar">
        {loadingHistory ? (
          <div className="flex items-center justify-center w-full h-full">
            <Loader2 className="animate-spin text-default-400" size={20} />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="w-full text-center text-[10px] sm+:text-xs text-default-400 italic">
            {t('ui.emptyHistory')}
          </div>
        ) : (
          filteredHistory.map((item) => {
            // Convert API mode to AppMode
            const itemMode = item.mode === 'comic' ? AppMode.COMIC 
                           : item.mode === 'advertising' ? AppMode.ADVERTISING
                           : AppMode.INFOGRAPHIC

            return (
              <div
                key={item.id}
                onClick={() => onImageSelect(item.image_url)}
                className={`relative h-12 sm+:h-20 aspect-square rounded-large overflow-hidden cursor-pointer transition-all flex-shrink-0 group shadow-sm hover:shadow-md ${
                  resultImage === item.image_url
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-content1'
                    : 'ring-1 ring-default-200 hover:ring-default-300'
                }`}
              >
                <img
                  src={item.image_url}
                  className="w-full h-full object-cover"
                  alt="history"
                />

                <div className="hidden sm+:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-1 backdrop-blur-[2px]">
                  {onUseAsRef && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onUseAsRef(item.image_url, itemMode)
                      }}
                      className="p-1.5 bg-content1 text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                      title={t('labels.useAsRef')}
                    >
                      <ImagePlus size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item.id, e)
                    }}
                    className="p-1.5 bg-content1 text-foreground rounded-full hover:bg-danger hover:text-danger-foreground transition-colors shadow-lg"
                    title={t('labels.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

