/**
 * описывает данные страницы
 */

export type HomeProgressState = 'complete' | 'current' | 'pending'

export type HomeNavigationKey = 'home' | 'documents' | 'profile' | 'support'

export interface HomeUser {
  readonly fullName: string
  readonly initials: string
  readonly email: string
  readonly avatarUrl: string
}

export interface HomeNavigationItem {
  readonly key: HomeNavigationKey
  readonly label: string
  readonly href: string
  readonly isActive: boolean
}

export interface HomeOnboardingStep {
  readonly key: string
  readonly shortLabel: string
  readonly label: string
  readonly state: HomeProgressState
}

export interface HomeOnboarding {
  readonly currentStep: number
  readonly totalSteps: number
  readonly completedCount: number
  readonly steps: readonly HomeOnboardingStep[]
}

export interface HomeBalance {
  readonly amountMinor: number
  readonly currency: 'EUR'
  readonly productLabel: string
  readonly interestRateLabel: string
  readonly availabilityMessage: string
  readonly statusLabel: string
  readonly withdrawUrl: string
  readonly isWithdrawEnabled: boolean
}

export interface HomeDataRow {
  readonly key: string
  readonly label: string
  readonly value: string
}

export interface HomeVerificationItem {
  readonly key: string
  readonly title: string
  readonly description: string
  readonly state: HomeProgressState
  readonly stateLabel: string
  readonly iconKey: HomeVerificationIconKey
  readonly href?: string | undefined
}

export type HomeVerificationIconKey =
  'simulation' | 'approval' | 'account' | 'documents' | 'signature'

export interface HomePendingStep {
  readonly key: string
  readonly label: string
}

export interface HomeSupport {
  readonly href: string
  readonly unreadCount: number
  readonly label: string
  readonly avatarUrl: string
}

export interface HomeBreadcrumb {
  readonly label: string
  readonly href?: string | undefined
}

export interface HomePageProps {
  readonly user: HomeUser
  readonly notificationsCount: number
  readonly navigation: readonly HomeNavigationItem[]
  readonly breadcrumbs: readonly HomeBreadcrumb[]
  readonly onboarding: HomeOnboarding
  readonly balance: HomeBalance
  readonly personalData: readonly HomeDataRow[]
  readonly verification: readonly HomeVerificationItem[]
  readonly verificationHeading: {
    readonly eyebrow: string
    readonly title: string
  }
  readonly progressBanner: {
    readonly title: string
    readonly subtitle: string
    readonly badgeLabel: string
    readonly compactBadgeLabel: string
    readonly href: string
    readonly pendingSteps: readonly HomePendingStep[]
  }
  readonly support: HomeSupport
}
