# Uranus Design System runtime

Locally owned visual language and reusable controls for Uranus-Cortex. New controls must use Uranus semantic tokens and must not depend on Carbon.

- `tokens/`: primitive palette and semantic CSS custom properties.
- `themes/`: theme overrides; light is the default, dark tokens are prepared.
- `components/`: reusable local controls.
- `patterns/`: reusable page and interaction patterns.

## Implemented controls

- `components/Button`: enterprise-console button with primary, secondary, tertiary, and danger variants; small, medium, and large sizes; disabled, loading, and full-width states.
- `components/Input`: native text-entry control with optional visible label, helper text, validation error, required/disabled/read-only states, three sizes, optional leading/trailing adornments, and full-width layout.

Import controls from their component folder or its `index.ts` entry. Continue adding controls with documented APIs, keyboard/accessibility behavior, examples, and tests. Existing Carbon-based app surfaces remain legacy until migrated.
