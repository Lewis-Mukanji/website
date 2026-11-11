-- Both public forms submit through the website server, which validates consent.
-- Only the server secret can access leads; the dashboard also checks its login.
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  type text not null check (type in ('meal-plan', 'enquiry')),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 9 and 30),
  email text,
  service text,
  preferred text,
  message text,
  summary text,
  quiz jsonb check (quiz is null or jsonb_typeof(quiz) = 'object'),
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'closed')),
  notes text
);
create index leads_created_at_id_idx on public.leads ("createdAt" desc, id desc);
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant select, insert, update on public.leads to service_role;
