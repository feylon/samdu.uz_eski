import { AUTH_COOKIE } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const baseURL = import.meta.server ? config.apiBaseServer : config.public.apiBase;
  const { $i18n } = useNuxtApp();
  const token = useCookie<string | null>(AUTH_COOKIE);

  const api = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const headers = new Headers(options.headers);
      headers.set('Accept-Language', $i18n.locale.value);
      if (token.value) headers.set('Authorization', `Bearer ${token.value}`);
      options.headers = headers;
    },
    onResponseError({ response }) {
      if (response.status === 401 && token.value) token.value = null;
    },
  });

  return { provide: { api } };
});
