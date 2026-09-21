<script setup lang="ts">
import type { HomeNavigationKey } from '../../types/home/home_page.types'
import { computed } from 'vue'
import navHome from '../../../images/home/mobile/nav_home.svg'
import navDocuments from '../../../images/home/mobile/nav_documents.svg'
import navProfile from '../../../images/home/mobile/nav_profile.svg'
import chatBubble from '../../../images/home/shared/chat_bubble.svg'

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

const ICONS: Readonly<Record<HomeNavigationKey, NavigationIcon>> = {
  home: { source: navHome, width: 14.445, height: 15.186 },
  documents: { source: navDocuments, width: 12.962, height: 15.927 },
  profile: { source: navProfile, width: 11.483, height: 14.445 },
  support: { source: chatBubble, width: 15.273, height: 15.273 },
}

const icon = computed<NavigationIcon>(() => ICONS[props.itemKey])
</script>

<template>
  <li class="home-bottom-item">
    <a
      class="home-bottom-item__link"
      :class="{
        'home-bottom-item__link--active': isActive,
        'home-bottom-item__link--support': itemKey === 'support',
      }"
      :href="href"
      :aria-current="isActive ? 'page' : undefined"
    >
      <span class="home-bottom-item__icon">
        <img
          :src="icon.source"
          alt=""
          aria-hidden="true"
          :width="icon.width"
          :height="icon.height"
        />
      </span>
      <span class="home-bottom-item__label">{{ label }}</span>
    </a>
  </li>
</template>

<style scoped>
.home-bottom-item__link {
  position: relative;
  display: flex;
  height: 41px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--home-radius-control);
  color: var(--home-text-strong);
  font-size: 14px;
  font-weight: var(--home-weight-medium);
  gap: 4px;
  line-height: 17px;
}

.home-bottom-item__link::after {
  position: absolute;
  content: '';
  inset: -2px -6px;
}

.home-bottom-item__link--active {
  color: var(--home-brand);
  font-weight: 520;
}

.home-bottom-item__icon {
  display: flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
}

.home-bottom-item__icon img {
  width: auto;
  height: auto;
}

.home-bottom-item__link--support {
  width: 108px;
  height: 43px;
  box-sizing: border-box;
  padding: 4px 16px;
  background-color: var(--home-brand);
  color: var(--home-text-inverse);
  font-size: 12px;
  font-weight: var(--home-weight-semibold);
  line-height: 15px;
}

.home-bottom-item__link--support .home-bottom-item__label {
  width: 76px;
  text-align: left;
}

.home-bottom-item__link--support .home-bottom-item__icon {
  width: 16px;
  height: 16px;
}

.home-bottom-item__link--support .home-bottom-item__icon img {
  width: 13.091px;
  height: 13.091px;
}
</style>
