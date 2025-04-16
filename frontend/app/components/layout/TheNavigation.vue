<script setup lang="ts">
import { ChevronDown, House, Menu as MenuIcon } from '@lucide/vue';
import type { MenuItem } from '~/types/api';

defineProps<{ items: MenuItem[] }>();

const ui = useUiStore();
const localePath = useLocalePath();
const route = useRoute();
const resolve = useMenuLink();

const isActive = (item: MenuItem) => {
  const link = resolve(item);
  return !link.external && typeof link.to === 'string' && link.to !== localePath('/') && route.path.startsWith(link.to.split('?')[0]!.split('#')[0]!);
};
</script>

<template>
  <nav class="bg-navy-900 shadow-lg shadow-navy-950/20" :aria-label="$t('nav.menu')">
    <div class="container flex h-14 items-center justify-between">
      <ul class="hidden h-full items-stretch lg:flex">
        <li class="flex">
          <NuxtLink
            :to="localePath('/')"
            class="flex items-center px-4 text-white/80 transition hover:bg-white/5 hover:text-gold-300"
            :aria-label="$t('nav.home')"
            exact-active-class="!text-gold-400"
          >
            <House class="h-5 w-5" />
          </NuxtLink>
        </li>
        <li v-for="item in items" :key="item.id" class="nav-item relative flex">
          <UiMenuLink
            :item="item"
            class="relative flex items-center gap-1 px-4 text-sm font-semibold uppercase tracking-wide text-white/90 transition hover:bg-white/5 hover:text-gold-300 xl:px-5"
            :class="{ 'text-gold-400 after:absolute after:inset-x-4 after:bottom-0 after:h-[3px] after:rounded-t after:bg-gold-500': isActive(item) }"
          >
            {{ item.title }}
            <ChevronDown v-if="item.children.length" class="h-4 w-4 opacity-70" />
          </UiMenuLink>
          <LayoutNavDropdown v-if="item.children.length" :items="item.children" />
        </li>
      </ul>

      <button
        type="button"
        class="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold uppercase tracking-wide text-white lg:hidden"
        :aria-expanded="ui.mobileMenuOpen"
        @click="ui.mobileMenuOpen = true"
      >
        <MenuIcon class="h-6 w-6" /> {{ $t('nav.menu') }}
      </button>

      <NuxtLink :to="localePath('/announcements?type=admission')" class="btn-gold !py-2 text-xs uppercase tracking-wider">
        {{ $t('quickLinks.admission') }} 2025
      </NuxtLink>
    </div>
  </nav>
</template>
