# Руководство по реализации Home

Это операционный чеклист для изменений Home desktop и mobile. Обязательная политика
проекта находится в корневом `AGENTS.md`.

## Перед началом работы

1. Прочитать `AGENTS.md`.
2. Выбрать релевантный раздел:
   - [архитектура](architecture.md);
   - [визуальное качество](visual-quality.md);
   - [поставка](delivery.md).
3. Проверить `home-reference/README.md` и `home-reference/mobile/README.md`.
4. Открыть релевантные PNG и JSON, не восстанавливать точные значения по памяти.
5. Сохранить Laravel как владельца маршрутов, данных и серверного контракта.

## Правила реализации

- Laravel 13, PHP 8.4, Inertia 3, Vue 3, TypeScript strict, Vite 8, Node 24 LTS.
- Только `<script setup lang="ts">`.
- Один компонент в файле, имена `<domain>_<purpose>.vue`, максимум 300 строк.
- Типизированные serializable props передаются из immutable Laravel DTO.
- Один `home_page.vue` используется Laravel и GitHub Pages fixture preview.
- Нельзя добавлять вторую реализацию UI, клиентский роутер или лишний state manager.

## Обязательная проверка

Перед поставкой выполнить полный post-base-merge gate из
`docs/QUALITY_GATES.md`. Pixel-perfect готовность подтверждается desktop/mobile
артефактами actual, expected и diff.
