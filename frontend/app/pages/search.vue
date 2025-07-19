<script setup lang="ts">
import { Search } from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''));
const input = ref(q.value);
const enabled = computed(() => q.value.length >= 2);

const [news, announcements] = await Promise.all([
  useNewsList(() => ({ search: enabled.value ? q.value : undefined, limit: enabled.value ? 9 : 1 })),
  useAnnouncementsList(() => ({ search: enabled.value ? q.value : undefined, limit: enabled.value ? 10 : 1 })),
]);

const hasResults = computed(() => (news.data.value?.items.length ?? 0) + (announcements.data.value?.items.length ?? 0) > 0);

function submit() {
  router.push({ query: { q: input.value.trim() || undefined } });
}

watch(q, (value) => (input.value = value));

useSeoMeta({ title: () => t('search.title') });
</script>

<template>
  <div>
    <UiPageHero :title="enabled ? $t('search.results', { q }) : $t('search.title')" :crumbs="[{ label: $t('search.title') }]" />
    <section class="section">
      <div class="container">
        <form class="mx-auto mb-12 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-2 pl-5 shadow-card" @submit.prevent="submit">
          <Search class="h-5 w-5 shrink-0 text-ink-soft" />
          <input v-model="input" type="search" minlength="2" :placeholder="$t('search.placeholder')" class="w-full bg-transparent py-3 outline-none" />
          <button type="submit" class="btn-navy shrink-0">{{ $t('search.submit') }}</button>
        </form>

        <UiStateMessage v-if="!enabled" :message="$t('search.hint')" />
        <UiStateMessage v-else-if="!news.pending.value && !announcements.pending.value && !hasResults" :message="$t('search.nothing')" />
        <template v-else-if="enabled">
          <div v-if="news.data.value?.items.length" class="mb-14">
            <h2 class="mb-6 text-xl font-extrabold uppercase">{{ $t('news.title') }}</h2>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <NewsCard v-for="item in news.data.value.items" :key="item.id" :item="item" />
            </div>
          </div>
          <div v-if="announcements.data.value?.items.length">
            <h2 class="mb-6 text-xl font-extrabold uppercase">{{ $t('announcements.title') }}</h2>
            <div class="space-y-4">
              <AnnouncementsAnnouncementCard v-for="item in announcements.data.value.items" :key="item.id" :item="item" />
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
