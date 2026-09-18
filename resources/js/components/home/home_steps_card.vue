<script setup lang="ts">
import type { HomeOnboarding, HomeProgressState } from '../../types/home/home_page.types'
import HomeStepItem from './home_step_item.vue'
import { computed } from 'vue'

const props = defineProps<{
  onboarding: HomeOnboarding
  title: string
  completedLabel: string
  stateLabels: Readonly<Record<HomeProgressState, string>>
}>()

/** Отрезок после шага окрашен в бренд, только когда сам шаг завершён (Figma 1:73 / 1:96). */
const connectorClasses = computed<readonly string[]>(() =>
  props.onboarding.steps
    .slice(0, -1)
    .map((step) =>
      step.state === 'complete' ? 'home-steps__connector--done' : 'home-steps__connector--todo',
    ),
)
</script>

<template>
  <section class="home-steps" :aria-label="title">
    <div class="home-steps__header">
      <h2 class="home-steps__title">{{ title }}</h2>
      <p class="home-steps__counter">{{ completedLabel }}</p>
    </div>
    <ol class="home-steps__row">
      <template v-for="(step, index) in onboarding.steps" :key="step.key">
        <li
          v-if="index > 0"
          class="home-steps__connector"
          :class="connectorClasses[index - 1]"
          aria-hidden="true"
        >
          <span class="home-steps__line" />
        </li>
        <HomeStepItem
          :short-label="step.shortLabel"
          :label="step.label"
          :state="step.state"
          :state-label="stateLabels[step.state]"
        />
      </template>
    </ol>
  </section>
</template>

<style scoped>
.home-steps {
  box-sizing: border-box;
  padding: 16px;
  border-radius: var(--home-radius-card);
  background-color: var(--home-surface-card);
  box-shadow:
    inset 0 0 0 1px var(--home-border-soft),
    var(--home-shadow-steps);
}

.home-steps__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-steps__title {
  color: var(--home-text-strong);
  font-size: 10px;
  font-weight: var(--home-weight-bold);
  line-height: 12px;
}

.home-steps__counter {
  color: var(--home-text-muted);
  font-size: 10px;
  font-weight: var(--home-weight-medium);
  line-height: 12px;
}

.home-steps__row {
  display: flex;
  align-items: flex-start;
  height: 36px;
  margin-top: 12px;
}

.home-steps__connector {
  display: flex;
  min-width: 0;
  flex: 1;
  margin-top: 17px; /* Figma 57:1907 — линия проходит ниже центра круга */
}

.home-steps__line {
  width: 100%;
  height: 2px;
}

.home-steps__connector--done .home-steps__line {
  background-color: var(--home-brand);
}

.home-steps__connector--todo .home-steps__line {
  background-color: var(--home-border-strong);
}

@media (width >= 768px) {
  .home-steps {
    padding: 20px 24px;
  }

  .home-steps__title {
    font-size: 13px;
    line-height: 16px;
  }

  .home-steps__counter {
    font-size: 13px;
    line-height: 16px;
  }

  .home-steps__row {
    height: 58px;
    margin-top: 16px;
  }

  /* На десктопе линия заходит под круги: Figma 1:73 тянется от края круга до края. */
  .home-steps__line {
    width: calc(100% + 72px);
    margin-left: -36px;
  }
}
</style>
