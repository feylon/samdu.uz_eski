export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config',
    viewer: false,
  },

  runtimeConfig: {
    apiBaseServer: 'http://localhost:4000/api',
    public: {
      apiBase: 'http://localhost:4000/api',
      mediaBase: 'http://localhost:4000',
      siteUrl: 'http://localhost:3000',
    },
  },

  app: {
    head: {
      titleTemplate: '%s · SamDU',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#14234a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  i18n: {
    baseUrl: 'http://localhost:3000',
    strategy: 'prefix_except_default',
    defaultLocale: 'uz',
    langDir: 'locales',
    locales: [
      { code: 'uz', language: 'uz-UZ', name: "O'zbekcha", file: 'uz.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'samdu_lang',
      redirectOn: 'root',
    },
  },

  typescript: {
    strict: true,
  },
});
