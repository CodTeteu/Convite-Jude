create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.rsvp_confirmations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  guest_name text not null,
  phone text not null,
  attendance_status text not null default 'pending' check (attendance_status in ('pending', 'attending', 'not-attending')),
  companions_count integer not null default 0 check (companions_count >= 0 and companions_count <= 20),
  companions_names text[] not null default '{}',
  notes text not null default '',
  admin_notes text not null default '',
  acknowledged_guidelines boolean not null default false,
  source text not null default 'site',
  event_slug text not null,
  submitted_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_rsvp_confirmations_created_at on public.rsvp_confirmations (created_at desc);
create index if not exists idx_rsvp_confirmations_event_slug on public.rsvp_confirmations (event_slug);
create index if not exists idx_rsvp_confirmations_status on public.rsvp_confirmations (attendance_status);
create index if not exists idx_rsvp_confirmations_guest_name on public.rsvp_confirmations using gin (to_tsvector('simple', guest_name));
create index if not exists idx_rsvp_confirmations_phone on public.rsvp_confirmations (phone);

drop trigger if exists trg_rsvp_confirmations_updated_at on public.rsvp_confirmations;
create trigger trg_rsvp_confirmations_updated_at
before update on public.rsvp_confirmations
for each row
execute procedure public.set_updated_at();

alter table public.rsvp_confirmations enable row level security;
