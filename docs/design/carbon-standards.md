# IBM Carbon Design System standards

**Status:** Initial project policy.  
**Applies to:** Product UI, shared components, and UI documentation.

## Authority and versioning
- Official guidance: https://carbondesignsystem.com/
- React implementation reference: https://react.carbondesignsystem.com/
- Use `@carbon/react`, `@carbon/styles`, and Carbon icons as the supported UI foundation.
- Dependency updates must be deliberate, reviewed, and checked against peer dependencies and migration notes.
- This policy supplements, and does not replace, official Carbon component guidance.

## Component selection
1. Prefer an official Carbon component for established UI patterns.
2. Compose Carbon components before creating custom components.
3. Project components may provide domain naming, data wiring, or reviewed compositions; they must not silently fork Carbon behavior or appearance.
4. Custom controls are exceptional. Explain why Carbon cannot meet the requirement and review accessibility, keyboard interaction, focus, responsive behavior, and tests.
5. Use Carbon icons; do not use emoji or arbitrary icon packs as product UI icons.

## Tokens and theming
- Use Carbon themes and tokens for color, spacing, type, borders, elevation, and motion wherever available.
- Do not add raw color values, arbitrary spacing, or ad-hoc font stacks when a Carbon token applies.
- Do not redefine Carbon token names or create duplicate token layers.
- Theme changes must use Carbon-supported mechanisms and be checked for contrast and component states.
- Unusual visual values require explanation in review.

## Accessibility and responsive behavior
- Target WCAG 2.2 AA and follow Carbon accessibility guidance.
- Interactive controls need accessible names, keyboard operation, visible focus, and meaningful states.
- Use semantic HTML, logical headings, landmarks, labels, and associated error messages.
- Never communicate status by color alone. Respect reduced-motion preferences.
- Use Carbon Grid and responsive patterns where appropriate; validate narrow/wide viewports and zoom/reflow.
- Consider loading, empty, success, validation, error, disabled, and permission states when applicable.

## Quality gates
UI PRs should include component/token review, tests for changed behavior, automated accessibility checks where feasible, typecheck/lint/build/audit results, and preview/screenshots for substantial visual changes. Automated checks do not replace keyboard/screen-reader review for critical journeys.

## Exceptions
Record deviations in `docs/design/carbon-exceptions.md`, including alternatives, rationale, accessibility impact, tests/evidence, approver, and revisit date. CI can flag missing evidence but must not auto-approve exceptions.
