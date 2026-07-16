import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  FilePlus2,
  FolderOpen,
  Home,
  ShieldCheck,
  UserRoundCheck,
  type LucideIcon,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { getRoleLabel, useI18n } from '@/i18n';
import { useAuthStore } from '@/store/zustand/authStore';
import type { UserRole } from '@/types';
import { cn } from '@/utils/cn';
import { roleRedirect } from '@/utils/roleRedirect';

type RoleNavigationItem = {
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
  iconClassName: string;
  isActive: (pathname: string) => boolean;
};

function getDashboardTitle(role: UserRole, t: ReturnType<typeof useI18n>['t']) {
  switch (role) {
    case 'SUPERVISOR':
      return t('dashboardSupervisorTitle');
    case 'HEAD':
      return t('dashboardHeadTitle');
    case 'STUDENT':
    default:
      return t('dashboardStudentTitle');
  }
}

function isProjectsArea(pathname: string) {
  return (
    pathname === '/projects' ||
    (pathname.startsWith('/projects/') && pathname !== '/projects/new')
  );
}

function isDiscussionSchedulesArea(pathname: string) {
  return pathname === '/discussion-schedules';
}

function getRoleNavigationItems(
  role: UserRole,
  t: ReturnType<typeof useI18n>['t'],
): RoleNavigationItem[] {
  const dashboardItem: RoleNavigationItem = {
    label: t('navDashboard'),
    description:
      role === 'SUPERVISOR'
        ? t('dashboardSupervisorPrimaryDescription')
        : role === 'HEAD'
          ? t('dashboardHeadPrimaryDescription')
          : t('dashboardStudentSecondaryDescription'),
    path: roleRedirect(role),
    icon:
      role === 'SUPERVISOR'
        ? UserRoundCheck
        : role === 'HEAD'
          ? ShieldCheck
          : Home,
    iconClassName: 'from-violet-600 to-indigo-600',
    isActive: (pathname) => pathname === roleRedirect(role),
  };

  const projectItem: RoleNavigationItem = {
    label: role === 'HEAD' ? t('navAllProjects') : t('navProjects'),
    description:
      role === 'HEAD'
        ? t('dashboardHeadSecondaryDescription')
        : t('projectsSubtitle'),
    path: '/projects',
    icon: FolderOpen,
    iconClassName: 'from-sky-500 to-indigo-600',
    isActive: isProjectsArea,
  };

  const notificationsItem: RoleNavigationItem = {
    label: t('notificationsTitle'),
    description: t('notificationsSubtitle'),
    path: '/notifications',
    icon: Bell,
    iconClassName: 'from-amber-400 to-orange-500',
    isActive: (pathname) => pathname === '/notifications',
  };

  const discussionSchedulesItem: RoleNavigationItem = {
    label: t('navDiscussionSchedules'),
    description: t('discussionSchedulesDashboardDescription'),
    path: '/discussion-schedules',
    icon: CalendarDays,
    iconClassName: 'from-cyan-500 to-blue-600',
    isActive: isDiscussionSchedulesArea,
  };

  if (role === 'STUDENT') {
    return [
      dashboardItem,
      projectItem,
      discussionSchedulesItem,
      {
        label: t('projectsNew'),
        description: t('dashboardStudentPrimaryDescription'),
        path: '/projects/new',
        icon: FilePlus2,
        iconClassName: 'from-emerald-500 to-teal-500',
        isActive: (pathname) => pathname === '/projects/new',
      },
      notificationsItem,
    ];
  }

  return [dashboardItem, projectItem, discussionSchedulesItem, notificationsItem];
}

export function RoleNavigationPanel() {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const { isRtl, t } = useI18n();

  const role: UserRole = user?.role ?? 'STUDENT';
  const items = getRoleNavigationItems(role, t);
  const roleLabel = getRoleLabel(role, t);
  const dashboardTitle = getDashboardTitle(role, t);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'GP';

  return (
    <section className='relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#1a1825] p-5 shadow-[0_28px_70px_rgba(17,12,35,0.32)] md:p-6'>
      <div className='pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.24)_0%,transparent_68%)]' />
      <div className='pointer-events-none absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_72%)]' />

      <div className='relative space-y-5'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex items-start gap-4'>
            <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-violet-600 to-indigo-600 text-base font-extrabold text-white shadow-[0_18px_30px_rgba(79,70,229,0.35)]'>
              {initials}
            </div>

            <div>
              <p className='text-[11px] font-bold uppercase tracking-[0.16em] text-[#6f6997]'>
                {t('appName')}
              </p>
              <h2 className='mt-1 text-xl font-black tracking-tight text-[#f4f1ff] md:text-2xl'>
                {dashboardTitle}
              </h2>
              <p className='mt-2 text-sm leading-6 text-[#a9a4cb]'>
                {t('topbarLoggedInAs')} {user?.name ?? t('topbarGuest')} -{' '}
                {roleLabel}
              </p>
            </div>
          </div>

          <div className='inline-flex w-fit items-center rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#ddd8ff]'>
            {roleLabel}
          </div>
        </div>

        <div
          className={cn(
            'grid gap-3 md:grid-cols-2',
            items.length === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3',
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive(pathname);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group relative flex min-h-[172px] flex-col justify-between overflow-hidden rounded-[22px] border p-4 transition-all duration-200',
                  isActive
                    ? [
                        'border-violet-400/35 bg-white/[0.08]',
                        'shadow-[0_20px_45px_rgba(8,6,18,0.38)]',
                      ].join(' ')
                    : [
                        'border-white/[0.06] bg-white/[0.03]',
                        'hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.06]',
                      ].join(' '),
                )}
              >
                {isActive ? (
                  <span className='absolute left-0 top-5 h-12 w-1 rounded-r-full bg-gradient-to-b from-violet-300 to-indigo-500' />
                ) : null}

                <div className='space-y-4'>
                  <span
                    className={cn(
                      'inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br text-white transition-transform',
                      item.iconClassName,
                      isActive
                        ? 'scale-105 shadow-[0_12px_24px_rgba(79,70,229,0.35)]'
                        : 'group-hover:scale-105',
                    )}
                  >
                    <Icon className='h-5 w-5' />
                  </span>

                  <div>
                    <h3 className='text-base font-bold text-[#f4f1ff]'>
                      {item.label}
                    </h3>
                    <p className='mt-2 text-sm leading-6 text-[#a9a4cb]'>
                      {item.description}
                    </p>
                  </div>
                </div>

                <span className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#ddd8ff]'>
                  {t('commonOpen')}
                  <ArrowIcon
                    className={cn(
                      'h-3.5 w-3.5 transition-transform',
                      isActive
                        ? isRtl
                          ? '-translate-x-0.5'
                          : 'translate-x-0.5'
                        : isRtl
                          ? 'group-hover:-translate-x-0.5'
                          : 'group-hover:translate-x-0.5',
                    )}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
