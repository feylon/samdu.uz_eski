<script setup lang="ts">
import { Hourglass, MapPin, Pin } from '@lucide/vue';
import type { AnnouncementItem } from '~/types/api';

const props = withDefaults(defineProps<{ item: AnnouncementItem; compact?: boolean }>(), { compact: false });

const localePath = useLocalePath();
const { formatDate, dayAndMonth } = useFormatDate();
const date = computed(() => dayAndMonth(props.item.eventDate ?? props.item.publishedAt));
</script>

<template>
  <article
    class="group relative flex gap-4 rounded-xl bg-white p-4 transition hover:bg-navy-50/60"
    :class="compact ? '' : 'shadow-card hover:shadow-card-hover sm:p-5'"
  >
    <div class="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-navy-900 text-white shadow-md transition group-hover:bg-gold-500 group-hover:text-navy-950">
      <span class="font-display text-xl font-extrabold leading-none">{{ date.day }}</span>
      <span class="mt-1 text-2xs font-semibold uppercase tracking-wider opacity-80">{{ date.month }}</span>
    </div>
    <div class="min-w-0 flex-1">
      <div class="mb-1.5 flex flex-wrap items-center gap-2">
        <span class="chip !bg-navy-50 !text-navy-700">{{ $t(`announcements.types.${item.type}`) }}</span>
        <span v-if="item.isPinned" class="chip"><Pin class="h-3 w-3" />{{ $t('announcements.pinned') }}</span>
      </div>
      <h3 class="line-clamp-2 text-[0.95rem] font-bold leading-snug transition group-hover:text-navy-600">
        <NuxtLink :to="localePath(`/announcements/${item.slug}`)" class="after:absolute after:inset-0">{{ item.title }}</NuxtLink>
      </h3>
      <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span v-if="item.location" class="flex items-center gap-1"><MapPin class="h-3.5 w-3.5 text-gold-600" />{{ item.location }}</span>
        <span v-if="item.deadline" class="flex items-center gap-1"><Hourglass class="h-3.5 w-3.5 text-gold-600" />{{ $t('announcements.deadline') }}: {{ formatDate(item.deadline) }}</span>
      </div>
    </div>
  </article>
</template>
