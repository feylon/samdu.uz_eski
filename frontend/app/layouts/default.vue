<script setup lang="ts">
const { locale } = useI18n();
const menuStore = useMenuStore();

await useAsyncData(
  () => `menus:${locale.value}`,
  async () => {
    await Promise.all([menuStore.load('header', locale.value), menuStore.load('footer', locale.value)]);
    return true;
  },
);

const headerMenu = computed(() => menuStore.items('header', locale.value));
const footerMenu = computed(() => menuStore.items('footer', locale.value));
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a href="#main" class="sr-only z-[100] rounded-lg bg-gold-500 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
      Skip to content
    </a>
    <LayoutTheHeader :menu="headerMenu" />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <LayoutTheFooter :links="footerMenu" />
  </div>
</template>
