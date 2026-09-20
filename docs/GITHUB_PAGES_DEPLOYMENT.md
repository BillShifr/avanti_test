# Публикация на GitHub Pages

## Что публикуется

GitHub Pages публикует статический review-preview из `dist-preview`. Он импортирует
тот же `resources/js/pages/home/home_page.vue`, который Laravel рендерит через
Inertia, и подставляет детерминированные данные из
`preview/fixtures/home_page.fixture.ts`.

Pages не запускает PHP и не заменяет Laravel. Именованные маршруты, invokable
контроллер, immutable DTO, серверные данные и auth policy остаются в Laravel.
Production Laravel должен работать на PHP-совместимом хостинге.

Официальные инструкции:

- [custom workflow для GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages);
- [выбор источника публикации](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Подготовленная конфигурация

Workflow `.github/workflows/pages.yml`:

1. устанавливает Node 24 и зависимости из frozen lock-файла;
2. передаёт Vite project base `/<repository>/`;
3. запускает `pnpm run build:pages`;
4. загружает `dist-preview` как Pages artifact;
5. публикует artifact через официальный `actions/deploy-pages`.

Preview-ссылки используют hash после project base, поэтому не выходят за пределы
`/avanti_test/` и не требуют серверного SPA rewrite.

## Первичное включение Pages

1. Откройте репозиторий `BillShifr/avanti_test` на GitHub.
2. Перейдите в **Settings → Pages**.
3. В разделе **Build and deployment → Source** выберите **GitHub Actions**.
4. Сохраните настройку, если GitHub показывает кнопку сохранения.

Сторонние токены, deploy keys и переменные окружения не нужны: workflow использует
короткоживущий `GITHUB_TOKEN` с минимальными `pages: write` и `id-token: write`.

## Публикация текущей feature-ветки

Публичный deployment запускается вручную:

1. Откройте **Actions → Deploy GitHub Pages**.
2. Нажмите **Run workflow**.
3. Выберите ветку `feature/home-pixel-perfect`.
4. Подтвердите **Run workflow**.
5. Дождитесь зелёных jobs `build` и `deploy`.

Ожидаемый URL проекта:

```text
https://billshifr.github.io/avanti_test/
```

После merge в `main` workflow будет запускаться автоматически только после зелёного
workflow `CI`. Самостоятельно сливать feature-ветку ради публикации не нужно.

## Проверка результата

1. Откройте URL на desktop `1440 × 889` и mobile `390 × 1139`.
2. Проверьте локальные шрифты, изображения и отсутствие ошибок в console/network.
3. Проверьте основные ссылки: они должны оставаться внутри
   `https://billshifr.github.io/avanti_test/`.
4. Обновите страницу после перехода по hash-ссылке — интерфейс должен открыться без 404.
5. Добавьте Pages URL в описание PR и итоговый handoff.

## Если workflow не публикует сайт

- Ошибка `Get Pages site failed`: включите **Settings → Pages → GitHub Actions**.
- Ошибка environment protection: разрешите выбранной ветке deployment в environment
  `github-pages` или подтвердите ожидающее approval.
- 404 для assets: проверьте, что `PAGES_BASE_PATH` равен `/<repository>/` с завершающим
  `/`.
- Пустой artifact: локально выполните `pnpm run build:pages` и проверьте
  `dist-preview/index.html`.
- Не публикуйте `public/build`: это Laravel Vite bundle без статического HTML.
