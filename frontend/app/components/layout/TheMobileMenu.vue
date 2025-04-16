<script setup lang="ts">
import { X } from '@lucide/vue';
import type { MenuItem } from '~/types/api';

defineProps<{ items: MenuItem[] }>();
const ui = useUiStore();
const route = useRoute();

watch(() => route.fullPath, () => (ui.mobileMenuOpen = false));
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-200" leave-to-class="opacity-0">
      <div v-if="ui.mobileMenuOpen" class="fixed inset-0 z-[70] bg-navy-950/60 backdrop-blur-sm lg:hidden" @click="ui.mobileMenuOpen = false" />
    </Transition>
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="-translate-x-full" leave-active-class="transition duration-200 ease-in" leave-to-class="-translate-x-full">
      <aside
        v-if="ui.mobileMenuOpen"
        class="fixed inset-y-0 left-0 z-[75] flex w-[86%] max-w-sm flex-col bg-navy-900 shadow-2xl lg:hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('nav.menu')"
      >
        <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <UiAppLogo light compact />
          <span class="flex-1 px-3 font-display text-sm font-bold uppercase text-white">{{ $t('university.short') }}</span>
          <button type="button" class="rounded-full p-2 text-white/70 hover:bg-white/10" :aria-label="$t('nav.close')" @click="ui.mobileMenuOpen = false">
            <X class="h-6 w-6" />
          </button>
        </div>
        <ul class="flex-1 divide-y divide-white/5 overflow-y-auto px-5 py-2">
          <LayoutMobileMenuItem v-for="item in items" :key="item.id" :item="item" />
        </ul>
        <div class="border-t border-white/10 p-5">
          <LayoutLanguageSwitcher />
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
