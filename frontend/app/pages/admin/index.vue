<script setup lang="ts">
import { BookOpen, ExternalLink, FileImage, LogOut, Megaphone, Newspaper } from '@lucide/vue';
import type { FacultyStats, Paginated } from '~/types/api';

interface AdminNews {
  id: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string;
  translations: { locale: string; title: string }[];
}

definePageMeta({ middleware: 'auth' });

const { t, locale } = useI18n();
const auth = useAuthStore();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const { formatDate } = useFormatDate();

const [news, announcements, media, stats] = await Promise.all([
  useApiFetch<Paginated<AdminNews>>('/news/admin', { query: { limit: 5 } }),
  useApiFetch<Paginated<unknown>>('/announcements/admin', { query: { limit: 1 } }),
  useApiFetch<Paginated<unknown>>('/media', { query: { limit: 1 } }),
  useApiFetch<FacultyStats>('/faculties/stats'),
]);

const swaggerUrl = computed(() => `${config.public.apiBase.replace(/\/api\/?$/, '')}/api/docs`);

const cards = computed(() => [
  { icon: Newspaper, label: t('admin.news'), value: news.data.value?.meta.total ?? 0 },
  { icon: Megaphone, label: t('admin.announcements'), value: announcements.data.value?.meta.total ?? 0 },
  { icon: BookOpen, label: t('admin.faculties'), value: stats.data.value?.faculties ?? 0 },
  { icon: FileImage, label: t('admin.media'), value: media.data.value?.meta.total ?? 0 },
]);

const titleOf = (item: AdminNews) =>
  (item.translations.find((tr) => tr.locale === locale.value) ?? item.translations.find((tr) => tr.locale === 'uz') ?? item.translations[0])?.title ?? item.slug;

async function logout() {
  auth.logout();
  await navigateTo(localePath('/login'));
}

useSeoMeta({ title: () => t('admin.title'), robots: 'noindex, nofollow' });
</script>

<template>
  <div>
    <UiPageHero :title="$t('admin.title')" :crumbs="[{ label: $t('admin.title') }]" />
    <section class="section">
      <div class="container space-y-8">
        <div class="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-lg font-bold text-navy-900">{{ $t('admin.welcome', { name: auth.user?.fullName ?? '' }) }}</p>
            <p class="text-sm text-ink-muted">
              {{ auth.user?.email }} · {{ $t('admin.role') }}: <span class="chip">{{ $t(`admin.roles.${auth.user?.role ?? 'user'}`) }}</span>
            </p>
          </div>
          <button type="button" class="btn border border-red-200 text-red-600 hover:bg-red-50" @click="logout">
            <LogOut class="h-4 w-4" /> {{ $t('auth.logout') }}
          </button>
        </div>

        <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="card in cards" :key="card.label" class="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card">
            <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <component :is="card.icon" class="h-6 w-6" />
            </span>
            <span>
              <span class="block font-display text-2xl font-extrabold text-navy-900">{{ card.value }}</span>
              <span class="text-xs font-medium uppercase tracking-wider text-ink-muted">{{ card.label }}</span>
            </span>
          </li>
        </ul>

        <div class="grid gap-6 lg:grid-cols-12">
          <div class="rounded-2xl bg-white p-6 shadow-card lg:col-span-8">
            <h2 class="mb-4 text-lg font-extrabold uppercase">{{ $t('admin.recentNews') }}</h2>
            <ul class="divide-y divide-surface-subtle">
              <li v-for="item in news.data.value?.items ?? []" :key="item.id" class="flex items-center justify-between gap-4 py-3">
                <NuxtLink :to="localePath(`/news/${item.slug}`)" class="line-clamp-1 font-medium text-navy-900 hover:text-navy-600">{{ titleOf(item) }}</NuxtLink>
                <span class="flex shrink-0 items-center gap-3 text-xs text-ink-soft">
                  {{ formatDate(item.publishedAt) }}
                  <span class="chip" :class="item.isPublished ? '' : '!bg-surface-subtle !text-ink-muted'">
                    {{ item.isPublished ? $t('admin.published') : $t('admin.draft') }}
                  </span>
                </span>
              </li>
            </ul>
          </div>
          <a :href="swaggerUrl" target="_blank" rel="noopener noreferrer" class="group flex flex-col justify-between rounded-2xl bg-navy-gradient p-6 text-white shadow-card lg:col-span-4">
            <div>
              <h2 class="mb-2 flex items-center gap-2 text-lg font-extrabold !text-white">
                {{ $t('admin.apiDocs') }} <ExternalLink class="h-4 w-4 text-gold-400" />
              </h2>
              <p class="text-sm text-white/70">{{ $t('admin.apiDocsText') }}</p>
            </div>
            <span class="btn-gold mt-6 w-fit">Swagger UI</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
