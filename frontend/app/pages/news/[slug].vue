<script setup lang="ts">
import { ArrowLeft, Calendar, Eye } from '@lucide/vue';

const route = useRoute();
const { t, te } = useI18n();
const localePath = useLocalePath();
const media = useMediaUrl();
const { formatDate } = useFormatDate();

const slug = computed(() => String(route.params.slug));
const { data: item, error } = await useNewsItem(slug);

if (error.value || !item.value) {
  throw createError({ statusCode: 404, statusMessage: 'News not found', fatal: true });
}

const { data: related } = await useNewsList({ limit: 4 });
const others = computed(() => (related.value?.items ?? []).filter((news) => news.slug !== slug.value).slice(0, 3));
const category = computed(() => {
  const key = `news.categories.${item.value?.category}`;
  return te(key) ? t(key) : item.value?.category;
});

useSeoMeta({
  title: () => item.value?.title ?? '',
  description: () => item.value?.summary ?? '',
  ogTitle: () => item.value?.title ?? '',
  ogImage: () => media(item.value?.coverImage),
  ogType: 'article',
});
</script>

<template>
  <div v-if="item">
    <UiPageHero :title="item.title" :crumbs="[{ label: $t('news.title'), to: localePath('/news') }, { label: item.title }]" />
    <section class="section">
      <div class="container grid gap-10 lg:grid-cols-12">
        <article class="lg:col-span-8">
          <div class="overflow-hidden rounded-2xl bg-white shadow-card">
            <img :src="media(item.coverImage)" :alt="item.title" class="aspect-[16/9] w-full object-cover" />
            <div class="p-6 sm:p-10">
              <div class="mb-6 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
                <span class="chip">{{ category }}</span>
                <span class="flex items-center gap-1.5"><Calendar class="h-4 w-4 text-gold-600" />{{ formatDate(item.publishedAt) }}</span>
                <span class="flex items-center gap-1.5"><Eye class="h-4 w-4 text-gold-600" />{{ $t('news.views', { n: item.views }) }}</span>
              </div>
              <p v-if="item.summary" class="mb-6 border-l-4 border-gold-500 pl-4 text-lg font-medium text-navy-800">{{ item.summary }}</p>
              <div class="prose prose-lg" v-html="item.content" />
            </div>
          </div>
          <NuxtLink :to="localePath('/news')" class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-gold-600">
            <ArrowLeft class="h-4 w-4" /> {{ $t('news.back') }}
          </NuxtLink>
        </article>
        <aside class="lg:col-span-4">
          <h2 class="mb-5 text-lg font-extrabold uppercase">{{ $t('news.related') }}</h2>
          <div class="space-y-6">
            <NewsCard v-for="news in others" :key="news.id" :item="news" />
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
