<script setup lang="ts">
import { ChevronDown } from '@lucide/vue';
import type { MenuItem } from '~/types/api';

defineProps<{ item: MenuItem; depth?: number }>();
const open = ref(false);
const ui = useUiStore();
</script>

<template>
  <li>
    <div class="flex items-center">
      <UiMenuLink
        :item="item"
        class="flex-1 py-3 text-left text-[0.95rem] font-medium text-white/90 hover:text-gold-300"
        :style="{ paddingLeft: `${(depth ?? 0) * 16}px` }"
        @click="item.url ? (ui.mobileMenuOpen = false) : (open = !open)"
      />
      <button
        v-if="item.children.length"
        type="button"
        class="rounded-lg p-2 text-white/60 hover:bg-white/10"
        :aria-expanded="open"
        :aria-label="item.title"
        @click="open = !open"
      >
        <ChevronDown class="h-5 w-5 transition" :class="{ 'rotate-180': open }" />
      </button>
    </div>
    <ul v-if="item.children.length" v-show="open" class="border-l border-white/10">
      <LayoutMobileMenuItem v-for="child in item.children" :key="child.id" :item="child" :depth="(depth ?? 0) + 1" />
    </ul>
  </li>
</template>
