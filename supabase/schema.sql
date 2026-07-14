-- mondayC — run this in Supabase → SQL Editor once.
-- Creates the tasks table + Row Level Security so each user sees only their own tasks.

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'backlog' check (status in ('backlog','in_progress','done')),
  priority    text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  due_date    date,
  assignee    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks (user_id);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.tasks enable row level security;

drop policy if exists "own tasks select" on public.tasks;
create policy "own tasks select" on public.tasks
  for select using (auth.uid() = user_id);

drop policy if exists "own tasks insert" on public.tasks;
create policy "own tasks insert" on public.tasks
  for insert with check (auth.uid() = user_id);

drop policy if exists "own tasks update" on public.tasks;
create policy "own tasks update" on public.tasks
  for update using (auth.uid() = user_id);

drop policy if exists "own tasks delete" on public.tasks;
create policy "own tasks delete" on public.tasks
  for delete using (auth.uid() = user_id);
