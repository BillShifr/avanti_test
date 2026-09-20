# Master prompt: реализация Home desktop + mobile

Ты — senior full-stack разработчик. Полностью реализуй два состояния одной страницы Home по уже извлечённому Figma-дизайну: desktop и mobile. Это тестовое задание, поэтому оцениваются не только внешний вид, но и архитектура, качество кода, тестирование, Git workflow и deployment.

Не ограничивайся планом или scaffold. Доведи работу до проверяемой реализации, зелёного полного gate, GitHub feature-ветки и GitHub Pages preview. Не расширяй scope за пределы Home.

## 1. Рабочая директория

Работай только в:

```text
/Users/vladislavtatyankin/test_tat
```

Не используй похожий каталог `/Users/vladislavtatyankin/Documents/ChatGPT/test_tat`.

Сохрани существующие Figma-артефакты и инженерную документацию. Если Git/Laravel ещё не инициализированы, создай проект в текущем каталоге без удаления имеющихся файлов.

## 2. Обязательный порядок чтения

До написания кода прочитай:

1. `/Users/vladislavtatyankin/test_tat/AGENTS.md`
2. `/Users/vladislavtatyankin/test_tat/IMPLEMENTATION_BLUEPRINT.md`
3. `/Users/vladislavtatyankin/test_tat/docs/IMPLEMENTATION_PLAN.md`
4. `/Users/vladislavtatyankin/test_tat/docs/TECH_STACK.md`
5. `/Users/vladislavtatyankin/test_tat/docs/ROADMAP.md`
6. `/Users/vladislavtatyankin/test_tat/docs/QUALITY_GATES.md`
7. `/Users/vladislavtatyankin/test_tat/docs/SKILLS.md`
8. `/Users/vladislavtatyankin/test_tat/home-reference/README.md`
9. `/Users/vladislavtatyankin/test_tat/home-reference/mobile/README.md`

Используй локальное руководство по реализации:

```text
/Users/vladislavtatyankin/test_tat/docs/home-implementation-guide/README.md
```

`AGENTS.md` является обязательной политикой. Документация описывает уже принятые решения: не заменяй их случайной альтернативой. Если обнаружится реальное техническое противоречие, сначала докажи его кодом или официальной документацией, затем зафиксируй изменение решения в `docs/`.

## 3. Источники дизайна

### Desktop

```text
Figma node: 1:15
Viewport: 1440 × 889
PNG:  /Users/vladislavtatyankin/test_tat/home-reference/home-1440x889.png
SVG:  /Users/vladislavtatyankin/test_tat/home-reference/home.svg
JSON: /Users/vladislavtatyankin/test_tat/home-reference/spec/home-layout.json
Summary: /Users/vladislavtatyankin/test_tat/home-reference/spec/home-summary.json
Components: /Users/vladislavtatyankin/test_tat/home-reference/components
Assets: /Users/vladislavtatyankin/test_tat/home-reference/assets
```

### Mobile

```text
Figma node: 18:967
Viewport: 390 × 1139
PNG:  /Users/vladislavtatyankin/test_tat/home-reference/mobile/home-mobile-390x1139.png
SVG:  /Users/vladislavtatyankin/test_tat/home-reference/mobile/home-mobile.svg
JSON: /Users/vladislavtatyankin/test_tat/home-reference/mobile/spec/home-layout.json
Summary: /Users/vladislavtatyankin/test_tat/home-reference/mobile/spec/home-summary.json
Components: /Users/vladislavtatyankin/test_tat/home-reference/mobile/components
Assets: /Users/vladislavtatyankin/test_tat/home-reference/mobile/assets
```

Полный исходный Figma-файл находится здесь:

```text
/Users/vladislavtatyankin/test_tat/Личный кабинет (Copy).fig
```

PNG/SVG являются визуальным эталоном. JSON является источником точных размеров, координат, fills, strokes, effects и typography. Не измеряй «на глаз». Не вставляй весь экран как картинку или SVG.

## 4. Scope

Реализуй только:

- Home desktop;
- Home mobile;
- responsive переход между ними;
- необходимые для Home Laravel route/controller/DTO;
- типизированные fixture-данные для GitHub Pages preview;
- тесты, линтеры, hooks, CI и deployment этих двух состояний.

Не реализуй остальные Figma-экраны, полноценный auth flow, notification center, chat backend, выдачу средств или общий UI-kit всего продукта.

## 5. Обязательный стек

- PHP 8.4;
- Laravel 13;
- Inertia 3;
- Vue 3;
- TypeScript strict;
- Composition API через `<script setup lang="ts">`;
- Vite 8;
- Node 24 LTS;
- pnpm с committed `pnpm-lock.yaml`;
- native CSS, scoped SFC styles и CSS custom properties;
- self-hosted Inter WOFF2: 300, 400, 500, 600, 700.

Quality tooling:

- `vue-tsc`;
- ESLint 10 flat config, `eslint-plugin-vue`, typed `typescript-eslint`;
- Stylelint с поддержкой Vue SFC;
- Prettier;
- Laravel Pint;
- Larastan/PHPStan;
- Pest 4;
- Vitest 5 и Vue Testing Library;
- Playwright;
- `@axe-core/playwright`;
- Lefthook;
- GitHub Actions.

Не добавляй Tailwind, shadcn-vue, Pinia, Vue Router, Axios, icon library, VueUse, Sass или Storybook: в scope двух экранов у них нет оправданной задачи.

## 6. Правила лида

Соблюдай буквально:

1. Всё разносится по компонентам; каждая кнопка — отдельный компонент.
2. Один компонент — один `.vue`-файл.
3. Имя Vue-файла состоит из домена и назначения: `<domain>_<purpose>.vue`.
4. Используй `snake_case`, например `home_withdraw_button.vue`.
5. Ни один Vue-файл не превышает 300 строк вместе с template, script и style. Целевой размер — до 220 строк.
6. Компоненты должны быть переиспользуемыми через узкие props, slots и emits.
7. Используй сокращённый Composition API: `<script setup lang="ts">`.
8. Запрещены inline JS и inline CSS.

Практическая трактовка последнего пункта:

- запрещены `style="..."` и `:style`;
- запрещены inline arrow-functions и сложные выражения в template;
- обработчики имеют имена: `@click="handleWithdraw"`;
- вычисления находятся в `computed` или чистых функциях;
- запрещены `v-html`, `any`, необоснованные `@ts-ignore` и type assertions;
- стили находятся в `<style scoped>` или общих token/reset-файлах.

Добавь автоматический structural check, который ломает CI при нарушении naming, 300 LOC и inline-запретов.

## 7. Архитектура

Используй следующий поток:

```text
Laravel named route
  → invokable HomeController
  → immutable HomePageData DTO
  → Inertia page props
  → resources/js/pages/home/home_page.vue
  → узкие presentation components
```

Не передавай Eloquent model прямо во frontend. Не выполняй дополнительный fetch при первом render. URL приходят из Laravel named routes.

Создай компоненты из карты в `docs/IMPLEMENTATION_PLAN.md`, включая:

```text
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
home_shell_layout.vue
home_page.vue
```

Если в ходе реализации понадобится дополнительный компонент, он должен иметь отдельную ответственность и соблюдать naming rule. Не создавай абстракцию только ради уменьшения количества строк.

## 8. Laravel и GitHub Pages должны использовать один UI

Сделай два build target:

1. `build:laravel` — Laravel Vite Plugin, `resources/js/app.ts`, output/manifest для Laravel.
2. `build:pages` — `preview/index.html` и `preview/main.ts`, статическая сборка для GitHub Pages.

Оба entrypoint импортируют один и тот же `home_page.vue`. Preview использует fixture, объявленный через `satisfies HomePageProps`. Не создавай копию HTML или отдельную preview-версию компонентов.

GitHub Pages используется как frontend preview тестового задания. Production Laravel остаётся готовым для PHP-совместимого hosting.

## 9. Порядок реализации

Следуй gates из `docs/ROADMAP.md`:

1. repository/Laravel bootstrap;
2. inventory ассетов и design tokens;
3. Laravel DTO, route, controller и TypeScript contract;
4. semantic component skeleton;
5. desktop pixel pass;
6. mobile pixel pass;
7. responsive hardening;
8. unit, feature, E2E, visual и accessibility tests;
9. linters, Lefthook и GitHub Actions;
10. GitHub push, GitHub Pages preview и handoff.

Сначала выравнивай внешнюю геометрию, затем внутренние отступы, typography baseline, SVG/raster assets, borders, radius и shadows. Не маскируй неправильную структуру абсолютным позиционированием всего экрана.

## 10. Pixel-perfect приёмка

Обязательные screenshot viewport:

```text
desktop: 1440 × 889, deviceScaleFactor 1
mobile:  390 × 1139, deviceScaleFactor 1
```

Перед screenshot:

- browser zoom 100%;
- фиксированные locale, timezone, данные и время;
- дождаться `document.fonts.ready` и загрузки изображений;
- отключить transitions, animations и caret;
- не выполнять внешние network requests.

Acceptance:

- card/container bounds: 0 px deviation;
- text bounds: максимум 1 CSS px из-за font rasterization;
- Figma PNG diff: не более `0.35%` пикселей после antialias threshold;
- ни одна связная структурная diff-область не может давать edge displacement больше 2 px;
- после визуального одобрения browser regression snapshots в pinned CI environment проходят с `maxDiffPixels: 0`.

Сохраняй `actual`, `expected`, `diff` и overlay как CI artifacts при падении. Не обновляй snapshots автоматически.

Дополнительно проверь ширины:

```text
320, 375, 390, 768, 1024, 1280, 1440, 1920
```

Не должно быть horizontal overflow, overlap, clipping или перекрытия content нижней mobile navigation.

## 11. Тесты

Реализуй только тесты, проверяющие риск и observable behavior.

Минимальный набор:

- Pest: route/auth, Inertia component, props shape, DTO, отсутствие sensitive fields;
- Pest architecture: namespace/dependency rules и отсутствие прямой Eloquent serialization;
- Vitest: currency formatter, progress/badge mappings;
- Vue Testing Library: states, aria-current, buttons/emits, accessible names;
- Playwright E2E: primary navigation, CTA, notification, mobile nav/chat, console errors;
- Playwright visual: desktop/mobile reference и regression snapshots;
- axe: zero critical/serious WCAG 2.2 A/AA violations;
- ручная keyboard, focus, VoiceOver smoke и 200% zoom проверка.

Не пиши тесты, которые лишь повторяют строку из template или проверяют внутреннюю реализацию компонента.

## 12. Hooks и CI

Настрой Lefthook:

- pre-commit: staged Prettier, ESLint fix, Stylelint fix, Pint dirty, structural check;
- pre-push: frontend quality, PHP quality, оба production build и Chromium smoke.

GitHub Actions jobs:

```text
frontend-static
php-static
unit-feature
builds
e2e
visual-a11y
```

Используй frozen lockfiles, pinned browser/container versions, dependency cache и upload artifacts при падении. Warnings считаются ошибками.

## 13. Git workflow

Если репозиторий ещё не создан, инициализируй его и работай в feature branch:

```text
feature/home-pixel-perfect
```

Используй conventional commits, например:

```text
feat(home): implement responsive home page
test(home): add visual and accessibility coverage
chore(tooling): add quality gates and hooks
```

Перед каждым push обязательно:

1. определить base: `staging`, если существует, иначе `main`;
2. `git fetch origin <base>`;
3. `git merge origin/<base>` в feature branch;
4. разрешить конфликты;
5. выполнить полный gate после merge;
6. сразу сделать push.

Если base снова сдвинулся, повторить merge и полный gate. Не merge-ить PR самостоятельно.

Если remote, GitHub authentication или Pages configuration отсутствуют, сначала полностью закончи локальную реализацию и проверки. Только затем сообщи точный внешний blocker и одну конкретную операцию, которая требуется от владельца.

## 14. Полный gate

После merge актуальной base выполни:

```bash
pnpm install --frozen-lockfile
composer install --no-interaction --prefer-dist
pnpm quality:frontend
composer quality
pnpm test:e2e
pnpm test:visual
pnpm build:laravel
pnpm build:pages
```

Дополнительно проверь:

- `git status` чистый;
- production bundle не содержит reference PNG всего экрана;
- console errors/warnings отсутствуют;
- GitHub CI зелёный;
- GitHub Pages preview открывается на обоих контрольных viewport.

## 15. Definition of Done

Не объявляй работу готовой, пока одновременно не выполнено всё:

- desktop и mobile визуально приняты по описанному protocol;
- код соответствует lead rules и `AGENTS.md`;
- все компоненты меньше 300 строк;
- inline JS/CSS отсутствуют;
- Laravel и GitHub Pages используют один набор компонентов;
- полный gate зелёный после merge свежей base;
- feature branch отправлена в GitHub;
- GitHub Pages preview доступен;
- имеются actual/expected/diff screenshots;
- README содержит команды установки, запуска, тестирования и сборки;
- PR подготовлен, но не merged.

## 16. Финальный ответ

В финале укажи:

- результат реализации;
- feature branch;
- commit SHA;
- GitHub branch/PR URL;
- GitHub Pages URL;
- локальные ссылки на desktop/mobile screenshots и diff;
- какие gates и тесты прошли;
- только реальные оставшиеся риски или blockers.

Добавь готовое Markdown-описание PR строго с разделами:

```markdown
## Что и зачем

## Как

## Риски

## Как протестировано
```

Не утверждай, что страница pixel-perfect, если не приложены обе пары reference/actual и diff-результаты.
