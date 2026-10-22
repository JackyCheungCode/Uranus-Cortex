# Architecture

## Initial foundation
- **UI:** React + TypeScript, built with Vite.
- **Design system:** IBM Carbon React components, styles, icons, and tokens.
- **Runtime:** Cloudflare Worker named `cortex`, serving the SPA assets and a small health endpoint.
- **Quality:** TypeScript build check and GitHub Actions CI.
- **Data/auth:** Not configured. No database, authentication, secrets, or business workflows are assumed by this scaffold.

## Boundaries
- Prefer Carbon components in `src`; keep domain logic out of generic visual primitives.
- Keep secrets out of source control.
- Production bindings, authentication, persistence, and database policy require explicit requirements and separate review.
- This scaffold is not a claim that production functionality is complete.

## Follow-up
1. Confirm product requirements and core journeys.
2. Define route/navigation and domain boundaries from those requirements.
3. Choose backend/auth/data details only when required.
4. Add focused tests and further quality gates as business behavior is introduced.
