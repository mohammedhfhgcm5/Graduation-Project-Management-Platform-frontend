import {
  CalendarDays,
  FolderOpen,
  Home,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { getRoleLabel, useI18n } from '@/i18n';
import { useAuthStore } from '@/store/zustand/authStore';
import { useUiStore } from '@/store/zustand/uiStore';
import { cn } from '@/utils/cn';

type SidebarItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const { isRtl, t } = useI18n();

  const roleItems: Record<string, SidebarItem[]> = {
    STUDENT: [
      {
        label: t('navDashboard'),
        path: '/dashboard/student',
        icon: <Home className='h-[18px] w-[18px]' />,
      },
      {
        label: t('navProjects'),
        path: '/projects',
        icon: <FolderOpen className='h-[18px] w-[18px]' />,
      },
      {
        label: t('navDiscussionSchedules'),
        path: '/discussion-schedules',
        icon: <CalendarDays className='h-[18px] w-[18px]' />,
      },
    ],
    SUPERVISOR: [
      {
        label: t('navDashboard'),
        path: '/dashboard/supervisor',
        icon: <UserRoundCheck className='h-[18px] w-[18px]' />,
      },
      {
        label: t('navProjects'),
        path: '/projects',
        icon: <FolderOpen className='h-[18px] w-[18px]' />,
      },
      {
        label: t('navDiscussionSchedules'),
        path: '/discussion-schedules',
        icon: <CalendarDays className='h-[18px] w-[18px]' />,
      },
    ],
    HEAD: [
      {
        label: t('navDashboard'),
        path: '/dashboard/head',
        icon: <ShieldCheck className='h-[18px] w-[18px]' />,
      },
      {
        label: t('navAllProjects'),
        path: '/projects',
        icon: <FolderOpen className='h-[18px] w-[18px]' />,
      },
      {
        label: t('navDiscussionSchedules'),
        path: '/discussion-schedules',
        icon: <CalendarDays className='h-[18px] w-[18px]' />,
      },
    ],
  };

  const items = roleItems[user?.role ?? 'STUDENT'];
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'GP';

  return (
    <aside
      className={cn(
        'fixed inset-y-0 z-40 hidden flex-col md:flex',
        'border-white/[0.06] bg-[#1a1825]',
        isRtl ? 'right-0 border-l' : 'left-0 border-r',
        'transition-[width] duration-300 ease-in-out',
        sidebarOpen ? 'w-60' : 'w-[72px]',
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -top-14 h-44 w-44 rounded-full',
          isRtl ? '-left-14' : '-right-14',
        )}
        style={{
          background:
            'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
        }}
      />

      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-2.5 border-b border-white/[0.06] px-[18px]',
          !sidebarOpen && 'justify-center px-0',
        )}
      >
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]',
            'bg-gradient-to-br from-violet-600 to-indigo-600',
            'text-sm font-extrabold text-white',
            'shadow-[0_2px_10px_rgba(124,58,237,0.4)]',
          )}
        >
          GP
        </div>

        {sidebarOpen && (
          <div className='overflow-hidden'>
            <p className='truncate text-[15px] font-extrabold leading-none tracking-tight text-[#f0eeff]'>
              {t('appName')}
            </p>
            <p className='mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#44446a]'>
              {t('sidebarManagementSystem')}
            </p>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <p className='px-[18px] pb-2 pt-[18px] text-[10px] font-bold uppercase tracking-[0.14em] text-[#44446a]'>
          {t('sidebarMainMenu')}
        </p>
      )}

      <nav className='flex-1 space-y-1 p-2.5'>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-2.5 rounded-[10px] px-3 py-2.5',
                'border text-[13.5px] font-semibold transition-all duration-150',
                !sidebarOpen && 'justify-center px-0',
                isActive
                  ? [
                      'border-violet-500/35 text-white',
                      'bg-gradient-to-br from-violet-600/35 to-indigo-600/25',
                      'shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
                    ].join(' ')
                  : [
                      'border-transparent text-[#8080b0]',
                      'hover:border-white/[0.06] hover:bg-white/5 hover:text-[#e0e0f8]',
                    ].join(' '),
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className={cn(
                      'absolute top-1/2 h-5 w-[3px] -translate-y-1/2 bg-gradient-to-b from-violet-400 to-violet-700',
                      isRtl
                        ? '-right-2.5 rounded-l-full'
                        : '-left-2.5 rounded-r-full',
                    )}
                  />
                )}

                <span
                  className={cn(
                    'shrink-0 opacity-80 transition-colors',
                    isActive && 'text-violet-300 opacity-100',
                  )}
                >
                  {item.icon}
                </span>

                {sidebarOpen && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className='shrink-0 border-t border-white/[0.05] p-2.5'>
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-[10px] border border-white/[0.06] bg-white/[0.04] px-3 py-2.5',
            !sidebarOpen && 'justify-center px-0',
          )}
        >
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              'bg-gradient-to-br from-violet-600 to-indigo-600',
              'text-[12px] font-extrabold text-white',
            )}
          >
            {initials}
          </div>

          {sidebarOpen && (
            <div className='min-w-0'>
              <p className='truncate text-[13px] font-bold text-[#d0d0f0]'>
                {user?.name ?? t('topbarGuest')}
              </p>
              <p className='text-[11px] font-medium text-[#5a5a8a]'>
                {user ? getRoleLabel(user.role, t) : '-'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
