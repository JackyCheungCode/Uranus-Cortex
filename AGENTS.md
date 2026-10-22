# Repository contribution rules

## Source of truth
- Follow this file, then `docs/design/carbon-standards.md`, then `docs/architecture.md`.
- Official IBM Carbon documentation is authoritative for component behavior and design guidance.
- Do not introduce a second design system or duplicate visual token layer.

## Required workflow
1. Identify the relevant Carbon components/patterns, responsive behavior, keyboard interaction, and accessibility needs before implementation.
2. Prefer supported components from `@carbon/react` and Carbon tokens. Search Carbon before proposing a custom component.
3. Implement the smallest coherent change and separate domain logic from generic presentation where practical.
4. Add/update tests for behavior, semantics, and key states.
5. Run typecheck, lint, tests, build, and dependency audit when the environment permits; report any commands not run.
6. Update docs when a pattern, token, dependency, or exception changes.

## Prohibited without explicit review
- Hard-coded colors, arbitrary spacing, or ad-hoc typography when a Carbon token exists.
- Reimplementing Carbon controls, keyboard behavior, focus behavior, or icons without a documented reason.
- Removing accessible names, keyboard support, visible focus, semantic landmarks, or reduced-motion support.
- Adding an overlapping UI library.
- Merging PRs, changing production deployment settings, or mutating production data/schema as routine implementation.

## Exceptions
Document deviations in `docs/design/carbon-exceptions.md`: rationale, affected surface, accessibility impact, tests, reviewer, and revisit date. Exceptions require human review; automated checks do not grant approval.

## Pull request checklist
- [ ] Carbon component/pattern choice explained where non-obvious.
- [ ] Carbon tokens used; exceptions documented and reviewed.
- [ ] Keyboard and screen-reader behavior considered.
- [ ] Responsive layout and empty/loading/error states considered.
- [ ] Typecheck, lint, test, build, and audit results reported.
- [ ] No secrets, unrelated changes, or production mutations included.
