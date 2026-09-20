<script setup lang="ts">
import type { HomeUser } from '../../types/home/home_page.types'

withDefaults(
  defineProps<{
    user: HomeUser
    variant?: 'desktop' | 'mobile'
  }>(),
  { variant: 'desktop' },
)
</script>

<template>
  <div class="home-user" :class="`home-user--${variant}`">
    <img
      class="home-user__avatar"
      :src="user.avatarUrl"
      :alt="`Фото профиля: ${user.fullName}`"
      width="96"
      height="96"
      decoding="async"
    />
    <p v-if="variant === 'desktop'" class="home-user__text">
      <span class="home-user__name">{{ user.fullName }}</span>
      <span class="home-user__email">{{ user.email }}</span>
    </p>
    <p v-else class="home-user__text">
      <span class="home-user__initials">{{ user.initials }}</span>
    </p>
  </div>
</template>

<style scoped>
.home-user {
  display: flex;
  align-items: center;
}

.home-user__avatar {
  border-radius: 50%;
  object-fit: cover;
  flex: none;
}

.home-user__text {
  display: flex;
  flex-direction: column;
}

.home-user--desktop {
  gap: 12px;
}

.home-user--desktop .home-user__avatar {
  width: 40px;
  height: 40px;
}

.home-user__name {
  color: var(--home-text-strong);
  font-size: 14px;
  font-weight: var(--home-weight-semibold);
  line-height: 17px;
}

.home-user__email {
  color: var(--home-text-muted);
  font-size: 12px;
  font-weight: var(--home-weight-regular);
  line-height: 15px;
}

.home-user--mobile {
  gap: 6px;
}

/* Figma 57:2063 задаёт тексту фиксированную ширину 21px, шире собственных
   «чернил» (20.48px); без неё группа целиком уезжает на 1px вправо. */
.home-user--mobile .home-user__text {
  width: 21px;
}

.home-user--mobile .home-user__avatar {
  width: 32px;
  height: 32px;
  border: 1px solid var(--home-brand);
}

.home-user__initials {
  color: var(--home-text-strong);
  font-size: 13px;
  font-weight: var(--home-weight-semibold);
  line-height: 16px;
}
</style>
