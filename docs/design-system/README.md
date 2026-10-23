# Uranus Design System
Locally owned design language and component library for Uranus-Cortex: visual identity, design tokens, control APIs, interaction behavior, page patterns, accessibility, and implementation rules.

Principles: local ownership; consistent reusable controls; accessible keyboard/focus/semantics/contrast/reduced motion; incremental migration; no third-party library defining Uranus public APIs or visual language.

Layers: foundations, primitive and semantic tokens, local controls, reusable page patterns, examples/tests/accessibility checks.

Runtime: `src/design-system/`. Documentation: `docs/design-system/`.

The bootstrap still uses Carbon; these usages are legacy, not the target. Prioritize Button, Input, Select, Checkbox, Dialog, Notification, DataTable, Pagination, and Loading/Empty/Error states. APIs are proposals until implemented and tested.
