<script setup lang="ts">
import { ArrowUpRight, Users } from '@lucide/vue';
import type { FacultyItem } from '~/types/api';

const props = defineProps<{ item: FacultyItem }>();
const localePath = useLocalePath();
const icon = computed(() => facultyIcon(props.item.icon));
</script>

<template>
  <article class="card group relative flex h-full flex-col p-6">
    <div class="mb-5 flex items-start justify-between">
      <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-700 transition duration-300 group-hover:bg-navy-900 group-hover:text-gold-400">
        <component :is="icon" class="h-7 w-7" />
      </span>
      <ArrowUpRight class="h-5 w-5 text-ink-soft transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-600" />
    </div>
    <h3 class="mb-2 text-lg font-bold leading-snug">
      <NuxtLink :to="localePath(`/faculties/${item.slug}`)" class="after:absolute after:inset-0">{{ item.name }}</NuxtLink>
    </h3>
    <p v-if="item.shortDescription" class="mb-5 line-clamp-2 text-sm text-ink-muted">{{ item.shortDescription }}</p>
    <div class="mt-auto flex items-center justify-between border-t border-surface-subtle pt-4 text-xs font-medium text-ink-soft">
      <span>{{ $t('faculties.departmentsCount', { n: item.departmentsCount }) }}</span>
      <span class="flex items-center gap-1"><Users class="h-3.5 w-3.5" />{{ $t('faculties.students', { n: formatNumber(item.studentsCount) }) }}</span>
    </div>
    <span class="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gold-gradient transition duration-300 group-hover:scale-x-100" />
  </article>
</template>
