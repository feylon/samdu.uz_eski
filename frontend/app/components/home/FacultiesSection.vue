<script setup lang="ts">
import type { FacultyItem } from '~/types/api';

defineProps<{ items: FacultyItem[]; pending?: boolean }>();
const localePath = useLocalePath();
</script>

<template>
  <section class="section">
    <div class="container">
      <UiSectionTitle
        :title="$t('home.facultiesTitle')"
        :subtitle="$t('home.facultiesSubtitle')"
        :link-to="localePath('/faculties')"
        :link-label="$t('home.allFaculties')"
      />
      <div v-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 8" :key="n" class="h-56 animate-pulse rounded-2xl bg-white shadow-card" />
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FacultiesFacultyCard v-for="item in items.slice(0, 8)" :key="item.id" :item="item" />
      </div>
    </div>
  </section>
</template>
