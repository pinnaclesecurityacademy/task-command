import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) setError(signInError.message);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-command-ink text-white">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Task Command</h1>
            <p className="text-sm font-medium text-slate-500">Security operations access</p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
            Supabase is not configured yet. Add your `.env` values before signing in.
          </div>
        )}

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</span>
            <input
              type="email"
              className="tap rounded-lg border border-slate-200 bg-command-field px-3"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</span>
            <input
              type="password"
              className="tap rounded-lg border border-slate-200 bg-command-field px-3"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
          <button
            className="tap flex items-center justify-center gap-2 rounded-lg bg-command-ink font-bold text-white disabled:opacity-60"
            disabled={loading || !isSupabaseConfigured}
          >
            <LockKeyhole className="h-4 w-4" /> {loading ? 'Checking' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
