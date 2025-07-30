<script setup lang="ts">
import { ArrowLeft, Eye, EyeOff, LoaderCircle, Lock, Mail } from '@lucide/vue';

definePageMeta({ layout: 'blank', middleware: 'guest' });

const { t } = useI18n();
const auth = useAuthStore();
const route = useRoute();
const localePath = useLocalePath();

const form = reactive({ email: '', password: '' });
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

async function submit() {
  errorMessage.value = '';
  loading.value = true;
  try {
    await auth.login(form.email.trim(), form.password);
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : localePath('/admin');
    await navigateTo(redirect);
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    errorMessage.value = status === 401 || status === 400 ? t('auth.invalid') : t('auth.error');
  } finally {
    loading.value = false;
  }
}

useSeoMeta({ title: () => t('auth.title'), robots: 'noindex, nofollow' });
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <aside class="relative hidden overflow-hidden bg-navy-gradient p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div class="pointer-events-none absolute inset-0 bg-pattern-dots bg-dots" />
      <div class="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
      <UiAppLogo light class="relative" />
      <div class="relative max-w-md">
        <span class="mb-6 block h-1 w-16 rounded-full bg-gold-gradient" />
        <h2 class="text-4xl font-extrabold leading-tight !text-white">{{ $t('auth.panelTitle') }}</h2>
        <p class="mt-4 text-white/70">{{ $t('auth.panelText') }}</p>
      </div>
      <p class="relative text-xs text-white/50">{{ $t('university.fullName') }}</p>
    </aside>

    <main class="flex items-center justify-center px-4 py-12 sm:px-8">
      <div class="w-full max-w-md">
        <div class="mb-8 lg:hidden"><UiAppLogo /></div>
        <NuxtLink :to="localePath('/')" class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-navy-700">
          <ArrowLeft class="h-4 w-4" /> {{ $t('auth.backToSite') }}
        </NuxtLink>
        <h1 class="text-3xl font-extrabold">{{ $t('auth.title') }}</h1>
        <p class="mt-2 text-ink-muted">{{ $t('auth.subtitle') }}</p>

        <form class="mt-8 space-y-5" novalidate @submit.prevent="submit">
          <div>
            <label for="email" class="mb-1.5 block text-sm font-semibold text-navy-900">{{ $t('auth.email') }}</label>
            <div class="field">
              <Mail class="h-5 w-5 text-ink-soft" />
              <input id="email" v-model="form.email" type="email" autocomplete="username" required placeholder="admin@samdu.uz" class="field-input" />
            </div>
          </div>
          <div>
            <label for="password" class="mb-1.5 block text-sm font-semibold text-navy-900">{{ $t('auth.password') }}</label>
            <div class="field">
              <Lock class="h-5 w-5 text-ink-soft" />
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                minlength="6"
                class="field-input"
              />
              <button type="button" class="rounded p-1 text-ink-soft hover:text-navy-700" :aria-label="$t('auth.showPassword')" @click="showPassword = !showPassword">
                <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <p v-if="errorMessage" role="alert" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage }}</p>

          <button type="submit" class="btn-navy w-full py-3" :disabled="loading || !form.email || form.password.length < 6">
            <LoaderCircle v-if="loading" class="h-4 w-4 animate-spin" />
            {{ loading ? $t('auth.submitting') : $t('auth.submit') }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.field {
  @apply flex items-center gap-3 rounded-xl border border-surface-subtle bg-white px-4 transition focus-within:border-navy-500 focus-within:ring-2 focus-within:ring-navy-100;
}

.field-input {
  @apply w-full bg-transparent py-3 text-ink outline-none placeholder:text-ink-soft focus-visible:ring-0 focus-visible:ring-offset-0;
}
</style>
