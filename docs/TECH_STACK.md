# Стек и решения

Версии ниже — целевые major/minor на 18.09.2026. Точные patch-версии фиксируются lock-файлами после scaffolding.

## Runtime

| Слой | Выбор | Почему |
|---|---|---|
| PHP | PHP 8.4 | Поддерживает Laravel 13 и Pest 4; единая современная CI-матрица. |
| Backend | Laravel 13 | Текущий major; владеет auth, routing, validation и подготовкой props. |
| Bridge | Inertia 3 | Одна кодовая база Laravel + Vue без отдельного SPA API и дублирования роутинга. |
| UI | Vue 3, SFC, `<script setup lang="ts">` | Прямое выполнение требования лида и официальный рекомендуемый Composition API syntax. |
| Language | TypeScript strict | Контракт между page, components и fixture проверяется до runtime. |
| Build | Vite 8.1 + Laravel Vite Plugin 3.x | Актуальный Vite; один pipeline для Laravel assets и статического preview. |
| Node | Node 24 LTS | Поддерживаемая LTS-линия до апреля 2028; совместима с ESLint 10 и Vitest 5. |
| Package manager | pnpm 10, frozen lockfile | Быстрые детерминированные installs; `pnpm-lock.yaml` обязателен. |
| CSS | Native CSS + scoped SFC styles + custom properties | Минимум зависимостей, точный контроль Figma, отсутствие utility-noise. |
| Font | Self-hosted Inter WOFF2: 300/400/500/600/700 | Предсказуемая метрика, отсутствие внешнего сетевого запроса и layout shift. |

Официальный Laravel Vue starter kit уже связывает Vue, TypeScript и Inertia. Его можно использовать как scaffold, затем удалить shadcn/Tailwind из Home, потому что типовые primitives не совпадают с Figma и создают лишний слой override.

## Инструменты качества

| Задача | Выбор | Политика |
|---|---|---|
| TS diagnostics | `vue-tsc` | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`; zero errors. |
| JS/Vue lint | ESLint 10 flat config, `eslint-plugin-vue`, `typescript-eslint` typed rules | zero warnings; запреты inline handlers/style усиливаются локальными правилами/AST-check. |
| CSS lint | Stylelint + standard config + `postcss-html` | Проверяет `<style>` внутри Vue, дубликаты, ошибки свойств и порядок соглашений. |
| Formatting | Prettier | Только форматирование; ESLint и Stylelint отвечают за correctness. |
| PHP style | Laravel Pint | `./vendor/bin/pint --test` в gate; `--dirty` в pre-commit. |
| PHP analysis | Larastan 3 / PHPStan level 8 сначала, затем 9 | Нет baseline для нового кода, zero ignored errors без объяснения. |
| PHP tests | Pest 4 + Laravel plugin | Feature contract route/controller/Inertia props и architecture checks. |
| Vue tests | Vitest 5 + Vue Testing Library | Поведение через accessible queries; jsdom только для быстрых component tests. |
| Browser/E2E | Playwright | Chromium gate; WebKit и Firefox smoke в CI. |
| Accessibility | `@axe-core/playwright` | WCAG 2.2 A/AA automated scan плюс ручной checklist. |
| Git hooks | Lefthook | Один cross-language YAML, parallel staged checks, без shell glue в `.git/hooks`. |
| CI | GitHub Actions | Linux pinned image/container, dependency caches, concurrency cancellation, artifacts on failure. |
| Hosting | Vercel Vite preview | Git-connected preview для PR; fixture mode, тот же Vue page. |

## Что намеренно не устанавливаем

| Библиотека | Решение |
|---|---|
| Tailwind | Не использовать в Home: utility chains усложнят буквальную проверку CSS и читаемость template. |
| shadcn-vue / UI-kit | Не использовать: визуальные primitives не соответствуют Figma; override cost выше пользы. |
| Pinia | Нет клиентского глобального mutable state. Inertia props и локального state достаточно. |
| Vue Router | Routing уже принадлежит Laravel/Inertia. |
| Axios | Home не делает самостоятельные REST-запросы. Inertia обрабатывает navigation/actions. |
| Icon library | Использовать точные SVG Figma, иначе меняются stroke, viewBox и optical alignment. |
| VueUse | Добавить позднее только при втором доказанном reusable composable. Один `matchMedia` helper зависимости не оправдывает. |
| Storybook | Для двух экранов стоимость setup выше пользы. Vite preview route и component tests дают нужный review loop. |
| Sass | Native CSS покрывает nesting/tokens/layout; дополнительный compiler не нужен. |

## Laravel и Vercel

Laravel/Inertia page обычно рендерится PHP-сервером. Поэтому delivery делится на два build target без дублирования UI:

1. `build:laravel` использует `resources/js/app.ts`, Laravel Vite Plugin и manifest в `public/build`.
2. `build:preview` использует `preview/index.html` + `preview/main.ts`, импортирует тот же `home_page.vue` и fixture.
3. `vercel.json` собирает preview и отдаёт SPA fallback. Никакие production API credentials в preview не нужны.

Это позволяет передать ссылку Vercel для тестового задания и оставить код готовым к реальному Laravel runtime. Если заказчик требует production Laravel именно на одном домене Vercel, это отдельное инфраструктурное решение; оно не должно менять компоненты Home.

## Управление версиями

- Pin major/minor диапазон в manifests и точный dependency graph в `composer.lock` и `pnpm-lock.yaml`.
- CI использует `composer install --no-interaction --prefer-dist` и `pnpm install --frozen-lockfile`.
- Renovate/Dependabot группирует dev-tool updates отдельно от runtime.
- Major upgrades выполняются отдельным PR с release notes, full gate и обновлением visual baselines только при осознанном изменении рендера.

## Первичные источники

- [Laravel 13 release notes](https://laravel.com/docs/13.x/releases)
- [Laravel Vue starter kit](https://laravel.com/starter-kits)
- [Laravel frontend and Inertia](https://laravel.com/docs/13.x/frontend)
- [Inertia 3 pages](https://inertiajs.com/docs/v3/the-basics/pages)
- [Vue `<script setup>`](https://vuejs.org/api/sfc-script-setup)
- [Vite 8.1](https://vite.dev/blog/announcing-vite8-1)
- [Vite backend integration](https://vite.dev/guide/backend-integration)
- [Vercel Vite deployments](https://vercel.com/docs/frameworks/frontend/vite)
- [Node release schedule](https://nodejs.org/en/about/previous-releases)
- [ESLint flat config](https://eslint.org/docs/latest/use/configure/)
- [typescript-eslint typed linting](https://typescript-eslint.io/getting-started/typed-linting/)
- [Stylelint setup](https://stylelint.io/user-guide/get-started/)
- [Laravel Pint](https://laravel.com/docs/13.x/pint)
- [Larastan](https://github.com/larastan/larastan)
- [Pest](https://pestphp.com/docs/installation)

