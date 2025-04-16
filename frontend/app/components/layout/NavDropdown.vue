<script setup lang="ts">
import { ChevronRight } from '@lucide/vue';
import type { MenuItem } from '~/types/api';

defineProps<{ items: MenuItem[]; nested?: boolean }>();
</script>

<template>
  <ul class="nav-dropdown" :class="nested ? 'nav-dropdown--nested' : 'nav-dropdown--root'">
    <li v-for="item in items" :key="item.id" class="nav-item relative">
      <UiMenuLink
        :item="item"
        class="flex w-full items-center justify-between gap-4 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-ink transition hover:bg-navy-50 hover:text-navy-700"
      >
        <span>{{ item.title }}</span>
        <ChevronRight v-if="item.children.length" class="h-4 w-4 text-ink-soft" />
      </UiMenuLink>
      <LayoutNavDropdown v-if="item.children.length" :items="item.children" nested />
    </li>
  </ul>
</template>

<style scoped>
.nav-dropdown {
  @apply invisible absolute z-50 min-w-64 translate-y-2 rounded-xl border-t-[3px] border-gold-500 bg-white p-2 opacity-0 shadow-dropdown transition duration-200;
}

.nav-dropdown--root {
  @apply left-0 top-full;
}

.nav-dropdown--nested {
  @apply left-full top-0 -mt-2;
}

:global(.nav-item:hover > .nav-dropdown),
:global(.nav-item:focus-within > .nav-dropdown) {
  @apply visible translate-y-0 opacity-100;
}
</style>
