import { Inter } from 'next/font/google'

export const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap',
  subsets: [
    'cyrillic',
    'cyrillic-ext',
    'greek',
    'greek-ext',
    'latin',
    'latin-ext',
    'vietnamese',
  ],
  variable: '--font-inter',
})
