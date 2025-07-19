<script setup lang="ts">
import { ArrowLeft, Calendar, Hourglass, MapPin } from '@lucide/vue';

const route = useRoute();
const localePath = useLocalePath();
const { formatDate, formatDateTime } = useFormatDate();

const { data: item, error } = await useAnnouncementItem(() => String(route.params.slug));

if (error.value || !item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Announcement not found', fatal: true });
}

useSeoMeta({
  title: () => item.value?.title ?? '',
  description: () => item.value?.summary ?? '',
});
</script>

<template>
  <div v-if="item">
    <UiPageHero :title="item.title" :crumbs="[{ label: $t('announcements.title'), to: localePath('/announcements') }, { label: item.title }]" />
    <section class="section">
      <div class="container grid max-w-6xl gap-8 lg:grid-cols-12">
        <article class="rounded-2xl bg-white p-6 shadow-card sm:p-10 lg:col-span-8">
          <span class="chip mb-5">{{ $t(`announcements.types.${item.type}`) }}</span>
          <p v-if="item.summary" class="mb-6 text-lg font-medium text-navy-800">{{ item.summary }}</p>
          <div class="prose prose-lg" v-html="item.content" />
        </article>
        <aside class="h-fit space-y-4 rounded-2xl bg-navy-900 p-6 text-white shadow-card lg:col-span-4">
          <div v-if="item.eventDate" class="flex gap-3">
            <Calendar class="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
            <div>
              <p class="text-xs uppercase tracking-wider text-white/50">{{ $t('announcements.eventDate') }}</p>
              <p class="font-semibold">{{ formatDateTime(item.eventDate) }}</p>
            </div>
          </div>
          <div v-if="item.deadline" class="flex gap-3">
            <Hourglass class="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
            <div>
              <p class="text-xs uppercase tracking-wider text-white/50">{{ $t('announcements.deadline') }}</p>
              <p class="font-semibold">{{ formatDate(item.deadline) }}</p>
            </div>
          </div>
          <div v-if="item.location" class="flex gap-3">
            <MapPin class="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
            <div>
              <p class="text-xs uppercase tracking-wider text-white/50">{{ $t('announcements.location') }}</p>
              <p class="font-semibold">{{ item.location }}</p>
            </div>
          </div>
          <NuxtLink :to="localePath('/announcements')" class="btn-gold mt-2 w-full">
            <ArrowLeft class="h-4 w-4" /> {{ $t('announcements.back') }}
          </NuxtLink>
        </aside>
      </div>
    </section>
  </div>
</template>
