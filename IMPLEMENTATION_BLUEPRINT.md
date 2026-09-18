# Home: blueprint реализации

Дата фиксации стека: **18 сентября 2026**.

Этот каталог содержит исполнимый план для двух представлений одной страницы `Home`:

- desktop: `1440 × 889`, Figma node `1:15`;
- mobile: `390 × 1139`, Figma node `18:967`.

## Что читать и в каком порядке

1. [Архитектура и компоненты](docs/IMPLEMENTATION_PLAN.md)
2. [Выбор стека и библиотек](docs/TECH_STACK.md)
3. [Roadmap с критериями готовности](docs/ROADMAP.md)
4. [Тестирование и quality gates](docs/QUALITY_GATES.md)
5. [Матрица инженерных навыков](docs/SKILLS.md)
6. [Правила для разработчика и Codex](AGENTS.md)
7. [Проектный Codex skill](.codex/skills/home-screens-implementation/SKILL.md)
8. [Готовый master prompt для разработки](DEVELOPMENT_PROMPT.md)

## Источники дизайна

- [Desktop reference](home-reference/home-1440x889.png)
- [Mobile reference](home-reference/mobile/home-mobile-390x1139.png)
- [Desktop specification](home-reference/spec/home-layout.json)
- [Mobile specification](home-reference/mobile/spec/home-layout.json)
- [Desktop extraction notes](home-reference/README.md)
- [Mobile extraction notes](home-reference/mobile/README.md)

PNG и SVG — визуальная истина. JSON — источник размеров, координат, стилей, текста и структуры. При расхождении нельзя угадывать: сначала проверяется Figma node, затем фиксируется решение в ADR или PR.

## Принятое решение

Основное приложение: **Laravel 13 + PHP 8.4 + Inertia 3 + Vue 3 + TypeScript + Vite 8**. Laravel владеет маршрутом, авторизацией и данными; Vue владеет представлением. Компоненты получают готовые типизированные props и не знают об Eloquent.

Тот же `home_page.vue` используется статическим preview entrypoint. Он получает данные из fixture и собирается Vite для Vercel. Это даёт обязательную ссылку Vercel без второй реализации интерфейса. Production Laravel разворачивается в PHP-совместимой среде; Vercel используется как проверяемый frontend preview.

## Definition of Done

Работа готова только когда одновременно выполнено следующее:

- desktop и mobile совпадают с референсами по сетке, размерам, типографике, цветам, радиусам, теням и ассетам;
- нет горизонтального overflow на `320`, `375`, `390`, `768`, `1024`, `1440`, `1920` px;
- каждый Vue-компонент находится в одном `.vue`-файле и не превышает 300 строк;
- все кнопки являются компонентами, а обработчики имеют имена в `<script setup lang="ts">`;
- отсутствуют `style="..."`, `:style`, inline arrow-functions в template и hand-written SVG, если экспорт уже есть;
- проходят TypeScript, ESLint, Stylelint, Prettier, unit/component, Laravel feature, accessibility, E2E, visual и production build;
- ветка синхронизирована с базой перед push, затем повторно пройден полный gate;
- GitHub-ветка и Vercel Preview доступны проверяющему.
