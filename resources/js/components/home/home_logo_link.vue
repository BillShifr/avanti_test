<script setup lang="ts">
import logoMark from '../../../images/home/shared/logo_mark.svg'

withDefaults(
  defineProps<{
    href: string
    label?: string
    size?: 'desktop' | 'mobile'
  }>(),
  {
    label: 'Avanti',
    size: 'desktop',
  },
)
</script>

<template>
  <a class="home-logo" :class="`home-logo--${size}`" :href="href">
    <img class="home-logo__mark" :src="logoMark" alt="" aria-hidden="true" width="48" height="38" />
    <span class="home-logo__word">{{ label }}</span>
  </a>
</template>

<style scoped>
.home-logo {
  display: inline-flex;
  align-items: center;
  color: #000;
  font-weight: var(--home-weight-bold);
  letter-spacing: -0.05em;
  white-space: nowrap;
}

.home-logo__mark {
  flex: none;
}

.home-logo--desktop {
  width: 152.01px; /* Figma node 1:22 */
  height: 39px;
  gap: 12px;
  font-size: 32px;
  line-height: 39px;
}

.home-logo--desktop .home-logo__mark {
  width: 48.147px; /* Figma node 1:23 */
  height: 37.566px;
}

.home-logo--mobile {
  width: 104px; /* Figma node 18:970 */
  height: 29px;
  gap: 6px;
  color: var(--home-text-strong);
  font-size: 22px;
  line-height: 27px;
}

.home-logo--mobile .home-logo__mark {
  width: 34px; /* Figma node 18:972 */
  height: 26px;
}
</style>
