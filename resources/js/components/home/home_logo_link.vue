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

  --home-tracking: -0.05em;

  letter-spacing: var(--home-tracking);
  text-indent: calc(var(--home-tracking) / 2);
  white-space: nowrap;
}

.home-logo__mark {
  flex: none;
}

.home-logo--desktop {
  width: 152.01px;
  height: 39px;
  gap: 12px;
  font-size: 32px;
  line-height: 39px;
}

.home-logo--desktop .home-logo__mark {
  width: 48.147px;
  height: 37.566px;
}

.home-logo--mobile {
  width: 104px;
  height: 29px;
  gap: 6px;
  align-items: flex-end;
  color: var(--home-text-strong);
  font-size: 22px;
  line-height: 27px;
}

.home-logo--mobile .home-logo__mark {
  align-self: flex-start;
  width: 34px;
  height: 26px;
}
</style>
