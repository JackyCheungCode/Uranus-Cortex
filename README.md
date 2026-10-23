# Uranus-Cortex
A modular foreign-trade platform spanning prospect discovery, customer management, advanced product catalog, quotations, orders, fulfillment, operational money records, after-sales, and disputes.

## Foundation
- React + TypeScript + Vite
- Cloudflare Workers, Cloudflare Vite plugin, Wrangler
- Uranus Design System: locally owned tokens, controls, patterns, and frontend rules
- Supabase is planned; this scaffold does not imply production database/auth setup

The bootstrap still uses legacy IBM Carbon imports. Carbon is no longer mandatory; dependencies will be considered for removal after migration and verification.

Read [AGENTS.md](./AGENTS.md), [architecture](./docs/architecture.md), and [Uranus Design System](./docs/design-system/README.md) before UI/runtime changes.

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

Review Wrangler targets and bindings before deployment. The current Worker serves the SPA and exposes `/api/health`; business workflows, authentication, persistence, and external integrations are not implemented yet.
