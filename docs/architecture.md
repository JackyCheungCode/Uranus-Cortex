# Architecture

## Initial foundation
- **UI:** React + TypeScript, built with Vite.
- **Design system:** IBM Carbon React components, styles, icons, and tokens.
- **Quality:** TypeScript, ESLint, Vitest, Testing Library, and GitHub Actions.
- **Backend/data:** Not selected. Do not invent business workflows, database tables, auth rules, or deployment topology before requirements are agreed.
- **Current delivery phase:** frontend-first; typed Mock data and Mock services only until the user explicitly approves a later integration scope.

## Architecture references
- [Frontend architecture and module boundaries](./architecture/frontend-architecture.md)
- [Frontend engineering and modularity standards](./engineering/frontend-standards.md)
- [UI acceptance checklist](./engineering/ui-acceptance-checklist.md)
- [IBM Carbon standards](./design/carbon-standards.md)
- [Product requirements: search and buyer discovery](./product/search-and-buyer-discovery.md)

## Boundaries
- Prefer Carbon components in `src`; keep domain logic out of generic visual primitives.
- Organize code by business domain. Modules expose explicit public interfaces and do not import another module's internal files.
- Keep secrets out of source control and browser-side code.
- Production deployment, authentication, persistence, and database policy require explicit requirements and separate review.
- During the frontend-first phase, do not connect live external APIs, databases, auth providers, or production resources without explicit authorization.
- This scaffold is not a claim that production functionality is complete.

## Follow-up
1. Confirm product requirements and core journeys.
2. Implement and validate the application shell and first frontend workflows with Carbon and Mock services.
3. Run the UI acceptance checklist and quality gates.
4. Only after frontend review, plan real service contracts, auth, data persistence, and deployment as separate, explicitly authorized work.
