-- Trekking Guide Portfolio: run once in Supabase > SQL Editor. Safe to re-run; it never drops or edits existing tables.
create extension if not exists pgcrypto;

create table if not exists public.guide_profiles (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  token_hash    text not null unique,
  slug          text unique,
  status        text not null default 'draft'
                check (status in ('draft','submitted','under_review','approved','changes_required','suspended')),
  verified      boolean not null default false,
  display_name  text,
  step          int  not null default 0 check (step between 0 and 7),
  data          jsonb not null default '{}'::jsonb,
  admin_note    text,
  submitted_at  timestamptz,
  approved_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists guide_profiles_email_idx  on public.guide_profiles (lower(email));
create index if not exists guide_profiles_status_idx on public.guide_profiles (status);

create table if not exists public.guide_inquiries (
  id          uuid primary key default gen_random_uuid(),
  guide_id    uuid not null references public.guide_profiles(id) on delete cascade,
  package_id  text,
  kind        text not null default 'Booking request',
  name        text not null,
  email       text not null,
  country     text,
  phone       text,
  travel_date text,
  group_size  text,
  message     text not null,
  status      text not null default 'new' check (status in ('new','read','replied','closed')),
  created_at  timestamptz not null default now()
);
create index if not exists guide_inquiries_guide_idx on public.guide_inquiries (guide_id, created_at desc);

-- Row Level Security: no public policies on purpose. The website server uses the service-role key,
-- which bypasses RLS, and only ever returns approved guides through toPublic(). Anonymous API keys
-- cannot read or write these tables, so private data (email, phone, licence, documents) is never exposed.
alter table public.guide_profiles  enable row level security;
alter table public.guide_inquiries enable row level security;
