export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const baseURL = import.meta.server ? config.apiBaseServer : config.public.apiBase;
  const { $i18n } = useNuxtApp();

  const api = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const headers = new Headers(options.headers);
      headers.set('Accept-Language', $i18n.locale.value);
      options.headers = headers;
    },
  });

  return { provide: { api } };
});
