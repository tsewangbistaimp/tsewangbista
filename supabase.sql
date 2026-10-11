-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
create table if not exists q_invites (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  label text not null default '',
  revoked boolean not null default false,
  single_use boolean not null default false,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists q_submissions (
  id uuid primary key,
  idempotency_key text unique not null,
  created_at timestamptz not null default now(),
  name text not null,
  field text not null,
  email text not null default '',
  invite_id uuid references q_invites(id),
  email_status text not null default 'pending',
  payload jsonb not null
);

-- The server uses the service-role key. Lock the tables so the public anon key can never read them.
alter table q_invites enable row level security;
alter table q_submissions enable row level security;
