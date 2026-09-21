<script setup lang="ts">
import type { HomeNavigationKey } from '../../types/home/home_page.types'
import navHome from '../../../images/home/desktop/nav_home.svg'
import navDocuments from '../../../images/home/desktop/nav_documents.svg'
import navProfile from '../../../images/home/desktop/nav_profile.svg'
import { computed } from 'vue'

const props = defineProps<{
  itemKey: HomeNavigationKey
  label: string
  href: string
  isActive: boolean
}>()

interface NavigationIcon {
  readonly source: string
  readonly width: number
  readonly height: number
}

const ICONS: Readonly<Partial<Record<HomeNavigationKey, NavigationIcon>>> = {
  home: { source: navHome, width: 14, height: 14.667 },
  documents: { source: navDocuments, width: 12.667, height: 15.335 },
  profile: { source: navProfile, width: 11.335, height: 14.001 },
}

const icon = computed<NavigationIcon>(
  () => ICONS[props.itemKey] ?? { source: navProfile, width: 11.335, height: 14.001 },
)
</script>

<template>
  <li class="home-nav-item">
    <a
      class="home-nav-item__link"
      :class="{ 'home-nav-item__link--active': isActive }"
      :href="href"
      :aria-current="isActive ? 'page' : undefined"
    >
      <span class="home-nav-item__icon">
        <img
          :src="icon.source"
          alt=""
          aria-hidden="true"
          :width="icon.width"
          :height="icon.height"
        />
      </span>
      <span class="home-nav-item__label">{{ label }}</span>
    </a>
  </li>
</template>

<style scoped>
.home-nav-item {
  display: flex;
  min-width: 0;
}

.home-nav-item__link {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--home-radius-control);
  background-color: var(--home-surface-page);
  box-shadow: inset 0 0 0 1px var(--home-border-soft);
  color: var(--home-text-strong);
  font-size: 14px;
  font-weight: var(--home-weight-medium);
  gap: 12px;
  line-height: 17px;
}

.home-nav-item__link--active {
  background-color: var(--home-surface-accent-soft);
  box-shadow: none;
  color: var(--home-brand);
  font-weight: var(--home-weight-semibold);
}

.home-nav-item__icon {
  display: flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  flex: none;
}

.home-nav-item__icon img {
  width: auto;
  height: auto;
}

.home-nav-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
