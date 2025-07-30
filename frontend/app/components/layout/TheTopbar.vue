<script setup lang="ts">
import { Accessibility, CircleUser, Clock, LogIn, Mail, Phone, Search } from '@lucide/vue';

const a11y = useAccessibilityStore();
const ui = useUiStore();
const auth = useAuthStore();
const localePath = useLocalePath();
</script>

<template>
  <div class="relative bg-navy-950 text-white/80">
    <div class="container flex h-10 items-center justify-between gap-4 text-xs">
      <div class="hidden items-center gap-5 md:flex">
        <a href="tel:+998662391140" class="flex items-center gap-1.5 transition hover:text-gold-300">
          <Phone class="h-3.5 w-3.5 text-gold-400" /> +998 (66) 239-11-40
        </a>
        <a href="mailto:info@samdu.uz" class="flex items-center gap-1.5 transition hover:text-gold-300">
          <Mail class="h-3.5 w-3.5 text-gold-400" /> info@samdu.uz
        </a>
        <span class="hidden items-center gap-1.5 lg:flex">
          <Clock class="h-3.5 w-3.5 text-gold-400" /> {{ $t('university.workHours') }}
        </span>
      </div>

      <div class="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-white"
          :class="{ 'text-gold-300': a11y.isActive }"
          :aria-expanded="a11y.panelOpen"
          @click="a11y.panelOpen = !a11y.panelOpen"
        >
          <Accessibility class="h-4 w-4" />
          <span class="hidden sm:inline">{{ $t('topbar.accessibility') }}</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-white"
          @click="ui.searchOpen = true"
        >
          <Search class="h-4 w-4" />
          <span class="hidden sm:inline">{{ $t('topbar.search') }}</span>
        </button>
        <NuxtLink
          :to="localePath(auth.isLoggedIn ? '/admin' : '/login')"
          class="flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-white"
        >
          <component :is="auth.isLoggedIn ? CircleUser : LogIn" class="h-4 w-4" />
          <span class="hidden sm:inline">{{ auth.isLoggedIn ? $t('admin.title') : $t('auth.login') }}</span>
        </NuxtLink>
        <span class="mx-1 hidden h-4 w-px bg-white/15 sm:block" />
        <LayoutLanguageSwitcher />
      </div>
    </div>
    <LayoutAccessibilityPanel />
  </div>
</template>
