<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';

const props = defineProps<{ page: number; totalPages: number }>();
const emit = defineEmits<{ change: [page: number] }>();

const pages = computed(() => {
  const range: (number | '…')[] = [];
  for (let n = 1; n <= props.totalPages; n++) {
    if (n === 1 || n === props.totalPages || Math.abs(n - props.page) <= 1) range.push(n);
    else if (range[range.length - 1] !== '…') range.push('…');
  }
  return range;
});
</script>

<template>
  <nav v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
    <button type="button" class="pager-btn" :disabled="page <= 1" :aria-label="$t('common.prev')" @click="emit('change', page - 1)">
      <ChevronLeft class="h-4 w-4" />
    </button>
    <template v-for="(item, index) in pages" :key="`${item}-${index}`">
      <span v-if="item === '…'" class="px-2 text-ink-soft">…</span>
      <button
        v-else
        type="button"
        class="pager-btn"
        :class="{ '!border-navy-900 !bg-navy-900 !text-white': item === page }"
        :aria-current="item === page ? 'page' : undefined"
        :aria-label="$t('common.page', { n: item })"
        @click="emit('change', item)"
      >
        {{ item }}
      </button>
    </template>
    <button type="button" class="pager-btn" :disabled="page >= totalPages" :aria-label="$t('common.next')" @click="emit('change', page + 1)">
      <ChevronRight class="h-4 w-4" />
    </button>
  </nav>
</template>

<style scoped>
.pager-btn {
  @apply flex h-10 min-w-10 items-center justify-center rounded-lg border border-surface-subtle bg-white px-3 text-sm font-semibold text-ink transition hover:border-navy-300 hover:text-navy-700 disabled:cursor-not-allowed disabled:opacity-40;
}
</style>
