-- Search & buyer discovery data model.
-- Apply through a reviewed Supabase migration. All rows are tenant/user scoped.
create extension if not exists pgcrypto;

create table if not exists public.search_providers (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  provider_key text not null check (provider_key in ('tavily','brave','serper','exa','firecrawl','dataforseo')),
  enabled boolean not null default false,
  is_default boolean not null default false,
  capabilities jsonb not null default '{}'::jsonb,
  connection_status text not null default 'not_configured',
  last_tested_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_user_id, provider_key)
);

create table if not exists public.search_tasks (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text,
  query_model jsonb not null,
  normalized_query text not null,
  provider_keys text[] not null default '{}',
  status text not null default 'queued' check (status in ('queued','running','paused','completed','completed_with_warnings','stopped','failed')),
  budget_limit_usd numeric(12,4) not null default 0 check (budget_limit_usd >= 0),
  estimated_cost_usd numeric(12,4) not null default 0,
  actual_cost_usd numeric(12,4),
  max_results integer not null default 50 check (max_results between 1 and 500),
  max_pages integer not null default 100 check (max_pages between 1 and 5000),
  results_count integer not null default 0,
  accepted_companies_count integer not null default 0,
  stop_reason text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.search_task_events (
  id bigint generated always as identity primary key,
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  task_id uuid not null references public.search_tasks(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.search_cache (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cache_fingerprint text not null,
  provider_key text not null,
  payload jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique(owner_user_id, cache_fingerprint, provider_key)
);

create table if not exists public.discovered_pages (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  task_id uuid references public.search_tasks(id) on delete set null,
  normalized_url text not null,
  canonical_url text,
  domain text not null,
  title text,
  snippet text,
  published_at timestamptz,
  discovered_at timestamptz not null default now(),
  provider_key text,
  matched_conditions jsonb not null default '[]'::jsonb,
  processing_status text not null default 'discovered' check (processing_status in ('discovered','fetch_queued','fetching','fetched','extracting','extracted','verifying','assessed','skipped','failed')),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_user_id, normalized_url)
);

create table if not exists public.page_versions (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  page_id uuid not null references public.discovered_pages(id) on delete cascade,
  content_hash text not null,
  fetched_at timestamptz not null default now(),
  published_at timestamptz,
  content_storage_key text,
  extraction_version text,
  created_at timestamptz not null default now(),
  unique(owner_user_id, page_id, content_hash)
);

create table if not exists public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  task_id uuid references public.search_tasks(id) on delete cascade,
  page_id uuid references public.discovered_pages(id) on delete cascade,
  stage text not null,
  idempotency_key text not null,
  status text not null default 'queued' check (status in ('queued','running','completed','failed','skipped')),
  attempts integer not null default 0,
  locked_until timestamptz,
  input_hash text,
  processor_version text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_user_id, idempotency_key)
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  legal_name text,
  display_name text not null,
  website_url text,
  normalized_domain text,
  country_code text,
  city text,
  public_address text,
  company_type text,
  business_description text,
  verification_status text not null default 'source_supported' check (verification_status in ('verified','source_supported','inferred','conflicted','not_found','stale')),
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected','needs_research')),
  match_score numeric(5,2),
  purchase_intent_score numeric(5,2),
  created_from_task_id uuid references public.search_tasks(id) on delete set null,
  merged_into_company_id uuid references public.companies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_aliases (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  alias text not null,
  alias_type text not null default 'brand',
  evidence_id uuid,
  created_at timestamptz not null default now(),
  unique(owner_user_id, company_id, alias)
);

create table if not exists public.company_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  contact_type text not null check (contact_type in ('email','phone','contact_form','business_profile','other')),
  contact_value text not null,
  role_title text,
  source_url text,
  trust_status text not null default 'source_supported' check (trust_status in ('verified','source_supported','inferred','conflicted','not_found','stale')),
  verified_at timestamptz,
  recheck_after timestamptz,
  created_at timestamptz not null default now(),
  unique(owner_user_id, company_id, contact_type, contact_value)
);

create table if not exists public.company_evidence (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  page_id uuid references public.discovered_pages(id) on delete set null,
  field_key text not null,
  claim_text text not null,
  quote_text text,
  source_url text not null,
  source_published_at timestamptz,
  observed_at timestamptz not null default now(),
  trust_status text not null default 'source_supported' check (trust_status in ('verified','source_supported','inferred','conflicted','not_found','stale')),
  confidence numeric(5,4) check (confidence between 0 and 1),
  extraction_method text,
  model_version text,
  created_at timestamptz not null default now()
);

create table if not exists public.buyer_assessments (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  task_id uuid references public.search_tasks(id) on delete set null,
  business_match_score numeric(5,2) check (business_match_score between 0 and 100),
  purchase_intent_score numeric(5,2) check (purchase_intent_score between 0 and 100),
  positive_evidence_ids uuid[] not null default '{}',
  missing_items jsonb not null default '[]'::jsonb,
  conflict_items jsonb not null default '[]'::jsonb,
  rationale text,
  rules_version text,
  model_version text,
  assessed_at timestamptz not null default now()
);

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  activity_type text not null,
  description text not null,
  outcome text,
  actor_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_ledger (
  id bigint generated always as identity primary key,
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  task_id uuid references public.search_tasks(id) on delete set null,
  provider_key text not null,
  operation text not null,
  quantity numeric(14,4),
  unit text,
  estimated_cost_usd numeric(12,4),
  actual_cost_usd numeric(12,4),
  currency text not null default 'USD',
  provider_request_id text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table if not exists public.suppression_records (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  normalized_domain text,
  contact_value_hash text,
  reason text not null,
  source text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists search_tasks_owner_created_idx on public.search_tasks(owner_user_id, created_at desc);
create index if not exists search_tasks_status_idx on public.search_tasks(owner_user_id, status);
create index if not exists search_task_events_task_idx on public.search_task_events(owner_user_id, task_id, created_at);
create index if not exists search_cache_expiry_idx on public.search_cache(owner_user_id, expires_at);
create index if not exists discovered_pages_domain_idx on public.discovered_pages(owner_user_id, domain);
create index if not exists discovered_pages_status_idx on public.discovered_pages(owner_user_id, processing_status);
create index if not exists companies_domain_idx on public.companies(owner_user_id, normalized_domain);
create index if not exists company_evidence_company_idx on public.company_evidence(owner_user_id, company_id, observed_at desc);
create index if not exists buyer_assessments_company_idx on public.buyer_assessments(owner_user_id, company_id, assessed_at desc);
create index if not exists usage_ledger_task_idx on public.usage_ledger(owner_user_id, task_id, occurred_at);

do $$
declare t text;
begin
  foreach t in array array[
    'search_providers','search_tasks','search_task_events','search_cache','discovered_pages',
    'page_versions','processing_jobs','companies','company_aliases','company_contacts',
    'company_evidence','buyer_assessments','crm_activities','usage_ledger','suppression_records'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists owner_access on public.%I', t);
    execute format('create policy owner_access on public.%I for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid())', t);
  end loop;
end $$;

comment on table public.search_providers is 'Provider metadata only; API secrets belong in server-side secret storage, never this table.';
comment on table public.company_evidence is 'Auditable source evidence for company facts and buyer-intent claims.';
comment on table public.suppression_records is 'Tenant-scoped do-not-contact, correction, and retention restrictions.';
