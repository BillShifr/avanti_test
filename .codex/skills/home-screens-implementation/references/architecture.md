# Architecture reference

Source of truth: `/Users/vladislavtatyankin/test_tat/docs/IMPLEMENTATION_PLAN.md`.

Load this reference for component, data, Laravel, Inertia, responsive, asset, or dependency decisions.

Key constraints:

- one Laravel route and one typed page contract;
- desktop/mobile share domain components;
- page composes, controller coordinates, DTO serializes, presentation components render;
- component files are domain-prefixed snake_case and under 300 lines;
- no dependency without a current owner and use case;
- no duplicated Vercel UI.

When a requested change conflicts with the plan, prefer the user's explicit request, then update the plan or record an ADR so code and documentation stay consistent.

