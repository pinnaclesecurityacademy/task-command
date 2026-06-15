import { History, MessageSquare, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AuditEvent, Profile, Task, TaskComment } from '../types/task';
import { formatDateTime } from '../utils/dates';
import { addComment, fetchTaskThread } from '../services/tasks';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

type Props = {
  task: Task;
  profile: Profile;
  onClose: () => void;
  onEdit: (task: Task) => void;
};

export function TaskDetail({ task, profile, onClose, onEdit }: Props) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTaskThread(task.id)
      .then((thread) => {
        setComments(thread.comments);
        setAudit(thread.audit);
      })
      .finally(() => setLoading(false));
  }, [task.id]);

  async function handleAddComment(event: React.FormEvent) {
    event.preventDefault();
    const value = comment.trim();
    if (!value) return;
    const created = await addComment(task.id, profile.id, value);
    setComments((current) => [...current, { ...created, profile }]);
    setComment('');
  }

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-slate-950/55 p-3">
      <section className="mx-auto min-h-full max-w-2xl rounded-lg bg-white p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
            <h2 className="mt-3 text-xl font-black">{task.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{task.description || 'No description recorded.'}</p>
          </div>
          <button className="tap rounded-lg border border-slate-200 px-3" onClick={onClose} aria-label="Close task">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 sm:grid-cols-2">
          <Info label="Assigned" value={task.assigned_person} />
          <Info label="Category" value={task.category} />
          <Info label="Due" value={task.due_date ? formatDateTime(`${task.due_date}T00:00:00`) : 'No date'} />
          <Info label="Created" value={`${task.created_by_profile?.display_name ?? 'User'} ${formatDateTime(task.created_at)}`} />
          <Info label="Completed by" value={task.completed_by_profile?.display_name ?? 'Not completed'} />
          <Info label="Completed" value={formatDateTime(task.completed_at)} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="tap rounded-lg border border-slate-200 font-bold text-slate-700" onClick={onClose}>
            Done
          </button>
          <button className="tap rounded-lg bg-command-ink font-bold text-white" onClick={() => onEdit(task)}>
            Edit task
          </button>
        </div>

        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
            <MessageSquare className="h-4 w-4" /> Updates
          </h3>
          <form className="mt-3 flex gap-2" onSubmit={handleAddComment}>
            <input
              className="tap min-w-0 flex-1 rounded-lg border border-slate-200 bg-command-field px-3"
              value={comment}
              placeholder="Add an update"
              onChange={(event) => setComment(event.target.value)}
            />
            <button className="tap rounded-lg bg-command-blue px-4 font-bold text-white">Post</button>
          </form>
          <div className="mt-3 grid gap-2">
            {loading ? (
              <p className="text-sm text-slate-500">Loading thread...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-slate-500">No updates yet.</p>
            ) : (
              comments.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm text-slate-800">{item.comment}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {item.profile?.display_name ?? 'User'} · {formatDateTime(item.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
            <History className="h-4 w-4" /> Audit history
          </h3>
          <div className="mt-3 grid gap-2">
            {audit.map((item) => (
              <div key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <span className="font-bold capitalize">{item.action}</span> by{' '}
                {item.profile?.display_name ?? 'User'} · {formatDateTime(item.created_at)}
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
