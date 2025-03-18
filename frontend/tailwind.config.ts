import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

const navy = {
  50: '#eef3fb',
  100: '#d9e3f5',
  200: '#b6c8ea',
  300: '#87a3da',
  400: '#5679c4',
  500: '#3559a8',
  600: '#26458c',
  700: '#1f3872',
  800: '#1b2f5e',
  900: '#14234a',
  950: '#0c1630',
};

const gold = {
  50: '#fdf9ec',
  100: '#faf0c9',
  200: '#f4df8f',
  300: '#eec955',
  400: '#e8b42e',
  500: '#d4991a',
  600: '#b77713',
  700: '#925613',
  800: '#794417',
  900: '#673918',
  950: '#3b1d09',
};

export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      colors: {
        navy,
        gold,
        primary: { ...navy, DEFAULT: navy[900] },
        accent: { ...gold, DEFAULT: gold[500] },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f7fb',
          subtle: '#eaeef6',
        },
        ink: {
          DEFAULT: '#14213d',
          muted: '#5b6478',
          soft: '#8a93a6',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Montserrat', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 35, 74, 0.04), 0 8px 24px -12px rgba(20, 35, 74, 0.18)',
        'card-hover': '0 2px 4px rgba(20, 35, 74, 0.06), 0 18px 40px -16px rgba(20, 35, 74, 0.32)',
        dropdown: '0 12px 32px -8px rgba(12, 22, 48, 0.28)',
        gold: '0 8px 24px -8px rgba(212, 153, 26, 0.55)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0c1630 0%, #14234a 45%, #1f3872 100%)',
        'gold-gradient': 'linear-gradient(135deg, #eec955 0%, #d4991a 100%)',
        'hero-overlay': 'linear-gradient(90deg, rgba(12,22,48,0.92) 0%, rgba(12,22,48,0.65) 45%, rgba(12,22,48,0.15) 100%)',
        'pattern-dots': 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        dots: '18px 18px',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'ken-burns': { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.08)' } },
        progress: { from: { width: '0%' }, to: { width: '100%' } },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'ken-burns': 'ken-burns 7s ease-out both',
        progress: 'progress linear both',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#14213d',
            '--tw-prose-headings': navy[900],
            '--tw-prose-links': navy[600],
            '--tw-prose-bold': navy[900],
            '--tw-prose-quote-borders': gold[500],
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [typography],
};
