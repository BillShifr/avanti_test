# Visual quality reference

Read:

- `/Users/vladislavtatyankin/test_tat/home-reference/README.md`
- `/Users/vladislavtatyankin/test_tat/home-reference/mobile/README.md`
- `/Users/vladislavtatyankin/test_tat/docs/QUALITY_GATES.md`

Reference viewports:

- desktop `1440 × 889`, node `1:15`;
- mobile `390 × 1139`, node `18:967`.

Use PNG/SVG for appearance and JSON for exact properties. Do not ship the full-screen reference. Check major block geometry with DOM measurements, then screenshot overlay/diff. Reject a structural mismatch even if aggregate pixel percentage passes.

Always wait for `document.fonts.ready`, use local Inter, fixed fixture, fixed DPR and fixed browser container. Validate intermediate widths and accessibility after both reference anchors match.

