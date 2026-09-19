# Тестирование и quality gates

## 1. Скрипты проекта

Имена должны быть стабильны, чтобы hooks и CI не дублировали команды:

```json
{
  "scripts": {
    "dev": "vite",
    "build:laravel": "vite build",
    "build:preview": "vite build --config vite.preview.config.ts",
    "typecheck": "vue-tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "lint:css": "stylelint 'resources/**/*.{css,vue}'",
    "format:check": "prettier . --check",
    "test:unit": "vitest run",
    "test:e2e": "playwright test --grep-invert @visual",
    "test:visual": "playwright test --grep @visual",
    "quality:frontend": "pnpm typecheck && pnpm lint && pnpm lint:css && pnpm format:check && pnpm test:unit"
  }
}
```

Composer aliases:

```json
{
  "scripts": {
    "test": "pest",
    "analyse": "phpstan analyse --memory-limit=1G",
    "format:check": "pint --test",
    "quality": ["@format:check", "@analyse", "@test"]
  }
}
```

Root `Makefile` или `justfile` может объединить `quality`, но не должен скрывать параметры или менять смысл CI.

## 2. Pre-commit

Lefthook запускает только staged/dirty быстрые проверки:

- Prettier write на staged JS/TS/Vue/CSS/JSON/Markdown;
- ESLint `--fix` на staged JS/TS/Vue;
- Stylelint `--fix` на staged CSS/Vue;
- Pint `--dirty` на PHP;
- custom structural checker: Vue filename, 300 LOC, banned inline style/handlers;
- повторно добавить исправленные файлы в index через встроенную `{staged_files}` механику.

Pre-commit не запускает browser suite. Его цель — обратная связь до 15 секунд.

## 3. Pre-push

Pre-push локально запускает:

- `pnpm quality:frontend`;
- `composer quality`;
- `pnpm build:laravel`;
- `pnpm build:preview`;
- Chromium E2E smoke.

Полный visual/cross-browser gate остаётся CI, но глобальное правило merge-base-before-push обязательно: hook не заменяет fetch + merge + повторный gate.

## 4. Test pyramid

### PHP feature tests

- guest/auth behavior route `/home`;
- controller returns Inertia component `home/home_page`;
- props contain required shape and named URLs;
- notification/progress counts are integers with valid ranges;
- money remains integer minor units;
- no sensitive backend fields leak into props.

### PHP architecture tests

- Controllers end in `Controller` and do not exceed one public action for invokable controller;
- DTO namespace cannot depend on HTTP layer;
- no direct Eloquent model serialization in Home response;
- Pest Laravel, strict and security presets where compatible.

### TypeScript unit tests

- currency formatter for EUR, zero and large values;
- progress modifier mapping;
- badge formatter `0`, `9`, `99+`;
- no tests for trivial prop forwarding.

### Vue component tests

- queries use role/name/text instead of CSS implementation selectors;
- buttons emit named events and expose disabled state;
- active nav exposes `aria-current`;
- complete/current/pending states expose textual or ARIA meaning;
- user image has correct alternative handling;
- desktop-only/mobile-only sections use expected classes/semantics.

### Playwright E2E

- page renders without console/page errors;
- desktop primary navigation links have correct destinations;
- withdraw CTA is keyboard reachable and performs expected navigation/event;
- notification and support controls have correct badge/accessible name;
- mobile bottom navigation and floating chat are operable;
- no horizontal scroll at viewport matrix;
- browser matrix: Chromium required, Firefox/WebKit smoke.

## 5. Pixel-perfect protocol

### Reference checks

1. Set `deviceScaleFactor: 1`, zoom 100%, locale/timezone fixed.
2. Load exact local Inter fonts and await `document.fonts.ready`.
3. Disable caret, transitions and animations via test stylesheet.
4. Use fixed fixture, no network calls, fixed clock.
5. Screenshot at `1440 × 889` and `390 × 1139`.
6. Generate `actual`, `expected`, `diff` and 50% overlay.
7. Validate DOM bounding boxes for every major block against reference table.

Acceptance has two layers:

- **Geometry:** expected x/y/width/height must match; tolerance is at most 1 CSS px for text bounds and 0 px for card/container bounds.
- **Figma raster:** pixelmatch threshold may ignore subpixel antialiasing, but total differing pixels must stay under `0.35%`, and no connected structural diff region may exceed 2 px along an edge.

Bit-identical PNG comparison between Figma export and browser output is not a valid cross-platform requirement because font and graphics rasterization vary by OS/browser. Figma fidelity and browser regression therefore run on the pinned `macos-26` CoreText runner with Playwright Chromium 1.63 and `maxDiffPixels: 0`; Linux/Skia remains a separate functional cross-browser gate.

Playwright reference screenshots remain committed. Updating them requires:

- `pnpm test:visual --update-snapshots` executed on the pinned `macos-26` runner;
- before/after/diff attached to PR;
- a reason tied to Figma or an approved design correction.

## 6. Accessibility and usability gate

- `@axe-core/playwright` has zero critical/serious WCAG 2.2 A/AA violations;
- manual keyboard pass covers every link/button and visible focus;
- VoiceOver quick pass checks page landmarks, nav name, progress and buttons;
- 200% zoom has no information loss or horizontal page scroll at desktop;
- content remains understandable without color;
- contrast conflicts in Figma are logged. Accessibility wins for functional state/focus while preserving geometry.

Automated axe checks do not prove full accessibility; manual checks are required because axe itself documents partial automatic coverage.

## 7. CI jobs

1. `frontend-static`: frozen install, typecheck, ESLint, Stylelint, Prettier, structure script.
2. `php-static`: Composer install, Pint check, Larastan.
3. `unit-feature`: Vitest coverage + Pest.
4. `builds`: Laravel production build + Vercel preview build; upload bundles on failure.
5. `e2e`: Chromium functional, Firefox/WebKit smoke.
6. `visual-a11y`: `macos-26`, pinned Chromium, Figma diff, zero-diff regression; upload artifacts always.

Recommended coverage policy focuses on meaningful code:

- 100% branch coverage for pure formatters/state mappings;
- 90% lines/branches for Home frontend domain files;
- every controller/DTO path covered by Pest;
- coverage percentage never substitutes for scenario coverage.

## 8. Performance budget

For this Home entry on a clean production build:

- no duplicate Vue runtime or separate desktop/mobile bundle;
- critical font WOFF2 preload only for weights visible above fold;
- all images have width/height and appropriate compression;
- no third-party runtime JS for the two screens;
- Lighthouse mobile targets: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95;
- CLS ≤ 0.02 for fixture page;
- console errors/warnings = 0.

## 9. Full gate before push

After merging the latest base, run in this order:

```bash
pnpm install --frozen-lockfile
composer install --no-interaction --prefer-dist
pnpm quality:frontend
composer quality
pnpm test:e2e
pnpm test:visual
pnpm build:laravel
pnpm build:preview
```

Push immediately after success. If base changes, merge and repeat all commands.

## Sources

- [Vue Test Utils](https://test-utils.vuejs.org/guide/)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
- [Vitest 5](https://vitest.dev/guide/)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- [axe-core](https://github.com/dequelabs/axe-core)
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Pest browser testing](https://pestphp.com/docs/browser-testing)
