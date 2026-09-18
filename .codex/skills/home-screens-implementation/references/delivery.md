# Delivery reference

Read `/Users/vladislavtatyankin/test_tat/AGENTS.md` and `/Users/vladislavtatyankin/test_tat/docs/ROADMAP.md` before delivery work.

Before every push:

1. identify `staging`, otherwise `main`;
2. fetch that base;
3. merge `origin/<base>` into the feature branch;
4. resolve conflicts;
5. run the complete gate from `docs/QUALITY_GATES.md`;
6. push immediately; repeat if base moved.

Never merge the PR. Verify the GitHub branch and Vercel preview are accessible. Final handoff includes branch, SHA, URLs and sections `Что и зачем`, `Как`, `Риски`, `Как протестировано`.

