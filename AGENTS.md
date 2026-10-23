# Uranus-Cortex repository rules
- Brand: **Uranus-Cortex**; do not rename without approval. Simplified Chinese is the default UI language.
- Read `docs/architecture.md` and `docs/design-system/` before UI changes.
- Uranus Design System owns tokens, local controls, page patterns, and UI rules. IBM Carbon is not mandatory.
- Existing Carbon imports are legacy migration work. Do not remove dependencies until all usages are migrated and verified. New UI uses local controls once available.
- Domain logic belongs in `src/modules/<module>`; shared controls in `src/design-system`; generic utilities in `src/shared`.
- External providers must be replaceable adapters. Preserve evidence, confidence, unknowns, commercial snapshots, and audit history where relevant.
- Enforce organization authorization server-side. Target WCAG 2.2 AA, including keyboard, focus, responsive, semantic, and reduced-motion support.
- Inspect before changing code; make small changes, test, and report checks honestly. Do not alter production settings, secrets, or live data without approval.
