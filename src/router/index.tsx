/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/components/layout/AppLayout';
import { NotificationList } from '@/features/notifications/NotificationList';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { HeadDashboard } from '@/pages/dashboard/head/HeadDashboard';
import { StudentDashboard } from '@/pages/dashboard/student/StudentDashboard';
import { SupervisorDashboard } from '@/pages/dashboard/supervisor/SupervisorDashboard';
import { NewProjectPage } from '@/pages/projects/NewProjectPage';
import { ProjectDetailPage } from '@/pages/projects/ProjectDetailPage';
import { ProjectsListPage } from '@/pages/projects/ProjectsListPage';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { RoleRoute } from '@/router/RoleRoute';
import { useAuthStore } from '@/store/zustand/authStore';
import { roleRedirect } from '@/utils/roleRedirect';

function HomeRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace />;
  }

  return <Navigate to={roleRedirect(user.role)} replace />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: 'dashboard/student',
        element: (
          <RoleRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'dashboard/supervisor',
        element: (
          <RoleRoute allowedRoles={['SUPERVISOR']}>
            <SupervisorDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'dashboard/head',
        element: (
          <RoleRoute allowedRoles={['HEAD']}>
            <HeadDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'projects',
        element: <ProjectsListPage />,
      },
      {
        path: 'projects/new',
        element: (
          <RoleRoute allowedRoles={['STUDENT']}>
            <NewProjectPage />
          </RoleRoute>
        ),
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailPage />,
      },
      {
        path: 'notifications',
        element: <NotificationList />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
]);
