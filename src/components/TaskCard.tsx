import { CalendarDays, RotateCcw, UserCheck } from 'lucide-react';
import type { Task } from '../types/task';
import { formatDate, formatDateTime, isOverdue } from '../utils/dates';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

type Props = {
  task: Task;
  onOpen: (task: Task) => void;
  onComplete: (task: Task) => void;
  onReopen: (task: Task) => void;
};

export function TaskCard({ task, onOpen, onComplete, onReopen }: Props) {
  const overdue = task.status !== 'Completed' && isOverdue(task.due_date);
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <button className="block w-full text-left" onClick={() => onOpen(task)}>
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
        <h3 className="mt-3 text-base font-black text-slate-950">{task.title}</h3>
        {task.description && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{task.description}</p>}
        <div className="mt-3 grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" aria-hidden="true" />
            Assigned: {task.assigned_person}
          </span>
          <span className={`flex items-center gap-2 ${overdue ? 'font-bold text-red-700' : ''}`}>
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Due: {formatDate(task.due_date)}
          </span>
          {task.completed_at && (
            <span className="text-xs font-semibold text-green-700">
              Completed by {task.completed_by_profile?.display_name ?? 'User'} {formatDateTime(task.completed_at)}
            </span>
          )}
        </div>
      </button>
      <div className="mt-4 flex gap-2">
        {task.status === 'Completed' ? (
          <button
            className="tap flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
            onClick={() => onReopen(task)}
          >
            <RotateCcw className="h-4 w-4" /> Reopen
          </button>
        ) : (
          <button
            className="tap flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 text-sm font-bold text-white"
            onClick={() => onComplete(task)}
          >
            <UserCheck className="h-4 w-4" /> Complete
          </button>
        )}
        <button
          className="tap flex-1 rounded-lg bg-command-ink text-sm font-bold text-white"
          onClick={() => onOpen(task)}
        >
          Open
        </button>
      </div>
    </article>
  );
}
