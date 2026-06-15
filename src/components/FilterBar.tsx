import { Search } from 'lucide-react';
import { CATEGORIES, PEOPLE, STATUSES, type Person, type TaskCategory, type TaskStatus } from '../types/task';

export type Filters = {
  keyword: string;
  person: Person | 'Any';
  category: TaskCategory | 'Any';
  status: TaskStatus | 'Any';
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <label className="relative">
        <span className="sr-only">Search tasks</span>
        <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <input
          className="tap w-full rounded-lg border border-slate-200 bg-command-field pl-10 pr-3"
          value={filters.keyword}
          placeholder="Search tasks"
          onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
        />
      </label>
      <Select
        label="Person"
        value={filters.person}
        options={['Any', ...PEOPLE]}
        onChange={(person) => onChange({ ...filters, person: person as Filters['person'] })}
      />
      <Select
        label="Category"
        value={filters.category}
        options={['Any', ...CATEGORIES]}
        onChange={(category) => onChange({ ...filters, category: category as Filters['category'] })}
      />
      <Select
        label="Status"
        value={filters.status}
        options={['Any', ...STATUSES]}
        onChange={(status) => onChange({ ...filters, status: status as Filters['status'] })}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        className="tap w-full rounded-lg border border-slate-200 bg-command-field px-3 text-sm font-semibold"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
