<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const [slides, news, announcements, faculties, stats] = await Promise.all([
  useSlides(),
  useNewsList({ limit: 5 }),
  useAnnouncementsList({ limit: 4 }),
  useFaculties(),
  useFacultyStats(),
]);

useSeoMeta({
  title: () => t('nav.home'),
  ogTitle: () => t('university.fullName'),
});
</script>

<template>
  <div>
    <HomeHeroSlider :slides="slides.data.value ?? []" />
    <HomeQuickLinks />

    <section class="section">
      <div class="container">
        <UiSectionTitle
          :title="$t('home.newsTitle')"
          :subtitle="$t('home.newsSubtitle')"
          :link-to="localePath('/news')"
          :link-label="$t('home.allNews')"
        />
        <div class="grid gap-8 lg:grid-cols-12">
          <div class="lg:col-span-8">
            <HomeNewsGrid :items="news.data.value?.items ?? []" :pending="news.pending.value" />
          </div>
          <div class="lg:col-span-4">
            <HomeAnnouncementsList :items="announcements.data.value?.items ?? []" :pending="announcements.pending.value" />
          </div>
        </div>
      </div>
    </section>

    <HomeStatsSection :stats="stats.data.value" />
    <HomeFacultiesSection :items="faculties.data.value ?? []" :pending="faculties.pending.value" />
  </div>
</template>
