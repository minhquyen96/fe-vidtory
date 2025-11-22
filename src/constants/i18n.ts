export const I18N_NAMESPACES = {
  VOCABULARY: 'vocabulary',
  COMMON: 'common',
  HOME: 'home',
  TOPICS: 'topics',
  LESSON: 'lesson',
  PROFILE: 'profile',
  REVIEW: 'review',
  POLICY: 'privacy-policy',
  TOS: 'terms-of-service',
  ABOUT_US: 'about-us',
  CONTACT_US: 'contact-us',
  MY_NOTES: 'my-notes',
  SHADOWING: 'shadowing',
  DICTATION: 'dictation',
  ADVISORS: 'advisors',
  LEADERBOARD: 'leaderboard',
  FEEDBACK: 'feedback',
  SHOP: 'shop',
  LINK: 'link',
  PRICING: 'pricing',
  COMMUNITY: 'community',
  LEARNING_VOCABULARY: 'learning-vocabulary',
  GEMINI_BANANA_PRO: 'gemini-banana-pro',
} as const

export type I18nNamespace =
  (typeof I18N_NAMESPACES)[keyof typeof I18N_NAMESPACES]
