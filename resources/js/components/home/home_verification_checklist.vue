<script setup lang="ts">
import type { HomeVerificationItem } from '../../types/home/home_page.types'
import HomeChecklistItem from './home_checklist_item.vue'
import HomeChecklistToggle from './home_checklist_toggle.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  eyebrow: string
  title: string
  items: readonly HomeVerificationItem[]
  progressLabel: string
}>()

const isExpanded = ref<boolean>(true)

const segmentClasses = computed<readonly string[]>(() =>
  props.items.map((item) => `home-checklist__segment--${item.state}`),
)

function handleToggle(): void {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <section class="home-checklist" :aria-label="title">
    <div class="home-checklist__header">
      <div class="home-checklist__heading">
        <p class="home-checklist__eyebrow">{{ eyebrow }}</p>
        <h2 class="home-checklist__title">{{ title }}</h2>
      </div>
      <HomeChecklistToggle
        :is-expanded="isExpanded"
        controls="home-checklist-items"
        :label="title"
        @toggle="handleToggle"
      />
    </div>

    <ul v-show="isExpanded" id="home-checklist-items" class="home-checklist__items">
      <HomeChecklistItem
        v-for="item in items"
        :key="item.key"
        :title="item.title"
        :description="item.description"
        :state="item.state"
        :icon-key="item.iconKey"
        :href="item.href"
      />
    </ul>

    <p class="home-checklist__progress" role="img" :aria-label="progressLabel">
      <span
        v-for="(item, index) in items"
        :key="item.key"
        class="home-checklist__segment"
        :class="segmentClasses[index]"
        aria-hidden="true"
      />
    </p>
  </section>
</template>

<style scoped>
.home-checklist {
  overflow: hidden;
  box-sizing: border-box;
  border-radius: var(--home-radius-card);
  background-color: var(--home-surface-card);
  box-shadow:
    inset 0 0 0 1px var(--home-border-neutral),
    var(--home-shadow-checklist);
}

.home-checklist__header {
  display: flex;
  height: 66px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--home-border-row);
  gap: 16px;
}

.home-checklist__heading {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.home-checklist__eyebrow {
  color: var(--home-brand);
  font-size: 11px;
  font-weight: var(--home-weight-bold);

  --home-tracking: 0.05em;

  letter-spacing: var(--home-tracking);
  text-indent: calc(var(--home-tracking) / 2);
  line-height: 14px;
}

.home-checklist__title {
  color: var(--home-text-strong);
  font-size: 13px;
  font-weight: var(--home-weight-semibold);
  line-height: 16px;
}

.home-checklist__items > :not(:first-child) {
  height: 69px;
  border-top: 1px solid var(--home-border-row);
}

.home-checklist__progress {
  display: flex;
  height: 33px;
  box-sizing: border-box;
  align-items: flex-start;
  padding: 12px 16px 0;
  border-top: 1px solid var(--home-border-row);
  gap: 4px;
}

.home-checklist__segment {
  height: 4px;
  border-radius: var(--home-radius-pill);
  background-color: var(--home-border-neutral);
  flex: 1;
}

.home-checklist__segment--complete {
  background-color: var(--home-brand);
}

.home-checklist__segment--current {
  background-image: linear-gradient(90deg, #2491aa 0%, #e4e4e7 100%);
}

@media (width >= 768px) {
  .home-checklist__items > :not(:first-child) {
    height: 77px;
  }
}
</style>
