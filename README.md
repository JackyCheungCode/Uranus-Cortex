# Uranus Cortex

Initial application foundation for the `cortex` Cloudflare Worker, using React, TypeScript, Vite, and IBM Carbon.

## Stack

- React + TypeScript + Vite
- IBM Carbon React components and styles
- Cloudflare Workers Vite plugin and Wrangler
- Cloudflare Worker health endpoint at `/api/health`

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

The Wrangler configuration is intentionally named `cortex` to match the existing Cloudflare Worker. After reviewing bindings and build settings, deploy with:

```bash
npm run deploy
```

The Worker serves the Vite-built single-page application and responds with JSON at `/api/health`. No Cloudflare bindings, secrets, or external services are required by this initial foundation.
