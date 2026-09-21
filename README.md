# Avanti — Home (desktop + mobile)

Реализация одной страницы `Home` в двух состояниях по Figma-макету
«Личный кабинет (Copy)»: desktop `1:15` (1440×889) и mobile `18:967` (390×1139).

Стек: **PHP 8.4 · Laravel 13 · Inertia 3 · Vue 3 (`<script setup lang="ts">`) ·
TypeScript strict · Vite 8 · нативный CSS**. Один и тот же `home_page.vue`
рендерится и Laravel-приложением, и статическим preview для GitHub Pages.

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
touch database/database.sqlite
php artisan key:generate
```

## Запуск

```bash
# ларавел и сервер разработки
php artisan serve
pnpm run dev

# статический предварительный просмотр
pnpm run build:preview && pnpm run preview:serve
```

## Тесты

```bash
pnpm run test:unit      # модульные тесты
pnpm run test:e2e       # браузерные тесты поведения
pnpm run test:visual    # визуальные тесты
composer test           # серверные тесты
```

Обновление regression-снимков — только в закреплённом контейнере и с
приложенными before/after/diff к PR:

```bash
pnpm exec playwright test --grep @visual --update-snapshots
```

## Качество

```bash
pnpm run quality:frontend   # проверка клиентской части
composer quality            # проверка серверной части
pnpm run structure          # проверка структуры
```

Хуки ставятся через `pnpm exec lefthook install`:
pre-commit — быстрые проверки staged-файлов, pre-push — полный фронт/бэк
gate, оба продакшн-билда и Chromium smoke.

## Сборка

```bash
pnpm run build:laravel   # сборка для ларавел
pnpm run build:preview   # локальная предварительная сборка
pnpm run build:pages     # сборка для публикации
```

Пошаговое включение и публикация описаны в
[инструкции GitHub Pages](docs/GITHUB_PAGES_DEPLOYMENT.md). Pages публикует
проверочный статический preview того же Vue-компонента; основное приложение остаётся Laravel.

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
preview/               entrypoint и типизированная фикстура для GitHub Pages
tests/                 Pest, Vitest, Playwright (e2e + visual), support
tools/                 structure_check.mjs, pixel_diff.mjs
docs/                  план, стек, roadmap, quality gates, ADR, доступность
```

Поток данных: именованный маршрут → `HomeController` → `HomePageData` →
Inertia props → `home_page.vue` → узкие компоненты. Eloquent во фронтенд
не попадает, деньги передаются в минорных единицах и форматируются
чистой функцией `home_currency_formatter.ts`.
