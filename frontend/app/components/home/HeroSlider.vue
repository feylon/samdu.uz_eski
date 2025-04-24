<script setup lang="ts">
import { ArrowRight, ChevronLeft, ChevronRight } from '@lucide/vue';
import type { SlideItem } from '~/types/api';

const props = withDefaults(defineProps<{ slides: SlideItem[]; interval?: number }>(), { interval: 6500 });

const media = useMediaUrl();
const resolve = useMenuLink();
const current = ref(0);
const paused = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

const total = computed(() => props.slides.length);

function go(index: number) {
  if (!total.value) return;
  current.value = (index + total.value) % total.value;
  restart();
}

function restart() {
  if (timer) clearInterval(timer);
  if (import.meta.server || total.value < 2) return;
  timer = setInterval(() => {
    if (!paused.value) current.value = (current.value + 1) % total.value;
  }, props.interval);
}

onMounted(restart);
onBeforeUnmount(() => timer && clearInterval(timer));
watch(total, () => {
  current.value = 0;
  restart();
});
</script>

<template>
  <section
    class="relative isolate h-[34rem] overflow-hidden bg-navy-950 sm:h-[38rem] lg:h-[42rem]"
    aria-roledescription="carousel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <TransitionGroup
      enter-active-class="transition-opacity duration-1000"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-1000 absolute inset-0"
      leave-to-class="opacity-0"
    >
      <div
        v-for="(slide, index) in slides"
        v-show="index === current"
        :key="slide.id"
        class="absolute inset-0"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${index + 1} / ${total}`"
      >
        <img
          :src="media(slide.image)"
          :alt="slide.title"
          class="absolute inset-0 h-full w-full object-cover"
          :class="{ 'animate-ken-burns': index === current }"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
        />
        <div class="absolute inset-0 bg-hero-overlay" />
        <div class="container relative flex h-full items-center pb-20">
          <div v-if="index === current" class="max-w-2xl">
            <span class="mb-5 inline-block h-1 w-16 animate-slide-up rounded-full bg-gold-gradient" />
            <h1 class="mb-5 animate-slide-up text-3xl font-extrabold leading-tight !text-white [animation-delay:120ms] sm:text-5xl lg:text-6xl">
              {{ slide.title }}
            </h1>
            <p v-if="slide.subtitle" class="mb-8 animate-slide-up text-base text-white/80 [animation-delay:240ms] sm:text-lg">
              {{ slide.subtitle }}
            </p>
            <div class="flex animate-slide-up flex-wrap gap-3 [animation-delay:360ms]">
              <NuxtLink
                v-if="slide.link"
                :to="resolve({ url: slide.link, isExternal: false }).to"
                class="btn-gold px-7 py-3.5 text-sm uppercase tracking-wider"
              >
                {{ slide.buttonText || $t('news.readMore') }}
                <ArrowRight class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <div v-if="total > 1" class="absolute inset-x-0 bottom-24 z-10 sm:bottom-28">
      <div class="container flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            type="button"
            class="relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-300"
            :class="index === current ? 'w-14' : 'w-6 hover:bg-white/50'"
            :aria-label="$t('hero.goTo', { n: index + 1 })"
            :aria-current="index === current"
            @click="go(index)"
          >
            <span
              v-if="index === current"
              :key="`progress-${current}`"
              class="absolute inset-y-0 left-0 animate-progress bg-gold-400"
              :style="{ animationDuration: `${interval}ms`, animationPlayState: paused ? 'paused' : 'running' }"
            />
          </button>
        </div>
        <div class="flex gap-2">
          <button type="button" class="hero-arrow" :aria-label="$t('hero.prev')" @click="go(current - 1)">
            <ChevronLeft class="h-5 w-5" />
          </button>
          <button type="button" class="hero-arrow" :aria-label="$t('hero.next')" @click="go(current + 1)">
            <ChevronRight class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-arrow {
  @apply flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur transition hover:border-gold-400 hover:bg-gold-500 hover:text-navy-950;
}
</style>
