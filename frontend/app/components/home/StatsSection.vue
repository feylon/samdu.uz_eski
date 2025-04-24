<script setup lang="ts">
import { Award, BookOpen, Building, GraduationCap, Handshake, Users } from '@lucide/vue';
import type { FacultyStats } from '~/types/api';

const props = defineProps<{ stats?: FacultyStats | null }>();
const { t } = useI18n();

const items = computed(() => [
  { icon: Award, value: new Date().getFullYear() - 1927, suffix: '', label: t('stats.years') },
  { icon: GraduationCap, value: props.stats?.students || 25000, suffix: '+', label: t('stats.students') },
  { icon: Building, value: props.stats?.faculties || 16, suffix: '', label: t('stats.faculties') },
  { icon: BookOpen, value: props.stats?.departments || 80, suffix: '', label: t('stats.departments') },
  { icon: Users, value: 1500, suffix: '+', label: t('stats.teachers') },
  { icon: Handshake, value: 150, suffix: '+', label: t('stats.partners') },
]);

const root = ref<HTMLElement | null>(null);
const progress = ref(1);

onMounted(() => {
  if (!root.value) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      progress.value = 0;
      const started = performance.now();
      const step = (now: number) => {
        progress.value = Math.min(1, (now - started) / 1600);
        if (progress.value < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    { threshold: 0.3 },
  );
  observer.observe(root.value);
  onBeforeUnmount(() => observer.disconnect());
});

const display = (value: number) => {
  const eased = 1 - Math.pow(1 - progress.value, 3);
  return formatNumber(value * eased);
};
</script>

<template>
  <section ref="root" class="relative overflow-hidden bg-navy-gradient py-16 lg:py-20">
    <div class="pointer-events-none absolute inset-0 bg-pattern-dots bg-dots" />
    <div class="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />
    <div class="container relative">
      <UiSectionTitle :title="$t('home.statsTitle')" light />
      <ul class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3 lg:grid-cols-6">
        <li v-for="item in items" :key="item.label" class="group bg-navy-950/40 p-6 text-center backdrop-blur transition hover:bg-navy-950/70">
          <component :is="item.icon" class="mx-auto mb-4 h-8 w-8 text-gold-400 transition group-hover:scale-110" />
          <p class="font-display text-3xl font-extrabold text-white lg:text-4xl">
            {{ display(item.value) }}<span class="text-gold-400">{{ item.suffix }}</span>
          </p>
          <p class="mt-2 text-xs font-medium uppercase tracking-wider text-white/60">{{ item.label }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
