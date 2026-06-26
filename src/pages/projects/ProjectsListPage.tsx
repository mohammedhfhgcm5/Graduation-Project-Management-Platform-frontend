import { Link, useNavigate } from 'react-router-dom';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ProjectFilters } from '@/features/projects/ProjectFilters';
import { ProjectTable } from '@/features/projects/ProjectTable';
import { useProjects } from '@/hooks/useProjects';
import { useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import { setPage } from '@/store/redux/projectsSlice';
import { useAuthStore } from '@/store/zustand/authStore';

export function ProjectsListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { list, total, page, limit } = useAppSelector((state) => state.projects);
  const { projectsQuery } = useProjects();
  const { t } = useI18n();
  const safeList = Array.isArray(list) ? list : [];

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canCreateProject = user?.role === 'STUDENT';

  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>{t('projectsTitle')}</h1>
          <p className='text-sm text-slate-500 dark:text-slate-400'>{t('projectsSubtitle')}</p>
        </div>
        {canCreateProject ? (
          <Link to='/projects/new'>
            <Button>{t('projectsNew')}</Button>
          </Link>
        ) : null}
      </div>

      <ProjectFilters />

      {projectsQuery.isLoading ? <LoadingSpinner /> : null}

      {projectsQuery.error ? (
        <p className='text-sm text-red-600'>
          {getApiErrorMessage(projectsQuery.error, t('errorLoadProjects'))}
        </p>
      ) : null}

      {!projectsQuery.isLoading && !safeList.length ? (
        <EmptyState
          title={t('projectsNoResultsTitle')}
          description={t('projectsNoResultsDescription')}
          actionLabel={canCreateProject ? t('emptyStateActionCreateProject') : undefined}
          onAction={canCreateProject ? () => navigate('/projects/new') : undefined}
        />
      ) : null}

      {safeList.length ? <ProjectTable projects={safeList} /> : null}

      <div className='flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/45'>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          {t('projectsPageIndicator', { page, total: totalPages })}
        </p>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='dark:border-violet-400/40 dark:bg-transparent dark:text-violet-200 dark:hover:bg-violet-500/10 dark:hover:text-violet-100'
            onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
            disabled={page === 1}
          >
            {t('projectsPrevious')}
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='dark:border-violet-400/40 dark:bg-transparent dark:text-violet-200 dark:hover:bg-violet-500/10 dark:hover:text-violet-100'
            onClick={() => dispatch(setPage(Math.min(totalPages, page + 1)))}
            disabled={page >= totalPages}
          >
            {t('projectsNext')}
          </Button>
        </div>
      </div>
    </section>
  );
}
