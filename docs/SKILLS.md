# Матрица навыков и evidence

Этот файл отвечает на вопрос «что должен уметь исполнитель» и чем это доказывается в PR.

| Навык | Ожидаемое решение | Evidence |
|---|---|---|
| Figma forensics | Читать node geometry, effects, typography и component instances; не угадывать по PNG | Asset manifest, measurement table, overlay/diff |
| Semantic HTML | Выбрать `a`/`button`, landmarks, ordered progress, accessible labels | Component DOM tests, axe, keyboard video/checklist |
| Advanced CSS | Grid/Flex, scoped styles, custom properties, responsive reflow, safe-area, exact shadows/fonts | Desktop/mobile screenshots, overflow matrix |
| Vue 3 Composition API | `<script setup>`, typed props/emits, small presentation components | `vue-tsc`, component tests, files <300 LOC |
| TypeScript | Discriminated unions, strict contract, pure formatters, no unsafe escapes | strict typecheck, fixture `satisfies` contract |
| Laravel | Thin controller, DTO boundary, named routes, Inertia props, auth policy | Pest feature/architecture tests |
| Inertia 3 | Server-driven route and data hydration without duplicate API/router | Network trace: no initial client fetch |
| Testing strategy | Risk-based unit/component/feature/E2E/visual coverage | Green CI with failure artifacts |
| Accessibility | WCAG 2.2 A/AA, keyboard/focus/zoom, semantic status | axe + manual checklist |
| Build engineering | Dual Vite entrypoints sharing one UI, deterministic lockfiles | Both production builds |
| Git hygiene | Focused commits, base merge before push, reviewable PR | Clean history, current base, PR template |
| Deployment | Git-linked Vercel preview and Laravel-ready artifact | Vercel URL + Laravel build artifact |

## Codex skills used for this project

- `skill-creator`: used to create the local, reusable execution skill at `.codex/skills/home-screens-implementation`.
- `figma-design-to-code`: must be loaded before any future Figma `get_design_context` call used during implementation.
- `git-feature-handoff`: should be used when implementation is complete and the branch is ready to merge base, validate, push and hand off.

The first implementation turn should load the local Home skill. The final delivery turn should also load `git-feature-handoff`. Skills guide the workflow; `AGENTS.md` remains the hard project policy.

## Senior review questions

- Can the reviewer trace every visual value to a token or Figma node?
- Does mobile reuse domain components instead of copying desktop markup wholesale?
- Is every dependency solving a current problem?
- Can Laravel change its persistence model without changing presentation components?
- Can a failed screenshot test explain where and how many pixels changed?
- Can the repository be cloned, installed, tested and built without undocumented global tools?
- Does the Vercel URL run the same Home component that Laravel renders?
- Are accessibility corrections explicit when the source design is incomplete?

