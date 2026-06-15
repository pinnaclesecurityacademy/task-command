import { endOfDay, format, isAfter, isBefore, isSameDay, parseISO, startOfDay, subDays } from 'date-fns';

export function formatDate(value?: string | null) {
  if (!value) return 'No date';
  return format(parseISO(value), 'dd/MM/yy');
}

export function formatDateTime(value?: string | null) {
  if (!value) return 'Not recorded';
  return format(parseISO(value), 'dd/MM/yy HH:mm');
}

export function isOverdue(value?: string | null) {
  if (!value) return false;
  return isBefore(parseISO(value), startOfDay(new Date()));
}

export function isDueToday(value?: string | null) {
  if (!value) return false;
  return isSameDay(parseISO(value), new Date());
}

export function isCompletedThisWeek(value?: string | null) {
  if (!value) return false;
  const date = parseISO(value);
  return isAfter(date, subDays(new Date(), 7)) && isBefore(date, endOfDay(new Date()));
}
