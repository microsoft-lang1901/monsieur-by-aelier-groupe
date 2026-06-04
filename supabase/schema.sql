-- Monsieur backend schema for Supabase/Postgres.
-- Run this in a Supabase SQL editor or migration after creating a project.
-- Tables use RLS by default. The current local server writes with the service role key.

create table if not exists public.wardrobe (
  id text primary key,
  name text not null,
  sku text,
  house text,
  tone text,
  material text,
  price numeric not null default 0,
  board text,
  editorial jsonb not null default '[]'::jsonb,
  saved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.wardrobe add column if not exists sku text;
alter table public.wardrobe add column if not exists board text;
alter table public.wardrobe add column if not exists editorial jsonb not null default '[]'::jsonb;

create table if not exists public.orders (
  id text primary key,
  status text not null default 'confirmed',
  payment_method text not null,
  payment_status text not null default 'paid',
  payment_intent_id text,
  shipping jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  total numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.mtm_commissions (
  id text primary key,
  status text not null default 'commissioned',
  style text,
  fabric text,
  details jsonb not null default '[]'::jsonb,
  measurements jsonb not null default '[]'::jsonb,
  estimated_atelier_time text,
  created_at timestamptz not null default now()
);

create table if not exists public.fitting_requests (
  id text primary key,
  status text not null default 'requested',
  name text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id text primary key,
  status text not null default 'new',
  name text not null,
  email text not null,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.wardrobe enable row level security;
alter table public.orders enable row level security;
alter table public.mtm_commissions enable row level security;
alter table public.fitting_requests enable row level security;
alter table public.contact_requests enable row level security;
alter table public.events enable row level security;

grant usage on schema public to service_role;
grant all privileges on table
  public.wardrobe,
  public.orders,
  public.mtm_commissions,
  public.fitting_requests,
  public.contact_requests,
  public.events
to service_role;

-- Service-role writes bypass RLS. Add authenticated policies when real user auth is connected.
