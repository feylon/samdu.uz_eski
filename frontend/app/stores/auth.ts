import { defineStore } from 'pinia';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor' | 'user';
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUser;
}

export const AUTH_COOKIE = 'samdu_token';

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>(AUTH_COOKIE, { maxAge: 60 * 60 * 24, sameSite: 'lax', default: () => null });
  const user = ref<AuthUser | null>(null);

  const isLoggedIn = computed(() => Boolean(token.value));

  async function login(email: string, password: string) {
    const { $api } = useNuxtApp();
    const response = await $api<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } });
    token.value = response.accessToken;
    user.value = response.user;
    return response.user;
  }

  async function fetchMe() {
    if (!token.value) return null;
    const { $api } = useNuxtApp();
    user.value = await $api<AuthUser>('/auth/me').catch(() => {
      logout();
      return null;
    });
    return user.value;
  }

  function logout() {
    token.value = null;
    user.value = null;
  }

  return { token, user, isLoggedIn, login, fetchMe, logout };
});
