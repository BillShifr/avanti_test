import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import HomeStepsCard from '../../../../resources/js/components/home/home_steps_card.vue'
import HomeWithdrawButton from '../../../../resources/js/components/home/home_withdraw_button.vue'
import HomeNavigationItem from '../../../../resources/js/components/home/home_navigation_item.vue'
import HomeNotificationsButton from '../../../../resources/js/components/home/home_notifications_button.vue'
import HomeChecklistItem from '../../../../resources/js/components/home/home_checklist_item.vue'
import HomeVerificationChecklist from '../../../../resources/js/components/home/home_verification_checklist.vue'
import HomeUserSummary from '../../../../resources/js/components/home/home_user_summary.vue'
import HomeProgressBanner from '../../../../resources/js/components/home/home_progress_banner.vue'
import { homePageFixture } from '../../../../preview/fixtures/home_page.fixture'

const STATE_LABELS = {
  complete: 'завершён',
  current: 'текущий шаг',
  pending: 'ожидает',
} as const

describe('home_steps_card', () => {
  it('раскрывает состояние каждого шага текстом, а не только цветом', () => {
    render(HomeStepsCard, {
      props: {
        onboarding: homePageFixture.onboarding,
        title: 'Passo 4 di 5',
        completedLabel: '3 / 5 completati',
        stateLabels: STATE_LABELS,
      },
    })

    const steps = screen.getAllByRole('listitem')

    expect(steps).toHaveLength(5)
    expect(steps[0]).toHaveTextContent('Simulazione — завершён')
    expect(steps[3]).toHaveTextContent('Documenti — текущий шаг')
    expect(steps[4]).toHaveTextContent('Firma — ожидает')
  })
})

describe('home_withdraw_button', () => {
  it('сообщает о недоступности и не эмитит событие', async () => {
    const { emitted } = render(HomeWithdrawButton, {
      props: { label: 'Preleva i fondi', isEnabled: false },
    })

    const button = screen.getByRole('button', { name: 'Preleva i fondi' })

    expect(button).toHaveAttribute('aria-disabled', 'true')

    await userEvent.click(button)

    expect(emitted()).not.toHaveProperty('withdraw')
  })

  it('эмитит withdraw, когда вывод разрешён', async () => {
    const { emitted } = render(HomeWithdrawButton, {
      props: { label: 'Preleva i fondi', isEnabled: true },
    })

    await userEvent.click(screen.getByRole('button', { name: 'Preleva i fondi' }))

    expect(emitted()).toHaveProperty('withdraw')
  })
})

describe('home_navigation_item', () => {
  it('помечает активный пункт через aria-current', () => {
    render(HomeNavigationItem, {
      props: { itemKey: 'home', label: 'Home', href: '/home', isActive: true },
    })

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  })

  it('не выставляет aria-current неактивному пункту', () => {
    render(HomeNavigationItem, {
      props: { itemKey: 'documents', label: 'Documenti', href: '/documenti', isActive: false },
    })

    expect(screen.getByRole('link', { name: 'Documenti' })).not.toHaveAttribute('aria-current')
  })
})

describe('home_notifications_button', () => {
  it('включает количество в доступное имя и эмитит open', async () => {
    const { emitted } = render(HomeNotificationsButton, { props: { count: 4 } })

    const button = screen.getByRole('button', { name: 'Уведомления, новых: 4' })
    await userEvent.click(button)

    expect(emitted()).toHaveProperty('open')
  })

  it('скрывает бейдж, когда уведомлений нет', () => {
    render(HomeNotificationsButton, { props: { count: 0 } })

    expect(screen.getByRole('button', { name: 'Уведомления' })).toBeTruthy()
  })
})

describe('home_checklist_item', () => {
  it('делает ссылкой только шаг, требующий действия', () => {
    render(HomeChecklistItem, {
      props: {
        title: 'Documenti caricati',
        description: 'Step attuale • Azione richiesta',
        state: 'current',
        iconKey: 'documents',
        href: '/documenti',
      },
    })

    expect(
      screen.getByRole('link', { name: 'Documenti caricati: Step attuale • Azione richiesta' }),
    ).toHaveAttribute('href', '/documenti')
  })

  it('не делает ссылкой завершённый шаг', () => {
    render(HomeChecklistItem, {
      props: {
        title: 'Account creato',
        description: 'Completato',
        state: 'complete',
        iconKey: 'account',
        href: '/account',
      },
    })

    expect(screen.queryByRole('link')).toBeNull()
  })
})

describe('home_verification_checklist', () => {
  it('сворачивает и разворачивает список по кнопке', async () => {
    render(HomeVerificationChecklist, {
      props: {
        eyebrow: homePageFixture.verificationHeading.eyebrow,
        title: homePageFixture.verificationHeading.title,
        items: homePageFixture.verification,
        progressLabel: 'Прогресс верификации: 3 из 5',
      },
    })

    const toggle = screen.getByRole('button', { expanded: true })

    await userEvent.click(toggle)

    expect(screen.getByRole('button', { expanded: false })).toBeTruthy()
  })
})

describe('home_user_summary', () => {
  it('десктоп показывает имя и почту, мобайл — инициалы', () => {
    const { unmount } = render(HomeUserSummary, {
      props: { user: homePageFixture.user, variant: 'desktop' },
    })

    expect(screen.getByAltText('Фото профиля: Marco Rossi')).toBeTruthy()
    expect(screen.getByText('ikoei@09gmail.com')).toBeTruthy()

    unmount()

    render(HomeUserSummary, { props: { user: homePageFixture.user, variant: 'mobile' } })

    expect(screen.getByText('MR')).toBeTruthy()
  })
})

describe('home_progress_banner', () => {
  it('перечисляет незавершённые шаги и даёт ссылку с понятным именем', () => {
    render(HomeProgressBanner, {
      props: {
        ...homePageFixture.progressBanner,
        linkLabel: 'Перейти к незавершённым шагам',
      },
    })

    const list = screen.getByRole('list')

    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'Перейти к незавершённым шагам' })).toHaveAttribute(
      'href',
      '/documenti',
    )
  })
})

describe('fixture contract', () => {
  it('держит деньги в минорных единицах и целочисленные счётчики', () => {
    expect(Number.isInteger(homePageFixture.balance.amountMinor)).toBe(true)
    expect(Number.isInteger(homePageFixture.notificationsCount)).toBe(true)
    expect(homePageFixture.onboarding.completedCount).toBeLessThanOrEqual(
      homePageFixture.onboarding.totalSteps,
    )
  })

  it('не содержит готовой HTML-строки с суммой', () => {
    expect(JSON.stringify(homePageFixture)).not.toContain('<')
  })
})
