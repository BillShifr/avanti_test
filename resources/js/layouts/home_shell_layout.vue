<script setup lang="ts">
import type {
  HomeBreadcrumb,
  HomeNavigationItem,
  HomeSupport,
  HomeUser,
} from '../types/home/home_page.types'
import HomeLogoLink from '../components/home/home_logo_link.vue'
import HomePrimaryNavigation from '../components/home/home_primary_navigation.vue'
import HomeSupportButton from '../components/home/home_support_button.vue'
import HomeNotificationsButton from '../components/home/home_notifications_button.vue'
import HomeUserSummary from '../components/home/home_user_summary.vue'
import HomeBreadcrumbs from '../components/home/home_breadcrumbs.vue'
import HomeBottomNavigation from '../components/home/home_bottom_navigation.vue'

defineProps<{
  user: HomeUser
  navigation: readonly HomeNavigationItem[]
  breadcrumbs: readonly HomeBreadcrumb[]
  support: HomeSupport
  notificationsCount: number
  homeHref: string
}>()

const emit = defineEmits<{ notifications: [] }>()

function handleNotifications(): void {
  emit('notifications')
}
</script>

<template>
  <div class="home-shell">
    <header class="home-shell__header">
      <div class="home-shell__top">
        <div class="home-shell__brand">
          <HomeLogoLink class="home-shell__logo-desktop" :href="homeHref" size="desktop" />
          <HomeLogoLink class="home-shell__logo-mobile" :href="homeHref" size="mobile" />
          <HomePrimaryNavigation
            class="home-shell__nav"
            :items="navigation"
            label="Основная навигация"
          />
        </div>
        <div class="home-shell__top-actions">
          <HomeNotificationsButton
            class="home-shell__bell"
            :count="notificationsCount"
            @open="handleNotifications"
          />
          <HomeUserSummary class="home-shell__user-mobile" :user="user" variant="mobile" />
          <HomeSupportButton
            class="home-shell__support"
            :label="support.label"
            :href="support.href"
            :unread-count="notificationsCount"
          />
        </div>
      </div>

      <div class="home-shell__meta">
        <HomeUserSummary :user="user" variant="desktop" />
        <HomeBreadcrumbs :items="breadcrumbs" label="Хлебные крошки" />
      </div>
    </header>

    <main class="home-shell__main">
      <div class="home-shell__column home-shell__column--main">
        <slot name="main" />
      </div>
      <div class="home-shell__column home-shell__column--side">
        <slot name="side" />
      </div>
    </main>

    <HomeBottomNavigation :items="navigation" label="Нижняя навигация" />
    <slot name="floating" />
  </div>
</template>

<style scoped>
.home-shell {
  min-height: 100vh;
  background-color: var(--home-surface-page);
}

.home-shell__top {
  display: flex;
  height: var(--home-header-height-mobile);
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--home-space-gutter-mobile);
  background-color: var(--home-surface-card);

  /* Figma рисует обводку внутрь фрейма, поэтому она не должна влиять на поток. */
  box-shadow: inset 0 0 0 1px var(--home-border-neutral);
}

.home-shell__brand {
  display: flex;
  min-width: 0;
  align-items: center;
  flex: 0 1 auto;
}

.home-shell__top-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;
}

.home-shell__logo-desktop,
.home-shell__nav,
.home-shell__support,
.home-shell__meta {
  display: none;
}

.home-shell__main {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 16px var(--home-space-gutter-mobile)
    calc(20px + var(--home-bottom-nav-height) + env(safe-area-inset-bottom));
  gap: 20px;
}

.home-shell__column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (width >= 768px) {
  .home-shell__logo-mobile,
  .home-shell__bell,
  .home-shell__user-mobile {
    display: none;
  }

  .home-shell__logo-desktop {
    display: inline-flex;
  }

  .home-shell__nav {
    display: block;
    min-width: 0;
  }

  .home-shell__support {
    display: inline-flex;
  }

  .home-shell__top {
    height: var(--home-header-height-desktop);
    padding: 0 clamp(24px, 5vw, var(--home-space-gutter-desktop));
  }

  .home-shell__brand {
    gap: 52px;
  }

  .home-shell__meta {
    display: flex;
    max-width: 1440px;
    height: 60px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(24px, 5vw, var(--home-space-gutter-desktop));
    margin-inline: auto;
  }

  .home-shell__main {
    display: grid;
    max-width: 1440px;
    box-sizing: border-box;
    padding: 20px clamp(24px, 5vw, var(--home-space-gutter-desktop)) 40px;
    margin-inline: auto;
    gap: 32px 40px;
    grid-template-columns: minmax(0, 1fr);
  }

  .home-shell__column {
    gap: 32px;
  }
}

/*
 * Две колонки включаются только там, где карточка шагов (минимум 540px)
 * помещается в главную колонку. Пропорция 792:464 и зазор 40px из Figma 1:59
 * воспроизводятся точно на контрольном viewport 1440px.
 */
@media (width >= 1200px) {
  .home-shell__main {
    grid-template-columns: minmax(0, 792fr) minmax(0, 464fr);
  }
}
</style>
