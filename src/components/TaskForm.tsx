import { Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CATEGORIES, PEOPLE, PRIORITIES, STATUSES, type Task, type TaskInput } from '../types/task';

type Props = {
  task?: Task | null;
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
};

const emptyInput: TaskInput = {
  title: '',
  description: '',
  assigned_person: 'Chris',
  status: 'Open',
  category: 'Operations',
  priority: 'Normal',
  due_date: '',
};

export function TaskForm({ task, onSubmit, onCancel }: Props) {
  const initial = useMemo<TaskInput>(
    () =>
      task
        ? {
            title: task.title,
            description: task.description ?? '',
            assigned_person: task.assigned_person,
            status: task.status,
            category: task.category,
            priority: task.priority,
            due_date: task.due_date ?? '',
          }
        : emptyInput,
    [task],
  );
  const [input, setInput] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.title.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ ...input, title: input.title.trim(), description: input.description.trim() });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-1">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Title</span>
        <input
          className="tap rounded-lg border border-slate-200 bg-command-field px-3"
          value={input.title}
          onChange={(event) => setInput({ ...input, title: event.target.value })}
          required
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Description</span>
        <textarea
          className="min-h-24 rounded-lg border border-slate-200 bg-command-field p-3"
          value={input.description}
          onChange={(event) => setInput({ ...input, description: event.target.value })}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Assigned" value={input.assigned_person} options={PEOPLE} onChange={(assigned_person) => setInput({ ...input, assigned_person })} />
        <Select label="Status" value={input.status} options={STATUSES} onChange={(status) => setInput({ ...input, status })} />
        <Select label="Category" value={input.category} options={CATEGORIES} onChange={(category) => setInput({ ...input, category })} />
        <Select label="Priority" value={input.priority} options={PRIORITIES} onChange={(priority) => setInput({ ...input, priority })} />
      </div>
      <label className="grid gap-1">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Due date</span>
        <input
          type="date"
          className="tap rounded-lg border border-slate-200 bg-command-field px-3"
          value={input.due_date}
          onChange={(event) => setInput({ ...input, due_date: event.target.value })}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="tap flex items-center justify-center gap-2 rounded-lg border border-slate-200 font-bold text-slate-700"
          onClick={onCancel}
        >
          <X className="h-4 w-4" /> Cancel
        </button>
        <button
          className="tap flex items-center justify-center gap-2 rounded-lg bg-command-ink font-bold text-white disabled:opacity-60"
          disabled={saving}
        >
          <Save className="h-4 w-4" /> {saving ? 'Saving' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        className="tap rounded-lg border border-slate-200 bg-command-field px-3"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
