<script setup lang="ts">
import type { HomeNavigationItem } from '../../types/home/home_page.types'
import HomeNavigationItemLink from './home_navigation_item.vue'
import { computed } from 'vue'

const props = defineProps<{
  items: readonly HomeNavigationItem[]
  label: string
}>()

const pageItems = computed<readonly HomeNavigationItem[]>(() =>
  props.items.filter((item) => item.key !== 'support'),
)
</script>

<template>
  <nav class="home-primary-nav" :aria-label="label">
    <ul class="home-primary-nav__list">
      <HomeNavigationItemLink
        v-for="item in pageItems"
        :key="item.key"
        class="home-primary-nav__item"
        :item-key="item.key"
        :label="item.label"
        :href="item.href"
        :is-active="item.isActive"
      />
    </ul>
  </nav>
</template>

<style scoped>
.home-primary-nav__list {
  display: flex;
  width: 660px;
  max-width: 100%;
  align-items: center;
  gap: 12px;
}

.home-primary-nav__item {
  min-width: 0;
  flex: 0 1 212.667px;
}

.home-primary-nav__item:first-child {
  flex-basis: 210.667px;
}
</style>
