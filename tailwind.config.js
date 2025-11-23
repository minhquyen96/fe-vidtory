/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {
      inter: ['var(--font-inter)'],
      mono: ['var(--font-roboto-mono)'],
      link: 'var(--link-font-family)',
    },
    screens: {
      '3xl': { max: '1680px' },
      '3xl+': { min: '1681px' },
      '2.5xl': { max: '1600px' },
      '2xl': { max: '1440px' },
      '1xl': { max: '1366px' },
      xl: { max: '1279px' },
      lg: { max: '1024px' },
      'lg+': { min: '1025px' },
      md: { max: '768px' },
      'md+': { min: '769px' },
      sm: { max: '850px' },
      'sm+': { min: '851px' },
      xs: { max: '425px' },
      xxs: { max: '360px' },
      mobile: { max: '500px' },
      tablet: { min: '600px', max: '1000px' },

      // Tailwind defaults (renamed for migration).
      tsm: { min: '640px' },
      tmd: { min: '768px' },
      tlg: { min: '1024px' },
      txl: { min: '1280px' },
      t2xl: { min: '1720px' },
    },
    container: {
      center: true,
      screens: {
        sm: '600px',
        md: '728px',
        lg: '1024px',
        xl: '1400px', // hoặc 1280px tùy design
      },
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '1.5rem',
      },
    },
    extend: {
      colors: {
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        // HeroUI semantic colors
        content1: 'rgb(var(--content1) / <alpha-value>)',
        content2: 'rgb(var(--content2) / <alpha-value>)',
        content3: 'rgb(var(--content3) / <alpha-value>)',
        content4: 'rgb(var(--content4) / <alpha-value>)',
        default: {
          100: 'rgb(var(--default-100) / <alpha-value>)',
          200: 'rgb(var(--default-200) / <alpha-value>)',
          300: 'rgb(var(--default-300) / <alpha-value>)',
          // 400: 'rgb(var(--default-400) / <alpha-value>)',
          // 500: 'rgb(var(--default-500) / <alpha-value>)',
          DEFAULT: 'rgb(var(--default-200) / <alpha-value>)',
        },
        divider: 'rgb(var(--divider) / <alpha-value>)',
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          foreground: 'rgb(var(--danger-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        medium: '12px',
        large: '14px',
        small: '8px',
      },
      boxShadow: {
        medium: '0px 4px 12px rgba(0, 0, 0, 0.08)',
        large: '0px 8px 24px rgba(0, 0, 0, 0.12)',
        'primary-lg': '0px 10px 30px -10px var(--primary-shadow)',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'shake-vertical': {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translateY(-4px) rotate(-1deg)',
          },
          '20%, 40%, 60%, 80%': {
            transform: 'translateY(4px) rotate(1deg)',
          },
        },
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'bounce-slow': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'spin-slow': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        ripple: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'reverse-spin': {
          '0%': {
            transform: 'rotate(360deg)',
          },
          '100%': {
            transform: 'rotate(0deg)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'shake-vertical':
          'shake-vertical 0.5s cubic-bezier(.36,.07,.19,.97) both',
        progress: 'progress 1s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-left': 'fade-left 0.5s ease-out forwards',
        blob: 'blob 7s infinite',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        float: 'float 3s ease-in-out infinite',
        ripple: 'ripple 3s linear infinite',
        'reverse-spin': 'reverse-spin 8s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
