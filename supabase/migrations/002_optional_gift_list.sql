create table if not exists public.gift_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  event_slug text not null,
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  category text not null default 'Geral',
  image_url text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.gift_selections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  event_slug text not null,
  guest_name text not null,
  guest_phone text not null,
  message text not null default '',
  total_cents integer not null default 0 check (total_cents >= 0),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'cancelled')),
  admin_notes text not null default ''
);

create table if not exists public.gift_selection_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  selection_id uuid not null references public.gift_selections(id) on delete cascade,
  gift_item_id uuid not null references public.gift_items(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  unique (selection_id, gift_item_id)
);

create index if not exists idx_gift_items_event_slug on public.gift_items (event_slug);
create index if not exists idx_gift_items_active_sort on public.gift_items (event_slug, is_active, sort_order);
create index if not exists idx_gift_selections_event_slug on public.gift_selections (event_slug);
create index if not exists idx_gift_selections_created_at on public.gift_selections (created_at desc);
create index if not exists idx_gift_selections_payment_status on public.gift_selections (payment_status);
create index if not exists idx_gift_selection_items_selection_id on public.gift_selection_items (selection_id);
create index if not exists idx_gift_selection_items_gift_item_id on public.gift_selection_items (gift_item_id);

drop trigger if exists trg_gift_items_updated_at on public.gift_items;
create trigger trg_gift_items_updated_at
before update on public.gift_items
for each row
execute procedure public.set_updated_at();

drop trigger if exists trg_gift_selections_updated_at on public.gift_selections;
create trigger trg_gift_selections_updated_at
before update on public.gift_selections
for each row
execute procedure public.set_updated_at();

alter table public.gift_items enable row level security;
alter table public.gift_selections enable row level security;
alter table public.gift_selection_items enable row level security;
