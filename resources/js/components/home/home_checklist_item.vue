<script setup lang="ts">
import type { HomeVerificationIconKey, HomeProgressState } from '../../types/home/home_page.types'
import { computed } from 'vue'
import chartWhite from '../../../images/home/shared/chart_white.svg'
import shieldWhite from '../../../images/home/shared/shield_white.svg'
import userWhite from '../../../images/home/shared/user_white.svg'
import uploadTeal from '../../../images/home/shared/upload_teal.svg'
import penGrey from '../../../images/home/shared/pen_grey.svg'
import checkWhiteBold from '../../../images/home/shared/check_white_bold.svg'
import arrowWhite from '../../../images/home/shared/arrow_white.svg'
import arrowGrey from '../../../images/home/shared/arrow_grey.svg'

const props = defineProps<{
  title: string
  description: string
  state: HomeProgressState
  iconKey: HomeVerificationIconKey
  href?: string | undefined
}>()

const LEADING_ICONS: Readonly<Record<HomeVerificationIconKey, string>> = {
  simulation: chartWhite,
  approval: shieldWhite,
  account: userWhite,
  documents: uploadTeal,
  signature: penGrey,
}

const STATUS_ICONS: Readonly<Record<HomeProgressState, string>> = {
  complete: checkWhiteBold,
  current: arrowWhite,
  pending: arrowGrey,
}

const leadingIcon = computed<string>(() => LEADING_ICONS[props.iconKey])
const statusIcon = computed<string>(() => STATUS_ICONS[props.state])
const isActionable = computed<boolean>(() => props.state !== 'complete' && Boolean(props.href))
</script>

<template>
  <li class="home-check" :class="`home-check--${state}`">
    <span class="home-check__icon">
      <img :src="leadingIcon" alt="" aria-hidden="true" />
    </span>

    <span class="home-check__text">
      <span class="home-check__title">{{ title }}</span>
      <span class="home-check__description">{{ description }}</span>
    </span>

    <a
      v-if="isActionable"
      class="home-check__status"
      :href="href"
      :aria-label="`${title}: ${description}`"
    >
      <img :src="statusIcon" alt="" aria-hidden="true" />
    </a>
    <span v-else class="home-check__status">
      <img :src="statusIcon" alt="" aria-hidden="true" />
    </span>
  </li>
</template>

<style scoped>
.home-check {
  display: flex;
  height: 68px;
  box-sizing: border-box;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.home-check--current {
  background-color: var(--home-surface-accent-soft);
}

.home-check__icon {
  display: flex;
  width: 36px;
  height: 36px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex: none;
}

.home-check__icon img {
  width: 16px;
  height: 16px;
}

.home-check--complete .home-check__icon {
  background-color: var(--home-brand);
}

.home-check--current .home-check__icon {
  border: 2px solid var(--home-brand);
  background-color: var(--home-surface-card);
}

.home-check--pending .home-check__icon {
  background-color: var(--home-surface-muted);
}

.home-check__text {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.home-check__title {
  color: var(--home-text-strong);
  font-size: 13px;
  font-weight: var(--home-weight-semibold);
  line-height: 16px;
}

.home-check--current .home-check__title {
  font-weight: var(--home-weight-bold);
}

.home-check--pending .home-check__title {
  color: var(--home-text-muted);
  font-weight: var(--home-weight-medium);
}

.home-check__description {
  color: var(--home-brand);
  font-size: 11px;
  font-weight: var(--home-weight-medium);
  line-height: 13px;
}

.home-check--current .home-check__description {
  font-weight: var(--home-weight-semibold);
}

.home-check--pending .home-check__description {
  color: var(--home-text-subtle);
  font-weight: var(--home-weight-regular);
}

.home-check__status {
  display: flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--home-brand);
  flex: none;
}

.home-check__status img {
  width: 10px;
  height: 10px;
}

.home-check--current .home-check__status,
.home-check--pending .home-check__status {
  width: 28px;
  height: 28px;
}

.home-check--current .home-check__status img,
.home-check--pending .home-check__status img {
  width: 14px;
  height: 14px;
}

.home-check--pending .home-check__status {
  background-color: var(--home-surface-muted);
}

@media (width >= 768px) {
  .home-check {
    height: 76px;
  }

  .home-check--current {
    background-color: var(--home-surface-card);
  }

  .home-check__icon {
    width: 44px;
    height: 44px;
  }

  .home-check__icon img {
    width: 19.556px;
    height: 19.556px;
  }

  .home-check--current .home-check__icon {
    border-width: 2.444px;
  }

  .home-check__title {
    font-size: 14px;
    line-height: 17px;
  }

  .home-check__status,
  .home-check--current .home-check__status,
  .home-check--pending .home-check__status {
    width: 28px;
    height: 28px;
  }

  .home-check__status img {
    width: 12.727px;
    height: 12.727px;
  }

  .home-check--current .home-check__status img,
  .home-check--pending .home-check__status img {
    width: 14px;
    height: 14px;
  }
}
</style>
