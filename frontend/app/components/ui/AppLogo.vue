<script setup lang="ts">
withDefaults(defineProps<{ light?: boolean; compact?: boolean }>(), { light: false, compact: false });
const localePath = useLocalePath();
</script>

<template>
  <NuxtLink :to="localePath('/')" class="group flex items-center gap-3" :aria-label="$t('university.fullName')">
    <img src="/logo.svg" alt="" class="h-12 w-12 shrink-0 transition duration-300 group-hover:rotate-6 lg:h-14 lg:w-14" />
    <span v-if="!compact" class="flex flex-col leading-tight">
      <span
        class="font-display text-[0.95rem] font-extrabold uppercase tracking-wide lg:text-lg"
        :class="light ? 'text-white' : 'text-navy-900'"
      >
        {{ $t('university.name') }}
      </span>
      <span class="text-2xs font-medium lg:text-xs" :class="light ? 'text-gold-300' : 'text-gold-700'">
        {{ $t('university.tagline') }}
      </span>
    </span>
  </NuxtLink>
</template>
