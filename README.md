# Uranus Cortex

Uranus Cortex is being bootstrapped with React, TypeScript, Vite, and IBM Carbon Design System.

## Prerequisites

Node.js 22+ and npm.

## Development

```sh
npm install
npm run dev
```

## Quality checks

Run `npm run typecheck`, `npm run lint`, `npm run carbon:check`, `npm run test`, `npm run build`, and `npm audit`.

## Engineering standards

These documents are required reading before frontend implementation:

- [Repository-wide AI and contribution rules](./AGENTS.md)
- [Frontend engineering and modularity standards](./docs/engineering/frontend-standards.md)
- [UI acceptance checklist](./docs/engineering/ui-acceptance-checklist.md)
- [Frontend architecture and module boundaries](./docs/architecture/frontend-architecture.md)
- [IBM Carbon standards](./docs/design/carbon-standards.md)
- [Architecture overview](./docs/architecture.md)

## Product planning

- [Search and buyer discovery: development requirements and implementation plan](./docs/product/search-and-buyer-discovery.md)

## Cloudflare Workers

The `wrangler.jsonc` configuration targets the Worker named `cortex` and serves the Vite `dist/` output as a single-page application.

```sh
npm run cf:dev
npm run cf:dry-run
npm run deploy
```

The deploy command builds before deploying. Do not deploy until CI is green and the target Worker configuration has been reviewed. The current Worker has no configured resource bindings or secrets; backend services and production environment variables have not been selected.

## Project stage

The current stage is **frontend-first**: build the modular UI with IBM Carbon, typed interfaces, and Mock services before connecting real APIs, authentication, databases, or production resources. Mock behavior must never be presented as a real service result.

This is a technical foundation, not a completed product. Product workflows, persistence, and authentication remain subject to the approved requirements.
