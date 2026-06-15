import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TaskDetail } from './components/TaskDetail';
import { TaskForm } from './components/TaskForm';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { TaskBoardPage } from './pages/TaskBoardPage';
import { TodayPage } from './pages/TodayPage';
import { getProfile } from './services/profiles';
import { createTask, fetchTasks, setTaskStatus, updateTask } from './services/tasks';
import { supabase } from './services/supabase';
import type { Profile, Task, TaskInput } from './types/task';

type Page = 'Dashboard' | 'Today' | 'Tasks';
type Modal =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; task: Task }
  | { type: 'detail'; task: Task };

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<Page>('Dashboard');
  const [modal, setModal] = useState<Modal>({ type: 'none' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setProfile(null);
        setTasks([]);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const user = session.user;

    async function boot() {
      setLoading(true);
      setError('');
      try {
        const userProfile = await getProfile(user);
        setProfile(userProfile);
        setTasks(await fetchTasks());
      } catch (bootError) {
        setError(bootError instanceof Error ? bootError.message : 'Unable to load Task Command.');
      } finally {
        setLoading(false);
      }
    }

    boot();
  }, [session]);

  async function refreshTasks() {
    setTasks(await fetchTasks());
  }

  async function handleCreate(input: TaskInput) {
    if (!profile) return;
    const created = await createTask(input, profile.id);
    setTasks((current) => [created, ...current]);
    setModal({ type: 'none' });
  }

  async function handleUpdate(task: Task, input: TaskInput) {
    if (!profile) return;
    const updated = await updateTask(task, input, profile.id);
    setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setModal({ type: 'detail', task: updated });
  }

  async function handleStatus(task: Task, status: Task['status']) {
    if (!profile) return;
    const updated = await setTaskStatus(task, status, profile.id);
    setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

  if (!session) return <LoginPage />;

  if (loading || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="rounded-lg bg-white p-5 text-sm font-bold text-slate-600 shadow-soft">Loading Task Command...</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        profile={profile}
        activePage={page}
        onPageChange={(nextPage) => setPage(nextPage as Page)}
        onSignOut={() => supabase.auth.signOut()}
      />

      <main className="mx-auto max-w-6xl px-4 py-5">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
            {error}
            <button className="ml-3 underline" onClick={refreshTasks}>
              Retry
            </button>
          </div>
        )}

        {page === 'Dashboard' && (
          <DashboardPage
            tasks={tasks}
            onOpen={(task) => setModal({ type: 'detail', task })}
            onComplete={(task) => handleStatus(task, 'Completed')}
            onReopen={(task) => handleStatus(task, 'Open')}
          />
        )}
        {page === 'Today' && (
          <TodayPage
            tasks={tasks}
            profile={profile}
            onOpen={(task) => setModal({ type: 'detail', task })}
            onComplete={(task) => handleStatus(task, 'Completed')}
            onReopen={(task) => handleStatus(task, 'Open')}
          />
        )}
        {page === 'Tasks' && (
          <TaskBoardPage
            tasks={tasks}
            profile={profile}
            onCreate={() => setModal({ type: 'create' })}
            onOpen={(task) => setModal({ type: 'detail', task })}
            onComplete={(task) => handleStatus(task, 'Completed')}
            onReopen={(task) => handleStatus(task, 'Open')}
          />
        )}
      </main>

      {modal.type === 'create' && (
        <FormModal title="New task">
          <TaskForm onSubmit={handleCreate} onCancel={() => setModal({ type: 'none' })} />
        </FormModal>
      )}

      {modal.type === 'edit' && (
        <FormModal title="Edit task">
          <TaskForm
            task={modal.task}
            onSubmit={(input) => handleUpdate(modal.task, input)}
            onCancel={() => setModal({ type: 'detail', task: modal.task })}
          />
        </FormModal>
      )}

      {modal.type === 'detail' && (
        <TaskDetail
          task={modal.task}
          profile={profile}
          onClose={() => setModal({ type: 'none' })}
          onEdit={(task) => setModal({ type: 'edit', task })}
        />
      )}
    </div>
  );
}

function FormModal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-slate-950/55 p-3">
      <section className="mx-auto max-w-2xl rounded-lg bg-white p-4 shadow-soft">
        <h2 className="mb-4 text-xl font-black">{title}</h2>
        {children}
      </section>
    </div>
  );
}
