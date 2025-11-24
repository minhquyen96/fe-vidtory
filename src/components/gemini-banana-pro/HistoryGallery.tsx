import {
  History,
  DownloadCloud,
  Loader2,
  Trash2,
  ImagePlus,
  Download,
  X,
  ArrowLeft,
} from 'lucide-react'
import { useTranslation } from 'next-i18next'
import { useRef, useEffect } from 'react'
import { type HistoryItem } from '@/services/geminiBananaService'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { AppMode } from '@/types/gemini-banana-pro'
import LazyImage from '@/components/common/LazyLoadImage'

interface HistoryGalleryProps {
  history: (HistoryItem & { isLoading?: boolean })[]
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
  const loadingItemRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Filter history based on active page mode (Session Isolation)
  const filteredHistory = history.filter((item) => {
    // Convert API mode to AppMode for comparison
    const itemMode =
      item.mode === 'comic'
        ? AppMode.COMIC
        : item.mode === 'advertising'
          ? AppMode.ADVERTISING
          : AppMode.INFOGRAPHIC
    return itemMode === activePage
  })

  // Find loading item
  const loadingItem = filteredHistory.find((item) => item.isLoading)

  // Scroll to loading item when it appears
  useEffect(() => {
    if (loadingItem && loadingItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const item = loadingItemRef.current

      // Scroll to show loading item
      const containerRect = container.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()

      if (
        itemRect.left < containerRect.left ||
        itemRect.right > containerRect.right
      ) {
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [loadingItem])

  return (
    <div className="h-[100px] sm+:h-[140px] bg-content1 border-t border-divider flex flex-col shrink-0 z-20">
      {/* Header */}
      <div className="h-8 sm+:h-9 px-4 sm+:px-6 flex items-center justify-between border-b border-divider bg-default-50">
        <div className="flex items-center gap-2 text-[10px] sm+:text-xs font-bold text-default-500 uppercase tracking-wider">
          <History size={12} className="sm+:w-[14px] sm+:h-[14px]" />
          {t('labels.history')}
        </div>
        <div className="flex items-center gap-2">
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
      </div>
      {/* List Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex items-center gap-2 sm+:gap-3 p-2 sm+:p-3 overflow-x-auto custom-scrollbar"
      >
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
            const itemMode =
              item.mode === 'comic'
                ? AppMode.COMIC
                : item.mode === 'advertising'
                  ? AppMode.ADVERTISING
                  : AppMode.INFOGRAPHIC

            // If item is loading, show loading spinner
            if (item.isLoading) {
              return (
                <div
                  key={item.id}
                  ref={loadingItemRef}
                  className="relative h-12 sm+:h-20 aspect-square rounded-large flex-shrink-0 shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-content1 bg-default-100 flex items-center justify-center cursor-pointer hover:bg-default-200 transition-colors"
                  title={t('labels.generating') || 'Đang tạo...'}
                >
                  <Loader2 className="animate-spin text-primary" size={20} />
                </div>
              )
            }

            return (
              <div
                key={item.id}
                onClick={() => item.image_url && onImageSelect(item.image_url)}
                className={`relative h-12 sm+:h-20 aspect-square rounded-large cursor-pointer transition-all flex-shrink-0 group shadow-sm hover:shadow-md ${
                  resultImage === item.image_url
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-content1'
                    : 'ring-1 ring-default-200 hover:ring-default-300'
                }`}
              >
                <LazyImage
                  src={item.image_url}
                  className="w-full h-full object-cover rounded-lg"
                  alt="history"
                />

                {/* Delete button - Top right corner */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item.id, e)
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 sm+:w-6 sm+:h-6 bg-danger/90 hover:bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  title={t('labels.delete')}
                >
                  <X
                    size={12}
                    className="sm+:w-[14px] sm+:h-[14px]"
                    strokeWidth={2.5}
                  />
                </button>

                {/*/!* Use as ref button - Center on hover (desktop only) *!/*/}
                {/*{onUseAsRef && (*/}
                {/*  <div className="hidden sm+:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center backdrop-blur-[2px]  rounded-lg">*/}
                {/*    <button*/}
                {/*      onClick={(e) => {*/}
                {/*        e.stopPropagation()*/}
                {/*        onUseAsRef(item.image_url, itemMode)*/}
                {/*      }}*/}
                {/*      className="p-1.5 bg-content1 text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"*/}
                {/*      title={t('labels.useAsRef')}*/}
                {/*    >*/}
                {/*      <ImagePlus size={14} />*/}
                {/*    </button>*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
