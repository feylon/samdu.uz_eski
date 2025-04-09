<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const available = computed(() => locales.value.map((item) => ({ code: item.code, name: item.name ?? item.code })));
</script>

<template>
  <nav class="flex items-center gap-0.5 rounded-md bg-white/5 p-0.5" :aria-label="$t('topbar.language')">
    <NuxtLink
      v-for="item in available"
      :key="item.code"
      :to="switchLocalePath(item.code)"
      :title="item.name"
      :aria-current="item.code === locale ? 'true' : undefined"
      class="rounded px-2 py-1 text-2xs font-bold uppercase tracking-wider transition"
      :class="item.code === locale ? 'bg-gold-500 text-navy-950' : 'text-white/75 hover:bg-white/10 hover:text-white'"
    >
      {{ item.code }}
    </NuxtLink>
  </nav>
</template>
