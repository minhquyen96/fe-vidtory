import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Languages } from 'lucide-react'
import { useRouter } from 'next/router'
import useTranslationWithHTMLParser from '@/hooks/useTranslationWithHTMLParser'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { languages, LocaleKey } from '@/types/language'
import { Icons } from '@/components/ui/icons'
import React, { useState } from 'react'
import { useEventTrackingHelpers, EVENT_NAMES } from '@/helpers/eventTracking'

const getSafeLocaleKey = (locale: string | undefined): LocaleKey => {
  const validKeys: LocaleKey[] = [
    'en',
    'ar',
    'de',
    'el',
    'es',
    'id',
    'ja',
    'ko',
    'ms',
    'pt',
    'ru',
    'th',
    'tr',
    'uk',
    'vi',
    'zh-CN',
    'zh-TW',
  ]
  return (validKeys.includes(locale as LocaleKey) ? locale : 'en') as LocaleKey
}

export function LanguageSelector() {
  const { t } = useTranslationWithHTMLParser(I18N_NAMESPACES.COMMON)
  const router = useRouter()
  const { trackEvent } = useEventTrackingHelpers()
  const { locale: currentLocale } = router
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const safeLocaleKey = getSafeLocaleKey(currentLocale)

  const handlePopoverToggle = (open: boolean) => {
    trackEvent('NAVIGATION', EVENT_NAMES.NAVIGATION.MENU_TOGGLE, {
      action: open ? 'open' : 'close',
      menu_type: 'language_selector',
      current_language: safeLocaleKey,
      current_page: router.pathname,
    })
    setIsPopoverOpen(open)
  }

  const handleLanguageChange = (newLocale: string) => {
    trackEvent('NAVIGATION', EVENT_NAMES.NAVIGATION.LANGUAGE_CHANGE, {
      from_language: safeLocaleKey,
      to_language: newLocale,
      current_page: router.pathname,
    })

    router.push(router.asPath, router.asPath, { locale: newLocale })
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={handlePopoverToggle}>
      <Button variant="ghost" asChild>
        <PopoverTrigger>
          <img src={languages[safeLocaleKey].flag} className="h-4" alt="flag" />
          <span>{languages[safeLocaleKey].name}</span>
          <Icons.chevronDown className="h-4 w-4" />
        </PopoverTrigger>
      </Button>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="grid grid-cols-2">
          {Object.values(languages).map((language) => (
            <Button
              key={language.key}
              variant="ghost"
              className={`flex items-center justify-start gap-2 rounded-none ${
                language.key === currentLocale ? 'bg-muted font-medium' : ''
              }`}
              onClick={() => handleLanguageChange(language.key)}
            >
              <img src={language.flag} className="w-6 h-[18px]" alt="flag" />
              <span>{language.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
