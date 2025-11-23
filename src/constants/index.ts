export const MINIMUM_SEGMENT_TIME_MS = 100

export const SYNC_INTERVAL_MS = 2000

export const CLEAN_TEXT_REGEX = /[^a-zA-Z0-9\- \t\n\r]/g

export const routes = {
  home: '/',
  profile: '/profile',
  contactUs: '/contact-us',
  aboutUs: '/about-us',
  policy: '/privacy-policy',
  tos: '/terms-of-service',
  gemini: '/ai-creative-generator',
}

export const ENCOURAGE_LOGIN_COOKIE = 'encourage_login_shown'
export const ENCOURAGE_LOGIN_EXPIRY_DAYS = 4 / 24 // 4 hours

export const AVAILABLE_PLAYBACK_RATES = [
  {
    label: '0.25x',
    value: 0.25,
  },
  {
    label: '0.5x',
    value: 0.5,
  },
  {
    label: '0.75x',
    value: 0.75,
  },
  {
    label: '1x',
    value: 1,
  },
  {
    label: '1.25x',
    value: 1.25,
  },
  {
    label: '1.5x',
    value: 1.5,
  },
  {
    label: '1.75x',
    value: 1.75,
  },
  {
    label: '2x',
    value: 2,
  },
]

export const KEYBOARD_SHORTCUTS = {
  PREVIOUS: 'Ctrl/Cmd + ←',
  NEXT: 'Ctrl/Cmd + →',
  PLAY_PAUSE: 'Tab',
  REPLAY: '`',
  RECORD: 'Shift + `',
  SUBMIT: 'Enter',
  PREVIOUS_SLASH_NEXT: 'Ctrl/Cmd + ←/→',
} as const
