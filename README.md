# Task Command

Task Command is a mobile-first PWA for Chris and Damien to share security operations tasks without full project management overhead.

## Setup

1. Open the existing Supabase project named **Testing Ops**.
2. Open the SQL editor and run `supabase/task_command_install.sql`.
3. Create or reuse two Supabase Auth users for Chris and Damien.
4. Copy `.env.example` to `.env` and fill in:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

5. Install and run:

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The app includes a manifest and service worker for install support. Serve the built `dist` folder over HTTPS for PWA installation on phones.

## Supabase notes

- Task Command is designed to run inside the existing **Testing Ops** Supabase project alongside Pinnacle Inspect.
- The install migration creates only Task Command resources and does not modify existing Pinnacle Inspect tables, policies, functions, triggers, storage buckets, or auth configuration.
- All Task Command database resources are namespaced with `tc_`: `tc_profiles`, `tc_tasks`, `tc_comments`, `tc_audit_history`, and `tc_touch_task_updated_at`.
- Task Command does not create or use Supabase Storage buckets.
- Keep using the existing Supabase Auth system for login.
- Both users have equal task permissions.
- The schema uses row level security so authenticated users can manage all tasks, comments, and audit entries.
- Profiles are keyed to Supabase Auth user IDs and restricted to display names Chris and Damien.
- Completion records `completed_by` and `completed_at` even when the completer is not the assigned person.
Initial Vercel deployment
