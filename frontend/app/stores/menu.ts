import { defineStore } from 'pinia';
import type { MenuItem, MenuLocation } from '~/types/api';

type MenuCache = Partial<Record<string, MenuItem[]>>;

export const useMenuStore = defineStore('menu', () => {
  const cache = ref<MenuCache>({});

  const keyOf = (location: MenuLocation, lang: string) => `${location}:${lang}`;

  function items(location: MenuLocation, lang: string): MenuItem[] {
    return cache.value[keyOf(location, lang)] ?? [];
  }

  async function load(location: MenuLocation, lang: string): Promise<MenuItem[]> {
    const key = keyOf(location, lang);
    const cached = cache.value[key];
    if (cached) return cached;
    const { $api } = useNuxtApp();
    const data = await $api<MenuItem[]>('/menus', { query: { location, lang } }).catch(() => [] as MenuItem[]);
    cache.value[key] = data;
    return data;
  }

  return { cache, items, load };
});
