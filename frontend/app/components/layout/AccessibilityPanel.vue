<script setup lang="ts">
import { Contrast, Eye, ImageOff, RotateCcw, Type, X } from '@lucide/vue';
import type { FontScale } from '~/stores/accessibility';

const a11y = useAccessibilityStore();
const { t } = useI18n();

const scales = computed<{ value: FontScale; label: string; size: string }[]>(() => [
  { value: 100, label: t('a11y.normal'), size: 'text-sm' },
  { value: 112, label: t('a11y.large'), size: 'text-base' },
  { value: 125, label: t('a11y.xlarge'), size: 'text-lg' },
]);

const modes = computed(() => [
  { key: 'grayscale' as const, label: t('a11y.grayscale'), icon: Eye },
  { key: 'contrast' as const, label: t('a11y.contrast'), icon: Contrast },
  { key: 'hideImages' as const, label: t('a11y.hideImages'), icon: ImageOff },
]);
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="a11y.panelOpen"
      role="dialog"
      :aria-label="$t('a11y.title')"
      class="absolute right-4 top-full z-[60] mt-2 w-80 rounded-2xl bg-white p-5 text-ink shadow-dropdown"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-bold">{{ $t('a11y.title') }}</h2>
        <button type="button" class="rounded-full p-1 text-ink-muted hover:bg-surface-subtle" :aria-label="$t('nav.close')" @click="a11y.panelOpen = false">
          <X class="h-5 w-5" />
        </button>
      </div>

      <p class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        <Type class="h-4 w-4" /> {{ $t('a11y.fontSize') }}
      </p>
      <div class="mb-5 grid grid-cols-3 gap-2">
        <button
          v-for="scale in scales"
          :key="scale.value"
          type="button"
          class="rounded-lg border px-2 py-2 font-semibold transition"
          :class="[scale.size, a11y.state.fontScale === scale.value ? 'border-navy-900 bg-navy-900 text-white' : 'border-surface-subtle hover:border-navy-300']"
          :aria-pressed="a11y.state.fontScale === scale.value"
          @click="a11y.setFontScale(scale.value)"
        >
          A
          <span class="sr-only">{{ scale.label }}</span>
        </button>
      </div>

      <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">{{ $t('a11y.mode') }}</p>
      <div class="mb-5 space-y-2">
        <button
          v-for="mode in modes"
          :key="mode.key"
          type="button"
          class="flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition"
          :class="a11y.state[mode.key] ? 'border-gold-500 bg-gold-50 text-navy-900' : 'border-surface-subtle hover:border-navy-300'"
          :aria-pressed="a11y.state[mode.key]"
          @click="a11y.toggle(mode.key)"
        >
          <component :is="mode.icon" class="h-4 w-4" />
          {{ mode.label }}
        </button>
      </div>

      <button type="button" class="btn-navy w-full" @click="a11y.reset()">
        <RotateCcw class="h-4 w-4" /> {{ $t('a11y.reset') }}
      </button>
    </div>
  </Transition>
</template>
