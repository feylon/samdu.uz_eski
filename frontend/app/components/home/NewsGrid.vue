<script setup lang="ts">
import type { NewsItem } from '~/types/api';

const props = defineProps<{ items: NewsItem[]; pending?: boolean }>();
const featured = computed(() => props.items[0]);
const rest = computed(() => props.items.slice(1, 5));
</script>

<template>
  <div v-if="pending" class="grid gap-6 sm:grid-cols-2">
    <UiSkeletonCard v-for="n in 4" :key="n" />
  </div>
  <UiStateMessage v-else-if="!items.length" :message="$t('news.empty')" />
  <div v-else class="grid gap-6 sm:grid-cols-2">
    <div v-if="featured" class="sm:col-span-2">
      <NewsCard :item="featured" featured />
    </div>
    <NewsCard v-for="item in rest" :key="item.id" :item="item" />
  </div>
</template>
