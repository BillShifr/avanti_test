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
/*
 * Figma 1:55 — узел шириной 140px, прижатый к правому краю шапки.
 * Ширина зафиксирована, чтобы строка отсчитывалась от левого края узла:
 * Figma округляет ширину авторазмерного текстового узла вверх до целого
 * пикселя, поэтому при выключке вправо погрешности трёх узлов
 * складывались и сдвигали «Piattaforma» на 2px.
 */
.home-breadcrumbs {
  width: 140px;
}

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

/* Figma 1:57 — узел «/» шириной 6px с отступами 8px, итого 22px. */
.home-breadcrumbs__separator {
  box-sizing: border-box;
  width: 22px;
  color: var(--home-text-subtle);
  text-align: center;
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
