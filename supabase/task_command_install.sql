-- Task Command install migration for the existing "Testing Ops" Supabase project.
-- This migration creates only Task Command resources and does not modify Pinnacle Inspect tables.
-- Supabase Auth is reused; no auth configuration is changed here.

create type tc_task_person as enum ('Chris', 'Damien', 'Both');
create type tc_task_status as enum ('Open', 'In Progress', 'Waiting', 'Completed');
create type tc_task_category as enum (
  'Operations',
  'Staff',
  'Compliance',
  'Client Request',
  'Training',
  'Incident Follow Up',
  'SOP / Documentation',
  'Projects'
);
create type tc_task_priority as enum ('Critical', 'High', 'Normal', 'Low');
create type tc_task_audit_action as enum ('created', 'edited', 'completed', 'reopened');

create table public.tc_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (display_name in ('Chris', 'Damien')),
  email text,
  created_at timestamptz not null default now()
);

create table public.tc_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 180),
  description text,
  assigned_person tc_task_person not null default 'Chris',
  created_by uuid not null references public.tc_profiles(id),
  status tc_task_status not null default 'Open',
  category tc_task_category not null default 'Operations',
  priority tc_task_priority not null default 'Normal',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  completed_by uuid references public.tc_profiles(id),
  constraint tc_tasks_completed_fields_match check (
    (status = 'Completed' and completed_at is not null and completed_by is not null)
    or
    (status <> 'Completed' and completed_at is null and completed_by is null)
  )
);

create table public.tc_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tc_tasks(id) on delete cascade,
  user_id uuid not null references public.tc_profiles(id),
  comment text not null check (char_length(comment) <= 2000),
  created_at timestamptz not null default now()
);

create table public.tc_audit_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tc_tasks(id) on delete cascade,
  user_id uuid not null references public.tc_profiles(id),
  action tc_task_audit_action not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index tc_tasks_status_idx on public.tc_tasks(status);
create index tc_tasks_assigned_idx on public.tc_tasks(assigned_person);
create index tc_tasks_due_date_idx on public.tc_tasks(due_date);
create index tc_tasks_priority_idx on public.tc_tasks(priority);
create index tc_comments_task_id_idx on public.tc_comments(task_id);
create index tc_audit_history_task_id_idx on public.tc_audit_history(task_id);

alter table public.tc_profiles enable row level security;
alter table public.tc_tasks enable row level security;
alter table public.tc_comments enable row level security;
alter table public.tc_audit_history enable row level security;

create policy "tc authenticated read profiles"
  on public.tc_profiles for select
  to authenticated
  using (true);

create policy "tc users can insert own profile"
  on public.tc_profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "tc users can update own profile"
  on public.tc_profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "tc authenticated read tasks"
  on public.tc_tasks for select
  to authenticated
  using (true);

create policy "tc authenticated create tasks"
  on public.tc_tasks for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "tc authenticated update any task"
  on public.tc_tasks for update
  to authenticated
  using (true)
  with check (true);

create policy "tc authenticated read comments"
  on public.tc_comments for select
  to authenticated
  using (true);

create policy "tc authenticated create comments"
  on public.tc_comments for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "tc authenticated read audit"
  on public.tc_audit_history for select
  to authenticated
  using (true);

create policy "tc authenticated create audit"
  on public.tc_audit_history for insert
  to authenticated
  with check (user_id = auth.uid());

create function public.tc_touch_task_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tc_set_task_updated_at
before update on public.tc_tasks
for each row
execute function public.tc_touch_task_updated_at();

-- Optional seed profiles after creating auth users in Testing Ops:
-- insert into public.tc_profiles (id, display_name, email)
-- values
--   ('AUTH_USER_UUID_FOR_CHRIS', 'Chris', 'chris@example.com'),
--   ('AUTH_USER_UUID_FOR_DAMIEN', 'Damien', 'damien@example.com');
