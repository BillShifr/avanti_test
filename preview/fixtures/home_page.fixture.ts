import type { HomePageProps } from '../../resources/js/types/home/home_page.types'
import profileAvatar from '../../resources/images/home/shared/profile_avatar.jpg'
import chatAvatar from '../../resources/images/home/mobile/chat_avatar.png'
import { createPreviewHref } from '../preview_href'

const previewHref = (path: `/${string}`): string =>
  createPreviewHref(import.meta.env.VITE_PAGES_BASE_PATH ?? './', path)

/**
 * фиксированные данные предварительного просмотра проверяются по типу страницы
 */
export const homePageFixture = {
  user: {
    fullName: 'Marco Rossi',
    initials: 'MR',
    email: 'ikoei@09gmail.com',
    avatarUrl: profileAvatar,
  },
  notificationsCount: 4,
  navigation: [
    { key: 'home', label: 'Home', href: previewHref('/home'), isActive: true },
    {
      key: 'documents',
      label: 'Documenti',
      href: previewHref('/documenti'),
      isActive: false,
    },
    { key: 'profile', label: 'Profilo', href: previewHref('/profilo'), isActive: false },
    { key: 'support', label: 'Assistenza', href: previewHref('/assistenza'), isActive: false },
  ],
  breadcrumbs: [{ label: 'Piattaforma', href: previewHref('/') }, { label: 'Home' }],
  onboarding: {
    currentStep: 4,
    totalSteps: 5,
    completedCount: 3,
    steps: [
      { key: 'simulation', shortLabel: 'Simul.', label: 'Simulazione', state: 'complete' },
      { key: 'approval', shortLabel: 'Approv.', label: 'Approvazione', state: 'complete' },
      { key: 'account', shortLabel: 'Account', label: 'Account', state: 'complete' },
      { key: 'documents', shortLabel: 'Docum.', label: 'Documenti', state: 'current' },
      { key: 'signature', shortLabel: 'Firma', label: 'Firma', state: 'pending' },
    ],
  },
  balance: {
    amountMinor: 1_200_000,
    currency: 'EUR',
    productLabel: 'Prestito personale',
    interestRateLabel: 'TAN 3,8%',
    availabilityMessage: "Fondi disponibili dopo l'approvazione dei documenti",
    statusLabel: 'Completa i passaggi',
    withdrawUrl: previewHref('/prelievo'),
    isWithdrawEnabled: false,
  },
  personalData: [
    { key: 'surname', label: 'Cognome', value: 'Intesa Sanpaolo S.p.A.' },
    { key: 'name', label: 'Nome', value: 'Marco Rossi' },
  ],
  verification: [
    {
      key: 'simulation',
      title: 'Simulazione completata',
      description: 'Completato',
      state: 'complete',
      stateLabel: 'Completato',
      iconKey: 'simulation',
    },
    {
      key: 'approval',
      title: 'Credito approvato',
      description: 'Completato',
      state: 'complete',
      stateLabel: 'Completato',
      iconKey: 'approval',
    },
    {
      key: 'account',
      title: 'Account creato',
      description: 'Completato',
      state: 'complete',
      stateLabel: 'Completato',
      iconKey: 'account',
    },
    {
      key: 'documents',
      title: 'Documenti caricati',
      description: 'Step attuale • Azione richiesta',
      state: 'current',
      stateLabel: 'Step attuale',
      iconKey: 'documents',
      href: previewHref('/documenti'),
    },
    {
      key: 'signature',
      title: 'Contratto firmato',
      description: 'In attesa',
      state: 'pending',
      stateLabel: 'In attesa',
      iconKey: 'signature',
      href: previewHref('/firma'),
    },
  ],
  verificationHeading: {
    eyebrow: 'Completa tutti gli step',
    title: 'Per il prelievo dei fondi, completa tutti gli step',
  },
  progressBanner: {
    title: 'Per il prelievo dei fondi, completa tutti gli step',
    subtitle: 'Step ancora da completare',
    badgeLabel: '3 / 5 Completati',
    compactBadgeLabel: '3 / 5',
    href: previewHref('/documenti'),
    pendingSteps: [
      { key: 'documents', label: 'Documenti' },
      { key: 'signature', label: 'Firma' },
    ],
  },
  support: {
    href: previewHref('/assistenza'),
    unreadCount: 2,
    label: 'Assistenza',
    avatarUrl: chatAvatar,
  },
} satisfies HomePageProps
