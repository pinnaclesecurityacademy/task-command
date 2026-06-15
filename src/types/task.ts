export type Person = 'Chris' | 'Damien' | 'Both';
export type TaskStatus = 'Open' | 'In Progress' | 'Waiting' | 'Completed';
export type TaskCategory =
  | 'Operations'
  | 'Staff'
  | 'Compliance'
  | 'Client Request'
  | 'Training'
  | 'Incident Follow Up'
  | 'SOP / Documentation'
  | 'Projects';
export type TaskPriority = 'Critical' | 'High' | 'Normal' | 'Low';

export type Profile = {
  id: string;
  display_name: 'Chris' | 'Damien';
  email: string | null;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  assigned_person: Person;
  created_by: string;
  created_by_profile?: Profile | null;
  status: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  completed_by: string | null;
  completed_by_profile?: Profile | null;
};

export type TaskComment = {
  id: string;
  task_id: string;
  user_id: string;
  profile?: Profile | null;
  comment: string;
  created_at: string;
};

export type AuditEvent = {
  id: string;
  task_id: string;
  user_id: string;
  profile?: Profile | null;
  action: 'created' | 'edited' | 'completed' | 'reopened';
  details: Record<string, unknown> | null;
  created_at: string;
};

export type TaskInput = {
  title: string;
  description: string;
  assigned_person: Person;
  status: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  due_date: string;
};

export const PEOPLE: Person[] = ['Chris', 'Damien', 'Both'];
export const STATUSES: TaskStatus[] = ['Open', 'In Progress', 'Waiting', 'Completed'];
export const CATEGORIES: TaskCategory[] = [
  'Operations',
  'Staff',
  'Compliance',
  'Client Request',
  'Training',
  'Incident Follow Up',
  'SOP / Documentation',
  'Projects',
];
export const PRIORITIES: TaskPriority[] = ['Critical', 'High', 'Normal', 'Low'];
