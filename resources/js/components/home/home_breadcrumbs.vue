<script setup lang="ts">
import type { HomeBreadcrumb } from '../../types/home/home_page.types'

defineProps<{
  items: readonly HomeBreadcrumb[]
  label: string
}>()
</script>

<template>
  <nav class="home-breadcrumbs" :aria-label="label">
    <ol class="home-breadcrumbs__list">
      <li v-for="(item, index) in items" :key="item.label" class="home-breadcrumbs__item">
        <span v-if="index > 0" class="home-breadcrumbs__separator" aria-hidden="true">/</span>
        <a v-if="item.href" class="home-breadcrumbs__link" :href="item.href">{{ item.label }}</a>
        <span v-else class="home-breadcrumbs__current">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.home-breadcrumbs__list {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 17px;
}

.home-breadcrumbs__item {
  display: flex;
  align-items: center;
}

.home-breadcrumbs__separator {
  padding: 0 8px;
  color: var(--home-text-subtle);
  font-weight: var(--home-weight-medium);
}

.home-breadcrumbs__link {
  color: var(--home-text-muted);
  font-weight: var(--home-weight-medium);
}

.home-breadcrumbs__current {
  color: var(--home-text-strong);
  font-weight: var(--home-weight-semibold);
}
</style>
