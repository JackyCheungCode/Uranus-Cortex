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

## Cloudflare Workers

The `wrangler.jsonc` configuration targets the Worker named `cortex` and serves the Vite `dist/` output as a single-page application.

```sh
npm run cf:dev
npm run cf:dry-run
npm run deploy
```

The deploy command builds before deploying. Do not deploy until CI is green and the target Worker configuration has been reviewed. The current Worker has no configured resource bindings or secrets; backend services and production environment variables have not been selected.

Read [AGENTS.md](./AGENTS.md), [Carbon standards](./docs/design/carbon-standards.md), and [architecture](./docs/architecture.md) before changing UI or architecture.

This is a technical foundation, not a completed product. Product workflows, persistence, and authentication remain unspecified.
