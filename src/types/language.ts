export type Language = {
  key: string
  name: string
  flag: string
  hrefLang: string
}

export type LocaleKey =
  | 'ar'
  | 'de'
  | 'el'
  | 'en'
  | 'es'
  | 'id'
  | 'ja'
  | 'ko'
  | 'ms'
  | 'pt'
  | 'ru'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'zh-CN'
  | 'zh-TW'

export const languages: Record<LocaleKey, Language> = {
  en: {
    key: 'en',
    name: 'English',
    flag: 'https://assets.parroto.app/images/flags/en.svg',
    hrefLang: 'en',
  },
  ar: {
    key: 'ar',
    name: 'العربية',
    flag: 'https://assets.parroto.app/images/flags/ar.svg',
    hrefLang: 'ar',
  },
  de: {
    key: 'de',
    name: 'Deutsch',
    flag: 'https://assets.parroto.app/images/flags/de.svg',
    hrefLang: 'de',
  },
  el: {
    key: 'el',
    name: 'Ελληνικά',
    flag: 'https://assets.parroto.app/images/flags/el.svg',
    hrefLang: 'el',
  },
  es: {
    key: 'es',
    name: 'Español',
    flag: 'https://assets.parroto.app/images/flags/es.svg',
    hrefLang: 'es',
  },
  id: {
    key: 'id',
    name: 'Bahasa Indonesia',
    flag: 'https://assets.parroto.app/images/flags/id.svg',
    hrefLang: 'id',
  },
  ja: {
    key: 'ja',
    name: '日本語',
    flag: 'https://assets.parroto.app/images/flags/jp.svg',
    hrefLang: 'ja',
  },
  ko: {
    key: 'ko',
    name: '한국어',
    flag: 'https://assets.parroto.app/images/flags/kr.svg',
    hrefLang: 'ko',
  },
  ms: {
    key: 'ms',
    name: 'Bahasa Melayu',
    flag: 'https://assets.parroto.app/images/flags/ms.svg',
    hrefLang: 'ms-MY', // chuẩn ISO cho Malay
  },
  pt: {
    key: 'pt',
    name: 'Português',
    flag: 'https://assets.parroto.app/images/flags/pt.svg',
    hrefLang: 'pt',
  },
  ru: {
    key: 'ru',
    name: 'Русский',
    flag: 'https://assets.parroto.app/images/flags/ru.svg',
    hrefLang: 'ru',
  },
  th: {
    key: 'th',
    name: 'Thai',
    flag: 'https://assets.parroto.app/images/flags/th.svg',
    hrefLang: 'th',
  },
  tr: {
    key: 'tr',
    name: 'Türkçe',
    flag: 'https://assets.parroto.app/images/flags/tr.svg',
    hrefLang: 'tr',
  },
  uk: {
    key: 'uk',
    name: 'Українська',
    flag: 'https://assets.parroto.app/images/flags/uk.svg',
    hrefLang: 'uk',
  },
  vi: {
    key: 'vi',
    name: 'Tiếng Việt',
    flag: 'https://assets.parroto.app/images/flags/vn.svg',
    hrefLang: 'vi',
  },
  'zh-CN': {
    key: 'zh-CN',
    name: '简体中文',
    flag: 'https://assets.parroto.app/images/flags/cn.svg',
    hrefLang: 'zh-CN', // China
  },
  'zh-TW': {
    key: 'zh-TW',
    name: '繁體中文',
    flag: 'https://assets.parroto.app/images/flags/cn.svg',
    hrefLang: 'zh-TW', // Taiwan
  },
}
