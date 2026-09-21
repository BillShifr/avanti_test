<script setup lang="ts">
import { computed } from 'vue'
import chatBubble from '../../../images/home/shared/chat_bubble.svg'
import { formatBadgeCount } from '../../utils/home/home_currency_formatter'

const props = defineProps<{
  label: string
  href: string
  unreadCount: number
}>()

const hasBadge = computed<boolean>(() => props.unreadCount > 0)
const badgeLabel = computed<string>(() => formatBadgeCount(props.unreadCount))
const accessibleName = computed<string>(() =>
  hasBadge.value ? `${props.label}, непрочитанных сообщений: ${props.unreadCount}` : props.label,
)
</script>

<template>
  <a class="home-support" :href="href" :aria-label="accessibleName">
    <span class="home-support__icon">
      <img :src="chatBubble" alt="" aria-hidden="true" width="15" height="15" />
    </span>
    <span class="home-support__label">{{ label }}</span>
    <span v-if="hasBadge" class="home-support__badge" aria-hidden="true">{{ badgeLabel }}</span>
  </a>
</template>

<style scoped>
.home-support {
  position: relative;
  display: inline-flex;
  width: 156px;
  height: 39px;
  box-sizing: border-box;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--home-radius-control);
  background-color: var(--home-brand);
  color: var(--home-text-inverse);
  font-size: 16px;
  font-weight: var(--home-weight-semibold);
  gap: 12px;
  line-height: 19px;
}

.home-support__icon {
  display: flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  flex: none;
}

.home-support__icon img {
  width: 15.273px;
  height: 15.273px;
}

.home-support__badge {
  position: absolute;
  top: -10px;
  right: -11px;
  display: flex;
  width: 22px;
  height: 22px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--home-surface-card);
  border-radius: 50%;
  background-color: var(--home-danger);
  font-size: 11px;
  font-weight: var(--home-weight-bold);
  line-height: 13px;
}
</style>
