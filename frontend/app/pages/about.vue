<script setup lang="ts">
import { BookMarked, Target } from '@lucide/vue';

const { t } = useI18n();
const { data: stats } = await useFacultyStats();

useSeoMeta({ title: () => t('about.title') });
</script>

<template>
  <div>
    <UiPageHero :title="$t('about.title')" :crumbs="[{ label: $t('about.title') }]" />
    <section class="section">
      <div class="container max-w-5xl">
        <p class="mb-12 text-xl leading-relaxed text-navy-800">{{ $t('about.intro') }}</p>
        <div class="grid gap-8 md:grid-cols-2">
          <article id="history" class="scroll-mt-24 rounded-2xl bg-white p-8 shadow-card">
            <BookMarked class="mb-4 h-10 w-10 text-gold-500" />
            <h2 class="mb-3 text-2xl font-extrabold">{{ $t('about.historyTitle') }}</h2>
            <p class="leading-relaxed text-ink-muted">{{ $t('about.history') }}</p>
          </article>
          <article id="mission" class="scroll-mt-24 rounded-2xl bg-white p-8 shadow-card">
            <Target class="mb-4 h-10 w-10 text-gold-500" />
            <h2 class="mb-3 text-2xl font-extrabold">{{ $t('about.missionTitle') }}</h2>
            <p class="leading-relaxed text-ink-muted">{{ $t('about.mission') }}</p>
          </article>
        </div>
      </div>
    </section>
    <HomeStatsSection :stats="stats" />
  </div>
</template>
