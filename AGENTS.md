# Правила реализации Home

Эти правила обязательны для всех изменений, относящихся к desktop и mobile Home.

## Границы задачи

- Реализуются только desktop Home (`1:15`) и mobile Home (`18:967`).
- Не добавлять страницы, auth flow, backend CRUD или дизайн-систему сверх того, что нужно Home.
- Архитектура должна позволять продолжить проект без переписывания текущих компонентов.
- До кода прочитать `IMPLEMENTATION_BLUEPRINT.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/QUALITY_GATES.md` и оба `home-reference/**/README.md`.

## Компоненты

1. Любой интерактивный элемент — отдельный компонент. Каждая кнопка обязана быть отдельным `.vue`-файлом.
2. Один Vue-компонент — один `.vue`-файл. Не объявлять локальные компоненты объектами внутри другого компонента.
3. Имя файла: `<domain>_<purpose>.vue`, только `snake_case`. Для этой задачи домен обычно `home`, общий примитив — `shared`.
4. Импортированное имя компонента — PascalCase, совпадающий по смыслу с именем файла: `home_withdraw_button.vue` → `HomeWithdrawButton`.
5. Файл не должен превышать 300 строк, включая template, script и style. Цель — до 220 строк; при приближении к лимиту разделить по ответственности.
6. Переиспользование строить через props, slots и emits. Не создавать универсальный компонент с десятками несвязанных boolean props.
7. Использовать только `<script setup lang="ts">`, `defineProps`, `defineEmits`, `computed` и composables при реальной необходимости.
8. Props и emits типизировать. `any`, необоснованные type assertions и `@ts-ignore` запрещены.
9. Компонент не обращается к API, Eloquent-структуре или глобальному store, если это presentation component.
10. Не абстрагировать одноразовую разметку, если нет отдельной ответственности. DRY не должен ухудшать KISS.

## Template и стили

- Запрещены HTML `style`, Vue `:style`, `v-html`, inline arrow-functions и выражения с бизнес-логикой в template.
- Допустимы простые привязки: `:class`, `:aria-*`, `v-if`, `v-for`, `@click="handleClick"`.
- Все обработчики — именованные функции в script. Вычисления — `computed` или чистые функции.
- Стили компонента находятся в его `<style scoped>`; общие reset, font-face и tokens находятся в `resources/css`.
- Цвета, spacing, radius, shadow, z-index, typography объявлять semantic CSS custom properties. Не размножать magic values.
- Исключение для точного значения из Figma допускается рядом с комментарием `/* Figma node X:Y */`, если токен не имеет смысла.
- Не использовать Tailwind utility chains, CSS-in-JS, runtime-generated class names или UI-kit.
- Не перерисовывать экспортированную иконку. Использовать SVG из `resources/images/home` как `<img>`; декоративный SVG имеет пустой `alt`.
- Не вставлять весь экран как SVG или PNG. Референсы используются только в тестах и документации.
- Desktop и mobile реализуют одну семантическую страницу. Различия задаются CSS layout и небольшими viewport-specific компонентами, а не копией всей страницы.
- Основные контрольные viewport: `1440 × 889` и `390 × 1139`, browser zoom 100%.

## Архитектура и данные

- Laravel route → invokable `HomeController` → immutable `HomePageData` → Inertia `home/home_page`.
- Контракт props описан одновременно PHP DTO и TypeScript interfaces. Названия полей совпадают.
- Денежные значения передавать minor units + ISO currency, форматировать через чистый formatter. Не передавать заранее склеенную HTML-строку.
- URL передавать из Laravel named routes. Не хардкодить production paths в компонентах.
- Не устанавливать Pinia, Vue Router, Axios, UI-kit или icon pack для этой страницы: у них нет владельца состояния/задачи в текущем scope.
- Vercel preview использует тот же page component и типизированный fixture; отдельная копия UI запрещена.

## Доступность

- Использовать `header`, `nav`, `main`, `section`, списки и настоящие `button`/`a` по назначению.
- Иконка без текста получает accessible name; декоративная скрывается от accessibility tree.
- Focus indicator не удалять. Touch target стремится к `44 × 44`; если Figma меньше, интерактивная область расширяется без изменения видимой геометрии.
- Активный nav item получает `aria-current="page"`; progress/checklist имеют текстовое состояние, не только цвет.
- Поддержать keyboard navigation, 200% zoom, reduced motion и safe-area mobile.

## Тесты

- Тестировать observable behavior, props contract, emits, route response и ключевые пользовательские переходы.
- Не писать тесты, повторяющие implementation detail или статическую строку без риска.
- Для visual tests дождаться `document.fonts.ready`, отключить transitions/animations и использовать фиксированные данные/время.
- Изменение reference snapshot допускается только после сравнения с Figma и объяснения в PR.
- Полные команды и пороги находятся в `docs/QUALITY_GATES.md`.

## Git и поставка

- Работать в ветке `codex/home-pixel-perfect` или в согласованной feature-ветке.
- Conventional commits: `feat(home): ...`, `test(home): ...`, `chore(tooling): ...`.
- Не коммитить `.env`, токены, cookies, Vercel credentials, Playwright traces с персональными данными или исходный `.fig`, если лицензия/размер репозитория этого не допускают.
- Перед каждым push определить базу (`staging`, если она есть; иначе `main`) и выполнить строго по порядку:
  1. `git fetch origin <base>`;
  2. `git merge origin/<base>`;
  3. разрешить конфликты;
  4. полный gate: typecheck, JS tests, PHP tests, Prettier check, ESLint, Stylelint, Pint check, Larastan, Playwright, visual tests, production Laravel build и Vercel preview build;
  5. сразу `git push`.
- Если база сдвинулась после gate, повторить fetch, merge и весь gate.
- Не merge-ить PR самостоятельно.
- Финальный handoff содержит branch, commit SHA, GitHub URL, Vercel Preview URL и Markdown-разделы `Что и зачем`, `Как`, `Риски`, `Как протестировано`.

