<script setup lang="ts">
import type { MenuItem } from '~/types/api';

const props = defineProps<{ item: Pick<MenuItem, 'url' | 'isExternal' | 'title'> }>();
const resolve = useMenuLink();
const link = computed(() => resolve(props.item));
</script>

<template>
  <NuxtLink
    v-if="link.to"
    :to="link.to"
    :external="link.external"
    :target="link.external ? '_blank' : undefined"
    :rel="link.external ? 'noopener noreferrer' : undefined"
  >
    <slot>{{ item.title }}</slot>
  </NuxtLink>
  <button v-else type="button">
    <slot>{{ item.title }}</slot>
  </button>
</template>
