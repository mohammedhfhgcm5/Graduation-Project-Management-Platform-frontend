import type { UserRole } from '@/types';

const rolePathMap: Record<UserRole, string> = {
  STUDENT: '/dashboard/student',
  SUPERVISOR: '/dashboard/supervisor',
  HEAD: '/dashboard/head',
};

export function roleRedirect(role: UserRole) {
  return rolePathMap[role];
}
