import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const VIEWPORTS = [320, 375, 390, 768, 1024, 1280, 1440, 1920]

test.describe('Home', () => {
  test('рендерится без ошибок и предупреждений в консоли', async ({ page }) => {
    const problems: string[] = []

    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        problems.push(`${message.type()}: ${message.text()}`)
      }
    })
    page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))

    await page.goto('/')
    await expect(page.getByRole('main')).toBeVisible()

    expect(problems).toEqual([])
  })

  test('основная навигация ведёт на именованные маршруты', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'десктопная композиция')

    await page.goto('/')

    const nav = page.getByRole('navigation', { name: 'Основная навигация' })

    await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home')
    await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Documenti' })).toHaveAttribute('href', '/documenti')
    await expect(nav.getByRole('link', { name: 'Profilo' })).toHaveAttribute('href', '/profilo')
  })

  test('CTA достижима с клавиатуры и сообщает о недоступности вывода', async ({ page }) => {
    await page.goto('/')

    const cta = page.getByRole('button', { name: 'Preleva i fondi' })

    await expect(cta).toHaveAttribute('aria-disabled', 'true')

    await cta.focus()
    await expect(cta).toBeFocused()
  })

  test('кнопка поддержки и бейдж уведомлений имеют доступные имена', async ({ page }, testInfo) => {
    await page.goto('/')

    if (testInfo.project.name === 'chromium-desktop') {
      await expect(
        page.getByRole('link', { name: 'Assistenza, непрочитанных сообщений: 4' }),
      ).toBeVisible()

      return
    }

    await expect(page.getByRole('button', { name: 'Уведомления, новых: 4' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Assistenza, непрочитанных сообщений: 2' }),
    ).toBeVisible()
  })

  test('мобильная нижняя навигация и плавающий чат работают', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-mobile', 'мобильная композиция')

    await page.goto('/')

    const bottom = page.getByRole('navigation', { name: 'Нижняя навигация' })

    await expect(bottom).toBeVisible()
    await expect(bottom.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    await expect(bottom.getByRole('link', { name: 'Assistenza' })).toHaveAttribute(
      'href',
      '/assistenza',
    )

    const chat = page.getByRole('link', { name: 'Assistenza, непрочитанных сообщений: 2' })
    const box = await chat.boundingBox()
    const navBox = await bottom.boundingBox()

    expect(box).not.toBeNull()
    expect(navBox).not.toBeNull()
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThan(navBox?.y ?? 0)
  })

  test('чеклист сворачивается и разворачивается', async ({ page }) => {
    await page.goto('/')

    const toggle = page.locator('[aria-controls="home-checklist-items"]')
    const items = page.locator('#home-checklist-items')

    await expect(items).toBeVisible()
    await toggle.click()
    await expect(items).toBeHidden()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.click()
    await expect(items).toBeVisible()
  })

  test('нет горизонтального переполнения на контрольной матрице ширин', async ({ page }) => {
    await page.goto('/')

    for (const width of VIEWPORTS) {
      await page.setViewportSize({ width, height: 900 })
      await page.waitForTimeout(50)

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )

      expect(overflow, `ширина ${width}px`).toBeLessThanOrEqual(0)
    }
  })

  test('нет критичных и серьёзных нарушений WCAG 2.2 A/AA', async ({ page }, testInfo) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    /*
     * color-contrast вынесен из блокирующего набора: все конфликты приходят
     * из палитры Figma (#2491AA, #A1A1AA, #71717A) и перечислены в
     * docs/ACCESSIBILITY.md. Менять цвета — значит ломать растровую приёмку,
     * поэтому по docs/QUALITY_GATES.md §6 конфликты логируются, а не «чинятся».
     */
    const blocking = results.violations.filter(
      (violation) =>
        violation.id !== 'color-contrast' &&
        (violation.impact === 'critical' || violation.impact === 'serious'),
    )

    await testInfo.attach('axe-report.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    })

    expect(
      blocking.map((violation) => `${violation.id}: ${violation.help}`),
      JSON.stringify(blocking, null, 2),
    ).toEqual([])
  })
})
