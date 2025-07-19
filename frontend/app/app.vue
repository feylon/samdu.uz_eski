<script setup lang="ts">
const a11y = useAccessibilityStore();
const head = useLocaleHead();
const { t } = useI18n();

useHead(() => ({
  htmlAttrs: {
    lang: head.value.htmlAttrs?.lang,
    class: a11y.htmlClasses.join(' '),
    style: `--a11y-font-scale: ${a11y.state.fontScale}%`,
  },
  link: head.value.link,
  meta: head.value.meta,
}));

useSeoMeta({
  description: () => t('footer.about'),
  ogSiteName: () => t('university.fullName'),
  ogType: 'website',
});
</script>

<template>
  <NuxtLoadingIndicator color="#d4991a" :height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
