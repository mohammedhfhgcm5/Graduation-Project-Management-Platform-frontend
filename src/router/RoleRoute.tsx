import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/store/zustand/authStore';
import type { UserRole } from '@/types';

export function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  return children;
}
