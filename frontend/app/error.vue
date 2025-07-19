<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();
const localePath = useLocalePath();

useHead({ title: String(props.error.statusCode ?? 'Error') });

const handleError = () => clearError({ redirect: localePath('/') });
</script>

<template>
  <NuxtLayout>
    <section class="relative overflow-hidden bg-navy-gradient py-28 text-center text-white">
      <div class="pointer-events-none absolute inset-0 bg-pattern-dots bg-dots" />
      <div class="container relative">
        <p class="font-display text-8xl font-extrabold text-gold-400 sm:text-9xl">{{ error.statusCode }}</p>
        <h1 class="mt-4 text-2xl font-bold !text-white sm:text-3xl">
          {{ error.statusCode === 404 ? $t('common.notFound') : $t('common.error') }}
        </h1>
        <p class="mx-auto mt-3 max-w-lg text-white/70">{{ error.statusCode === 404 ? $t('common.notFoundText') : error.message }}</p>
        <button type="button" class="btn-gold mt-8" @click="handleError">{{ $t('common.goHome') }}</button>
      </div>
    </section>
  </NuxtLayout>
</template>
