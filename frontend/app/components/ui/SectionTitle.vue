<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';

defineProps<{ title: string; subtitle?: string; linkTo?: string; linkLabel?: string; light?: boolean }>();
</script>

<template>
  <div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <span class="mb-3 block h-1 w-14 rounded-full bg-gold-gradient" />
      <h2 class="text-2xl font-extrabold uppercase tracking-tight sm:text-3xl" :class="light ? '!text-white' : ''">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-2 text-sm sm:text-base" :class="light ? 'text-white/70' : 'text-ink-muted'">{{ subtitle }}</p>
    </div>
    <NuxtLink
      v-if="linkTo"
      :to="linkTo"
      class="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-wider transition"
      :class="light ? 'text-gold-300 hover:text-gold-200' : 'text-navy-700 hover:text-gold-600'"
    >
      {{ linkLabel }}
      <ArrowRight class="h-4 w-4 transition group-hover:translate-x-1" />
    </NuxtLink>
  </div>
</template>
