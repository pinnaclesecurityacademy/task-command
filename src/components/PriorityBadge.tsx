import type { TaskPriority } from '../types/task';

const styles: Record<TaskPriority, string> = {
  Critical: 'bg-red-600 text-white',
  High: 'bg-amber-500 text-slate-950',
  Normal: 'bg-blue-600 text-white',
  Low: 'bg-slate-200 text-slate-700',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`rounded px-2 py-1 text-xs font-bold uppercase tracking-wide ${styles[priority]}`}>
      {priority}
    </span>
  );
}
