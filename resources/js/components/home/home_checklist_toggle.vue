<script setup lang="ts">
import { computed } from 'vue'
import chevronUp from '../../../images/home/shared/chevron_up_grey.svg'

const props = defineProps<{
  isExpanded: boolean
  controls: string
  label: string
}>()

const emit = defineEmits<{ toggle: [] }>()

const accessibleName = computed<string>(() =>
  props.isExpanded ? `Свернуть: ${props.label}` : `Развернуть: ${props.label}`,
)

function handleToggle(): void {
  emit('toggle')
}
</script>

<template>
  <button
    class="home-checklist-toggle"
    :class="{ 'home-checklist-toggle--collapsed': !isExpanded }"
    type="button"
    :aria-expanded="isExpanded"
    :aria-controls="controls"
    :aria-label="accessibleName"
    @click="handleToggle"
  >
    <img :src="chevronUp" alt="" aria-hidden="true" />
  </button>
</template>

<style scoped>
.home-checklist-toggle {
  position: relative;
  display: flex;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 0.625px solid var(--home-border-neutral);
  border-radius: 5px;
  background-color: var(--home-surface-page);
  flex: none;
}

.home-checklist-toggle::after {
  position: absolute;
  content: '';
  inset: -12px;
}

.home-checklist-toggle img {
  width: 8.75px;
  height: 8.75px;
}

.home-checklist-toggle--collapsed img {
  transform: rotate(180deg);
}

@media (width >= 768px) {
  .home-checklist-toggle {
    width: 32px;
    height: 32px;
    border-width: 1px;
    border-radius: var(--home-radius-control);
  }

  .home-checklist-toggle::after {
    inset: -6px;
  }

  .home-checklist-toggle img {
    width: 14px;
    height: 14px;
  }
}
</style>
