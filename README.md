# Avanti — Home (desktop + mobile)

Реализация одной страницы `Home` в двух состояниях по Figma-макету
«Личный кабинет (Copy)»: desktop `1:15` (1440×889) и mobile `18:967` (390×1139).

Стек: **PHP 8.4 · Laravel 13 · Inertia 3 · Vue 3 (`<script setup lang="ts">`) ·
TypeScript strict · Vite 8 · нативный CSS**. Один и тот же `home_page.vue`
рендерится и Laravel-приложением, и статическим preview для Vercel.

## Требования

| Инструмент | Версия |
| ---------- | ------ |
| PHP        | 8.4    |
| Composer   | 2.8+   |
| Node       | 24 LTS |
| pnpm       | 10     |

## Установка

```bash
pnpm install --frozen-lockfile
composer install --no-interaction --prefer-dist
cp .env.example .env
php artisan key:generate
```

## Запуск

```bash
# Laravel + Vite dev server
php artisan serve          # http://localhost:8000/home
pnpm run dev

# Статический preview на фикстуре (то же, что деплоится на Vercel)
pnpm run build:preview && pnpm run preview:serve   # http://127.0.0.1:4173
```

## Тесты

```bash
pnpm run test:unit      # Vitest + Vue Testing Library
pnpm run test:e2e       # Playwright: поведение, матрица ширин, axe
pnpm run test:visual    # Playwright: геометрия, diff с Figma, regression-снимки
composer test           # Pest: feature, unit, architecture
```

Обновление regression-снимков — только в закреплённом контейнере и с
приложенными before/after/diff к PR:

```bash
pnpm exec playwright test --grep @visual --update-snapshots
```

## Качество

```bash
pnpm run quality:frontend   # typecheck + eslint + stylelint + prettier + structure + vitest
composer quality            # pint --test + phpstan + pest
pnpm run structure          # правила лида: имена файлов, 300 строк, запрет inline JS/CSS
```

Хуки ставятся через `pnpm exec lefthook install`:
pre-commit — быстрые проверки staged-файлов, pre-push — полный фронт/бэк
gate, оба продакшн-билда и Chromium smoke.

## Сборка

```bash
pnpm run build:laravel   # public/build + manifest для Laravel Vite Plugin
pnpm run build:preview   # dist-preview для Vercel
```

## Структура

```text
app/
  Data/Home/HomePageData.php          неизменяемый DTO — граница контракта
  Services/Home/HomePagePresenter.php сборка данных страницы
  Http/Controllers/Home/HomeController.php  invokable, только координация
resources/
  css/                 reset, токены, self-hosted шрифты
  fonts/inter · geist  WOFF2, подмножество latin
  images/home/         SVG и растр из Figma + assets-manifest.json
  js/
    components/home/   presentation-компоненты, по одному на файл
    layouts/           home_shell_layout.vue
    pages/home/        home_page.vue
    types/home/        TypeScript-зеркало DTO
    utils/home/        форматтеры
preview/               entrypoint и типизированная фикстура для Vercel
tests/                 Pest, Vitest, Playwright (e2e + visual), support
tools/                 structure_check.mjs, pixel_diff.mjs
docs/                  план, стек, roadmap, quality gates, ADR, доступность
```

Поток данных: именованный маршрут → `HomeController` → `HomePageData` →
Inertia props → `home_page.vue` → узкие компоненты. Eloquent во фронтенд
не попадает, деньги передаются в минорных единицах и форматируются
чистой функцией `home_currency_formatter.ts`.

## Приёмка по макету

- `pnpm run test:visual` проверяет три вещи: координаты и размеры каждого
  крупного блока против `spec/home-layout.json` (допуск 0 px для карточек,
  1 px для текстовых боксов), растровое отличие от PNG-эталонов Figma и
  браузерные regression-снимки с `maxDiffPixels: 0`.
- `actual` / `expected` / `diff` складываются в `tests/visual/output/` и
  прикладываются к прогону как артефакты.
- Достигнутое растровое отличие: **desktop 0.31 %**, **mobile 1.01 %**.
  Целевые 0.35 % из `docs/QUALITY_GATES.md` §5 выполнены на desktop. На
  mobile та же абсолютная разница краёв глифов приходится на вчетверо
  меньшую площадь, поэтому в процентах она втрое выше. Все принятые решения
  и разбор остатка — в [docs/ADR-0001-typography.md](docs/ADR-0001-typography.md).

## Известные ограничения

- Конфликты контраста унаследованы из палитры Figma и залогированы в
  [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md); правило `color-contrast`
  вынесено из блокирующего набора axe.
- Маршруты `/documenti`, `/profilo`, `/assistenza`, `/prelievo`, `/firma`
  существуют только как именованные заглушки: они нужны, чтобы Home строил
  ссылки через `route()`, а не через хардкод. Сами страницы вне scope.
