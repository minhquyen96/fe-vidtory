import { BookOpen, Megaphone, BarChart3, Wand2, Sun, Moon, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { AppMode } from '@/types/gemini-banana-pro'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface SidebarNavigationProps {
  activePage: AppMode
  onPageChange: (mode: AppMode) => void
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
  isAuthenticated: boolean
  userData?: any
  user?: any
  onLogin: () => void
  onLogout: () => void
}

const SidebarItem = ({
  mode,
  icon: Icon,
  activePage,
  onPageChange,
  t,
  isMobile,
}: {
  mode: AppMode
  icon: any
  activePage: AppMode
  onPageChange: (mode: AppMode) => void
  t: any
  isMobile?: boolean
}) => (
  <button
    onClick={() => onPageChange(mode)}
    className={`
      flex items-center justify-center rounded-lg transition-all group relative
      ${
        isMobile
          ? 'flex-1 flex-row gap-2 py-2 h-full'
          : 'w-[calc(100%-12px)] flex-col gap-1 py-3 mb-2'
      }
      ${
        activePage === mode
          ? 'bg-default-200 text-foreground'
          : 'text-default-600 hover:text-foreground hover:bg-default-100 hover:bg-opacity-500'
      }
    `}
    title={t(`modes.${mode}`)}
  >
    <div
      className={`p-1 md:p-2 rounded-md transition-colors ${
        activePage === mode && !isMobile ? 'bg-background shadow-sm' : ''
      }`}
    >
      <Icon
        size={isMobile ? 18 : 22}
        strokeWidth={2}
        className={activePage === mode ? 'text-primary' : ''}
      />
    </div>
    <span
      className={`${isMobile ? 'text-[10px]' : 'text-[10px]'} font-semibold tracking-tight`}
    >
      {t(`sidebar.${mode}`)}
    </span>
  </button>
)

const getUserDisplayName = (userData?: any, user?: any) => {
  return (
    userData?.displayName ||
    userData?.name ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'User'
  )
}

const getUserInitial = (userData?: any, user?: any) => {
  const name = getUserDisplayName(userData, user)
  return name.charAt(0).toUpperCase()
}

export function SidebarNavigation({
  activePage,
  onPageChange,
  theme,
  onThemeChange,
  isAuthenticated,
  userData,
  user,
  onLogin,
  onLogout,
}: SidebarNavigationProps) {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO)
  const router = useRouter()

  return (
    <div className="hidden sm+:flex w-[80px] bg-content1 border-r border-divider flex-col items-center py-6 shrink-0 z-30">
      <SidebarItem
        mode={AppMode.COMIC}
        icon={BookOpen}
        activePage={activePage}
        onPageChange={onPageChange}
        t={t}
      />
      <SidebarItem
        mode={AppMode.ADVERTISING}
        icon={Megaphone}
        activePage={activePage}
        onPageChange={onPageChange}
        t={t}
      />
      <SidebarItem
        mode={AppMode.INFOGRAPHIC}
        icon={BarChart3}
        activePage={activePage}
        onPageChange={onPageChange}
        t={t}
      />

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={() => {
            const newLocale = router.locale === 'vi' ? 'en' : 'vi'
            router.push(router.asPath, router.asPath, { locale: newLocale })
          }}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-default-100 text-default-500 hover:text-default-900 dark:hover:text-default-200 hover:bg-default-200 dark:hover:bg-default-700 font-bold text-base transition-all active:scale-95"
          title={
            router.locale === 'vi'
              ? 'Switch to English'
              : 'Chuyển sang Tiếng Việt'
          }
        >
          {router.locale === 'vi' ? 'VI' : 'EN'}
        </button>
        <button
          onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-default-100 text-default-500 dark:text-default-400 hover:text-default-900 dark:hover:text-default-200 hover:bg-default-200 dark:hover:bg-default-700 transition-all active:scale-95"
          title={
            theme === 'light'
              ? 'Switch to Dark Mode'
              : 'Chuyển sang Light Mode'
          }
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Avatar/Login Button - Bottom */}
      <div className="mt-4">
        {isAuthenticated && user ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-default-100 dark:hover:bg-default-800 transition-all relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={userData?.photoURL || user.photoURL || undefined}
                    alt={getUserDisplayName(userData, user)}
                  />
                  <AvatarFallback className="bg-primary text-default-900 dark:text-white">
                    {getUserInitial(userData, user)}
                  </AvatarFallback>
                </Avatar>
                {userData?.premium?.status === 'active' && (
                  <span className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-content1 shadow-sm">
                    PRO
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2">
              <div className="flex flex-col space-y-1">
                {/* Avatar and User Info */}
                <div className="px-3 py-2 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={userData?.photoURL || user.photoURL || undefined}
                      alt={getUserDisplayName(userData, user)}
                    />
                    <AvatarFallback className="bg-primary text-default-900 dark:text-white">
                      {getUserInitial(userData, user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-default-900 dark:text-white truncate">
                      {getUserDisplayName(userData, user)}
                    </p>
                    <p className="text-xs text-default-500 dark:text-default-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="border-t border-default-200 dark:border-default-700" />
                <Button
                  variant="ghost"
                  className="justify-start w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <button
            onClick={onLogin}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-default-400 hover:text-primary hover:bg-default-100 dark:hover:bg-default-800 transition-all"
            title="Login"
          >
            <User size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

