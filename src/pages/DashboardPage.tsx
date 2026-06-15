import { AlertTriangle, CalendarCheck, CheckCircle2, ClipboardList, UserRound } from 'lucide-react';
import type { Task } from '../types/task';
import { getMetrics } from '../utils/taskMetrics';
import { MetricCard } from '../components/MetricCard';
import { TaskCard } from '../components/TaskCard';
import { isOverdue } from '../utils/dates';

type Props = {
  tasks: Task[];
  onOpen: (task: Task) => void;
  onComplete: (task: Task) => void;
  onReopen: (task: Task) => void;
};

export function DashboardPage({ tasks, onOpen, onComplete, onReopen }: Props) {
  const metrics = getMetrics(tasks);
  const urgent = tasks
    .filter((task) => task.status !== 'Completed' && (task.priority === 'Critical' || isOverdue(task.due_date)))
    .slice(0, 4);

  return (
    <div className="grid gap-5">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <MetricCard label="Open" value={metrics.totalOpen} icon={ClipboardList} />
        <MetricCard label="Overdue" value={metrics.overdue} icon={AlertTriangle} tone="danger" />
        <MetricCard label="Due today" value={metrics.dueToday} icon={CalendarCheck} tone="warn" />
        <MetricCard label="Done week" value={metrics.completedWeek} icon={CheckCircle2} tone="good" />
        <MetricCard label="Chris" value={metrics.chris} icon={UserRound} />
        <MetricCard label="Damien" value={metrics.damien} icon={UserRound} />
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">Command attention</h2>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Critical and overdue</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {urgent.length === 0 ? (
            <EmptyState message="No urgent tasks currently." />
          ) : (
            urgent.map((task) => (
              <TaskCard key={task.id} task={task} onOpen={onOpen} onComplete={onComplete} onReopen={onReopen} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm font-semibold text-slate-500">{message}</div>;
}
