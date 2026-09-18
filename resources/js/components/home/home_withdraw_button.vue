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
    <img class="home-withdraw__icon" :src="bankIcon" alt="" aria-hidden="true" />
    <span class="home-withdraw__label">{{ label }}</span>
    <img class="home-withdraw__arrow" :src="arrowThin" alt="" aria-hidden="true" />
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

.home-withdraw--disabled {
  cursor: default;
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
  letter-spacing: 0.002em;
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
