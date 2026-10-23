# Design tokens

Uranus owns its token names and visual language. The selected direction is a restrained enterprise console: light canvas, white surfaces, neutral grays, blue action color, precise spacing, modest corner radii, and clear information hierarchy. IBM Cloud is a visual reference, not a source of copied branding or a runtime dependency.

## Layers and rules

1. **Primitive tokens** describe palette values.
2. **Semantic tokens** describe intent (surface, text, action, status, border, focus).
3. **Component tokens** may be introduced only when a stable component-specific need exists.

Components should consume semantic variables such as `--uranus-color-text-primary`, `--uranus-color-surface-canvas`, `--uranus-color-border-default`, and `--uranus-space-4`. Business modules must not introduce ad-hoc colors or spacing values when a token exists. Never use Carbon's `--cds-*` names for Uranus tokens.

## Implemented runtime tokens

- `src/design-system/tokens/index.css`: primitive palette, semantic light-theme roles, typography, spacing, shape, elevation, focus, and motion.
- `src/design-system/themes/dark.css`: dark-theme semantic overrides, ready to activate with `data-theme="dark"`. The theme switch is not implemented in this phase.
- Light is the default. Tokens are imported by the application entry point. The existing Carbon-based UI is not yet migrated to consume Uranus semantic tokens, apart from switching the legacy Carbon theme to light.

## Accessibility and review

- Target WCAG 2.2 AA; verify text and non-text contrast for actual component combinations before declaring a component compliant.
- Never communicate status by color alone.
- Keep visible keyboard focus and respect `prefers-reduced-motion`.
- Token values are the initial baseline and can be adjusted after visual review; they are not a claim of completed accessibility certification.
