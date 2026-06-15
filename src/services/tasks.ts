import { supabase } from './supabase';
import type { AuditEvent, Task, TaskComment, TaskInput, TaskStatus } from '../types/task';
import { TC_TABLES } from './tableNames';

const taskSelect = `
  *,
  created_by_profile:tc_profiles!tc_tasks_created_by_fkey(*),
  completed_by_profile:tc_profiles!tc_tasks_completed_by_fkey(*)
`;

const commentSelect = `
  *,
  profile:tc_profiles(*)
`;

const auditSelect = `
  *,
  profile:tc_profiles(*)
`;

export async function fetchTasks() {
  const { data, error } = await supabase
    .from(TC_TABLES.tasks)
    .select(taskSelect)
    .order('status', { ascending: true })
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function createTask(input: TaskInput, userId: string) {
  const { data, error } = await supabase
    .from(TC_TABLES.tasks)
    .insert({
      ...input,
      due_date: input.due_date || null,
      created_by: userId,
      completed_at: input.status === 'Completed' ? new Date().toISOString() : null,
      completed_by: input.status === 'Completed' ? userId : null,
    })
    .select(taskSelect)
    .single();

  if (error) throw error;
  await recordAudit(data.id, userId, 'created', { title: data.title });
  return data as Task;
}

export async function updateTask(task: Task, input: TaskInput, userId: string) {
  const wasCompleted = task.status === 'Completed';
  const isCompleted = input.status === 'Completed';
  const completed_at = isCompleted ? task.completed_at ?? new Date().toISOString() : null;
  const completed_by = isCompleted ? task.completed_by ?? userId : null;

  const { data, error } = await supabase
    .from(TC_TABLES.tasks)
    .update({
      ...input,
      due_date: input.due_date || null,
      completed_at,
      completed_by,
      updated_at: new Date().toISOString(),
    })
    .eq('id', task.id)
    .select(taskSelect)
    .single();

  if (error) throw error;
  await recordAudit(task.id, userId, wasCompleted && !isCompleted ? 'reopened' : 'edited', {
    title: input.title,
    status: input.status,
  });
  return data as Task;
}

export async function setTaskStatus(task: Task, status: TaskStatus, userId: string) {
  const completed = status === 'Completed';
  const { data, error } = await supabase
    .from(TC_TABLES.tasks)
    .update({
      status,
      completed_at: completed ? new Date().toISOString() : null,
      completed_by: completed ? userId : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', task.id)
    .select(taskSelect)
    .single();

  if (error) throw error;
  await recordAudit(task.id, userId, completed ? 'completed' : 'reopened', { status });
  return data as Task;
}

export async function fetchTaskThread(taskId: string) {
  const [{ data: comments, error: commentsError }, { data: audit, error: auditError }] =
    await Promise.all([
      supabase.from(TC_TABLES.comments).select(commentSelect).eq('task_id', taskId).order('created_at'),
      supabase.from(TC_TABLES.auditHistory).select(auditSelect).eq('task_id', taskId).order('created_at'),
    ]);

  if (commentsError) throw commentsError;
  if (auditError) throw auditError;
  return {
    comments: (comments ?? []) as TaskComment[],
    audit: (audit ?? []) as AuditEvent[],
  };
}

export async function addComment(taskId: string, userId: string, comment: string) {
  const { data, error } = await supabase
    .from(TC_TABLES.comments)
    .insert({ task_id: taskId, user_id: userId, comment })
    .select(commentSelect)
    .single();

  if (error) throw error;
  return data as TaskComment;
}

async function recordAudit(
  taskId: string,
  userId: string,
  action: AuditEvent['action'],
  details: Record<string, unknown>,
) {
  const { error } = await supabase
    .from(TC_TABLES.auditHistory)
    .insert({ task_id: taskId, user_id: userId, action, details });
  if (error) throw error;
}
