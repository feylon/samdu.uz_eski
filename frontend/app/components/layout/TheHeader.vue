<script setup lang="ts">
import { MapPin, Phone } from '@lucide/vue';
import type { MenuItem } from '~/types/api';

defineProps<{ menu: MenuItem[] }>();

const scrolled = ref(false);

onMounted(() => {
  const onScroll = () => (scrolled.value = window.scrollY > 140);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
});
</script>

<template>
  <header>
    <LayoutTheTopbar />
    <div class="border-b border-surface-subtle bg-white">
      <div class="container flex h-20 items-center justify-between gap-6 lg:h-24">
        <UiAppLogo />
        <div class="hidden items-center gap-8 xl:flex">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-navy-700">
              <MapPin class="h-5 w-5" />
            </span>
            <span class="max-w-[15rem] text-xs leading-snug text-ink-muted">{{ $t('university.address') }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-700">
              <Phone class="h-5 w-5" />
            </span>
            <span class="flex flex-col text-xs text-ink-muted">
              <a href="tel:+998662391140" class="text-sm font-bold text-navy-900 hover:text-navy-600">+998 (66) 239-11-40</a>
              {{ $t('university.workHours') }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="sticky top-0 z-40" :class="{ 'animate-fade-in': scrolled }">
      <LayoutTheNavigation :items="menu" />
    </div>
    <LayoutTheMobileMenu :items="menu" />
    <LayoutSearchOverlay />
  </header>
</template>
