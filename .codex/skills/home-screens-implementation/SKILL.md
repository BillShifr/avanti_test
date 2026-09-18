---
name: home-screens-implementation
description: "Implement or review the extracted Home desktop and mobile screens in Laravel 13, Inertia 3, Vue 3, and TypeScript. Use for any coding, testing, visual QA, refactoring, or delivery work on Figma nodes 1:15 and 18:967 in this project."
---

# Home Screens Implementation

Implement one Home page with desktop and mobile compositions from the checked-in reference pack. Treat this skill as the operational checklist; treat the root `AGENTS.md` as binding policy.

## Start every implementation task

1. Read `/Users/vladislavtatyankin/test_tat/AGENTS.md`.
2. Read only the relevant sections of:
   - `references/architecture.md` for code structure and data ownership;
   - `references/visual-quality.md` for CSS or screenshot work;
   - `references/delivery.md` for hooks, CI, Git, Vercel, or handoff.
3. Inspect `home-reference/README.md` and `home-reference/mobile/README.md`.
4. Open the relevant PNG and JSON. Never infer an exact value from memory.
5. Check whether a Laravel repository already exists before scaffolding.

## Build rules

- Use Laravel 13, PHP 8.4, Inertia 3, Vue 3, TypeScript strict, Vite 8, Node 24 LTS.
- Use `<script setup lang="ts">` exclusively.
- Name Vue files `<domain>_<purpose>.vue`; one component per file; maximum 300 lines.
- Extract each button as a component. Keep template handlers as named references.
- Forbid inline `style`, `:style`, inline arrow handlers, `v-html`, `any`, client-only routing duplication, and hand-drawn replacements for exported icons.
- Keep shared tokens in CSS custom properties and component rules in scoped styles.
- Pass serializable typed props from an immutable Laravel DTO. Never pass an Eloquent model directly.
- Use the same `home_page.vue` for Laravel and the Vercel fixture preview.
- Do not add Tailwind, UI kits, Pinia, Vue Router, Axios, icon libraries, VueUse, Sass, or Storybook unless the current task proves a need and records the decision.

## Visual workflow

Implement in this order: outer geometry, card geometry, internal layout, typography, assets, effects, interactions. At each reference viewport, compare screenshots and bounding boxes before moving to the next layer.

Use Playwright in a pinned environment. Await fonts and images; disable motion. Figma comparison allows only raster antialias tolerance from `docs/QUALITY_GATES.md`; browser regression snapshots allow zero changed pixels.

## Required verification

Run narrow tests during iteration. Before completion run the full post-base-merge gate in `docs/QUALITY_GATES.md`. Do not claim pixel-perfect without desktop and mobile actual/expected/diff artifacts.

For implementation handoff, report branch, commit SHA, GitHub URL, Vercel URL, test commands/results, remaining risks, and the required Russian PR sections.
