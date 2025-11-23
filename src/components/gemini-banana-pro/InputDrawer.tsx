import { Wand2, Loader2 } from 'lucide-react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import {
  AppMode,
  ComicInputs,
  AdInputs,
  InfoInputs,
  Language,
} from '@/types/gemini-banana-pro'
import {
  ComicForm,
  AdForm,
  InfoForm,
} from '@/components/gemini-banana-pro/InputGroups'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface InputDrawerProps {
  activePage: AppMode
  comicData: ComicInputs
  adData: AdInputs
  infoData: InfoInputs
  onComicDataChange: (key: keyof ComicInputs, value: any) => void
  onAdDataChange: (key: keyof AdInputs, value: any) => void
  onInfoDataChange: (key: keyof InfoInputs, value: any) => void
  onGenerate: () => void
  isLoading: boolean
  showGuide: boolean
  onDismissGuide: () => void
  userCredit: number
  mobileTab?: 'editor' | 'preview'
}

export function InputDrawer({
  activePage,
  comicData,
  adData,
  infoData,
  onComicDataChange,
  onAdDataChange,
  onInfoDataChange,
  onGenerate,
  isLoading,
  showGuide,
  onDismissGuide,
  userCredit,
  mobileTab = 'preview',
}: InputDrawerProps) {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO)
  const router = useRouter()
  const lang = (router.locale || 'vi') as Language

  return (
    <div
      className={`w-full sm+:w-[440px] bg-content1 border-r border-divider flex-col shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${
        mobileTab === 'editor' ? 'flex' : 'hidden sm+:flex'
      }`}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
        {/* Scrollable Header */}
        <div className="px-4 py-4 flex items-center justify-between shrink-0">
          <span className="font-bold text-xl tracking-tight flex items-center gap-2">
            {t(`modes.${activePage}`)}
          </span>
          <div className="flex items-center gap-1.5 opacity-90">
            {/* Muted "powered by" */}
            <span className="hidden sm+:inline text-[10px] text-default-400 font-medium lowercase">
              {t('labels.poweredBy') || 'powered by'}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-primary via-orange-500 to-secondary bg-[length:200%_auto] bg-clip-text text-transparent select-none">
              BANANA PRO
            </span>
            <span className="text-sm">🍌</span>
          </div>
        </div>

        <div className="px-4 pt-2">
          {activePage === AppMode.COMIC && (
            <ComicForm
              data={comicData}
              onChange={onComicDataChange}
              mode={activePage}
              lang={lang}
              showGuide={showGuide}
              onDismissGuide={onDismissGuide}
            />
          )}
          {activePage === AppMode.ADVERTISING && (
            <AdForm
              data={adData}
              onChange={onAdDataChange}
              mode={activePage}
              lang={lang}
            />
          )}
          {activePage === AppMode.INFOGRAPHIC && (
            <InfoForm
              data={infoData}
              onChange={onInfoDataChange}
              mode={activePage}
              lang={lang}
            />
          )}
        </div>
      </div>

      {/* DESKTOP FOOTER - Hidden on Mobile */}
      <div className="hidden sm+:flex h-[88px] items-center px-6 py-4 border-t border-divider bg-content1 shrink-0 z-10">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-4 rounded-large font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98]
            ${
              isLoading
                ? 'bg-default-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25 hover:shadow-primary/20'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={22} />{' '}
              {t('labels.generating')}
            </>
          ) : (
            <>
              <Wand2 size={22} /> {t('labels.generate')} (4 Credit)
            </>
          )}
        </button>
      </div>
    </div>
  )
}
