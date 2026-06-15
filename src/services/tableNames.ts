export const TC_TABLES = {
  profiles: 'tc_profiles',
  tasks: 'tc_tasks',
  comments: 'tc_comments',
  auditHistory: 'tc_audit_history',
} as const;

export type TaskCommandTable = (typeof TC_TABLES)[keyof typeof TC_TABLES];
