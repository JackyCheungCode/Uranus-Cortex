# Uranus-Cortex architecture
## Scope
Modular foreign-trade platform from prospect discovery and customer management through advanced product catalog, inquiries/quotations, orders, fulfillment/shipping, operational money records, after-sales, and disputes. Full accounting/general ledger, manufacturing, procurement, and full warehouse management are outside initial core scope.

## Baseline
React + TypeScript + Vite; existing Cloudflare Worker, Cloudflare Vite plugin, Wrangler; Uranus-owned design system. Supabase is planned but not configured for production.

## Incremental structure
- `src/design-system`: foundations, tokens, controls, themes, patterns.
- `src/modules`: business modules with explicit ownership.
- `src/shared`: genuinely cross-cutting utilities.
- `src/worker.ts`: keep the current entry point unless a reviewed migration is needed.
- `docs/design-system`, `docs/modules`, `docs/data-model`, `docs/api`, `docs/security`: documentation.

This is not a forced monorepo migration. Do not change workspace tooling or move the Worker entry point without separate review.

## Design policy
Uranus Design System is the product UI contract. Carbon is not mandatory and must not define new UI. Existing Carbon usage is legacy; remove dependencies only after all usages are replaced and verified.

## Domains
Customer development: discovery, companies, contacts, evidence, research, deduplication, follow-up. Data/integration: connectors, imports, search. Platform: auth, tasks, settings, compliance/audit, analytics. Product/sales: catalog, inquiries, quotations, orders, operational money records. Delivery/service: fulfillment, after-sales, disputes. External providers must be replaceable adapters.

## Invariants
Quotation-to-order conversion preserves commercial snapshots; orders can have multiple shipment batches; order, fulfillment, and payment states are separate; refunds and dispute resolutions retain audit history; money uses exact decimal/numeric values; AI preserves evidence, confidence, unknowns; review connector API access, licensing, cost, and constraints.

Implement one module at a time, keeping every increment buildable and testable.
