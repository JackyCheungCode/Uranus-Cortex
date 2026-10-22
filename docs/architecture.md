# Architecture

## Initial foundation
- **UI:** React + TypeScript, built with Vite.
- **Design system:** IBM Carbon React components, styles, icons, and tokens.
- **Quality:** TypeScript, ESLint, Vitest, Testing Library, and GitHub Actions.
- **Backend/data:** Not selected. Do not invent business workflows, database tables, auth rules, or deployment topology before requirements are agreed.

## Boundaries
- Prefer Carbon components in `src`; keep domain logic out of generic visual primitives.
- Keep secrets out of source control.
- Production deployment, authentication, persistence, and database policy require explicit requirements and separate review.
- This scaffold is not a claim that production functionality is complete.

## Follow-up
1. Confirm product requirements and core journeys.
2. Define route/navigation and domain boundaries from those requirements.
3. Choose backend/auth/deployment details only when required.
4. Add visual regression and accessibility tooling once core workflows are defined.
