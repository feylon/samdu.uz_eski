<script setup lang="ts">
import { ArrowRight, Clock, ExternalLink, Mail, MapPin, Phone } from '@lucide/vue';
import type { MenuItem } from '~/types/api';

defineProps<{ links: MenuItem[] }>();

const localePath = useLocalePath();
const year = new Date().getFullYear();

const sections = [
  { key: 'nav.about', to: '/about' },
  { key: 'nav.news', to: '/news' },
  { key: 'nav.announcements', to: '/announcements' },
  { key: 'nav.faculties', to: '/faculties' },
  { key: 'search.title', to: '/search' },
];

const socials = [
  { name: 'telegram' as const, href: 'https://t.me/samdu_uz', label: 'Telegram' },
  { name: 'instagram' as const, href: 'https://instagram.com/samdu_uz', label: 'Instagram' },
  { name: 'facebook' as const, href: 'https://facebook.com/samdu.uz', label: 'Facebook' },
  { name: 'youtube' as const, href: 'https://youtube.com/@samdu_uz', label: 'YouTube' },
];
</script>

<template>
  <footer class="relative overflow-hidden bg-navy-950 text-white/70">
    <div class="pointer-events-none absolute inset-0 bg-pattern-dots bg-dots opacity-60" />
    <div class="h-1 bg-gold-gradient" />
    <div class="container relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
      <div class="lg:col-span-4">
        <UiAppLogo light />
        <p class="mt-6 max-w-sm text-sm leading-relaxed">{{ $t('footer.about') }}</p>
        <p class="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-gold-400">{{ $t('footer.followUs') }}</p>
        <div class="flex gap-3">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.label"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 transition hover:bg-gold-500 hover:text-navy-950"
          >
            <UiSocialIcon :name="social.name" class="h-4 w-4" />
          </a>
        </div>
      </div>

      <div class="lg:col-span-2">
        <h3 class="mb-5 font-display text-sm font-bold uppercase tracking-widest text-white">{{ $t('footer.sections') }}</h3>
        <ul class="space-y-3 text-sm">
          <li v-for="item in sections" :key="item.to">
            <NuxtLink :to="localePath(item.to)" class="group inline-flex items-center gap-2 transition hover:text-gold-300">
              <ArrowRight class="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
              {{ $t(item.key) }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="lg:col-span-3">
        <h3 class="mb-5 font-display text-sm font-bold uppercase tracking-widest text-white">{{ $t('footer.usefulLinks') }}</h3>
        <ul class="space-y-3 text-sm">
          <li v-for="item in links" :key="item.id">
            <UiMenuLink :item="item" class="inline-flex items-center gap-2 transition hover:text-gold-300">
              {{ item.title }}
              <ExternalLink v-if="item.isExternal" class="h-3.5 w-3.5 opacity-60" />
            </UiMenuLink>
          </li>
        </ul>
      </div>

      <div class="lg:col-span-3">
        <h3 class="mb-5 font-display text-sm font-bold uppercase tracking-widest text-white">{{ $t('footer.contacts') }}</h3>
        <ul class="space-y-4 text-sm">
          <li class="flex gap-3">
            <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
            {{ $t('university.address') }}
          </li>
          <li class="flex gap-3">
            <Phone class="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
            <a href="tel:+998662391140" class="hover:text-gold-300">+998 (66) 239-11-40</a>
          </li>
          <li class="flex gap-3">
            <Mail class="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
            <a href="mailto:info@samdu.uz" class="hover:text-gold-300">info@samdu.uz</a>
          </li>
          <li class="flex gap-3">
            <Clock class="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
            {{ $t('university.workHours') }}
          </li>
        </ul>
      </div>
    </div>
    <div class="relative border-t border-white/10">
      <div class="container flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
        <p>© 1927–{{ year }} {{ $t('university.fullName') }}. {{ $t('footer.rights') }}</p>
        <p class="text-white/40">samdu.uz</p>
      </div>
    </div>
  </footer>
</template>
