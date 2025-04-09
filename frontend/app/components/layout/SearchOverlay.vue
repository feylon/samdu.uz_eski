<script setup lang="ts">
import { Search, X } from '@lucide/vue';

const ui = useUiStore();
const localePath = useLocalePath();
const query = ref('');
const input = ref<HTMLInputElement | null>(null);

watch(
  () => ui.searchOpen,
  async (open) => {
    if (!open) return;
    await nextTick();
    input.value?.focus();
  },
);

async function submit() {
  const q = query.value.trim();
  if (q.length < 2) return;
  ui.searchOpen = false;
  await navigateTo(localePath({ path: '/search', query: { q } }));
  query.value = '';
}

onKeyStroke('Escape', () => {
  ui.searchOpen = false;
});

function onKeyStroke(key: string, handler: () => void) {
  if (import.meta.server) return;
  const listener = (event: KeyboardEvent) => event.key === key && handler();
  onMounted(() => window.addEventListener('keydown', listener));
  onBeforeUnmount(() => window.removeEventListener('keydown', listener));
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div
        v-if="ui.searchOpen"
        class="fixed inset-0 z-[80] flex items-start justify-center bg-navy-950/90 px-4 pt-[18vh] backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('search.title')"
        @click.self="ui.searchOpen = false"
      >
        <button type="button" class="absolute right-6 top-6 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white" :aria-label="$t('nav.close')" @click="ui.searchOpen = false">
          <X class="h-7 w-7" />
        </button>
        <form class="w-full max-w-2xl animate-slide-up" @submit.prevent="submit">
          <label for="site-search" class="mb-4 block font-display text-2xl font-bold text-white">{{ $t('search.title') }}</label>
          <div class="flex items-center gap-3 rounded-2xl bg-white p-2 pl-5 shadow-dropdown">
            <Search class="h-6 w-6 shrink-0 text-ink-soft" />
            <input
              id="site-search"
              ref="input"
              v-model="query"
              type="search"
              minlength="2"
              :placeholder="$t('search.placeholder')"
              class="w-full bg-transparent py-3 text-lg text-ink outline-none placeholder:text-ink-soft"
            />
            <button type="submit" class="btn-gold shrink-0">{{ $t('search.submit') }}</button>
          </div>
          <p class="mt-3 text-sm text-white/60">{{ $t('search.hint') }}</p>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
