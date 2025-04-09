import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
  const mobileMenuOpen = ref(false);
  const searchOpen = ref(false);

  function closeAll() {
    mobileMenuOpen.value = false;
    searchOpen.value = false;
  }

  return { mobileMenuOpen, searchOpen, closeAll };
});
