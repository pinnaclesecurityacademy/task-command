import type { TaskStatus } from '../types/task';

const styles: Record<TaskStatus, string> = {
  Open: 'bg-slate-100 text-slate-700 ring-slate-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-blue-200',
  Waiting: 'bg-amber-50 text-amber-800 ring-amber-200',
  Completed: 'bg-green-50 text-green-700 ring-green-200',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${styles[status]}`}>{status}</span>;
}
