import type { Person, Task } from '../types/task';
import { isCompletedThisWeek, isDueToday, isOverdue } from './dates';

export function getMetrics(tasks: Task[]) {
  const openTasks = tasks.filter((task) => task.status !== 'Completed');
  return {
    totalOpen: openTasks.length,
    overdue: openTasks.filter((task) => isOverdue(task.due_date)).length,
    dueToday: openTasks.filter((task) => isDueToday(task.due_date)).length,
    completedWeek: tasks.filter((task) => isCompletedThisWeek(task.completed_at)).length,
    chris: workload(openTasks, 'Chris'),
    damien: workload(openTasks, 'Damien'),
  };
}

export function workload(tasks: Task[], person: Exclude<Person, 'Both'>) {
  return tasks.filter((task) => task.assigned_person === person || task.assigned_person === 'Both')
    .length;
}

export function priorityRank(priority: Task['priority']) {
  return { Critical: 0, High: 1, Normal: 2, Low: 3 }[priority];
}
