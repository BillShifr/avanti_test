# Roadmap реализации

Roadmap устроен как последовательность gates. Нельзя переходить дальше, пока критерии этапа не выполнены. Оценки даны в фокус-днях senior frontend/full-stack разработчика и нужны для порядка, а не для обещания срока.

## Этап 0. Repository bootstrap — 0.5 дня

Работы:

- инициализировать Laravel 13 repository и feature branch `codex/home-pixel-perfect`;
- зафиксировать PHP 8.4, Node 24 LTS, pnpm 10;
- установить Laravel Vue starter stack с Inertia 3 и TypeScript;
- удалить неиспользуемые UI primitives из Home scope;
- добавить `.editorconfig`, lockfiles, scripts и CI skeleton;
- определить base branch: `staging`, если существует, иначе `main`.

Gate:

- чистая установка воспроизводится по README;
- Laravel отвечает 200, Vite HMR работает;
- пустой production build проходит;
- секретов и локальных absolute paths в tracked files нет.

## Этап 1. Design inventory — 0.5 дня

Работы:

- сверить PNG, SVG и JSON для nodes `1:15` и `18:967`;
- составить asset manifest: semantic filename → Figma node → checksum → usage;
- self-host Inter 300/400/500/600/700;
- перенести подтверждённые цвета, shadows, radius, spacing и type styles в tokens;
- зафиксировать desktop/mobile measurement checklist.

Gate:

- каждый production asset имеет источник;
- нет placeholder icon, emoji или случайного изображения;
- font test подтверждает загрузку каждого weight без synthetic fallback;
- token list не содержит придуманного значения без назначения.

## Этап 2. Data boundary и Laravel route — 0.5 дня

Работы:

- создать `HomePageData`, controller и named route;
- описать `HomePageProps` TypeScript;
- собрать deterministic fixture на основе Figma текста;
- написать Pest feature test route/status/Inertia component/props shape;
- добавить currency formatter и его unit tests.

Gate:

- PHP DTO и TS fixture отражают один контракт;
- Eloquent model не сериализуется прямо в Vue;
- route test и TS typecheck проходят;
- page не делает дополнительный fetch при загрузке.

## Этап 3. Semantic component skeleton — 0.75 дня

Работы:

- создать page, layout и компоненты из component map;
- сначала реализовать semantic DOM и states без точной отделки;
- добавить named handlers/emits и keyboard semantics;
- настроить rule на лимит 300 строк и запреты inline JS/CSS;
- написать component tests только для вариантов и поведения.

Gate:

- все имена соответствуют `<domain>_<purpose>.vue`;
- каждая кнопка отдельна;
- ни один `.vue` не превышает 300 строк;
- нет `style`, `:style`, inline arrow handler, `any`, `v-html`;
- axe smoke не находит critical/serious violations.

## Этап 4. Desktop pixel pass — 1 день

Порядок настройки:

1. viewport, page background, header heights;
2. content max-width, 72px margins, columns `792/464`, 40px gap;
3. card boxes, borders, radius, shadow;
4. internal flex/grid spacing;
5. font metrics and baselines;
6. exact SVG/raster placement;
7. focus/hover states, не меняющие layout.

Gate на `1440 × 889`:

- bounding boxes ключевых блоков совпадают с reference;
- нет layout deviation больше 1 CSS px;
- difference review не показывает систематического offset;
- все desktop component screenshots подтверждены;
- desktop keyboard flow логичен.

## Этап 5. Mobile pixel pass — 1 день

Порядок настройки:

1. header `62px`, side padding `16px`;
2. cards `358px` и vertical positions reference;
3. balance typography/gradient/CTA;
4. progress banner и checklist;
5. fixed bottom nav `62px`, safe-area;
6. floating chat and badge;
7. long content and 320px fallback.

Gate на `390 × 1139`:

- ключевые bounding boxes совпадают;
- fixed UI не перекрывает focusable content;
- touch targets и accessible names корректны;
- нет horizontal scroll at 320/375/390;
- mobile visual reference review принят.

## Этап 6. Responsive hardening — 0.5 дня

Работы:

- проверить 320, 375, 390, 768, 1024, 1280, 1440, 1920;
- проверить длинные имя/email, notification count 0/9/99+, currency values;
- проверить 200% zoom, text-only zoom и reduced motion;
- проверить empty/complete/current states progress/checklist;
- обеспечить CLS около нуля после загрузки font/images.

Gate:

- нет overlap, clipping, accidental wrap и overflow;
- semantic order совпадает с visual order;
- responsive behavior не зависит от чтения `window.innerWidth` в render;
- reference viewport не регрессировали.

## Этап 7. Test pyramid и deterministic visual CI — 0.75 дня

Работы:

- Vitest tests для formatter и component variants;
- Pest route/DTO/architecture tests;
- Playwright E2E для nav, notification, CTA, mobile nav/chat;
- axe WCAG 2.2 A/AA scan;
- Figma comparison tests and stable regression snapshots;
- запуск browser tests в pinned Linux container.

Gate:

- все уровни тестов зелёные;
- flaky retry не скрывает дефект; CI retries = 0 для visual gate;
- snapshot update требует explicit command и code review;
- failed visual job сохраняет actual/expected/diff artifacts.

## Этап 8. Tooling, hooks и CI — 0.5 дня

Работы:

- ESLint 10 flat typed config, Stylelint, Prettier, Pint, Larastan;
- Lefthook pre-commit и pre-push;
- GitHub Actions jobs: frontend-static, php-static, tests, e2e-visual, builds;
- dependency cache keyed by both lockfiles;
- concurrency отменяет устаревший run той же PR.

Gate:

- локальный `pnpm quality` эквивалентен CI policy;
- `--no-verify` не является documented workflow;
- warnings treated as errors;
- production Laravel и preview builds проходят с clean checkout.

## Этап 9. Vercel и handoff — 0.5 дня

Работы:

- создать preview entrypoint с тем же `home_page.vue`;
- настроить `vercel.json`, build command/output directory;
- подключить Git repository к Vercel;
- проверить Preview URL на desktop/mobile;
- добавить README запуска и review instructions.

Перед push:

1. fetch base;
2. merge `origin/<base>`;
3. полный gate;
4. push без паузы;
5. дождаться GitHub CI и Vercel deployment.

Финальный Gate:

- проверяющему доступны GitHub branch/PR и Vercel URL;
- branch не конфликтует с base;
- CI зелёный;
- PR содержит `Что и зачем`, `Как`, `Риски`, `Как протестировано`;
- приложены desktop/mobile screenshots и при необходимости diff artifacts.

## Out of scope

- Реальная выдача средств и backend mutation;
- реализация остальных Figma screens;
- production auth, notification center, chat backend;
- полноценная общая design system;
- SSR, если он не требуется существующим Laravel приложением;
- самостоятельный production deploy Laravel backend на Vercel.

