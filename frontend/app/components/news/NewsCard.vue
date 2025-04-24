<script setup lang="ts">
import { ArrowRight, Calendar, Eye } from '@lucide/vue';
import type { NewsItem } from '~/types/api';

const props = withDefaults(defineProps<{ item: NewsItem; featured?: boolean }>(), { featured: false });

const localePath = useLocalePath();
const media = useMediaUrl();
const { formatDate } = useFormatDate();
const { t, te } = useI18n();

const to = computed(() => localePath(`/news/${props.item.slug}`));
const category = computed(() => {
  const key = `news.categories.${props.item.category}`;
  return te(key) ? t(key) : props.item.category;
});
</script>

<template>
  <article v-if="featured" class="group relative h-full min-h-[22rem] overflow-hidden rounded-2xl bg-navy-900 shadow-card">
    <img :src="media(item.coverImage)" :alt="item.title" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
    <div class="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
    <div class="relative flex h-full flex-col justify-end p-6 sm:p-8">
      <span class="chip mb-4 w-fit">{{ category }}</span>
      <h3 class="mb-3 text-xl font-bold leading-snug !text-white sm:text-2xl">
        <NuxtLink :to="to" class="after:absolute after:inset-0 hover:text-gold-300">{{ item.title }}</NuxtLink>
      </h3>
      <p v-if="item.summary" class="mb-5 line-clamp-2 max-w-2xl text-sm text-white/75">{{ item.summary }}</p>
      <div class="flex items-center gap-5 text-xs text-white/60">
        <span class="flex items-center gap-1.5"><Calendar class="h-3.5 w-3.5 text-gold-400" />{{ formatDate(item.publishedAt) }}</span>
        <span class="flex items-center gap-1.5"><Eye class="h-3.5 w-3.5 text-gold-400" />{{ item.views }}</span>
      </div>
    </div>
  </article>

  <article v-else class="card group relative flex h-full flex-col">
    <div class="relative aspect-[16/10] overflow-hidden bg-surface-subtle">
      <img :src="media(item.coverImage)" :alt="item.title" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
      <span class="chip absolute left-4 top-4 bg-white/95 text-navy-800 shadow">{{ category }}</span>
    </div>
    <div class="flex flex-1 flex-col p-5">
      <p class="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
        <Calendar class="h-3.5 w-3.5 text-gold-600" /> {{ formatDate(item.publishedAt) }}
      </p>
      <h3 class="mb-3 line-clamp-2 text-base font-bold leading-snug transition group-hover:text-navy-600">
        <NuxtLink :to="to" class="after:absolute after:inset-0">{{ item.title }}</NuxtLink>
      </h3>
      <p v-if="item.summary" class="mb-4 line-clamp-2 text-sm text-ink-muted">{{ item.summary }}</p>
      <span class="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-700">
        {{ $t('news.readMore') }} <ArrowRight class="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </span>
    </div>
  </article>
</template>
