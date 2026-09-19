<script setup lang="ts">
import { computed } from 'vue'
import bankIcon from '../../../images/home/shared/bank_teal.svg'
import arrowThin from '../../../images/home/shared/arrow_thin_teal.svg'

const props = withDefaults(
  defineProps<{
    label: string
    isEnabled: boolean
    hint?: string
  }>(),
  { hint: '' },
)

const emit = defineEmits<{ withdraw: [] }>()

const isDisabled = computed<boolean>(() => !props.isEnabled)

function handleWithdraw(): void {
  if (isDisabled.value) {
    return
  }

  emit('withdraw')
}
</script>

<template>
  <button
    class="home-withdraw"
    :class="{ 'home-withdraw--disabled': isDisabled }"
    type="button"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-describedby="hint ? 'home-withdraw-hint' : undefined"
    @click="handleWithdraw"
  >
    <img
      class="home-withdraw__icon"
      :src="bankIcon"
      alt=""
      aria-hidden="true"
      width="24"
      height="24"
    />
    <span class="home-withdraw__label">{{ label }}</span>
    <img
      class="home-withdraw__arrow"
      :src="arrowThin"
      alt=""
      aria-hidden="true"
      width="18"
      height="22"
    />
  </button>
</template>

<style scoped>
.home-withdraw {
  display: flex;
  width: 100%;
  height: 46px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 9px; /* Figma node 57:1042 */
  background-color: var(--home-surface-page);
}

/*
 * Недоступная CTA: Figma 1:117 гасит сам фрейм до 0.5, а в растровых эталонах
 * содержимое приглушено ещё раз — иконка, подпись и стрелка идут поверх
 * подложки с той же прозрачностью 0.5.
 */
.home-withdraw--disabled {
  cursor: default;
  opacity: 0.5;
}

.home-withdraw--disabled > * {
  opacity: 0.5;
}

.home-withdraw__icon {
  width: 20px;
  height: 20px;
  flex: none;
}

.home-withdraw__label {
  margin-left: 12px; /* Figma node 57:1043 — зазор иконка → текст */
  background-image: var(--home-brand-gradient);
  background-clip: text;
  color: transparent;
  font-size: 16px;
  font-weight: var(--home-weight-semibold);

  --home-tracking: 0.002em;

  letter-spacing: var(--home-tracking);
  text-indent: calc(var(--home-tracking) / 2);
  line-height: 19px;
}

.home-withdraw__arrow {
  margin-left: 4px;
  width: 15px;
  height: 18px;
  flex: none;
  opacity: 0.85;
}

@media (width >= 768px) {
  .home-withdraw {
    height: 64px;
    padding: 18px 24px;
    border-radius: 14px; /* Figma node 1:117 */
  }

  .home-withdraw__icon {
    width: 28px;
    height: 28px;
  }

  .home-withdraw__label {
    margin-left: 10px;
    font-size: 18px;
    line-height: 22px;
  }

  .home-withdraw__arrow {
    width: 18px;
    height: 22px;
    margin-left: 12px;
  }
}
</style>
