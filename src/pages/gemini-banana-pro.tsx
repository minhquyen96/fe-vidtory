import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@/components/layout/Layout'
import { Loader2, Wand2, Edit3, Eye, BookOpen, Megaphone, BarChart3 } from 'lucide-react'
import {
  AppMode,
  ComicInputs,
  AdInputs,
  InfoInputs,
  InputUnion,
  Language,
} from '@/types/gemini-banana-pro'
import {
  generateCreativeContent,
  getGenerationHistory,
  apiModeToAppMode,
  deleteHistory,
  type HistoryItem,
} from '@/services/geminiBananaService'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { useAuth } from '@/context/AuthContext'
import { BuyCreditModal } from '@/components/gemini-banana-pro/BuyCreditModal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SidebarNavigation } from '@/components/gemini-banana-pro/SidebarNavigation'
import { InputDrawer } from '@/components/gemini-banana-pro/InputDrawer'
import { PageHeader } from '@/components/gemini-banana-pro/PageHeader'
import { MainCanvas } from '@/components/gemini-banana-pro/MainCanvas'
import { HistoryGallery } from '@/components/gemini-banana-pro/HistoryGallery'
import JSZip from 'jszip'

export default function GeminiBananaProPage() {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO)
  const router = useRouter()
  const lang = (router.locale || 'vi') as Language
  const {
    isAuthenticated,
    userData,
    user,
    loading: authLoading,
    openLoginModal,
    logout,
    updateUserCredit,
  } = useAuth()
  const [activePage, setActivePage] = useState<AppMode>(AppMode.COMIC)
  const [isLoading, setIsLoading] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [showBuyCreditModal, setShowBuyCreditModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('preview')

  // UI State - Initialize theme from DOM or default to dark
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
    }
    return 'dark'
  })
  const [showGuide, setShowGuide] = useState(true) // Guide tooltip state

  // Get user credit
  const userCredit = userData?.premium?.credit ?? 0

  // Theme Effect - Apply theme immediately
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  // Load history from API on mount (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated || authLoading) return

    const loadHistory = async () => {
      try {
        setLoadingHistory(true)
        const result = await getGenerationHistory({
          page: 1,
          limit: 20,
          sort_by: 'created_at',
          sort_order: 'desc',
        })
        setHistory(result.histories)
      } catch (err) {
        console.error('Failed to load history:', err)
        // Don't show error to user, just log it
      } finally {
        setLoadingHistory(false)
      }
    }
    loadHistory()
  }, [isAuthenticated, authLoading])

  // Form State with Pre-selected Defaults
  const comicStyles = t('styles.comic', { returnObjects: true }) as string[]
  const adStyles = t('styles.advertising', { returnObjects: true }) as string[]
  const infoStyles = t('styles.infographic', {
    returnObjects: true,
  }) as string[]

  const [comicData, setComicData] = useState<ComicInputs>({
    description: '',
    story: '',
    frameCount: 4,
    style: comicStyles[0] || '', // Default to first style
    referenceImages: [],
    selectedManga: '',
    taskAction: 'story', // Default to 'New Story'
    aspectRatio: '1:1',
  })
  const [adData, setAdData] = useState<AdInputs>({
    description: '',
    style: adStyles[0] || '',
    brandName: '',
    headline: '',
    targetAudience: '',
    referenceImages: [],
    aspectRatio: '1:1',
  })
  const [infoData, setInfoData] = useState<InfoInputs>({
    description: '',
    style: infoStyles[0] || '',
    topic: '',
    dataPoints: '',
    referenceImages: [],
    aspectRatio: '1:1',
  })

  const handleGenerate = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      openLoginModal()
      return
    }

    setIsLoading(true)
    setError(null)
    setShowGuide(false) // Dismiss guide on first action

    try {
      let currentData: InputUnion
      switch (activePage) {
        case AppMode.COMIC:
          currentData = comicData
          break
        case AppMode.ADVERTISING:
          currentData = adData
          break
        case AppMode.INFOGRAPHIC:
          currentData = infoData
          break
      }

      const result = await generateCreativeContent(activePage, currentData, lang)
      setResultImage(result.imageUrl)

      // Update user credit with remaining credit from API response
      if (result.remainingCredit !== undefined) {
        updateUserCredit(result.remainingCredit)
      }

      // Reload history to get the new item from backend
      const historyResult = await getGenerationHistory({
        page: 1,
        limit: 20,
        sort_by: 'created_at',
        sort_order: 'desc',
      })
      setHistory(historyResult.histories)
    } catch (e) {
      if (e instanceof Error) {
        // Check if error is about insufficient credit
        if (
          (e as any).isInsufficientCredit ||
          e.message.includes('Insufficient credit') ||
          e.message.includes('insufficient')
        ) {
          setShowBuyCreditModal(true)
        }
        setError(e.message)
      } else {
        setError(t('ui.error'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyCredit = () => {
    setShowBuyCreditModal(true)
  }

  // Apply full history item data to form
  const handleSelectHistoryItem = (item: HistoryItem) => {
    const mode = apiModeToAppMode(item.mode)
    setActivePage(mode)

    // Convert API mode to AppMode and set form data
    // Note: referenceImages from history cannot be restored as File objects,
    // so we set them as empty array
    if (mode === AppMode.COMIC) {
      const comicInputs = item.inputs as ComicInputs
      setComicData({
        ...comicInputs,
        referenceImages: [], // Cannot restore File objects from history
        aspectRatio: item.aspectRatio || comicInputs.aspectRatio || '1:1',
      })
    } else if (mode === AppMode.ADVERTISING) {
      const adInputs = item.inputs as AdInputs
      setAdData({
        ...adInputs,
        referenceImages: [], // Cannot restore File objects from history
        aspectRatio: item.aspectRatio || adInputs.aspectRatio || '1:1',
      })
    } else if (mode === AppMode.INFOGRAPHIC) {
      const infoInputs = item.inputs as InfoInputs
      setInfoData({
        ...infoInputs,
        referenceImages: [], // Cannot restore File objects from history
        aspectRatio: item.aspectRatio || infoInputs.aspectRatio || '1:1',
      })
    }

    setResultImage(item.image_url)
  }

  const handleRemix = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    handleSelectHistoryItem(item)
  }

  // Helper function to add watermark to image
  const addWatermarkToImage = async (
    imageUrl: string
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          // Draw original image
          ctx.drawImage(img, 0, 0)

          // Load watermark logo
          const watermarkImg = new Image()
          watermarkImg.crossOrigin = 'anonymous'
          watermarkImg.src =
            'https://assets.vidtory.ai/images/logo.svg'

          watermarkImg.onload = () => {
            // Calculate watermark size (10% of image width, maintain aspect ratio)
            const watermarkWidth = img.width * 0.1
            const watermarkHeight =
              (watermarkImg.height / watermarkImg.width) * watermarkWidth

            // Position: bottom left with padding
            const padding = 20
            const x = img.width - watermarkWidth - padding
            const y = img.height - watermarkHeight - padding

            // Draw watermark
            ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight)

            // Convert to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob)
                } else {
                  reject(new Error('Failed to create blob'))
                }
              },
              'image/png',
              1.0
            )
          }

          watermarkImg.onerror = () => {
            // If watermark fails to load, return original image
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob)
                } else {
                  reject(new Error('Failed to create blob'))
                }
              },
              'image/png',
              1.0
            )
          }
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = imageUrl
    })
  }

  const handleDownload = async () => {
    if (!resultImage) return

    try {
      // Check premium status
      const isPremiumActive = userData?.premium?.status === 'active'

      let blob: Blob

      if (isPremiumActive) {
        // Premium user: download without watermark
        const response = await fetch(resultImage)
        if (!response.ok) throw new Error('Failed to fetch image')
        blob = await response.blob()
      } else {
        // Non-premium: add watermark
        blob = await addWatermarkToImage(resultImage)
      }

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `creative-studio-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up object URL
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
      setError(error instanceof Error ? error.message : t('ui.error'))
    }
  }

  const handleDownloadAll = async () => {
    if (history.length === 0) return

    try {
      setIsLoading(true)
      setError(null)

      // Check premium status
      const isPremiumActive = userData?.premium?.status === 'active'

      const zip = new JSZip()
      const downloadPromises = history.map(async (item, index) => {
        try {
          let blob: Blob

          if (isPremiumActive) {
            // Premium user: download without watermark
            const response = await fetch(item.image_url)
            if (!response.ok) throw new Error(`Failed to fetch image ${item.id}`)
            blob = await response.blob()
          } else {
            // Non-premium: add watermark
            blob = await addWatermarkToImage(item.image_url)
          }

          // Get file extension from content type or default to png
          const extension = blob.type.split('/')[1] || 'png'
          const filename = `gemini-${item.id || index}.${extension}`
          zip.file(filename, blob)
        } catch (error) {
          console.error(`Failed to fetch image ${item.id}:`, error)
          // Continue with other images even if one fails
        }
      })

      await Promise.all(downloadPromises)

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = window.URL.createObjectURL(zipBlob)

      const link = document.createElement('a')
      link.href = url
      link.download = `vidtory-history-${Date.now()}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up object URL
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to create zip file:', error)
      setError(error instanceof Error ? error.message : t('ui.error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirmId(id)
  }

  const confirmDeleteHistory = async () => {
    if (!deleteConfirmId) return

    try {
      await deleteHistory(deleteConfirmId)
      // Remove from local state
      setHistory((h) => h.filter((x) => x.id !== deleteConfirmId))
      // If deleted item is currently displayed, clear it
      if (
        resultImage &&
        history.find(
          (item) =>
            item.id === deleteConfirmId && item.image_url === resultImage
        )
      ) {
        setResultImage(null)
      }
      setDeleteConfirmId(null)
    } catch (err) {
      console.error('Failed to delete history:', err)
      const errorMessage = err instanceof Error ? err.message : t('ui.error')
      alert(errorMessage)
      setDeleteConfirmId(null)
    }
  }

  const handleUseAsRef = async (imageUrl: string, mode: AppMode) => {
    try {
      // Find the history item to get the actual image URL
      const currentItem = history.find((h) => h.image_url === imageUrl)
      if (!currentItem) {
        // If not found in history, try to use the provided URL directly
        // This handles cases where resultImage might be a blob URL
        const actualUrl = imageUrl.startsWith('blob:') 
          ? imageUrl 
          : imageUrl

        // Fetch image and convert to File
        const response = await fetch(actualUrl)
        if (!response.ok) throw new Error('Failed to fetch image')
        
        const blob = await response.blob()
        const file = new File([blob], `ref-${Date.now()}.png`, { type: blob.type || 'image/png' })

        // Set form data based on current mode
        if (mode === AppMode.COMIC) {
          setComicData((prev) => ({
            ...prev,
            referenceImages: [...prev.referenceImages, file],
          }))
        } else if (mode === AppMode.ADVERTISING) {
          setAdData((prev) => ({
            ...prev,
            referenceImages: [...prev.referenceImages, file],
          }))
        } else if (mode === AppMode.INFOGRAPHIC) {
          setInfoData((prev) => ({
            ...prev,
            referenceImages: [...prev.referenceImages, file],
          }))
        }

        // Switch to editor on mobile
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setMobileTab('editor')
        }
        return
      }

      // If found in history, use the actual image URL from history
      const modeFromItem = apiModeToAppMode(currentItem.mode)
      setActivePage(modeFromItem)

      // Fetch image from the actual URL and convert to File
      const response = await fetch(currentItem.image_url)
      if (!response.ok) throw new Error('Failed to fetch image')
      
      const blob = await response.blob()
      const file = new File([blob], `ref-${Date.now()}.png`, { type: blob.type || 'image/png' })

      // Set form data based on mode
      if (modeFromItem === AppMode.COMIC) {
        setComicData((prev) => ({
          ...prev,
          referenceImages: [...prev.referenceImages, file],
        }))
      } else if (modeFromItem === AppMode.ADVERTISING) {
        setAdData((prev) => ({
          ...prev,
          referenceImages: [...prev.referenceImages, file],
        }))
      } else if (modeFromItem === AppMode.INFOGRAPHIC) {
        setInfoData((prev) => ({
          ...prev,
          referenceImages: [...prev.referenceImages, file],
        }))
      }

      // Switch to editor on mobile
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setMobileTab('editor')
      }
    } catch (error) {
      console.error('Failed to convert image to reference:', error)
      setError(error instanceof Error ? error.message : t('ui.error'))
    }
  }

  const handlePreviewAction = async (
    action: 'remix' | 'ref' | 'delete' | 'continue' | 'variant' | 'recreate'
  ) => {
    if (!resultImage) return

    // Find current item by matching image URL
    // Handle both direct URL match and potential blob URL cases
    const currentItem = history.find((h) => {
      // Direct match
      if (h.image_url === resultImage) return true
      // Handle cases where resultImage might be a blob URL created from history item
      // We'll use the history item's URL for fetching
      return false
    })

    // If not found in history, try to use resultImage directly (might be a blob URL)
    if (!currentItem) {
      // For ref and continue actions, we can still use the resultImage URL directly
      if (action === 'ref' || action === 'continue') {
        await handleUseAsRef(resultImage, activePage)
        if (action === 'continue' && activePage === AppMode.COMIC) {
          setComicData((prev) => ({ ...prev, taskAction: 'continue' }))
        }
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setMobileTab('editor')
        }
      }
      return
    }

    switch (action) {
      case 'remix':
      case 'variant':
      case 'recreate':
        handleRemix(currentItem, {} as React.MouseEvent)
        break
      case 'ref':
        await handleUseAsRef(currentItem.image_url, activePage)
        break
      case 'continue':
        // 1. Use as ref
        await handleUseAsRef(currentItem.image_url, activePage)
        // 2. Switch to continue mode if in comic
        if (currentItem.mode === 'comic' || activePage === AppMode.COMIC) {
          setActivePage(AppMode.COMIC)
          setComicData((prev) => ({ ...prev, taskAction: 'continue' }))
        }
        // Switch to editor
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setMobileTab('editor')
        }
        break
      case 'delete':
        setDeleteConfirmId(currentItem.id)
        break
    }
  }

  // Show loading only while checking auth
  if (authLoading) {
    return (
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <Layout
      title={t('seo.title')}
      description={t('seo.description')}
      showHeader={false}
      showFooter={false}
    >
      <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Header - Full width */}
        <PageHeader
          activePage={activePage}
          userCredit={userCredit}
          resultImage={resultImage}
          onBuyCredit={handleBuyCredit}
          onDownload={handleDownload}
        />

        {/* Main Content Area - Responsive Pb for Action Bar + Nav */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative pb-[104px] sm+:pb-0">
          {/* 1. FAR LEFT RAIL (Navigation) */}
          <SidebarNavigation
            activePage={activePage}
            onPageChange={setActivePage}
            theme={theme}
            onThemeChange={setTheme}
            isAuthenticated={isAuthenticated}
            userData={userData}
            user={user}
            onLogin={openLoginModal}
            onLogout={logout}
          />

          {/* 2. SECONDARY DRAWER (Inputs) */}
          <InputDrawer
            activePage={activePage}
            comicData={comicData}
            adData={adData}
            infoData={infoData}
            onComicDataChange={(k, v) => setComicData((p) => ({ ...p, [k]: v }))}
            onAdDataChange={(k, v) => setAdData((p) => ({ ...p, [k]: v }))}
            onInfoDataChange={(k, v) => setInfoData((p) => ({ ...p, [k]: v }))}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            showGuide={showGuide}
            onDismissGuide={() => setShowGuide(false)}
            userCredit={userCredit}
            mobileTab={mobileTab}
          />

          {/* 3. MAIN CANVAS (Preview & Gallery) */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-100 dark:bg-black relative">
            <MainCanvas
              resultImage={resultImage}
              isLoading={isLoading}
              error={error}
              activePage={activePage}
              mobileTab={mobileTab}
              premiumStatus={userData?.premium?.status}
              onPreviewAction={handlePreviewAction}
              onMobileTabChange={setMobileTab}
              onRemoveWatermark={handleBuyCredit}
            />

            <HistoryGallery
              history={history}
              loadingHistory={loadingHistory}
              resultImage={resultImage}
              activePage={activePage}
              onImageSelect={(imageUrl) => {
                // Find the history item by image URL
                const item = history.find((h) => h.image_url === imageUrl)
                if (item) {
                  handleSelectHistoryItem(item)
                } else {
                  // Fallback: just set the image if item not found
                  setResultImage(imageUrl)
                }
              }}
              onRemix={handleRemix}
              onDelete={handleDeleteHistory}
              onDownloadAll={handleDownloadAll}
              onUseAsRef={handleUseAsRef}
            />
          </div>
        </div>

        {/* Buy Credit Modal */}
        <BuyCreditModal
          isOpen={showBuyCreditModal}
          onClose={() => setShowBuyCreditModal(false)}
        />

        {/* Delete Confirm Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirmId !== null}
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={confirmDeleteHistory}
          title={t('labels.delete')}
          description={t('labels.confirmDelete')}
          confirmText={t('labels.delete')}
          cancelText={t('labels.cancel')}
          variant="destructive"
        />

        {/* 5. MOBILE ACTION BAR (Fixed above nav) */}
        <div className="sm+:hidden fixed bottom-12 left-0 right-0 h-14 bg-content1/95 backdrop-blur-md border-t border-divider flex items-center px-3 gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {/* Generate Button (Larger - Flex 1.5) */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || userCredit <= 0}
            className={`flex-[1.5] h-10 rounded-large font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]
              ${
                isLoading || userCredit <= 0
                  ? 'bg-default-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary shadow-primary-lg/50'
              }
            `}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Wand2 size={18} /> {t('labels.generate')}
              </>
            )}
          </button>

          {/* View Switcher (Flex 1) */}
          <div className="flex-1 h-10 bg-default-100 p-1 rounded-large flex items-center border border-default-200">
            <button
              onClick={() => setMobileTab('editor')}
              className={`flex-1 h-full rounded-medium flex items-center justify-center gap-1 transition-all ${
                mobileTab === 'editor'
                  ? 'bg-background shadow-sm text-primary font-bold'
                  : 'text-default-400 font-medium'
              }`}
            >
              <Edit3 size={14} />
              <span className="text-[10px]">{t('labels.mobileEdit')}</span>
            </button>
            <div className="w-px h-4 bg-default-300 mx-1"></div>
            <button
              onClick={() => setMobileTab('preview')}
              className={`flex-1 h-full rounded-medium flex items-center justify-center gap-1 transition-all ${
                mobileTab === 'preview'
                  ? 'bg-background shadow-sm text-primary font-bold'
                  : 'text-default-400 font-medium'
              }`}
            >
              <Eye size={14} />
              <span className="text-[10px]">{t('labels.mobilePreview')}</span>
            </button>
          </div>
        </div>

        {/* 6. MOBILE BOTTOM NAVIGATION (Compact) */}
        <div className="sm+:hidden fixed bottom-0 left-0 right-0 h-12 bg-content1 border-t border-divider flex items-center justify-between px-2 z-50 pb-safe-area">
          <button
            onClick={() => setActivePage(AppMode.COMIC)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-medium transition-all ${
              activePage === AppMode.COMIC
                ? 'text-primary'
                : 'text-default-500'
            }`}
          >
            <BookOpen size={18} strokeWidth={activePage === AppMode.COMIC ? 2.5 : 2} />
            <span className="text-[9px] font-semibold">{t('sidebar.COMIC')}</span>
          </button>
          <button
            onClick={() => setActivePage(AppMode.ADVERTISING)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-medium transition-all ${
              activePage === AppMode.ADVERTISING
                ? 'text-primary'
                : 'text-default-500'
            }`}
          >
            <Megaphone size={18} strokeWidth={activePage === AppMode.ADVERTISING ? 2.5 : 2} />
            <span className="text-[9px] font-semibold">{t('sidebar.ADVERTISING')}</span>
          </button>
          <button
            onClick={() => setActivePage(AppMode.INFOGRAPHIC)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-medium transition-all ${
              activePage === AppMode.INFOGRAPHIC
                ? 'text-primary'
                : 'text-default-500'
            }`}
          >
            <BarChart3 size={18} strokeWidth={activePage === AppMode.INFOGRAPHIC ? 2.5 : 2} />
            <span className="text-[9px] font-semibold">{t('sidebar.INFOGRAPHIC')}</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        I18N_NAMESPACES.GEMINI_BANANA_PRO,
        I18N_NAMESPACES.COMMON,
        I18N_NAMESPACES.HOME,
      ])),
    },
  }
}
