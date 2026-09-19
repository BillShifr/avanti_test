<script setup lang="ts">
import type { HomeProgressState } from '../../types/home/home_page.types'
import { computed } from 'vue'
import checkWhite from '../../../images/home/shared/check_white.svg'
import uploadTeal from '../../../images/home/shared/upload_teal.svg'
import penGrey from '../../../images/home/shared/pen_grey.svg'

const props = defineProps<{
  shortLabel: string
  label: string
  state: HomeProgressState
  stateLabel: string
}>()

const STATE_ICONS: Readonly<Record<HomeProgressState, string>> = {
  complete: checkWhite,
  current: uploadTeal,
  pending: penGrey,
}

const iconSource = computed<string>(() => STATE_ICONS[props.state])
</script>

<template>
  <li class="home-step" :class="`home-step--${state}`">
    <span class="home-step__circle">
      <img
        class="home-step__icon"
        :src="iconSource"
        alt=""
        aria-hidden="true"
        width="24"
        height="24"
      />
    </span>
    <span class="home-step__label">{{ shortLabel }}</span>
    <span class="home-step__sr">{{ label }} — {{ stateLabel }}</span>
  </li>
</template>

<style scoped>
.home-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Figma node 57:1918: в мобильной композиции текущий шаг приглушён. */
.home-step--current {
  opacity: 0.8;
}

/* Базовая композиция — мобильная (Figma 57:1902), десктоп переопределяется ниже. */
.home-step__circle {
  display: flex;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.home-step--complete .home-step__circle {
  background-color: var(--home-brand);
}

.home-step--current .home-step__circle {
  border: 2px solid var(--home-brand);
  background-color: var(--home-surface-accent-soft);
}

.home-step--pending .home-step__circle {
  border: 1.5px solid var(--home-border-strong);
  background-color: var(--home-surface-muted);
}

.home-step__label {
  margin-top: 4px;
  font-size: 10px;
  font-weight: var(--home-weight-semibold);
  line-height: 12px;
  text-align: center;
  white-space: nowrap;
}

.home-step--complete .home-step__label,
.home-step--current .home-step__label {
  color: var(--home-brand);
}

.home-step--pending .home-step__label {
  color: var(--home-text-subtle);
  font-weight: var(--home-weight-medium);
}

.home-step--current .home-step__label {
  font-weight: var(--home-weight-bold);
}

.home-step__sr {
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  clip-path: inset(50%);
  white-space: nowrap;
}

.home-step__icon {
  width: 12.857px;
  height: 12.857px;
}

.home-step--current .home-step__icon,
.home-step--pending .home-step__icon {
  width: 11.43px;
  height: 11.43px;
}

@media (width >= 768px) {
  .home-step {
    width: 108px; /* Figma node 1:67 */
  }

  /* Десктопный узел 1:90 приглушения не имеет. */
  .home-step--current {
    opacity: 1;
  }

  .home-step__circle {
    width: 36px;
    height: 36px;
  }

  .home-step__icon,
  .home-step--current .home-step__icon,
  .home-step--pending .home-step__icon {
    width: 16px;
    height: 16px;
  }

  .home-step__label {
    margin-top: 8px;
    font-size: 11px;
    line-height: 13px;
  }
}
</style>
