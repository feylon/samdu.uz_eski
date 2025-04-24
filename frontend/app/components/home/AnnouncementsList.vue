<script setup lang="ts">
import { ArrowRight, Megaphone } from '@lucide/vue';
import type { AnnouncementItem } from '~/types/api';

defineProps<{ items: AnnouncementItem[]; pending?: boolean }>();
const localePath = useLocalePath();
</script>

<template>
  <aside class="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card">
    <div class="flex items-center gap-3 bg-navy-900 px-6 py-5">
      <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-navy-950">
        <Megaphone class="h-5 w-5" />
      </span>
      <h2 class="font-display text-lg font-extrabold uppercase tracking-wide !text-white">{{ $t('home.announcementsTitle') }}</h2>
    </div>
    <div class="flex-1 divide-y divide-surface-subtle p-2">
      <template v-if="pending">
        <div v-for="n in 4" :key="n" class="flex animate-pulse gap-4 p-4">
          <div class="h-16 w-16 rounded-xl bg-surface-subtle" />
          <div class="flex-1 space-y-2 py-1">
            <div class="h-3 w-20 rounded bg-surface-subtle" />
            <div class="h-4 w-full rounded bg-surface-subtle" />
          </div>
        </div>
      </template>
      <p v-else-if="!items.length" class="p-6 text-center text-sm text-ink-muted">{{ $t('announcements.empty') }}</p>
      <AnnouncementsAnnouncementCard v-for="item in items" v-else :key="item.id" :item="item" compact />
    </div>
    <NuxtLink
      :to="localePath('/announcements')"
      class="group flex items-center justify-center gap-2 border-t border-surface-subtle px-6 py-4 text-sm font-semibold uppercase tracking-wider text-navy-700 transition hover:bg-navy-50"
    >
      {{ $t('home.allAnnouncements') }}
      <ArrowRight class="h-4 w-4 transition group-hover:translate-x-1" />
    </NuxtLink>
  </aside>
</template>
