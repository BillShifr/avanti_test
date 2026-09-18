<script setup lang="ts">
import type { HomePendingStep } from '../../types/home/home_page.types'
import lockIcon from '../../../images/home/shared/lock_white.svg'
import arrowWhite from '../../../images/home/shared/arrow_white.svg'

defineProps<{
  title: string
  subtitle: string
  badgeLabel: string
  compactBadgeLabel: string
  href: string
  linkLabel: string
  pendingSteps: readonly HomePendingStep[]
}>()
</script>

<template>
  <section class="home-banner" :aria-label="title">
    <span class="home-banner__lock">
      <img :src="lockIcon" alt="" aria-hidden="true" />
    </span>

    <h2 class="home-banner__title">{{ title }}</h2>

    <p class="home-banner__subtitle">{{ subtitle }}</p>

    <div class="home-banner__footer">
      <ul class="home-banner__checks">
        <li v-for="step in pendingSteps" :key="step.key" class="home-banner__check">
          <span class="home-banner__box" aria-hidden="true" />
          <span>{{ step.label }}</span>
        </li>
      </ul>
      <p class="home-banner__badge">
        <span class="home-banner__badge-full">{{ badgeLabel }}</span>
        <span class="home-banner__badge-compact">{{ compactBadgeLabel }}</span>
      </p>
    </div>

    <a class="home-banner__action" :href="href" :aria-label="linkLabel">
      <img :src="arrowWhite" alt="" aria-hidden="true" />
    </a>
  </section>
</template>

<style scoped>
.home-banner {
  display: grid;
  box-sizing: border-box;
  padding: 16px;
  border-radius: var(--home-radius-card);
  background-color: var(--home-surface-accent-soft);
  box-shadow: inset 0 0 0 1px var(--home-brand);
  font-family: var(--home-font-family-banner);
  gap: 2px 12px;
  grid-template-areas:
    'lock title'
    'lock subtitle'
    'footer footer';
  grid-template-columns: 32px 1fr;
}

.home-banner__lock {
  display: flex;
  width: 32px;
  height: 32px;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--home-brand);
  grid-area: lock;
}

.home-banner__lock img {
  width: 14.222px;
  height: 14.222px;
}

.home-banner__title {
  max-width: 250px;
  color: var(--home-text-strong);
  font-size: 13px;
  font-weight: var(--home-weight-semibold);
  grid-area: title;
  line-height: 17px;
}

.home-banner__subtitle {
  color: var(--home-text-muted);
  font-size: 11px;
  font-weight: var(--home-weight-medium);
  grid-area: subtitle;
  line-height: 14px;
}

.home-banner__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 10px;
  gap: 12px;
  grid-area: footer;
}

.home-banner__checks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-banner__check {
  display: flex;
  align-items: center;
  color: var(--home-text-strong);
  font-size: 13px;
  font-weight: var(--home-weight-medium);
  gap: 8px;
  line-height: 17px;
}

.home-banner__box {
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border: 1px solid var(--home-brand);
  border-radius: var(--home-radius-checkbox);
  background-color: var(--home-surface-card);
  flex: none;
}

.home-banner__badge {
  padding: 4px 12px;
  border-radius: var(--home-radius-pill);
  background-color: var(--home-brand);
  color: var(--home-text-inverse);
  font-size: 11px;
  font-weight: var(--home-weight-bold);
  letter-spacing: 0.03em;
  line-height: 14px;
  white-space: nowrap;
  flex: none;
}

.home-banner__badge-full {
  display: none;
}

.home-banner__action {
  display: none;
}

@media (width >= 768px) {
  .home-banner {
    align-items: center;
    padding: 16px 20px;
    box-shadow: inset 0 0 0 1px var(--home-border-accent);
    gap: 6px 16px;
    grid-template-areas:
      'lock title    badge  action'
      'lock subtitle subtitle action'
      'lock checks   checks action';
    grid-template-columns: 44px 1fr auto 36px;
  }

  .home-banner__lock {
    width: 44px;
    height: 44px;
    align-self: start;
    box-shadow: var(--home-shadow-round-icon);
  }

  .home-banner__lock img {
    width: 20px;
    height: 20px;
  }

  .home-banner__title {
    max-width: none;
    line-height: 17px;
  }

  .home-banner__subtitle {
    font-size: 12px;
    line-height: 16px;
  }

  .home-banner__footer {
    display: contents;
  }

  .home-banner__checks {
    gap: 6px;
    grid-area: checks;
  }

  .home-banner__check {
    gap: 8px;
  }

  .home-banner__box {
    width: 18px;
    height: 18px;
  }

  .home-banner__badge {
    align-self: center;
    grid-area: badge;
  }

  .home-banner__badge-full {
    display: inline;
  }

  .home-banner__badge-compact {
    display: none;
  }

  .home-banner__action {
    display: flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--home-brand);
    box-shadow: var(--home-shadow-round-action);
    grid-area: action;
  }

  .home-banner__action img {
    width: 16px;
    height: 16px;
  }
}
</style>
