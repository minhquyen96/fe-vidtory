import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'
import { useEventTrackingHelpers, EVENT_NAMES } from '@/helpers/eventTracking'
import { useRouter } from 'next/router'
import { Typography } from '@/components/ui/typography'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { trackEvent } = useEventTrackingHelpers()
  const router = useRouter()
  const { t: tCommon } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'

    // Track theme change event
    trackEvent('NAVIGATION', EVENT_NAMES.NAVIGATION.THEME_TOGGLE, {
      from_theme: theme,
      to_theme: newTheme,
      current_page: router.pathname,
    })

    setTheme(newTheme)
  }

  return (
    <div className="flex gap-1 items-center">
      <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
      <Typography
        onClick={handleThemeToggle}
        variant="T14R"
        className="sm+:hidden text-sm font-medium transition-colors text-foreground/80"
      >
        {theme === 'light'
          ? tCommon('header.dark_mode')
          : tCommon('header.light_mode')}
      </Typography>
    </div>
  )
}
