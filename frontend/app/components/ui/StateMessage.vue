<script setup lang="ts">
import { CircleAlert, Inbox } from '@lucide/vue';

defineProps<{ type?: 'empty' | 'error'; message: string }>();
defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-subtle bg-white px-6 py-16 text-center">
    <component :is="type === 'error' ? CircleAlert : Inbox" class="mb-4 h-10 w-10" :class="type === 'error' ? 'text-red-500' : 'text-ink-soft'" />
    <p class="text-ink-muted">{{ message }}</p>
    <button v-if="type === 'error'" type="button" class="btn-navy mt-5" @click="$emit('retry')">{{ $t('common.retry') }}</button>
  </div>
</template>
