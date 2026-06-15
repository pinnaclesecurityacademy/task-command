import type { Profile, Task } from '../types/task';
import { isDueToday, isOverdue } from '../utils/dates';
import { priorityRank } from '../utils/taskMetrics';
import { TaskCard } from '../components/TaskCard';

type Props = {
  tasks: Task[];
  profile: Profile;
  onOpen: (task: Task) => void;
  onComplete: (task: Task) => void;
  onReopen: (task: Task) => void;
};

export function TodayPage({ tasks, profile, onOpen, onComplete, onReopen }: Props) {
  const focus = tasks
    .filter((task) => task.status !== 'Completed')
    .filter((task) => isDueToday(task.due_date) || isOverdue(task.due_date) || task.priority === 'Critical')
    .filter((task) => task.assigned_person === profile.display_name || task.assigned_person === 'Both')
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-black">Today</h2>
        <p className="text-sm font-medium text-slate-500">Priority actions for {profile.display_name}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {focus.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm font-semibold text-slate-500">
            No priority tasks need action today.
          </div>
        ) : (
          focus.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpen} onComplete={onComplete} onReopen={onReopen} />
          ))
        )}
      </div>
    </section>
  );
}
