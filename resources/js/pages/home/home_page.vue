<script setup lang="ts">
import type { HomePageProps, HomeProgressState } from '../../types/home/home_page.types'
import HomeShellLayout from '../../layouts/home_shell_layout.vue'
import HomeStepsCard from '../../components/home/home_steps_card.vue'
import HomeBalanceCard from '../../components/home/home_balance_card.vue'
import HomeProgressBanner from '../../components/home/home_progress_banner.vue'
import HomePersonalDataCard from '../../components/home/home_personal_data_card.vue'
import HomeVerificationChecklist from '../../components/home/home_verification_checklist.vue'
import HomeFloatingChatButton from '../../components/home/home_floating_chat_button.vue'
import { computed } from 'vue'

const props = defineProps<HomePageProps>()

const STEP_STATE_LABELS: Readonly<Record<HomeProgressState, string>> = {
  complete: 'завершён',
  current: 'текущий шаг',
  pending: 'ожидает',
}

const homeHref = computed<string>(
  () => props.navigation.find((item) => item.key === 'home')?.href ?? '/',
)

const stepsTitle = computed<string>(
  () => `Passo ${props.onboarding.currentStep} di ${props.onboarding.totalSteps}`,
)

const completedLabel = computed<string>(
  () => `${props.onboarding.completedCount} / ${props.onboarding.totalSteps} completati`,
)

const checklistProgressLabel = computed<string>(
  () =>
    `Прогресс верификации: ${props.onboarding.completedCount} из ${props.onboarding.totalSteps}`,
)

function handleWithdraw(): void {
  window.location.assign(props.balance.withdrawUrl)
}

function handleNotifications(): void {
  window.location.assign(props.support.href)
}
</script>

<template>
  <HomeShellLayout
    :user="user"
    :navigation="navigation"
    :breadcrumbs="breadcrumbs"
    :support="support"
    :notifications-count="notificationsCount"
    :home-href="homeHref"
    @notifications="handleNotifications"
  >
    <template #main>
      <HomeStepsCard
        :onboarding="onboarding"
        :title="stepsTitle"
        :completed-label="completedLabel"
        :state-labels="STEP_STATE_LABELS"
      />
      <HomeBalanceCard
        :balance="balance"
        eyebrow="Il tuo saldo"
        title="Importo approvato dai nostri partner"
        withdraw-label="Preleva i fondi"
        @withdraw="handleWithdraw"
      />
      <HomeProgressBanner
        class="home-page__banner"
        :title="progressBanner.title"
        :subtitle="progressBanner.subtitle"
        :badge-label="progressBanner.badgeLabel"
        :compact-badge-label="progressBanner.compactBadgeLabel"
        :href="progressBanner.href"
        link-label="Перейти к незавершённым шагам"
        :pending-steps="progressBanner.pendingSteps"
      />
    </template>

    <template #side>
      <HomePersonalDataCard
        class="home-page__personal"
        title="Dati personali"
        :rows="personalData"
      />
      <HomeVerificationChecklist
        :eyebrow="verificationHeading.eyebrow"
        :title="verificationHeading.title"
        :items="verification"
        :progress-label="checklistProgressLabel"
      />
    </template>

    <template #floating>
      <HomeFloatingChatButton
        :href="support.href"
        :label="support.label"
        :avatar-url="support.avatarUrl"
        :unread-count="support.unreadCount"
      />
    </template>
  </HomeShellLayout>
</template>

<style scoped>
.home-page__personal {
  display: none;
}

@media (width >= 768px) {
  .home-page__personal {
    display: flex;
  }
}
</style>
