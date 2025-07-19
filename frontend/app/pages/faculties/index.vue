<script setup lang="ts">
const { t } = useI18n();
const { data, pending, error, refresh } = await useFaculties();

useSeoMeta({ title: () => t('faculties.title') });
</script>

<template>
  <div>
    <UiPageHero :title="$t('faculties.title')" :crumbs="[{ label: $t('faculties.title') }]" />
    <section class="section">
      <div class="container">
        <UiStateMessage v-if="error" type="error" :message="$t('common.error')" @retry="refresh()" />
        <div v-else-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="n in 6" :key="n" class="h-56 animate-pulse rounded-2xl bg-white shadow-card" />
        </div>
        <UiStateMessage v-else-if="!data?.length" :message="$t('faculties.empty')" />
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FacultiesFacultyCard v-for="item in data" :key="item.id" :item="item" />
        </div>
      </div>
    </section>
  </div>
</template>
