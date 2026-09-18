<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <div class="home-data-row">
    <dt class="home-data-row__label">{{ label }}</dt>
    <dd class="home-data-row__value">{{ value }}</dd>
  </div>
</template>

<style scoped>
.home-data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.home-data-row__label {
  color: var(--home-text-muted);
  font-size: 12px;
  font-weight: var(--home-weight-regular);
  line-height: 15px;
}

.home-data-row__value {
  margin: 0;
  color: var(--home-text-strong);
  font-size: 13px;
  font-weight: var(--home-weight-semibold);
  line-height: 16px;
  text-align: right;
}
</style>
