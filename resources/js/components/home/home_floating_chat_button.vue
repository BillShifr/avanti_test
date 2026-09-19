<script setup lang="ts">
import { computed } from 'vue'
import { formatBadgeCount } from '../../utils/home/home_currency_formatter'

const props = defineProps<{
  href: string
  label: string
  avatarUrl: string
  unreadCount: number
}>()

const hasBadge = computed<boolean>(() => props.unreadCount > 0)
const badgeLabel = computed<string>(() => formatBadgeCount(props.unreadCount))
const accessibleName = computed<string>(() =>
  hasBadge.value ? `${props.label}, непрочитанных сообщений: ${props.unreadCount}` : props.label,
)
</script>

<template>
  <a class="home-chat" :href="href" :aria-label="accessibleName">
    <img
      class="home-chat__avatar"
      :src="avatarUrl"
      alt=""
      aria-hidden="true"
      width="128"
      height="128"
    />
    <span v-if="hasBadge" class="home-chat__badge" aria-hidden="true">{{ badgeLabel }}</span>
  </a>
</template>

<style scoped>
.home-chat {
  position: fixed;
  z-index: var(--home-z-floating-chat);
  right: 19.111px; /* Figma node 270:8193 */
  bottom: calc(95.9px + env(safe-area-inset-bottom));
  display: block;
  width: 56.889px;
  height: 56.889px;
}

.home-chat__avatar {
  width: 56.889px;
  height: 56.889px;
  box-sizing: border-box;
  /* Округление Figma 1.778 px до device-pixel на mobile viewport. */
  border: 2px solid var(--home-brand);
  border-radius: 50%;
  box-shadow: var(--home-shadow-chat);
  object-fit: cover;
}

.home-chat__badge {
  position: absolute;
  top: -14.222px;
  left: 39.111px;
  display: flex;
  width: 28.444px;
  height: 28.444px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--home-danger-deep);
  color: var(--home-text-inverse);
  font-size: 17.778px;
  font-weight: var(--home-weight-bold);
  line-height: 22px;
}

@media (width >= 768px) {
  .home-chat {
    display: none;
  }
}
</style>
