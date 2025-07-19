<script setup lang="ts">
import { ChevronRight, House } from '@lucide/vue';

defineProps<{ title: string; crumbs?: { label: string; to?: string }[] }>();
const localePath = useLocalePath();
</script>

<template>
  <section class="relative overflow-hidden bg-navy-gradient py-14 text-white lg:py-20">
    <div class="pointer-events-none absolute inset-0 bg-pattern-dots bg-dots" />
    <div class="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
    <div class="container relative">
      <nav class="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-white/60" aria-label="Breadcrumb">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-1 hover:text-gold-300">
          <House class="h-3.5 w-3.5" /> {{ $t('nav.home') }}
        </NuxtLink>
        <template v-for="crumb in crumbs ?? []" :key="crumb.label">
          <ChevronRight class="h-3.5 w-3.5" />
          <NuxtLink v-if="crumb.to" :to="crumb.to" class="hover:text-gold-300">{{ crumb.label }}</NuxtLink>
          <span v-else class="line-clamp-1 text-white/90">{{ crumb.label }}</span>
        </template>
      </nav>
      <h1 class="max-w-4xl text-3xl font-extrabold !text-white sm:text-4xl lg:text-5xl">{{ title }}</h1>
      <span class="mt-5 block h-1 w-20 rounded-full bg-gold-gradient" />
    </div>
  </section>
</template>
