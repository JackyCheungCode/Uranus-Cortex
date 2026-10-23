# Design tokens
Initial specification; exact brand values and measurements require visual review.

Use three layers: primitive values, semantic intent tokens, and component tokens only where stable customization is needed. Required roles: backgrounds/surfaces; text; borders/focus; actions; status; interaction states; spacing/layout; typography/numeric presentation; motion/reduced motion.

Use intent names such as `--uranus-color-text-primary`, `--uranus-color-surface-canvas`, `--uranus-color-border-default`, `--uranus-space-4`. Components consume semantic tokens, not raw palette values.

Avoid hard-coded visual values in business modules. Never communicate status by color alone. Use CSS custom properties. Do not reuse Carbon `--cds-*` names. Validate contrast and states before stabilizing tokens. Light theme first; dark theme may follow.
