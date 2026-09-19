<script setup lang="ts">
import { computed } from 'vue'
import bellIcon from '../../../images/home/mobile/bell.svg'
import { formatBadgeCount } from '../../utils/home/home_currency_formatter'

const props = withDefaults(
  defineProps<{
    count: number
    label?: string
  }>(),
  { label: 'Уведомления' },
)

const emit = defineEmits<{ open: [] }>()

const hasBadge = computed<boolean>(() => props.count > 0)
const badgeLabel = computed<string>(() => formatBadgeCount(props.count))
const accessibleName = computed<string>(() =>
  hasBadge.value ? `${props.label}, новых: ${props.count}` : props.label,
)

function handleClick(): void {
  emit('open')
}
</script>

<template>
  <button
    class="home-notifications"
    type="button"
    :aria-label="accessibleName"
    @click="handleClick"
  >
    <img
      class="home-notifications__icon"
      :src="bellIcon"
      alt=""
      aria-hidden="true"
      width="21"
      height="26"
    />
    <span v-if="hasBadge" class="home-notifications__badge" aria-hidden="true">{{
      badgeLabel
    }}</span>
  </button>
</template>

<style scoped>
.home-notifications {
  position: relative;
  display: flex;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 6.333px; /* Figma node 83:2086 */
  flex: none;
}

.home-notifications::after {
  position: absolute;
  content: '';
  inset: -3px;
}

/*
 * Размеры — полный контур экспортированного вектора (Figma 83:2084 даёт
 * геометрию 19 × 23.75 px, обводка добавляет по 1.187 px с каждой стороны).
 */
.home-notifications__icon {
  width: 21.375px;
  height: 26.125px;
}

.home-notifications__badge {
  position: absolute;
  top: 2.375px;
  left: 22.562px;
  display: flex;
  width: 12.667px;
  height: 12.667px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 1.152px solid var(--home-surface-card);
  border-radius: 50%;
  background-color: var(--home-danger);
  color: var(--home-text-inverse);
  font-size: 6.333px;
  font-weight: var(--home-weight-bold);
  line-height: 8px;
}
</style>
