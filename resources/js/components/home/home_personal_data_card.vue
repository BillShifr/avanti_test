<script setup lang="ts">
import type { HomeDataRow } from '../../types/home/home_page.types'
import HomeDataRowItem from './home_data_row.vue'

defineProps<{
  title: string
  rows: readonly HomeDataRow[]
}>()
</script>

<template>
  <section class="home-personal" :aria-label="title">
    <h2 class="home-personal__title">{{ title }}</h2>
    <dl class="home-personal__list">
      <HomeDataRowItem v-for="row in rows" :key="row.key" :label="row.label" :value="row.value" />
    </dl>
  </section>
</template>

<style scoped>
.home-personal {
  display: flex;
  height: 131px; /* Figma node 1:148 */
  box-sizing: border-box;
  flex-direction: column;
  padding: 24px;
  border-radius: var(--home-radius-card);
  background-color: var(--home-surface-card);
  box-shadow: inset 0 0 0 1px var(--home-border-neutral);
  gap: 16px;
}

.home-personal__title {
  color: var(--home-text-strong);
  font-size: 15px;
  font-weight: var(--home-weight-semibold);
  line-height: 18px;
}

.home-personal__list {
  display: flex;
  flex-direction: column;
  margin: 0;
  gap: 12px;
}
</style>
