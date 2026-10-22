# Repository contribution rules

## Source of truth
- Follow this file, then `docs/engineering/frontend-standards.md`, `docs/design/carbon-standards.md`, `docs/architecture.md`, and relevant product requirements.
- Official IBM Carbon documentation is authoritative for component behavior and design guidance.
- Do not introduce a second design system or duplicate visual token layer.

## Non-negotiable project rules
1. **Modular structure:** organize code by business domain, expose cross-module functionality through explicit public entry points, and do not import another module's internal files.
2. **Carbon-first UI:** use IBM Carbon components, themes, tokens, layout patterns, and Carbon Icons. Do not recreate existing Carbon controls or introduce a competing UI library.
3. **Frontend-first phase:** build and validate the frontend with typed Mock data/services first. Do not connect real APIs, databases, authentication, secrets, or production resources unless the user explicitly authorizes that scope.
4. **Quality and accessibility:** use strict TypeScript, responsive layouts, semantic markup, keyboard support, visible focus, and appropriate loading/empty/error/success states.

## Required workflow
1. Read this file, frontend standards, Carbon standards, architecture, and relevant product requirements before changing the project.
2. Identify module ownership, public dependencies, Carbon components/patterns, responsive behavior, keyboard interaction, accessibility needs, and key UI states.
3. Implement the smallest coherent frontend slice. Keep domain logic separate from generic presentation.
4. Use service contracts and Mock implementations; do not let pages import fixture data directly.
5. Add/update tests for behavior, semantics, and key states.
6. Run typecheck, lint, tests, build, and dependency audit when the environment permits; report any commands not run.
7. Update docs when a pattern, token, dependency, boundary, or exception changes.

## Prohibited without explicit review
- Hard-coded colors, arbitrary spacing, or ad-hoc typography when a Carbon token exists.
- Reimplementing Carbon controls, keyboard behavior, focus behavior, or icons without a documented reason.
- Removing accessible names, keyboard support, visible focus, semantic landmarks, or reduced-motion support.
- Adding an overlapping UI library.
- Connecting live external APIs, persisting secrets in the browser, changing production deployment settings, mutating production data/schema, or deploying as routine implementation.
- Claiming Mock data, simulated connectivity, or simulated success is real service behavior.
- Merging PRs or changing production resources without explicit authorization.

## Exceptions
Document deviations in `docs/design/carbon-exceptions.md`: rationale, affected surface, accessibility impact, tests, reviewer, and revisit date. Exceptions require human review; automated checks do not grant approval.

## Pull request checklist
- [ ] Module boundaries and public interfaces respected.
- [ ] Carbon component/pattern choice explained where non-obvious.
- [ ] Carbon tokens used; exceptions documented and reviewed.
- [ ] Keyboard, screen-reader behavior, responsive layout, and UI states considered.
- [ ] Mock/real-service boundary is explicit.
- [ ] Typecheck, lint, test, build, and audit results reported.
- [ ] No secrets, unrelated changes, unauthorized external calls, or production mutations included.
