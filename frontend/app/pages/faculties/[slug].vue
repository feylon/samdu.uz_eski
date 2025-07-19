<script setup lang="ts">
import { ArrowLeft, Mail, MapPin, Phone, User, Users } from '@lucide/vue';

const route = useRoute();
const localePath = useLocalePath();
const media = useMediaUrl();

const { data: item, error } = await useFacultyItem(() => String(route.params.slug));

if (error.value || !item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Faculty not found', fatal: true });
}

const icon = computed(() => facultyIcon(item.value?.icon));

useSeoMeta({
  title: () => item.value?.name ?? '',
  description: () => item.value?.shortDescription ?? '',
});
</script>

<template>
  <div v-if="item">
    <UiPageHero :title="item.name" :crumbs="[{ label: $t('faculties.title'), to: localePath('/faculties') }, { label: item.name }]" />
    <section class="section">
      <div class="container grid gap-8 lg:grid-cols-12">
        <div class="space-y-8 lg:col-span-8">
          <div class="overflow-hidden rounded-2xl bg-white shadow-card">
            <img :src="media(item.image)" :alt="item.name" class="aspect-[21/9] w-full object-cover" />
            <div class="p-6 sm:p-10">
              <div class="prose" v-html="item.description || `<p>${item.shortDescription ?? ''}</p>`" />
            </div>
          </div>
          <div class="rounded-2xl bg-white p-6 shadow-card sm:p-10">
            <h2 class="mb-6 text-xl font-extrabold uppercase">{{ $t('faculties.departments') }}</h2>
            <ul class="grid gap-4 sm:grid-cols-2">
              <li v-for="(department, index) in item.departments ?? []" :key="department.id" class="flex gap-4 rounded-xl border border-surface-subtle p-4 transition hover:border-gold-400 hover:bg-gold-50/40">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-900 font-display text-sm font-bold text-gold-400">{{ index + 1 }}</span>
                <div>
                  <p class="font-semibold leading-snug text-navy-900">{{ department.name }}</p>
                  <p v-if="department.headName" class="mt-1 text-xs text-ink-muted">{{ department.headName }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <aside class="h-fit space-y-4 rounded-2xl bg-navy-900 p-6 text-white shadow-card lg:col-span-4">
          <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 text-navy-950">
            <component :is="icon" class="h-8 w-8" />
          </span>
          <h2 class="font-display text-lg font-bold !text-white">{{ $t('faculties.contacts') }}</h2>
          <p v-if="item.deanName" class="flex gap-3"><User class="h-5 w-5 shrink-0 text-gold-400" />{{ $t('faculties.dean') }}: {{ item.deanName }}</p>
          <p class="flex gap-3"><Users class="h-5 w-5 shrink-0 text-gold-400" />{{ $t('faculties.students', { n: formatNumber(item.studentsCount) }) }}</p>
          <p v-if="item.phone" class="flex gap-3"><Phone class="h-5 w-5 shrink-0 text-gold-400" /><a :href="`tel:${item.phone.replace(/\s|-/g, '')}`" class="hover:text-gold-300">{{ item.phone }}</a></p>
          <p v-if="item.email" class="flex gap-3"><Mail class="h-5 w-5 shrink-0 text-gold-400" /><a :href="`mailto:${item.email}`" class="hover:text-gold-300">{{ item.email }}</a></p>
          <p v-if="item.address" class="flex gap-3"><MapPin class="h-5 w-5 shrink-0 text-gold-400" />{{ item.address }}</p>
          <NuxtLink :to="localePath('/faculties')" class="btn-gold mt-2 w-full">
            <ArrowLeft class="h-4 w-4" /> {{ $t('faculties.back') }}
          </NuxtLink>
        </aside>
      </div>
    </section>
  </div>
</template>
