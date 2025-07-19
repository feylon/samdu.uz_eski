<script setup lang="ts">
import type { AnnouncementType } from '~/types/api';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const types: AnnouncementType[] = ['admission', 'event', 'conference', 'vacancy', 'notice'];
const page = computed(() => Number(route.query.page ?? 1) || 1);
const type = computed(() => (types.includes(route.query.type as AnnouncementType) ? (route.query.type as AnnouncementType) : undefined));

const { data, pending, error, refresh } = await useAnnouncementsList(() => ({ page: page.value, limit: 10, type: type.value }));

function setQuery(query: Record<string, string | number | undefined>) {
  router.push({ query: { ...route.query, ...query } });
}

useSeoMeta({ title: () => t('announcements.title') });
</script>

<template>
  <div>
    <UiPageHero :title="$t('announcements.title')" :crumbs="[{ label: $t('announcements.title') }]" />
    <section class="section">
      <div class="container max-w-5xl">
        <div class="mb-10 flex flex-wrap gap-2">
          <button type="button" class="filter-pill" :class="{ 'filter-pill--active': !type }" @click="setQuery({ type: undefined, page: undefined })">
            {{ $t('announcements.allTypes') }}
          </button>
          <button
            v-for="item in types"
            :key="item"
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': type === item }"
            @click="setQuery({ type: item, page: undefined })"
          >
            {{ $t(`announcements.types.${item}`) }}
          </button>
        </div>

        <UiStateMessage v-if="error" type="error" :message="$t('common.error')" @retry="refresh()" />
        <div v-else-if="pending" class="space-y-4">
          <div v-for="n in 5" :key="n" class="h-28 animate-pulse rounded-xl bg-white shadow-card" />
        </div>
        <UiStateMessage v-else-if="!data?.items.length" :message="$t('announcements.empty')" />
        <div v-else class="space-y-4">
          <AnnouncementsAnnouncementCard v-for="item in data.items" :key="item.id" :item="item" />
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
