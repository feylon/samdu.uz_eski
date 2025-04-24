<script setup lang="ts">
import { GraduationCap, Globe, Microscope, School } from '@lucide/vue';

const localePath = useLocalePath();

const links = [
  { icon: GraduationCap, title: 'quickLinks.admission', text: 'quickLinks.admissionText', to: '/announcements?type=admission' },
  { icon: School, title: 'quickLinks.faculties', text: 'quickLinks.facultiesText', to: '/faculties' },
  { icon: Microscope, title: 'quickLinks.science', text: 'quickLinks.scienceText', to: '/news?category=science' },
  { icon: Globe, title: 'quickLinks.international', text: 'quickLinks.internationalText', to: '/news?category=international' },
];
</script>

<template>
  <section class="relative z-20 -mt-16 sm:-mt-20">
    <div class="container">
      <ul class="grid overflow-hidden rounded-2xl bg-white shadow-card-hover sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(link, index) in links" :key="link.to" class="group relative border-surface-subtle" :class="{ 'lg:border-l': index > 0, 'sm:border-t lg:border-t-0': index > 1 }">
          <NuxtLink :to="localePath(link.to)" class="flex items-center gap-4 p-6 transition hover:bg-navy-900">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-700 transition group-hover:bg-gold-500 group-hover:text-navy-950">
              <component :is="link.icon" class="h-6 w-6" />
            </span>
            <span>
              <span class="block font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition group-hover:text-white">{{ $t(link.title) }}</span>
              <span class="block text-xs text-ink-muted transition group-hover:text-white/70">{{ $t(link.text) }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
