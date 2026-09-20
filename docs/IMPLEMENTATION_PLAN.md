# Архитектура и план реализации

## 1. Цель и ограничения

Одна Laravel/Inertia route `/home` должна отрисовывать Home в двух viewport-состояниях. Контент и поведение общие; композиция и часть navigation различаются. Точки абсолютного соответствия: `1440 × 889` и `390 × 1139`.

Разработка ведётся от данных и семантики к стилям. Не допускается кодировать весь макет абсолютными координатами: CSS Grid/Flex восстанавливают layout, а точные размеры используются на контрольных viewport.

## 2. Целевая структура

```text
app/
  Data/Home/home_page_data.php
  Http/Controllers/Home/home_controller.php
resources/
  css/
    app.css
    home_tokens.css
  fonts/inter/*.woff2
  images/home/{desktop,mobile,shared}/*
  js/
    app.ts
    components/home/
      home_logo_link.vue
      home_primary_navigation.vue
      home_navigation_item.vue
      home_notifications_button.vue
      home_user_summary.vue
      home_steps_card.vue
      home_step_item.vue
      home_balance_card.vue
      home_withdraw_button.vue
      home_progress_banner.vue
      home_personal_data_card.vue
      home_data_row.vue
      home_verification_checklist.vue
      home_checklist_item.vue
      home_bottom_navigation.vue
      home_bottom_navigation_item.vue
      home_floating_chat_button.vue
    layouts/home_shell_layout.vue
    pages/home/home_page.vue
    types/home/home_page.types.ts
    utils/home/home_currency_formatter.ts
preview/
  fixtures/home_page.fixture.ts
  index.html
  main.ts
routes/web.php
tests/
  Feature/Home/home_page_test.php
  Unit/Home/home_page_data_test.php
  architecture_test.php
  frontend/components/home/*.spec.ts
  e2e/home/home.spec.ts
  visual/home/home.visual.spec.ts
```

Имена PHP следуют PSR-4/PascalCase, Vue-файлы — обязательному доменному `snake_case`.

## 3. Компонентная карта

| Компонент | Ответственность | Reuse/варианты |
|---|---|---|
| `home_page.vue` | Head/title, принимает `HomePageProps`, собирает layout | Никаких вычислений домена |
| `home_shell_layout.vue` | Header, main grid, desktop/mobile visibility, safe area | Layout для будущих cabinet pages только после второго use case |
| `home_logo_link.vue` | Бренд и link | Размер через `size="desktop|mobile"` |
| `home_primary_navigation.vue` | Desktop navigation list | Получает массив nav items |
| `home_navigation_item.vue` | Одна nav link | active/inactive, exact Figma icon |
| `home_notifications_button.vue` | Bell, badge, accessible label, emit | desktop/mobile size |
| `home_user_summary.vue` | Avatar, initials/name/email | variant desktop/mobile |
| `home_steps_card.vue` | Заголовок и ordered progress list | Desktop/mobile CSS composition |
| `home_step_item.vue` | Один шаг, connector, state | `complete|current|pending` |
| `home_balance_card.vue` | Balance content and status | Composition only |
| `home_withdraw_button.vue` | CTA, named click emit | Loading/disabled prepared, no API call |
| `home_progress_banner.vue` | Незавершённые шаги | Shared content, responsive layout |
| `home_personal_data_card.vue` | Desktop personal details | Список rows |
| `home_data_row.vue` | Label/value pair | Reusable in cabinet domain |
| `home_verification_checklist.vue` | Checklist heading/list/progress | Shared desktop/mobile |
| `home_checklist_item.vue` | One verification item | complete/current/pending |
| `home_bottom_navigation.vue` | Mobile fixed nav | Только mobile viewport |
| `home_bottom_navigation_item.vue` | Mobile nav link | active/inactive/badge |
| `home_floating_chat_button.vue` | Mobile chat/avatar/badge | Button with exact asset |

Кнопка не стилизуется ad hoc в родителе. Родитель только подписывается на emit или передаёт link/disabled state.

## 4. Контракт данных

```ts
type HomeProgressState = 'complete' | 'current' | 'pending'

interface HomePageProps {
  user: {
    fullName: string
    initials: string
    email: string
    avatarUrl: string
  }
  notificationsCount: number
  navigation: Array<{
    key: 'home' | 'documents' | 'profile' | 'support'
    label: string
    href: string
    isActive: boolean
  }>
  onboarding: {
    currentStep: number
    totalSteps: number
    completedCount: number
    steps: Array<{ key: string; shortLabel: string; label: string; state: HomeProgressState }>
  }
  balance: {
    amountMinor: number
    currency: 'EUR'
    productLabel: string
    interestRateLabel: string
    availabilityMessage: string
    statusLabel: string
    withdrawUrl: string
  }
  personalData: Array<{ key: string; label: string; value: string }>
  verification: Array<{
    key: string
    title: string
    description?: string
    state: HomeProgressState
    href?: string
  }>
  support: { href: string; unreadCount: number }
}
```

PHP `HomePageData` выдаёт тот же shape через `toArray()`. Controller получает данные через application service/repository, строит named route URLs и передаёт DTO в Inertia. Fixture удовлетворяет `satisfies HomePageProps`, поэтому drift ломает typecheck.

## 5. Responsive layout

- Breakpoint: desktop composition включается с `768px`; точные Figma anchors — 390 и 1440.
- Desktop: max content width `1296px`, side margin `72px` при 1440; grid `792px 464px`, gap `40px`; vertical gap `32px`.
- Mobile: width `100%`, padding `16px`, card gap `20px`; header `62px`; bottom nav `62px + env(safe-area-inset-bottom)`.
- Desktop order: steps → balance → progress banner слева; personal data → checklist справа.
- Mobile order: steps → balance → progress banner → checklist. Personal data отсутствует в Figma mobile и скрывается CSS. Bottom navigation и chat существуют только в mobile composition.
- Высота страницы не фиксируется production CSS. Reference height используется тестовым viewport; mobile padding-bottom резервирует fixed navigation.
- `clamp()` применять только для промежуточных viewport, если оно не изменяет контрольные размеры.

## 6. Design tokens

`home_tokens.css` содержит только подтверждённые значения:

- surfaces: `#f8fafb`, `#ffffff`, `#eaf4f6`;
- text: `#1a2332`, `#71717a`, `#a1a1aa`;
- brand: `#2491aa`, gradient endpoint `#1a7488`;
- borders: `#e4e4e7`, `#e2edf0`, `#c7e3ea`, `#d4d4d8`;
- danger: desktop `#ef4444`, mobile reference `#9a0606` only at its confirmed usage;
- radius: card `16px` plus exact subcomponent radii from JSON;
- shadows copied from reference README;
- spacing scale includes exact `16`, `20`, `32`, `40`, `72` values.

Typography uses Inter local font files and explicit weight mappings. Synthetic bold/italic is disabled. Line-height and letter-spacing follow Figma; decimal `17.7778px` is preserved only where the source requires it.

## 7. Assets

1. Copy only referenced production assets from `home-reference` into `resources/images/home` with semantic names.
2. Keep Figma node id in `assets-manifest.json`, not in production filename.
3. Run SVG optimizer only if pixel diff remains clean; preserve viewBox and strokes.
4. Raster avatar exports use explicit width/height and `object-fit: cover`; preload the critical profile avatar in preview tests.
5. Reference PNG/SVG remain under `home-reference` and never ship in the production bundle.

## 8. Interaction contract

- Nav and CTA use real links when they navigate; buttons only trigger actions.
- CTA emits `withdraw` or receives `href`, depending on confirmed product behavior. Do not fake an API request.
- Notification and chat buttons have accessible names and deterministic click tests.
- No loading skeleton is needed for first render: Inertia supplies props with the page.
- Error state is owned by Laravel/Inertia response. Components accept explicit disabled/status props when needed.

## 9. SOLID, DRY, KISS application

- SRP: page composes; card presents; controller coordinates; DTO defines boundary; formatter formats currency.
- OCP: step/checklist state is a union and modifier class, so a new state extends a narrow mapping.
- LSP: button/link semantics are not hidden behind one component that sometimes renders unrelated tags.
- ISP: each child receives the smallest prop slice, not the whole page object.
- DIP: Vue depends on a serializable contract, not Eloquent models or global runtime state.
- DRY: repeated step/checklist/nav rows are data-driven; desktop/mobile share domain components.
- KISS: no store, router, UI-kit, API client or generalized design-system package without a current requirement.

## 10. Delivery topology

- GitHub PR is the source of review.
- GitHub Actions runs `pnpm build:pages` and publishes `dist-preview` to GitHub Pages.
- Preview mode displays a small non-production data marker outside screenshot viewport or through metadata, never inside the target UI.
- Laravel mode runs `composer install`, `pnpm build:laravel` and feature tests.
- CI status is required before handoff. GitHub Pages preview is checked at both reference viewport sizes.
