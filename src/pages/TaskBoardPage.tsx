import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterBar, type Filters } from '../components/FilterBar';
import { TaskCard } from '../components/TaskCard';
import type { Profile, Task } from '../types/task';
import { isOverdue } from '../utils/dates';

type BoardView = 'All Tasks' | 'My Tasks' | 'Chris' | 'Damien' | 'Overdue' | 'Completed';

type Props = {
  tasks: Task[];
  profile: Profile;
  onOpen: (task: Task) => void;
  onCreate: () => void;
  onComplete: (task: Task) => void;
  onReopen: (task: Task) => void;
};

const views: BoardView[] = ['All Tasks', 'My Tasks', 'Chris', 'Damien', 'Overdue', 'Completed'];

export function TaskBoardPage({ tasks, profile, onOpen, onCreate, onComplete, onReopen }: Props) {
  const [view, setView] = useState<BoardView>('All Tasks');
  const [filters, setFilters] = useState<Filters>({
    keyword: '',
    person: 'Any',
    category: 'Any',
    status: 'Any',
  });

  const visible = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return tasks
      .filter((task) => {
        if (view === 'My Tasks' && task.assigned_person !== profile.display_name && task.assigned_person !== 'Both') return false;
        if (view === 'Chris' && task.assigned_person !== 'Chris' && task.assigned_person !== 'Both') return false;
        if (view === 'Damien' && task.assigned_person !== 'Damien' && task.assigned_person !== 'Both') return false;
        if (view === 'Overdue' && (task.status === 'Completed' || !isOverdue(task.due_date))) return false;
        if (view === 'Completed' && task.status !== 'Completed') return false;
        if (filters.person !== 'Any' && task.assigned_person !== filters.person) return false;
        if (filters.category !== 'Any' && task.category !== filters.category) return false;
        if (filters.status !== 'Any' && task.status !== filters.status) return false;
        if (keyword && !`${task.title} ${task.description ?? ''}`.toLowerCase().includes(keyword)) return false;
        return true;
      });
  }, [filters, profile.display_name, tasks, view]);

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Task Board</h2>
          <p className="text-sm font-medium text-slate-500">{visible.length} tasks visible</p>
        </div>
        <button
          className="tap flex items-center gap-2 rounded-lg bg-command-ink px-4 font-bold text-white"
          onClick={onCreate}
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {views.map((item) => (
          <button
            key={item}
            className={`tap whitespace-nowrap rounded-lg px-3 text-sm font-bold ${
              view === item ? 'bg-command-ink text-white' : 'bg-slate-100 text-slate-700'
            }`}
            onClick={() => setView(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm font-semibold text-slate-500">
            No tasks match this view.
          </div>
        ) : (
          visible.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpen} onComplete={onComplete} onReopen={onReopen} />
          ))
        )}
      </div>
    </section>
  );
}
