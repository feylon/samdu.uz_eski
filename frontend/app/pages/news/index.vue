<script setup lang="ts">
const { t, te } = useI18n();
const route = useRoute();
const router = useRouter();

const page = computed(() => Number(route.query.page ?? 1) || 1);
const category = computed(() => (typeof route.query.category === 'string' ? route.query.category : undefined));

const { data, pending, error, refresh } = await useNewsList(() => ({ page: page.value, limit: 9, category: category.value }));
const { data: categories } = await useApiFetch<string[]>('/news/categories');

const label = (key: string) => (te(`news.categories.${key}`) ? t(`news.categories.${key}`) : key);

function setQuery(query: Record<string, string | number | undefined>) {
  router.push({ query: { ...route.query, ...query } });
}

useSeoMeta({ title: () => t('news.title') });
</script>

<template>
  <div>
    <UiPageHero :title="$t('news.title')" :crumbs="[{ label: $t('news.title') }]" />
    <section class="section">
      <div class="container">
        <div class="mb-10 flex flex-wrap gap-2">
          <button type="button" class="filter-pill" :class="{ 'filter-pill--active': !category }" @click="setQuery({ category: undefined, page: undefined })">
            {{ $t('news.allCategories') }}
          </button>
          <button
            v-for="item in categories ?? []"
            :key="item"
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': category === item }"
            @click="setQuery({ category: item, page: undefined })"
          >
            {{ label(item) }}
          </button>
        </div>

        <UiStateMessage v-if="error" type="error" :message="$t('common.error')" @retry="refresh()" />
        <div v-else-if="pending" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <UiSkeletonCard v-for="n in 6" :key="n" />
        </div>
        <UiStateMessage v-else-if="!data?.items.length" :message="$t('news.empty')" />
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NewsCard v-for="item in data.items" :key="item.id" :item="item" />
        </div>

        <UiAppPagination v-if="data" :page="data.meta.page" :total-pages="data.meta.totalPages" @change="setQuery({ page: $event })" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.filter-pill {
  @apply rounded-full border border-surface-subtle bg-white px-4 py-2 text-sm font-semibold text-ink-muted transition hover:border-navy-300 hover:text-navy-700;
}

.filter-pill--active {
  @apply border-navy-900 bg-navy-900 text-white hover:border-navy-900 hover:text-white;
}
</style>
