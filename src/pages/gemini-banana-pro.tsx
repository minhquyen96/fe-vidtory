import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@/components/layout/Layout'
import {
  BookOpen,
  Megaphone,
  BarChart3,
  Wand2,
  Download,
  Loader2,
  Trash2,
  RefreshCw,
  History,
  Sun,
  Moon,
  PanelLeft,
  Coins,
  ShoppingCart,
  Languages,
  DownloadCloud,
} from 'lucide-react'
import {
  ComicForm,
  AdForm,
  InfoForm,
} from '@/components/gemini-banana-pro/InputGroups'
import {
  AppMode,
  ComicInputs,
  AdInputs,
  InfoInputs,
  InputUnion,
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

export default function GeminiBananaProPage() {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO)
  const router = useRouter()
  const {
    isAuthenticated,
    userData,
    loading: authLoading,
    openLoginModal,
  } = useAuth()
  const [activePage, setActivePage] = useState<AppMode>(AppMode.COMIC)
  const [isLoading, setIsLoading] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [showBuyCreditModal, setShowBuyCreditModal] = useState(false)

  // UI State - Initialize theme from DOM or default to dark
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
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
  })
  const [adData, setAdData] = useState<AdInputs>({
    description: '',
    style: adStyles[0] || '',
    brandName: '',
    headline: '',
    targetAudience: '',
    referenceImages: [],
  })
  const [infoData, setInfoData] = useState<InfoInputs>({
    description: '',
    style: infoStyles[0] || '',
    topic: '',
    dataPoints: '',
    referenceImages: [],
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

      const result = await generateCreativeContent(activePage, currentData)
      setResultImage(result.imageUrl)

      // Reload history to get the new item from backend
      const historyResult = await getGenerationHistory({
        page: 1,
        limit: 20,
        sort_by: 'created_at',
        sort_order: 'desc',
      })
      setHistory(historyResult.histories)

      // Reload user data to get updated credit
      // Note: This should be handled by AuthContext automatically after API call
    } catch (e) {
      if (e instanceof Error) {
        // Check if error is about insufficient credit
        if ((e as any).isInsufficientCredit || e.message.includes('Insufficient credit') || e.message.includes('insufficient')) {
          setShowBuyCreditModal(true);
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

  const handleRemix = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    const mode = apiModeToAppMode(item.mode)
    setActivePage(mode)

    // Convert API mode to AppMode and set form data
    if (mode === AppMode.COMIC) setComicData(item.inputs as ComicInputs)
    else if (mode === AppMode.ADVERTISING) setAdData(item.inputs as AdInputs)
    else if (mode === AppMode.INFOGRAPHIC)
      setInfoData(item.inputs as InfoInputs)

    setResultImage(item.image_url)
  }

  const handleDownload = () => {
    if (resultImage) {
      // Since imageUrl is from GCS, we can download directly
      const link = document.createElement('a')
      link.href = resultImage
      link.download = `creative-studio-${Date.now()}.png`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDownloadAll = async () => {
    if (history.length === 0) return
    
    for (const item of history) {
      try {
        const link = document.createElement('a')
        link.href = item.image_url
        link.download = `gemini-${item.id}.png`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // Small delay to avoid browser blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.error(`Failed to download ${item.id}:`, error)
      }
    }
  }

  const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const confirmMessage = t('labels.confirmDelete') || 'Bạn có chắc muốn xóa item này?'
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      await deleteHistory(id)
      // Remove from local state
      setHistory((h) => h.filter((x) => x.id !== id))
      // If deleted item is currently displayed, clear it
      if (resultImage && history.find(item => item.id === id && item.image_url === resultImage)) {
        setResultImage(null)
      }
    } catch (err) {
      console.error('Failed to delete history:', err)
      const errorMessage = err instanceof Error ? err.message : t('ui.error')
      alert(errorMessage)
    }
  }

  const SidebarItem = ({ mode, icon: Icon }: { mode: AppMode; icon: any }) => (
    <button
      onClick={() => setActivePage(mode)}
      className={`relative w-14 flex flex-col gap-1.5 items-center justify-center py-3 rounded-xl transition-all mb-3 ${
        activePage === mode
          ? 'bg-primary text-white shadow-lg shadow-primary/30'
          : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-200'
      }`}
      title={t(`modes.${mode}`)}
    >
      <Icon size={20} strokeWidth={2.5} />
      <span className="text-[10px] font-bold">{t(`sidebar.${mode}`)}</span>
      {activePage === mode && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full"></div>
      )}
    </button>
  )

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
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* 1. FAR LEFT RAIL (Navigation) */}
      <div className="w-[72px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 shrink-0 z-20">
        {/* Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-8">
          <Wand2 className="text-white" size={20} />
        </div>

        <SidebarItem mode={AppMode.COMIC} icon={BookOpen} />
        <SidebarItem mode={AppMode.ADVERTISING} icon={Megaphone} />
        <SidebarItem mode={AppMode.INFOGRAPHIC} icon={BarChart3} />

        <div className="mt-auto flex flex-col gap-4">
          <button
            onClick={() => {
              const newLocale = router.locale === 'vi' ? 'en' : 'vi'
              router.push(router.asPath, router.asPath, { locale: newLocale })
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs"
            title={router.locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            {router.locale === 'vi' ? 'VI' : 'EN'}
          </button>
          <button
            onClick={() =>
              setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
            }
            className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Chuyển sang Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>

      {/* 2. SECONDARY DRAWER (Inputs) */}
      <div className="w-[360px] bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 relative z-10 shadow-xl shadow-black/5">
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="font-bold text-slate-800 dark:text-white text-lg truncate">
            {t(`modes.${activePage}`)}
          </span>
          <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-500">
            {t('ui.version')}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          {activePage === AppMode.COMIC && (
            <ComicForm
              data={comicData}
              onChange={(k, v) => setComicData((p) => ({ ...p, [k]: v }))}
              mode={activePage}
              showGuide={showGuide}
              onDismissGuide={() => setShowGuide(false)}
            />
          )}
          {activePage === AppMode.ADVERTISING && (
            <AdForm
              data={adData}
              onChange={(k, v) => setAdData((p) => ({ ...p, [k]: v }))}
              mode={activePage}
            />
          )}
          {activePage === AppMode.INFOGRAPHIC && (
            <InfoForm
              data={infoData}
              onChange={(k, v) => setInfoData((p) => ({ ...p, [k]: v }))}
              mode={activePage}
            />
          )}
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 text-sm
                ${
                  isLoading
                    ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed'
                    : 'bg-primary hover:bg-secondary hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99]'
                }
              `}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />{' '}
                {t('labels.generating')}
              </>
            ) : (
              <>
                <Wand2 size={18} /> {t('labels.generate')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. MAIN CANVAS (Preview & Gallery) */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100 dark:bg-black relative">
        {/* Toolbar / Breadcrumbs */}
        <div className="h-16 px-6 flex items-center justify-between shrink-0 z-10">
           <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
             <PanelLeft size={16} />
             <span>{t('ui.project')}</span>
             <span>/</span>
             <span className="text-slate-900 dark:text-slate-200 font-medium">
               {t(`modes.${activePage}`)}
             </span>
           </div>
          <div className="flex items-center gap-3">
            {/* Credit Display */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <Coins size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                {userCredit}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t('ui.credits')}
              </span>
            </div>

            {/* Buy Credit Button */}
            <button
              onClick={handleBuyCredit}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-bold text-xs uppercase tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5"
            >
              <ShoppingCart size={14} />
              {t('labels.buyCredit')}
            </button>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={handleDownload}
              disabled={!resultImage}
              className={`p-2 px-4 rounded-lg border transition-all flex items-center gap-2 text-sm shadow-lg
                           ${
                             resultImage
                               ? 'bg-primary text-white border-primary hover:bg-secondary hover:border-secondary hover:shadow-primary/25'
                               : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-transparent cursor-not-allowed'
                           }
                        `}
            >
              <Download size={18} />
              <span className="font-bold">{t('labels.download')}</span>
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-8">
          {/* Dot Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          ></div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!resultImage && !isLoading && !error && (
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2
                  className="text-slate-400 dark:text-slate-600"
                  size={32}
                />
              </div>
              <p className="text-slate-400 dark:text-slate-500 max-w-xs mx-auto text-sm">
                {t('ui.emptyState')}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
                {t('labels.generating')}
              </p>
            </div>
          )}

          {resultImage && !isLoading && (
            <div className="relative max-w-full max-h-full shadow-2xl rounded-sm overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
              <img
                src={resultImage}
                alt="Result"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Bottom Gallery (Timeline style) */}
        <div className="h-36 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-20">
          <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <History size={12} /> {t('labels.history')}
            </div>
            {history.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-primary rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title={t('labels.downloadAll')}
              >
                <DownloadCloud size={12} />
                {t('labels.downloadAll')}
              </button>
            )}
          </div>
          <div className="flex-1 flex items-center gap-3 p-3 overflow-x-auto custom-scrollbar">
            {loadingHistory ? (
              <div className="flex items-center justify-center w-full h-full">
                <Loader2 className="animate-spin text-slate-400" size={20} />
              </div>
            ) : history.length === 0 ? (
              <div className="flex items-center justify-center w-full h-full text-slate-400 text-xs">
                {t('ui.emptyHistory')}
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setResultImage(item.image_url)}
                  className={`relative h-full aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 group ${
                    resultImage === item.image_url
                      ? 'border-primary'
                      : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <img
                    src={item.image_url}
                    className="w-full h-full object-cover"
                    alt="history"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 backdrop-blur-[1px]">
                    <button
                      onClick={(e) => handleRemix(item, e)}
                      className="p-1.5 bg-primary text-white rounded-full hover:scale-110 transition-transform"
                      title={t('labels.remix')}
                    >
                      <RefreshCw size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteHistory(item.id, e)}
                      className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                      title={t('labels.delete')}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
         </div>
       </div>

       {/* Buy Credit Modal */}
       <BuyCreditModal
         isOpen={showBuyCreditModal}
         onClose={() => setShowBuyCreditModal(false)}
       />
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
