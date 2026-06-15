import { LogOut, ShieldCheck } from 'lucide-react';
import type { Profile } from '../types/task';

type Props = {
  profile: Profile;
  activePage: string;
  onPageChange: (page: string) => void;
  onSignOut: () => void;
};

const pages = ['Dashboard', 'Today', 'Tasks'];

export function Header({ profile, activePage, onPageChange, onSignOut }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-command-ink text-white">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-black leading-tight">Task Command</h1>
          <p className="text-xs font-medium text-slate-500">Signed in as {profile.display_name}</p>
        </div>
        <button
          className="tap rounded-lg border border-slate-200 px-3 text-slate-700"
          onClick={onSignOut}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`tap rounded-lg px-4 text-sm font-bold ${
              activePage === page ? 'bg-command-ink text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </header>
  );
}
