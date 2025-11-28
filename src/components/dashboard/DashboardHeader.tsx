import React, { useState, useEffect } from 'react'
import {
  Search,
  Upload,
  Plus,
  Sparkles,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { BuyCreditModal } from '@/components/gemini-banana-pro/BuyCreditModal'

export function DashboardHeader() {
  const router = useRouter()
  const auth = useAuth()
  const { user, userData, openLoginModal, isAuthenticated } = auth
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [lang, setLang] = useState<'en' | 'vi'>('en')
  const [showBuyCreditModal, setShowBuyCreditModal] = useState(false)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
    // Load language from localStorage
    const savedLang = localStorage.getItem('lang') as 'en' | 'vi' | null
    if (savedLang) {
      setLang(savedLang)
    }
  }, [])

  const handleNewWorkflow = () => {
    router.push('/editor')
  }

  const handleImport = () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const jsonString = event.target?.result as string
            const workflowData = JSON.parse(jsonString)
            localStorage.setItem(
              'pending_import_workflow',
              JSON.stringify(workflowData)
            )
            router.push('/editor?import=true')
          } catch (error) {
            console.error('Error loading workflow:', error)
            alert('Failed to load workflow. Please check the file format.')
          }
        }
        reader.readAsText(file)
      }
      input.click()
    } catch (error) {
      console.error('Error opening file dialog:', error)
      alert('Failed to open file dialog. Please try again.')
    }
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLangToggle = () => {
    const newLang = lang === 'en' ? 'vi' : 'en'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const getUserDisplayName = () => {
    return (
      userData?.displayName ||
      userData?.name ||
      user?.displayName ||
      user?.email?.split('@')[0] ||
      'User'
    )
  }

  const getUserInitial = () => {
    const name = getUserDisplayName()
    return name.charAt(0).toUpperCase()
  }

  // Get credit from userData - same logic as PageHeader
  const credits = userData?.premium?.credit || 0

  // Handle buy credit - same logic as PageHeader
  const handleBuyCredit = () => {
    if (!isAuthenticated) {
      openLoginModal()
      return
    }
    setShowBuyCreditModal(true)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      const logoutFn = auth.logout as () => Promise<void>
      await logoutFn()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="h-16 px-6 md:px-10 flex items-center justify-between shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      {/* Right Side Actions */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        {/* Credits Display - UI from HomePage.tsx */}
        <div
          className="hidden md:flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer group"
          onClick={handleBuyCredit}
        >
          <Sparkles size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {credits} credits
          </span>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-xs font-bold text-[rgb(171,223,0)] hover:underline">
            Get more
          </span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
          <Bell
            size={20}
            className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors"
          />
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>

          <button
            onClick={handleThemeToggle}
            className="p-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            onClick={handleLangToggle}
            className="flex items-center gap-1.5 hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-bold text-xs uppercase"
            title="Switch Language"
          >
            <span className="text-lg leading-none">
              {lang === 'vi' ? '🇻🇳' : '🇺🇸'}
            </span>
            {lang.toUpperCase()}
          </button>
        </div>

        {/* User Avatar/Login Button */}
        {isAuthenticated && user ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all relative">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={userData?.photoURL || user.photoURL || undefined}
                    alt={getUserDisplayName()}
                  />
                  <AvatarFallback
                    className="bg-[rgb(171,223,0)] text-white dark:text-gray-900"
                    style={{
                      background:
                        'linear-gradient(to right, rgb(171, 223, 0), rgb(0, 226, 233))',
                    }}
                  >
                    {getUserInitial()}
                  </AvatarFallback>
                </Avatar>
                {userData?.premium?.status === 'active' && (
                  <span className="absolute -top-3 -right-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900 shadow-sm">
                    PRO
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2">
              <div className="flex flex-col space-y-1">
                {/* Avatar and User Info */}
                <div className="px-3 py-2 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={userData?.photoURL || user.photoURL || undefined}
                      alt={getUserDisplayName()}
                    />
                    <AvatarFallback
                      className="bg-[rgb(171,223,0)] text-white dark:text-gray-900"
                      style={{
                        background:
                          'linear-gradient(to right, rgb(171, 223, 0), rgb(0, 226, 233))',
                      }}
                    >
                      {getUserInitial()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700" />
                <Button
                  variant="ghost"
                  className="justify-start w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <button
            onClick={openLoginModal}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-[rgb(171,223,0)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="Login"
          >
            <User size={18} />
          </button>
        )}
      </div>

      {/* Buy Credit Modal */}
      <BuyCreditModal
        isOpen={showBuyCreditModal}
        onClose={() => setShowBuyCreditModal(false)}
      />
    </header>
  )
}
