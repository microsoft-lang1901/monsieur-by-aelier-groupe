create table if not exists client_profiles (
  id uuid primary key,
  display_name text not null,
  city text,
  notifications_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table client_profiles enable row level security;

create table if not exists wardrobe_items (
  user_id uuid not null,
  sku text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, sku)
);

alter table wardrobe_items enable row level security;

create index if not exists wardrobe_items_user_id_idx on wardrobe_items(user_id);
create index if not exists wardrobe_items_sku_idx on wardrobe_items(sku);

create table if not exists inventory_items (
  sku text primary key,
  available_quantity integer not null default 0 check (available_quantity >= 0),
  status text not null default 'atelier-confirmation-required',
  updated_at timestamptz not null default now()
);

create index if not exists inventory_items_status_idx on inventory_items(status);

create table if not exists atelier_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  stripe_payment_intent_id text,
  status text not null default 'confirmed',
  total_usd integer not null,
  created_at timestamptz not null default now()
);

alter table atelier_orders enable row level security;

create index if not exists atelier_orders_user_id_created_at_idx on atelier_orders(user_id, created_at desc);

create table if not exists atelier_order_items (
  order_id uuid not null references atelier_orders(id) on delete cascade,
  sku text not null,
  quantity integer not null check (quantity > 0),
  unit_price_usd integer not null check (unit_price_usd >= 0),
  primary key (order_id, sku)
);

create index if not exists atelier_order_items_sku_idx on atelier_order_items(sku);

create table if not exists atelier_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject text not null,
  notes text not null,
  preferred_contact text not null,
  status text not null default 'received',
  created_at timestamptz not null default now()
);

alter table atelier_requests enable row level security;

create index if not exists atelier_requests_user_id_created_at_idx on atelier_requests(user_id, created_at desc);

alter table inventory_items enable row level security;
alter table atelier_order_items enable row level security;

drop policy if exists "Clients can read own profile" on client_profiles;
create policy "Clients can read own profile"
  on client_profiles for select
  using (auth.uid() = id);

drop policy if exists "Clients can update own profile" on client_profiles;
create policy "Clients can update own profile"
  on client_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Clients can insert own profile" on client_profiles;
create policy "Clients can insert own profile"
  on client_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Clients can read own wardrobe" on wardrobe_items;
create policy "Clients can read own wardrobe"
  on wardrobe_items for select
  using (auth.uid() = user_id);

drop policy if exists "Clients can maintain own wardrobe" on wardrobe_items;
create policy "Clients can maintain own wardrobe"
  on wardrobe_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Clients can read own orders" on atelier_orders;
create policy "Clients can read own orders"
  on atelier_orders for select
  using (auth.uid() = user_id);

drop policy if exists "Clients can read own order items" on atelier_order_items;
create policy "Clients can read own order items"
  on atelier_order_items for select
  using (
    exists (
      select 1 from atelier_orders
      where atelier_orders.id = atelier_order_items.order_id
      and atelier_orders.user_id = auth.uid()
    )
  );

drop policy if exists "Clients can read inventory availability" on inventory_items;
create policy "Clients can read inventory availability"
  on inventory_items for select
  using (true);

drop policy if exists "Clients can read own atelier requests" on atelier_requests;
create policy "Clients can read own atelier requests"
  on atelier_requests for select
  using (auth.uid() = user_id);

drop policy if exists "Clients can create own atelier requests" on atelier_requests;
create policy "Clients can create own atelier requests"
  on atelier_requests for insert
  with check (auth.uid() = user_id);
