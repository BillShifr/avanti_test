# Подключение Vercel

## Что именно публикуется

Текущий `vercel.json` публикует статический preview страницы Home. Preview собирается
из того же `resources/js/pages/home/home_page.vue`, который рендерит Laravel через
Inertia, но получает детерминированные данные из `preview/fixture.ts`.

Это не замена Laravel-приложения: маршруты, DTO, серверные данные и бизнес-логика
остаются в Laravel. Полноценный PHP runtime на Vercel потребовал бы отдельной
serverless-адаптации. PHP указан Vercel как community runtime, а не как встроенный
официальный runtime, поэтому такая миграция не входит в текущий preview и не должна
включаться случайно.

Полезные официальные ссылки:

- [подключение Git-репозитория](https://vercel.com/docs/git);
- [настройка build и output directory](https://vercel.com/docs/builds/configure-a-build);
- [деплой через CLI](https://vercel.com/docs/projects/deploy-from-cli);
- [PHP community runtime и ограничения runtimes](https://vercel.com/docs/functions/runtimes).

## Готовая конфигурация проекта

Настройки уже сохранены в `vercel.json`:

| Поле Vercel       | Значение                         |
| ----------------- | -------------------------------- |
| Project Name      | `avanti-home`                    |
| Framework Preset  | `Other`                          |
| Root Directory    | `.`                              |
| Install Command   | `pnpm install --frozen-lockfile` |
| Build Command     | `pnpm run build:preview`         |
| Output Directory  | `dist-preview`                   |
| Production Branch | `main`                           |

Для статического preview переменные Laravel (`APP_KEY`, база данных и другие
секреты) не нужны. Не добавляйте `.env`, токены или Vercel credentials в Git.

## Вариант 1: подключение через Dashboard

1. Войдите в [Vercel](https://vercel.com/) через GitHub-аккаунт, которому доступен
   репозиторий `BillShifr/avanti_test`.
2. Нажмите **Add New → Project** и выберите **Import** напротив репозитория.
3. Укажите имя проекта `avanti-home`.
4. Проверьте настройки из таблицы выше. Значения из `vercel.json` имеют приоритет,
   поэтому дублировать overrides в Dashboard не требуется.
5. Убедитесь, что Production Branch — `main`.
6. Нажмите **Deploy**. Первый production deployment соберётся из `main`.
7. Для проверки текущей feature-ветки откройте **Deployments → Create Deployment**,
   выберите ветку `feature/home-pixel-perfect` и создайте Preview Deployment.

После подключения Git новые push в feature-ветки создают Preview Deployment, а
изменения production-ветки `main` — Production Deployment.

## Вариант 2: подключение через CLI

Команды выполняются из корня репозитория:

```bash
vercel login
vercel link
vercel deploy
```

При `vercel link` выберите нужную команду/личный аккаунт и проект `avanti-home`.
Если проекта ещё нет, CLI предложит создать его. Команда `vercel deploy` создаёт
Preview Deployment текущей ветки. Production deployment запускается только явно:

```bash
vercel deploy --prod
```

Каталог `.vercel`, создаваемый после link, игнорируется Git и не должен попадать в
коммиты.

## Проверка результата

1. В deployment log должны успешно завершиться install и `build:preview`.
2. В Build Output должен присутствовать каталог `dist-preview`.
3. Откройте выданный URL на desktop и mobile.
4. Проверьте `/`, `/home` и обновление страницы по прямой ссылке: rewrite должен
   вернуть `index.html` без 404.
5. В ответах должен присутствовать `X-Robots-Tag: noindex`.
6. Сохраните Preview URL в описании PR.

## Если сборка не запускается

- Проверьте, что Root Directory равен `.`.
- Проверьте Node.js 24 и package manager из `packageManager` в `package.json`.
- Не заменяйте `pnpm install --frozen-lockfile` на установку без lock-файла.
- Не указывайте `public/build` как Output Directory: это Laravel bundle, а Vercel
  preview собирается отдельно в `dist-preview`.
- Если Vercel не видит feature-ветку после первоначального импорта, создайте
  deployment по имени ветки в разделе Deployments или выполните `vercel deploy`
  из этой ветки.
