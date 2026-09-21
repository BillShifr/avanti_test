<script setup lang="ts">
import type { HomeNavigationItem } from '../../types/home/home_page.types'
import HomeBottomNavigationItem from './home_bottom_navigation_item.vue'

defineProps<{
  items: readonly HomeNavigationItem[]
  label: string
}>()
</script>

<template>
  <nav class="home-bottom-nav" :aria-label="label">
    <ul class="home-bottom-nav__list">
      <HomeBottomNavigationItem
        v-for="item in items"
        :key="item.key"
        :item-key="item.key"
        :label="item.label"
        :href="item.href"
        :is-active="item.isActive"
      />
    </ul>
  </nav>
</template>

<style scoped>
.home-bottom-nav {
  position: fixed;
  z-index: var(--home-z-bottom-nav);
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: content-box;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: var(--home-surface-card);
  box-shadow:
    inset 0 2px 0 var(--home-brand),
    inset 0 -3px 0 var(--home-brand),
    inset 3px 0 0 var(--home-brand),
    inset -3px 0 0 var(--home-brand);
}

.home-bottom-nav__list {
  display: flex;
  height: var(--home-bottom-nav-height);
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

@media (width >= 768px) {
  .home-bottom-nav {
    display: none;
  }
}
</style>
