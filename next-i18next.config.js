const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
      'vi',
    ],
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
  // debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
  debug: false,
}
