# Uranus Cortex

Initial application foundation for the `cortex` Cloudflare Worker, using React, TypeScript, Vite, and IBM Carbon.

## Stack
- React + TypeScript + Vite
- IBM Carbon React components, styles, icons, and design tokens
- Cloudflare Workers Vite plugin and Wrangler
- Cloudflare Worker health endpoint at `/api/health`

## Project rules
Read [AGENTS.md](./AGENTS.md), [Carbon standards](./docs/design/carbon-standards.md), and [architecture](./docs/architecture.md) before changing the UI or runtime configuration.

## Development
```bash
npm install
npm run dev
```

## Verify and build
```bash
npm run typecheck
npm run build
npm run preview
```

## Deploy
The Wrangler configuration is intentionally named `cortex` to match the existing Cloudflare Worker. After reviewing bindings and deployment settings, deploy with `npm run deploy`.

The Worker serves the Vite-built single-page application and responds with JSON at `/api/health`. No Cloudflare bindings, secrets, database, or external services are required by this initial foundation.
