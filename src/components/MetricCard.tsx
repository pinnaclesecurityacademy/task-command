import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: number;
  tone?: 'normal' | 'warn' | 'danger' | 'good';
  icon: LucideIcon;
};

const tones = {
  normal: 'border-slate-200 bg-white text-slate-900',
  warn: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-red-200 bg-red-50 text-red-900',
  good: 'border-green-200 bg-green-50 text-green-900',
};

export function MetricCard({ label, value, tone = 'normal', icon: Icon }: Props) {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
        </div>
        <Icon className="h-6 w-6 opacity-70" aria-hidden="true" />
      </div>
    </div>
  );
}
