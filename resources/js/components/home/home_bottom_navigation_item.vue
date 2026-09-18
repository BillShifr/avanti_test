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

const ICONS: Readonly<Record<HomeNavigationKey, string>> = {
  home: navHome,
  documents: navDocuments,
  profile: navProfile,
  support: chatBubble,
}

const iconSource = computed<string>(() => ICONS[props.itemKey])
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
        <img :src="iconSource" alt="" aria-hidden="true" />
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

/* В растровом эталоне 95:4429 подложка активного пункта не отрисована. */
.home-bottom-item__link--active {
  color: var(--home-brand);
  font-weight: var(--home-weight-semibold);
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
  width: 108px; /* Figma node 57:1765 — фиксированная ширина фрейма */
  height: 43px;
  box-sizing: border-box;
  padding: 4px 16px;
  background-color: var(--home-brand);
  color: var(--home-text-inverse);
  font-size: 12px;
  font-weight: var(--home-weight-semibold);
  line-height: 15px;
}

/* Figma 57:1769 — текстовый узел шириной 76 px с выключкой влево. */
.home-bottom-item__link--support .home-bottom-item__label {
  width: 76px;
  text-align: left;
}

.home-bottom-item__link--support .home-bottom-item__icon {
  width: 16px;
  height: 16px;
}

/* Figma 57:2047: геометрия 12 × 12 px, полный контур обводки — 13.091 px. */
.home-bottom-item__link--support .home-bottom-item__icon img {
  width: 13.091px;
  height: 13.091px;
}
</style>
